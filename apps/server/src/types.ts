export interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
}

export interface Order {
  id: string;
  userId: string;
  productIds: string[];
  total: number;
  createdAt: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
}

export interface CreateProductInput {
  name: string;
  price: number;
  description: string;
}

export interface CreateOrderInput {
  userId: string;
  productIds: string[];
}
