import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { OrderService } from './order.service';
import { Order } from './order.model';
import { CreateOrderInput } from './create-order.input';

@Resolver(() => Order)
export class OrderResolver {
  constructor(private readonly orderService: OrderService) {}

  @Query(() => [Order], { name: 'getOrders' })
  async getOrders(): Promise<Order[]> {
    return this.orderService.getAllOrders();
  }

  @Query(() => Order, { name: 'getOrderById' })
  async getOrderById(@Args('id') id: string): Promise<Order> {
    return this.orderService.getOrderById(id);
  }

  @Mutation(() => Order, { name: 'createOrder' })
  async createOrder(
    @Args('createOrderInput') createOrderInput: CreateOrderInput,
  ): Promise<Order> {
    console.log('Received createOrderInput:', createOrderInput);
    return this.orderService.createOrder(createOrderInput);
  }
}
