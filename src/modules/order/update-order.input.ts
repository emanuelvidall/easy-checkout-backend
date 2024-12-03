// src/orders/dto/update-order.input.ts

import { IsOptional, IsString, IsEnum } from 'class-validator';
import { PaymentStatus } from '../payment/payment-status.enum';
import { OrderStatus } from './order-status.enum';

export class UpdateOrderInput {
  @IsOptional()
  @IsString()
  paymentId?: string;

  @IsOptional()
  @IsEnum(PaymentStatus)
  paymentStatus?: PaymentStatus;

  @IsOptional()
  @IsEnum(OrderStatus)
  orderStatus?: OrderStatus;
}
