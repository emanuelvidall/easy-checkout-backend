import { Module } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { PaymentController } from './payment.controller';
import { OrderRepository } from '../order/order.repository';
import { PrismaService } from 'prisma/prisma.service';
import { OrderModule } from '../order/order.module';

@Module({
  imports: [OrderModule],
  controllers: [PaymentController],
  providers: [PaymentService, PaymentService, OrderRepository, PrismaService],
  exports: [PaymentService],
})
export class PaymentModule {}
