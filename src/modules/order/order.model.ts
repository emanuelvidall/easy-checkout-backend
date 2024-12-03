import { Field, ObjectType, registerEnumType } from '@nestjs/graphql';
import { $Enums } from '@prisma/client';
import { Product } from '../product/product.model';

registerEnumType($Enums.OrderStatus, {
  name: 'OrderStatus',
});

@ObjectType()
export class Order {
  @Field()
  id: string;

  @Field()
  productId: string;

  @Field(() => Product, { nullable: true })
  product?: Product;

  @Field()
  customerName: string;

  @Field()
  paymentId: string;

  @Field()
  paymentStatus: string;

  @Field()
  customerPhone: string;

  @Field()
  customerCPF: string;

  @Field()
  customerEmail: string;

  @Field(() => $Enums.OrderStatus)
  status: $Enums.OrderStatus;

  @Field()
  paymentMethod: string;

  @Field(() => Date)
  createdAt: Date;
}
