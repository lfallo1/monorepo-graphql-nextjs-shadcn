import { store } from './data/store.js';
import { Order, CreateProductInput, CreateOrderInput } from './types.js';

export const resolvers = {
  Query: {
    users: () => store.getUsers(),
    user: (_: unknown, { id }: { id: string }) => store.getUserById(id),
    orders: () => store.getOrders(),
    order: (_: unknown, { id }: { id: string }) => store.getOrderById(id),
    products: () => store.getProducts(),
    product: (_: unknown, { id }: { id: string }) => store.getProductById(id),
  },

  Mutation: {
    createProduct: (_: unknown, { input }: { input: CreateProductInput }) => {
      return store.createProduct(input);
    },
    createOrder: (_: unknown, { input }: { input: CreateOrderInput }) => {
      return store.createOrder(input);
    },
  },

  // Field resolvers for nested data
  User: {
    orders: (parent: { id: string }) => store.getOrdersByUserId(parent.id),
  },

  Order: {
    products: (parent: Order) => store.getProductsByIds(parent.productIds),
  },
};
