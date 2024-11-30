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

  //Example query to get order by id:
  // query {
  // getOrderById(id: "bb5be711-7aa3-4222-984c-cd139b612ef5") {
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

  @Mutation(() => Order, { name: 'createOrder' })
  async createOrder(
    @Args('createOrderInput') createOrderInput: CreateOrderInput,
  ): Promise<Order> {
    return this.orderService.createOrder(createOrderInput);
  }

  //Example mutation to create an order:
  //  mutation {
  //   createOrder(
  //     createOrderInput: {
  //       customerName: "John Doe"
  //       customerPhone: "+123456789"
  //       customerCPF: "123.456.789-00"
  //       customerEmail: "johndoe@example.com"
  //       productId: "product-id-1"
  //       paymentMethod: "Credit Card"
  //       status: PENDING
  //     }
  //   ) {
  //     id
  //     customerName
  //     status
  //     paymentMethod
  //     createdAt
  //     product {
  //       id
  //       name
  //       description
  //       price
  //     }
  //   }
  // }

  @Mutation(() => Order, { name: 'approveOrder' })
  async approveOrder(@Args('id') id: string): Promise<Order> {
    return this.orderService.approveOrder(id);
  }

  //Example mutation to approve an order:
  // mutation {
  // approveOrder(id: "bb5be711-7aa3-4222-984c-cd139b612ef5") {
  //   id
  //   product {
  //     id
  //     name
  //     description
  //     price
  //     imageURL
  //     createdAt
  //   }
}
