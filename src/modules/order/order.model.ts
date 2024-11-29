import { Field, ObjectType, registerEnumType } from '@nestjs/graphql';
import { Product } from '../product/product.model';

export enum OrderStatus {
  PENDING = 'PENDING',
  COMPLETED = 'COMPLETED',
  CANCELED = 'CANCELED',
}

registerEnumType(OrderStatus, {
  name: 'OrderStatus',
});

@ObjectType()
export class Order {
  @Field()
  id: string;

  @Field()
  productId: string;

  @Field(() => Product)
  product: Product;

  @Field()
  customerName: string;

  @Field()
  customerPhone: string;

  @Field()
  customerCPF: string;

  @Field()
  customerEmail: string;

  @Field(() => OrderStatus)
  status: OrderStatus;

  @Field()
  paymentMethod: string;

  @Field(() => Date)
  createdAt: Date;
}
