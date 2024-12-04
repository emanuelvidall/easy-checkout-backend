import { PrismaService } from 'prisma/prisma.service';
import { Order } from '@prisma/client';
import { Injectable } from '@nestjs/common';
import { CreateOrderInput } from './create-order.input';
import { PaymentStatus } from '../payment/payment-status.enum';
import { OrderStatus } from './order-status.enum';
import { UpdateOrderInput } from './update-order.input';

@Injectable()
export class OrderService {
  constructor(private readonly prisma: PrismaService) {}

  async getAllOrders(): Promise<Order[]> {
    return this.prisma.order.findMany({ include: { product: true } });
  }

  async getOrderById(id: string): Promise<Order | null> {
    return this.prisma.order.findUnique({
      where: { id },
      include: { product: true },
    });
  }

  async createOrder(data: CreateOrderInput): Promise<Order> {
    const { productId, ...rest } = data;

    return this.prisma.order.create({
      data: {
        ...rest,
        product: { connect: { id: productId } },
      },
      include: { product: true },
    });
  }

  mapPaymentStatusToOrderStatus(paymentStatus: PaymentStatus): OrderStatus {
    switch (paymentStatus) {
      case PaymentStatus.APPROVED:
        return OrderStatus.APPROVED;
      case PaymentStatus.PENDING:
      default:
        return OrderStatus.PENDING;
    }
  }

  async updateOrder(orderId: string, updateOrderInput: UpdateOrderInput) {
    return this.prisma.order.update({
      where: { id: orderId },
      data: updateOrderInput,
    });
  }

  async findByPaymentId(paymentId: string) {
    return this.prisma.order.findUnique({ where: { paymentId } });
  }
}
