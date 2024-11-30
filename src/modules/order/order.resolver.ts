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

  //Example query to get all orders:
  // query {
  // getOrders {
  //   id
  //   product {
  //     id
  //     name
  //     description
  //     price
  //     imageURL
  //     createdAt
  //   }
  //   quantity
  //   status
  //   createdAt
  // }

  @Query(() => Order, { name: 'getOrderById' })
  async getOrderById(@Args('id') id: string): Promise<Order> {
    return this.orderService.getOrderById(id);
  }

  @Mutation(() => Order, { name: 'createOrder' })
  async createOrder(@Args('data') data: CreateOrderInput): Promise<Order> {
    return this.orderService.createOrder(data);
  }

  @Mutation(() => Order, { name: 'approveOrder' })
  async approveOrder(@Args('id') id: string): Promise<Order> {
    return this.orderService.approveOrder(id);
  }
}
