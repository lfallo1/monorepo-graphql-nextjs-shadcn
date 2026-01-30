import { ObjectType, Field, ID } from 'type-graphql';
import { Order } from './order.type.js';

@ObjectType({ description: 'A user of the store' })
export class User {
  @Field(() => ID)
  id: string;

  @Field(() => String)
  name: string;

  @Field(() => String)
  email: string;

  @Field(() => [Order], { description: 'Orders placed by this user' })
  orders: Order[];
}
