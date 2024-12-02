import { Controller, Post, Body } from '@nestjs/common';
import { PaymentService } from './payment.service';

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
}
