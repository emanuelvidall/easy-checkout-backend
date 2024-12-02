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

@Controller('payment')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Post('create')
  async createPayment(
    @Body()
    body: {
      name: string;
      cpf: string;
      email: string;
      telefone: string;
    },
  ) {
    const { name, cpf, email } = body;

    const payment = await this.paymentService.createPayment(name, cpf, email);

    return {
      message: 'Pagamento criado com sucesso',
      payment,
    };
  }

  @Post('webhook')
  async handleWebhook(@Req() req: Request, @Res() res: Response) {
    try {
      const payload = req.body;

      await this.paymentService.handlePaymentStatusUpdate(payload);

      res.status(HttpStatus.OK).send('Webhook received');
    } catch (error) {
      console.error('Error handling webhook:', error.message);
      res.status(500).send('Failed to process webhook');
    }
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
