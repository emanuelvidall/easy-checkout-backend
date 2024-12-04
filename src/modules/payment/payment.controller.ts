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

  @Post('webhook')
  async handlePaymentWebhook(@Req() req: Request, @Res() res: Response) {
    const event = req.body;
    console.log('Received in Controller:', event);
    const { paymentId, status } = event;

    console.log('Payment ID:', paymentId);
    console.log('Status:', status);

    if (![PaymentStatus.PENDING, PaymentStatus.APPROVED].includes(status)) {
      console.log('Invalid payment status');
      return res.status(HttpStatus.BAD_REQUEST).send('Invalid payment status');
    }

    const order = await this.orderService.findByPaymentId(paymentId);
    console.log('Order:', order);

    if (!order) {
      console.log('Order not found');
      return res.status(HttpStatus.NOT_FOUND).send('Order not found');
    }

    const orderStatus =
      await this.orderService.mapPaymentStatusToOrderStatus(status);

    console.log(orderStatus, 'Order Status');

    const updateOrderInput: UpdateOrderInput = {
      paymentStatus: status,
      orderStatus: orderStatus,
    };

    console.log('Update Order Input:', updateOrderInput);

    await this.orderService.updateOrder(order.id, updateOrderInput);

    res.status(HttpStatus.OK).send('Payment status updated');
    console.log('Payment status updated');
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
