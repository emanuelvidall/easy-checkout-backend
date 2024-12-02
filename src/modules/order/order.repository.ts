import { Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { Order, Prisma } from '@prisma/client';

@Injectable()
export class OrderRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findOne(orderId: string): Promise<Order | null> {
    return this.prisma.order.findUnique({
      where: { id: orderId },
    });
  }

  async update(orderId: string, data: Partial<Order>): Promise<Order> {
    return this.prisma.order.update({
      where: { id: orderId },
      data,
    });
  }

  async create(data: Prisma.OrderCreateInput): Promise<Order> {
    return this.prisma.order.create({ data });
  }
}
