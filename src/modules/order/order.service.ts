import { PrismaService } from 'prisma/prisma.service';
import { Order } from '@prisma/client';
import { Injectable } from '@nestjs/common';
import { CreateOrderInput } from './create-order.input';

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

  async approveOrder(id: string): Promise<Order> {
    return this.prisma.order.update({
      where: { id },
      data: { status: 'APPROVED' },
    });
  }
}
