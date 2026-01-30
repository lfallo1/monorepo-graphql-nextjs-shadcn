import { ObjectType, Field, ID, Float, InputType } from 'type-graphql';

@ObjectType({ description: 'A product in the store' })
export class Product {
  @Field(() => ID)
  id: string;

  @Field(() => String)
  name: string;

  @Field(() => Float)
  price: number;

  @Field(() => String)
  description: string;
}

@InputType({ description: 'Input for creating a new product' })
export class CreateProductInput {
  @Field(() => String)
  name: string;

  @Field(() => Float)
  price: number;

  @Field(() => String)
  description: string;
}
