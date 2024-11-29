import { InputType, Field, Float } from '@nestjs/graphql';
import { IsNotEmpty, IsPositive, IsUrl } from 'class-validator';

@InputType()
export class CreateProductInput {
  @Field()
  @IsNotEmpty()
  name: string;

  @Field()
  @IsNotEmpty()
  description: string;

  @Field(() => Float)
  @IsPositive()
  price: number;

  @Field()
  @IsUrl()
  imageURL: string;
}
