import { gql } from "@apollo/client";

export const GET_PRODUCTS = gql`
  query GetProducts {
    products {
      id
      name
      price
      description
    }
  }
`;

export const GET_PRODUCT = gql`
  query GetProduct($id: ID!) {
    product(id: $id) {
      id
      name
      price
      description
    }
  }
`;

export const GET_ORDERS = gql`
  query GetOrders {
    orders {
      id
      userId
      total
      createdAt
      products {
        id
        name
        price
      }
    }
  }
`;

export const GET_ORDER = gql`
  query GetOrder($id: ID!) {
    order(id: $id) {
      id
      userId
      total
      createdAt
      products {
        id
        name
        price
        description
      }
    }
  }
`;

export const GET_USERS = gql`
  query GetUsers {
    users {
      id
      name
      email
    }
  }
`;
