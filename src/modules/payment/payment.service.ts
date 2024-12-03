import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import { OrderService } from '../order/order.service';
import { OrderRepository } from '../order/order.repository';
import { CreateOrderInput } from '../order/create-order.input';

@Injectable()
export class PaymentService {
  constructor(
    private readonly orderRepository: OrderRepository,
    private readonly orderService: OrderService,
  ) {}
  private readonly api = axios.create({
    baseURL: process.env.MERCADO_PAGO_BASE_URL,
    headers: {
      Authorization: `Bearer ${process.env.MERCADO_PAGO_ACCESS_TOKEN}`,
    },
  });

  async createPayment(
    name: string,
    cpf: string,
    email: string,
    phone: string,
    price: number,
    productId: string,
  ): Promise<{ id: string; qrCode: string; qrCodeBase64: string }> {
    try {
      if (!productId) {
        throw new Error('Product ID is required');
      }
      if (!phone) {
        throw new Error('Phone (customerPhone) is required');
      }

      console.log('Received in Service:', {
        name,
        cpf,
        email,
        phone,
        price,
        productId,
      });

      const createOrderInput: CreateOrderInput = {
        customerName: name,
        customerCPF: cpf,
        customerEmail: email,
        customerPhone: phone,
        productId: productId,
        paymentMethod: 'PIX',
      };

      const order = await this.orderService.createOrder(createOrderInput);

      const paymentData = {
        transaction_amount: price,
        description: 'Product Purchase',
        payment_method_id: 'pix',
        payer: {
          email,
          first_name: name,
          last_name: '',
          identification: {
            type: 'CPF',
            number: cpf.replace(/\D/g, ''),
          },
          address: {
            zip_code: '12345678',
            street_name: 'Example Street',
            street_number: '123',
            neighborhood: 'Example Neighborhood',
            city: 'São Paulo',
            federal_unit: 'SP',
          },
        },
        notification_url: `${process.env.BASE_URL}/payment/webhook`,
        metadata: {
          orderId: order.id,
        },
      };

      const paymentResponse = await this.api.post('/payments', paymentData, {
        headers: {
          'X-Idempotency-Key': uuidv4(),
        },
      });

      const { id, point_of_interaction } = paymentResponse.data;

      return {
        id,
        qrCode: point_of_interaction.transaction_data.qr_code,
        qrCodeBase64: point_of_interaction.transaction_data.qr_code_base64,
      };
    } catch (error) {
      console.error(
        'Error creating payment:',
        error.response?.data || error.message,
      );
      throw new Error('Failed to create payment');
    }
  }

  async checkPaymentStatus(
    paymentId: string,
  ): Promise<{ status: string; details: any }> {
    try {
      const paymentResponse = await this.api.get(`/payments/${paymentId}`);
      const status = paymentResponse.data.status;

      return {
        status,
        details: paymentResponse.data,
      };
    } catch (error) {
      console.error(
        'Error checking payment status:',
        error.response?.data || error.message,
      );
      throw new Error('Failed to check payment status');
    }
  }

  async handlePaymentStatusUpdate(payload: any): Promise<void> {
    const { data } = payload;

    const paymentId = data?.id;
    if (!paymentId) {
      throw new Error('Payment ID not found in webhook payload');
    }

    const paymentResponse = await this.api.get(`/payments/${paymentId}`);
    const paymentData = paymentResponse.data;

    const orderId = paymentData.metadata?.orderId;
    if (!orderId) {
      throw new Error('Order ID not found in payment metadata');
    }

    const order = await this.orderRepository.findOne(orderId);
    if (!order) {
      throw new Error(`Order not found for ID: ${orderId}`);
    }

    const newStatus =
      paymentData.status === 'approved' ? 'APPROVED' : 'PENDING';

    await this.orderRepository.update(orderId, { status: newStatus });
  }

  async updateOrderStatusToApproved(orderId: string): Promise<void> {
    try {
      await this.orderService.updateOrderStatus(orderId, 'APPROVED');
      console.log(`Order ${orderId} status updated to APPROVED`);
    } catch (error) {
      console.error('Error updating order status:', error.message);
      throw error;
    }
  }
}
