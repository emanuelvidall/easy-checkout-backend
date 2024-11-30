import { Module } from '@nestjs/common';
import { PrismaModule } from 'prisma/prisma.module';
import { OrderResolver } from './order.resolver';
import { OrderService } from './order.service';

@Module({
  imports: [PrismaModule],
  providers: [OrderResolver, OrderService],
  exports: [OrderService],
})
export class OrderModule {}
