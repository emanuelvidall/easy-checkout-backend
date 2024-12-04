import {
  Controller,
  Post,
  Body,
  Get,
  Query,
  Req,
  Res,
  HttpStatus,
} from '@nestjs/common';
import { PaymentService } from './payment.service';
import { Request, Response } from 'express';
import { PaymentStatus } from './payment-status.enum';
import { UpdateOrderInput } from '../order/update-order.input';
import { OrderService } from '../order/order.service';

@Controller('payment')
export class PaymentController {
  constructor(
    private readonly paymentService: PaymentService,
    private readonly orderService: OrderService,
  ) {}

  @Post('webhook')
  async handlePaymentWebhook(@Req() req: Request, @Res() res: Response) {
    const event = req.body;
    console.log('Received webhook event:', JSON.stringify(event, null, 2));

    let paymentId: string;

    if (event.type === 'payment' && event.data && event.data.id) {
      paymentId = event.data.id.toString();
    } else {
      return res
        .status(HttpStatus.BAD_REQUEST)
        .send('Payment ID is missing in webhook payload');
    }

    try {
      const { status } =
        await this.paymentService.checkPaymentStatus(paymentId);

      console.log('Payment ID:', paymentId);
      console.log('Payment Status:', status);

      if (
        ![PaymentStatus.PENDING, PaymentStatus.APPROVED].includes(
          status as PaymentStatus,
        )
      ) {
        return res
          .status(HttpStatus.BAD_REQUEST)
          .send('Invalid payment status');
      }

      const order = await this.orderService.findByPaymentId(paymentId);

      if (!order) {
        return res.status(HttpStatus.NOT_FOUND).send('Order not found');
      }

      const orderStatus = this.orderService.mapPaymentStatusToOrderStatus(
        status as PaymentStatus,
      );

      const paymentStatus = status as PaymentStatus;

      const updateOrderInput: UpdateOrderInput = {
        paymentStatus: paymentStatus,
        orderStatus: orderStatus,
      };

      await this.orderService.updateOrder(order.id, updateOrderInput);

      res.status(HttpStatus.OK).send('Payment status updated');
    } catch (error) {
      console.error('Error handling webhook:', error);
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .send('Error processing webhook');
    }
  }

  @Post('create')
  async createPayment(
    @Body()
    body: {
      name: string;
      cpf: string;
      email: string;
      phone: string;
      price: number;
      productId: string;
    },
  ) {
    const { name, cpf, email, phone, price, productId } = body;

    console.log('Received in Controller:', {
      name,
      cpf,
      email,
      phone,
      price,
      productId,
    });

    const payment = await this.paymentService.createPayment(
      name,
      cpf,
      email,
      phone,
      price,
      productId,
    );

    return {
      message: 'Pagamento criado com sucesso',
      payment,
    };
  }

  @Get('status')
  async checkPaymentStatus(@Query('id') paymentId: string) {
    const { status, details } =
      await this.paymentService.checkPaymentStatus(paymentId);

    return {
      message: 'Payment status retrieved successfully',
      status,
      details,
    };
  }
}
