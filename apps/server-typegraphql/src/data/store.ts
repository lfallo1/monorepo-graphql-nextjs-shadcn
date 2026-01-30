import { Product, Order, User, CreateProductInput, CreateOrderInput } from '../types/index.js';

// Internal types that store raw data (without resolved fields)
interface StoredUser {
  id: string;
  name: string;
  email: string;
}

interface StoredOrder {
  id: string;
  userId: string;
  productIds: string[];
  createdAt: string;
}

interface StoredProduct {
  id: string;
  name: string;
  price: number;
  description: string;
}

// In-memory data store
const users: StoredUser[] = [
  { id: '1', name: 'Alice Johnson', email: 'alice@example.com' },
  { id: '2', name: 'Bob Smith', email: 'bob@example.com' },
];

const products: StoredProduct[] = [
  { id: '1', name: 'Laptop', price: 999.99, description: 'High-performance laptop' },
  { id: '2', name: 'Mouse', price: 29.99, description: 'Wireless mouse' },
  { id: '3', name: 'Keyboard', price: 79.99, description: 'Mechanical keyboard' },
];

const orders: StoredOrder[] = [
  {
    id: '1',
    userId: '1',
    productIds: ['1', '2'],
    createdAt: '2024-01-15T10:30:00Z',
  },
  {
    id: '2',
    userId: '1',
    productIds: ['3'],
    createdAt: '2024-01-20T14:00:00Z',
  },
];

let nextProductId = 4;
let nextOrderId = 3;

// Store access functions
export const store = {
  // Users
  getUsers: (): StoredUser[] => users,
  getUserById: (id: string): StoredUser | undefined => users.find(u => u.id === id),

  // Products
  getProducts: (): StoredProduct[] => products,
  getProductById: (id: string): StoredProduct | undefined => products.find(p => p.id === id),
  getProductsByIds: (ids: string[]): StoredProduct[] => products.filter(p => ids.includes(p.id)),
  createProduct: (input: CreateProductInput): StoredProduct => {
    const product: StoredProduct = {
      id: String(nextProductId++),
      ...input,
    };
    products.push(product);
    return product;
  },

  // Orders
  getOrders: (): StoredOrder[] => orders,
  getOrderById: (id: string): StoredOrder | undefined => orders.find(o => o.id === id),
  getOrdersByUserId: (userId: string): StoredOrder[] => orders.filter(o => o.userId === userId),
  createOrder: (input: CreateOrderInput): StoredOrder => {
    const order: StoredOrder = {
      id: String(nextOrderId++),
      userId: input.userId,
      productIds: input.productIds,
      createdAt: new Date().toISOString(),
    };
    orders.push(order);
    return order;
  },
};
