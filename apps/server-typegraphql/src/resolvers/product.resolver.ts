import { Resolver, Query, Mutation, Arg, ID } from 'type-graphql';
import { Product, CreateProductInput } from '../types/index.js';
import { store } from '../data/store.js';

@Resolver(() => Product)
export class ProductResolver {
  @Query(() => [Product], { description: 'Get all products' })
  products(): Product[] {
    return store.getProducts() as Product[];
  }

  @Query(() => Product, { nullable: true, description: 'Get a product by ID' })
  product(@Arg('id', () => ID) id: string): Product | undefined {
    return store.getProductById(id) as Product | undefined;
  }

  @Mutation(() => Product, { description: 'Create a new product' })
  createProduct(
    @Arg('input', () => CreateProductInput) input: CreateProductInput
  ): Product {
    return store.createProduct(input) as Product;
  }
}
