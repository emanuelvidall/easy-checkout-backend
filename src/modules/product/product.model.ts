import { Field, ObjectType, Float } from '@nestjs/graphql';
import { Order } from '../order/order.model';

@ObjectType()
export class Product {
  @Field()
  id: string;

  @Field()
  name: string;

  @Field()
  description: string;

  @Field()
  imageURL: string;

  @Field(() => Float)
  price: number;

  @Field(() => Date)
  createdAt: Date;

  @Field(() => [Order], { nullable: true })
  orders?: Order[];
}
