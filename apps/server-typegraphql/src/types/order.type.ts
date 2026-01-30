import { ObjectType, Field, ID, Float, InputType } from 'type-graphql';
import { Product } from './product.type.js';

@ObjectType({ description: 'An order placed by a user' })
export class Order {
  @Field(() => ID)
  id: string;

  @Field(() => String)
  userId: string;

  // Internal field - not exposed directly, used by resolver
  productIds: string[];

  @Field(() => [Product], { description: 'Products in this order' })
  products: Product[];

  // total is computed by a FieldResolver, not stored
  @Field(() => Float, { description: 'Computed total from product prices' })
  total: number;

  @Field(() => String)
  createdAt: string;
}

@InputType({ description: 'Input for creating a new order' })
export class CreateOrderInput {
  @Field(() => String)
  userId: string;

  @Field(() => [String])
  productIds: string[];
}
