import { PrismaService } from 'prisma/prisma.service';
import { Order, Prisma } from '@prisma/client';
import { Injectable } from '@nestjs/common';

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

  async createOrder(data: Prisma.OrderCreateInput): Promise<Order> {
    return this.prisma.order.create({
      data: { product: { connect: { id: data.productId } } },
    });
  }

  async approveOrder(id: string): Promise<Order> {
    return this.prisma.order.update({
      where: { id },
      data: { status: 'APPROVED' },
    });
  }
}
