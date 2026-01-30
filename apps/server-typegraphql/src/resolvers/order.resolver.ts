import { Resolver, Query, Mutation, Arg, ID, FieldResolver, Root } from 'type-graphql';
import { Order, CreateOrderInput, Product } from '../types/index.js';
import { store } from '../data/store.js';

@Resolver(() => Order)
export class OrderResolver {
  @Query(() => [Order], { description: 'Get all orders' })
  orders(): Order[] {
    return store.getOrders() as Order[];
  }

  @Query(() => Order, { nullable: true, description: 'Get an order by ID' })
  order(@Arg('id', () => ID) id: string): Order | undefined {
    return store.getOrderById(id) as Order | undefined;
  }

  @Mutation(() => Order, { description: 'Create a new order' })
  createOrder(
    @Arg('input', () => CreateOrderInput) input: CreateOrderInput
  ): Order {
    return store.createOrder(input) as Order;
  }

  // Field resolver: resolves the products field by looking up productIds
  @FieldResolver(() => [Product], { description: 'Products in this order' })
  products(@Root() order: Order): Product[] {
    return store.getProductsByIds(order.productIds) as Product[];
  }

  // Field resolver: computes total from product prices on the fly
  @FieldResolver(() => Number, { description: 'Computed total from product prices' })
  total(@Root() order: Order): number {
    const products = store.getProductsByIds(order.productIds);
    const sum = products.reduce((acc, p) => acc + p.price, 0);
    return Math.round(sum * 100) / 100;
  }
}
