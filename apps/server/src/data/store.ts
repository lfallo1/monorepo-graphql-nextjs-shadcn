import { User, Order, Product } from '../types.js';

// In-memory data store
const users: User[] = [
  { id: '1', name: 'Alice Johnson', email: 'alice@example.com' },
  { id: '2', name: 'Bob Smith', email: 'bob@example.com' },
];

const products: Product[] = [
  { id: '1', name: 'Laptop', price: 999.99, description: 'High-performance laptop' },
  { id: '2', name: 'Mouse', price: 29.99, description: 'Wireless mouse' },
  { id: '3', name: 'Keyboard', price: 79.99, description: 'Mechanical keyboard' },
];

const orders: Order[] = [
  {
    id: '1',
    userId: '1',
    productIds: ['1', '2'],
    total: 1029.98,
    createdAt: '2024-01-15T10:30:00Z',
  },
  {
    id: '2',
    userId: '1',
    productIds: ['3'],
    total: 79.99,
    createdAt: '2024-01-20T14:00:00Z',
  },
];

let nextProductId = 4;
let nextOrderId = 3;

// Store access functions
export const store = {
  // Users
  getUsers: () => users,
  getUserById: (id: string) => users.find(u => u.id === id),

  // Products
  getProducts: () => products,
  getProductById: (id: string) => products.find(p => p.id === id),
  getProductsByIds: (ids: string[]) => products.filter(p => ids.includes(p.id)),
  createProduct: (input: { name: string; price: number; description: string }): Product => {
    const product: Product = {
      id: String(nextProductId++),
      ...input,
    };
    products.push(product);
    return product;
  },

  // Orders
  getOrders: () => orders,
  getOrderById: (id: string) => orders.find(o => o.id === id),
  getOrdersByUserId: (userId: string) => orders.filter(o => o.userId === userId),
  createOrder: (input: { userId: string; productIds: string[] }): Order => {
    const orderProducts = store.getProductsByIds(input.productIds);
    const total = orderProducts.reduce((sum, p) => sum + p.price, 0);

    const order: Order = {
      id: String(nextOrderId++),
      userId: input.userId,
      productIds: input.productIds,
      total: Math.round(total * 100) / 100,
      createdAt: new Date().toISOString(),
    };
    orders.push(order);
    return order;
  },
};
