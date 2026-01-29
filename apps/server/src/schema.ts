export const typeDefs = `#graphql
  type Product {
    id: ID!
    name: String!
    price: Float!
    description: String!
  }

  type Order {
    id: ID!
    userId: ID!
    products: [Product!]!
    total: Float!
    createdAt: String!
  }

  type User {
    id: ID!
    name: String!
    email: String!
    orders: [Order!]!
  }

  type Query {
    users: [User!]!
    user(id: ID!): User
    orders: [Order!]!
    order(id: ID!): Order
    products: [Product!]!
    product(id: ID!): Product
  }

  input CreateProductInput {
    name: String!
    price: Float!
    description: String!
  }

  input CreateOrderInput {
    userId: ID!
    productIds: [ID!]!
  }

  type Mutation {
    createProduct(input: CreateProductInput!): Product!
    createOrder(input: CreateOrderInput!): Order!
  }
`;
