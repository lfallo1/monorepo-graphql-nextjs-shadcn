import { Resolver, Query, Arg, ID, FieldResolver, Root } from 'type-graphql';
import { User, Order } from '../types/index.js';
import { store } from '../data/store.js';

@Resolver(() => User)
export class UserResolver {
  @Query(() => [User], { description: 'Get all users' })
  users(): User[] {
    return store.getUsers() as User[];
  }

  @Query(() => User, { nullable: true, description: 'Get a user by ID' })
  user(@Arg('id', () => ID) id: string): User | undefined {
    return store.getUserById(id) as User | undefined;
  }

  // Field resolver: resolves the orders field by looking up userId
  @FieldResolver(() => [Order], { description: 'Orders placed by this user' })
  orders(@Root() user: User): Order[] {
    return store.getOrdersByUserId(user.id) as Order[];
  }
}
