import { Field, InputType } from '@nestjs/graphql';
import { IsEmail, IsNotEmpty, IsPhoneNumber, IsString } from 'class-validator';

@InputType()
export class CreateOrderInput {
  @Field()
  @IsNotEmpty()
  @IsString()
  customerName: string;

  @Field()
  @IsNotEmpty()
  @IsPhoneNumber()
  customerPhone: string;

  @Field()
  @IsNotEmpty()
  @IsString()
  customerCPF: string;

  @Field()
  @IsNotEmpty()
  @IsEmail()
  customerEmail: string;

  @Field()
  @IsString()
  @IsNotEmpty()
  productId: string;

  @Field()
  @IsNotEmpty()
  @IsString()
  paymentMethod: string;
}
