import { Field, ObjectType, Float, ID, InputType } from '@nestjs/graphql';
import { Order } from '../order/order.model';

@ObjectType()
export class Product {
  @Field(() => ID)
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

@InputType()
export class DeleteProductInput {
  @Field(() => ID)
  productId: string;
}
