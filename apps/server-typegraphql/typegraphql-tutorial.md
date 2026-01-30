# Building a GraphQL Server with TypeGraphQL

A hands-on tutorial for developers who know REST but want to grok GraphQL with a code-first, decorator-based approach.

---

## What We're Building

A simple e-commerce API with:
- **Users** who place orders
- **Products** available for purchase
- **Orders** that connect users to products

By the end, you'll have a working GraphQL server and understand how TypeGraphQL's decorator pattern differs from the traditional SDL (Schema Definition Language) approach.

---

## Table of Contents

1. [Two Ways to Define GraphQL Schemas](#1-two-ways-to-define-graphql-schemas)
2. [Project Setup](#2-project-setup)
3. [Creating Your First ObjectType](#3-creating-your-first-objecttype)
4. [Adding More Types with Relationships](#4-adding-more-types-with-relationships)
5. [Input Types for Mutations](#5-input-types-for-mutations)
6. [Your First Resolver](#6-your-first-resolver)
7. [Field Resolvers for Nested Data](#7-field-resolvers-for-nested-data)
8. [Building the Schema](#8-building-the-schema)
9. [Wiring Up Apollo Server](#9-wiring-up-apollo-server)
10. [Testing Your API](#10-testing-your-api)
11. [Recap: SDL vs TypeGraphQL](#11-recap-sdl-vs-typegraphql)
12. [Addendum: How GraphQL Resolves a Request](#12-addendum-how-graphql-resolves-a-request)

---

## 1. Two Ways to Define GraphQL Schemas

Before we write code, let's understand the two main approaches.

### SDL-First (Schema Definition Language)

You write your schema as a string using GraphQL's type language, but you also need TypeScript types for your application code. This means defining things twice:

```typescript
// schema.ts - GraphQL schema (source of truth for API)
export const typeDefs = `#graphql
  type Product {
    id: ID!
    name: String!
    price: Float!
  }

  type Query {
    products: [Product!]!
  }
`;
```

```typescript
// types.ts - TypeScript interfaces (source of truth for your code)
export interface Product {
  id: string;
  name: string;
  price: number;
}
```

```typescript
// resolvers.ts - must manually ensure return types match both
export const resolvers = {
  Query: {
    products: (): Product[] => store.getProducts(),
  },
};
```

**The problem:** You're defining `Product` in two places. Add a field to the GraphQL schema but forget the TypeScript interface? TypeScript won't catch it. Change the interface but not the schema? Your API silently breaks. You're maintaining two sources of truth that can drift apart.

### Code-First with TypeGraphQL

You define types as decorated TypeScript classes. The schema is generated from your code:

```typescript
@ObjectType()
class Product {
  @Field(() => ID)
  id: string;

  @Field(() => String)
  name: string;

  @Field(() => Float)
  price: number;
}

@Resolver(() => Product)
class ProductResolver {
  @Query(() => [Product])
  products(): Product[] {
    return store.getProducts();
  }
}
```

**The benefit:** One source of truth. TypeScript types ARE your GraphQL types.

---

## 2. Project Setup

Create a new directory and initialize the project.

```bash
mkdir graphql-store && cd graphql-store
npm init -y
```

### Install Dependencies

```bash
npm install @apollo/server graphql type-graphql reflect-metadata class-validator graphql-scalars
npm install -D typescript tsx @types/node
```

Here's what each does:

- `@apollo/server` - The GraphQL server
- `graphql` - Core GraphQL implementation
- `type-graphql` - The decorator magic
- `reflect-metadata` - Required for TypeScript decorators to work at runtime
- `class-validator` - Optional validation (TypeGraphQL integrates with it)
- `graphql-scalars` - Common scalar types (dates, emails, etc.)
- `tsx` - Run TypeScript directly without compiling

### Configure TypeScript

Create `tsconfig.json`:

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "NodeNext",
    "moduleResolution": "NodeNext",
    "lib": ["ES2022"],
    "outDir": "dist",
    "rootDir": "src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "experimentalDecorators": true,
    "emitDecoratorMetadata": true,
    "strictPropertyInitialization": false
  },
  "include": ["src/**/*"]
}
```

The critical settings for TypeGraphQL:

- `experimentalDecorators: true` - Enables `@Decorator` syntax
- `emitDecoratorMetadata: true` - Allows runtime type reflection
- `strictPropertyInitialization: false` - Class properties don't need initializers

### Configure package.json

Update your `package.json`:

```json
{
  "type": "module",
  "scripts": {
    "dev": "tsx watch src/index.ts",
    "build": "tsc",
    "start": "node dist/index.js"
  }
}
```

### Create Directory Structure

```bash
mkdir -p src/types src/resolvers src/data
```

You should have:

```
graphql-store/
├── package.json
├── tsconfig.json
└── src/
    ├── types/
    ├── resolvers/
    └── data/
```

---

## 3. Creating Your First ObjectType

Let's start with `Product`. Create `src/types/product.type.ts`:

```typescript
import { ObjectType, Field, ID, Float } from 'type-graphql';

@ObjectType({ description: 'A product in the store' })
export class Product {
  @Field(() => ID)
  id: string;

  @Field(() => String)
  name: string;

  @Field(() => Float)
  price: number;

  @Field(() => String)
  description: string;
}
```

### Breaking It Down

**`@ObjectType()`** - Marks this class as a GraphQL type. The generated schema will include:

```graphql
type Product {
  ...
}
```

**`@Field(() => ID)`** - Marks this property as a GraphQL field. The arrow function specifies the GraphQL type.

Why the arrow function `() => ID` instead of just `ID`?

- It's a thunk (lazy evaluation) to handle circular dependencies
- With ESM modules, TypeScript's reflection can't always infer types, so explicit types are required

### GraphQL Type Mappings

| TypeScript | GraphQL | Field Decorator |
|------------|---------|-----------------|
| `string` | `String` | `@Field(() => String)` |
| `number` | `Float` or `Int` | `@Field(() => Float)` |
| `boolean` | `Boolean` | `@Field(() => Boolean)` |
| `string` (for IDs) | `ID` | `@Field(() => ID)` |
| `string[]` | `[String]` | `@Field(() => [String])` |
| `Date` | `DateTime` | Needs graphql-scalars |

---

## 4. Adding More Types with Relationships

### The Order Type

Create `src/types/order.type.ts`:

```typescript
import { ObjectType, Field, ID, Float } from 'type-graphql';
import { Product } from './product.type.js';

@ObjectType({ description: 'An order placed by a user' })
export class Order {
  @Field(() => ID)
  id: string;

  @Field(() => String)
  userId: string;

  // NOT a @Field - this is internal data used by the resolver
  productIds: string[];

  // This will be populated by a FieldResolver
  @Field(() => [Product], { description: 'Products in this order' })
  products: Product[];

  // total is computed by a FieldResolver - not stored in the database
  @Field(() => Float, { description: 'Computed total from product prices' })
  total: number;

  @Field(() => String)
  createdAt: string;
}
```

Notice a few things:

- `productIds` has no `@Field` decorator - it exists in our data but isn't exposed in the GraphQL schema
- `products` IS exposed, but we'll populate it via a FieldResolver
- `total` IS exposed, but it's computed on the fly by a FieldResolver (not stored in the database)

This is a powerful pattern: your stored data can be minimal, and resolvers compute derived fields on demand.

### The User Type

Create `src/types/user.type.ts`:

```typescript
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
```

### Barrel Export

Create `src/types/index.ts`:

```typescript
export { Product } from './product.type.js';
export { Order } from './order.type.js';
export { User } from './user.type.js';
```

---

## 5. Input Types for Mutations

GraphQL distinguishes between output types (what you query) and input types (what you send in mutations).

Add to `src/types/product.type.ts`:

```typescript
import { ObjectType, Field, ID, Float, InputType } from 'type-graphql';

@ObjectType({ description: 'A product in the store' })
export class Product {
  // ... existing fields
}

@InputType({ description: 'Input for creating a new product' })
export class CreateProductInput {
  @Field(() => String)
  name: string;

  @Field(() => Float)
  price: number;

  @Field(() => String)
  description: string;
}
```

Add to `src/types/order.type.ts`:

```typescript
import { ObjectType, Field, ID, Float, InputType } from 'type-graphql';
// ... existing code

@InputType({ description: 'Input for creating a new order' })
export class CreateOrderInput {
  @Field(() => String)
  userId: string;

  @Field(() => [String])
  productIds: string[];
}
```

Update your barrel export in `src/types/index.ts`:

```typescript
export { Product, CreateProductInput } from './product.type.js';
export { Order, CreateOrderInput } from './order.type.js';
export { User } from './user.type.js';
```

### Why Separate Input Types?

You might wonder why we can't just reuse `Product` for input. GraphQL enforces this separation because:

- Output types can have computed fields (resolvers)
- Input types must be plain data
- They often have different required fields (no `id` on create)

---

## 6. Your First Resolver

Before writing resolvers, let's create some mock data.

### The Data Store

Create `src/data/store.ts`:

```typescript
// Simple in-memory store for demo purposes

interface StoredProduct {
  id: string;
  name: string;
  price: number;
  description: string;
}

interface StoredOrder {
  id: string;
  userId: string;
  productIds: string[];
  createdAt: string;
  // Note: no 'total' field - this will be computed by a FieldResolver
}

interface StoredUser {
  id: string;
  name: string;
  email: string;
}

// Seed data
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
];

let nextProductId = 4;
let nextOrderId = 2;

// Store API
export const store = {
  // Users
  getUsers: () => users,
  getUserById: (id: string) => users.find(u => u.id === id),

  // Products
  getProducts: () => products,
  getProductById: (id: string) => products.find(p => p.id === id),
  getProductsByIds: (ids: string[]) => products.filter(p => ids.includes(p.id)),
  createProduct: (input: { name: string; price: number; description: string }) => {
    const product = { id: String(nextProductId++), ...input };
    products.push(product);
    return product;
  },

  // Orders
  getOrders: () => orders,
  getOrderById: (id: string) => orders.find(o => o.id === id),
  getOrdersByUserId: (userId: string) => orders.filter(o => o.userId === userId),
  createOrder: (input: { userId: string; productIds: string[] }) => {
    const order = {
      id: String(nextOrderId++),
      ...input,
      createdAt: new Date().toISOString(),
    };
    orders.push(order);
    return order;
  },
};
```

### The Product Resolver

Create `src/resolvers/product.resolver.ts`:

```typescript
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
```

### Breaking It Down

**`@Resolver(() => Product)`** - Groups related queries/mutations. The type hint helps with field resolvers (covered next).

**`@Query(() => [Product])`** - Marks this method as a GraphQL query. Returns an array of Products.

**`@Query(() => Product, { nullable: true })`** - This query can return `null` (if product not found).

**`@Arg('id', () => ID)`** - Declares a query argument. Maps to `product(id: ID!)` in the schema.

**`@Mutation(() => Product)`** - Same as Query, but for mutations.

---

## 7. Field Resolvers for Nested Data

Here's where it gets interesting. When a client queries:

```graphql
{
  users {
    name
    orders {
      total
    }
  }
}
```

How does GraphQL know how to get a user's orders? **Field Resolvers**.

### The User Resolver

Create `src/resolvers/user.resolver.ts`:

```typescript
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

  // This runs when 'orders' field is requested on a User
  @FieldResolver(() => [Order])
  orders(@Root() user: User): Order[] {
    return store.getOrdersByUserId(user.id) as Order[];
  }
}
```

**`@FieldResolver(() => [Order])`** - Runs when the `orders` field is queried on a User object.

**`@Root() user: User`** - The parent object. When resolving `users { orders }`, the `@Root()` is each User.

### The Order Resolver

Create `src/resolvers/order.resolver.ts`:

```typescript
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

  // Resolve products from productIds
  @FieldResolver(() => [Product])
  products(@Root() order: Order): Product[] {
    return store.getProductsByIds(order.productIds) as Product[];
  }

  // Compute total from product prices on the fly
  @FieldResolver(() => Number)
  total(@Root() order: Order): number {
    const products = store.getProductsByIds(order.productIds);
    const sum = products.reduce((acc, p) => acc + p.price, 0);
    return Math.round(sum * 100) / 100;
  }
}
```

Two field resolvers here:
- `products` transforms `productIds: ['1', '2']` into actual Product objects
- `total` computes the sum of product prices on demand

This pattern keeps your stored data minimal (just IDs) while the API returns rich, computed data. If product prices change, the `total` is always accurate because it's calculated at query time.

### Barrel Export

Create `src/resolvers/index.ts`:

```typescript
export { ProductResolver } from './product.resolver.js';
export { OrderResolver } from './order.resolver.js';
export { UserResolver } from './user.resolver.js';
```

---

## 8. Building the Schema

Now we tie it together. Create `src/schema.ts`:

```typescript
import 'reflect-metadata';
import { buildSchema, type BuildSchemaOptions } from 'type-graphql';
import path from 'path';
import { fileURLToPath } from 'url';
import { ProductResolver, OrderResolver, UserResolver } from './resolvers/index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const buildGraphQLSchema = async ({ emitGeneratedSchemaFile }: { emitGeneratedSchemaFile: boolean }) => {
  const options: BuildSchemaOptions = {
    resolvers: [
      ProductResolver,
      OrderResolver,
      UserResolver,
    ],
    emitSchemaFile: emitGeneratedSchemaFile
      ? path.resolve(__dirname, 'schema.graphql')
      : false,
    validate: { forbidUnknownValues: false },
  };

  return buildSchema(options);
};
```

**`import 'reflect-metadata'`** 

- Must be imported before any decorated classes are used. Only needed once at the entry point.

**`emitSchemaFile`** 

- Outputs the generated SDL to a file. Great for debugging or sharing with frontend teams.

**`validate`** 

- Integrates with class-validator. We disable strict mode here for simplicity.

---

## 9. Wiring Up Apollo Server

Create `src/index.ts`:

```typescript
import 'reflect-metadata';
import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import { buildGraphQLSchema } from './schema.js';

async function bootstrap() {
  // Build schema from decorated classes
  const schema = await buildGraphQLSchema({ emitGeneratedSchemaFile: true });

  // Create Apollo Server
  const server = new ApolloServer({
    schema,
    introspection: true, // Enable GraphQL Playground
  });

  // Start server
  const { url } = await startStandaloneServer(server, {
    listen: { port: 4000 },
  });

  console.log(`Server ready at ${url}`);
}

bootstrap().catch(console.error);
```

### Run It

```bash
npm run dev
```

You should see:

```
Server ready at http://localhost:4000
```

---

## 10. Testing Your API

Open http://localhost:4000 in your browser. Apollo Server provides a built-in explorer.

### Try These Queries

**Get all products:**
```graphql
query {
  products {
    id
    name
    price
  }
}
```

**Get users with their orders and products:**
```graphql
query {
  users {
    name
    email
    orders {
      id
      total
      createdAt
      products {
        name
        price
      }
    }
  }
}
```

**Create a product:**
```graphql
mutation {
  createProduct(input: {
    name: "Monitor"
    price: 299.99
    description: "27 inch 4K display"
  }) {
    id
    name
    price
  }
}
```

**Create an order:**
```graphql
mutation {
  createOrder(input: {
    userId: "2"
    productIds: ["1", "3"]
  }) {
    id
    total
    products {
      name
    }
  }
}
```

---

## 11. Recap: SDL vs TypeGraphQL

You've now built the same API that exists in the `server` directory, but with a completely different approach.

### SDL Approach (server/)

```
schema.ts    →  GraphQL types as strings
types.ts     →  TypeScript interfaces (separate!)
resolvers.ts →  Object with resolver functions
```

Pros: Familiar if you know GraphQL, schema is explicit
Cons: Two sources of truth, can drift apart

### TypeGraphQL Approach (server-typegraphql/)

```
types/*.ts      →  Classes with @ObjectType, @Field
resolvers/*.ts  →  Classes with @Resolver, @Query, @Mutation
schema.ts       →  buildSchema() generates everything
```

Pros: Single source of truth, full type safety, better IDE support
Cons: More decorators, slight learning curve

### When to Use Which?

**Use SDL when:**
- Team knows GraphQL well
- Schema is designed API-first
- Integrating with schema stitching/federation

**Use TypeGraphQL when:**
- Team knows TypeScript well
- Want maximum type safety
- Building from scratch with Node.js

---

## 12. Addendum: How GraphQL Resolves a Request

Now that you've built the server, let's demystify what happens when a query arrives. This is where the "magic" becomes clear.

### A Sample Query

```graphql
query Products {
  products {
    id
    name
    price
    description
  }
}
```

When this hits your server, how does GraphQL know what code to run?

### Step 1: The Operation Name is Ignored (For Resolution)

```graphql
query Products {  ← "Products" is just a label
```

The `Products` after `query` is the **operation name**. It's entirely optional and used for:
- Debugging (shows up in logs and dev tools)
- When sending multiple operations in one document

You could rename it to anything:

```graphql
query AnythingYouWant {
  products { ... }
}
```

The server doesn't use this name to find resolvers. It's purely for your benefit.

### Step 2: The Field Name is Everything

```graphql
query Products {
  products {  ← THIS is what matters
```

The lowercase `products` is the **field name**. This is what GraphQL uses to find the resolver.

### Step 3: Matching Field to Resolver Method

Look at your resolver:

```typescript
@Resolver(() => Product)
export class ProductResolver {

  @Query(() => [Product])
  products(): Product[] {  ← Method name = "products"
    return store.getProducts();
  }
}
```

The method name `products` becomes the field name in the schema. TypeGraphQL generates:

```graphql
type Query {
  products: [Product!]!  ← Field name comes from method name
}
```

When a query asks for `products`, GraphQL matches it to the method named `products`.

### The Class Name Doesn't Matter

You might wonder: "But the class is called `ProductResolver` - does that matter?"

**No.** The class name is purely organizational. You could rename it:

```typescript
@Resolver(() => Product)
export class AnythingResolver {  ← Doesn't affect resolution

  @Query(() => [Product])
  products(): Product[] {  ← THIS is what creates the "products" field
    return store.getProducts();
  }
}
```

The schema would be identical. GraphQL only cares about:
1. The `@Query` decorator (marks it as a query field)
2. The method name (becomes the field name)

### Overriding the Field Name

You can explicitly set a different field name:

```typescript
@Query(() => [Product], { name: 'allProducts' })
products(): Product[] {
  return store.getProducts();
}
```

Now the schema has `allProducts`, not `products`:

```graphql
type Query {
  allProducts: [Product!]!  ← Explicit name overrides method name
}
```

### The Full Resolution Flow

Here's the complete journey of a query:

```
┌─────────────────────────────────────────────────────────────────────┐
│  Client sends:                                                       │
│  query Products { products { id name price description } }          │
└─────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────┐
│  1. Parse: GraphQL parses the query string into an AST              │
│     - Operation type: "query"                                        │
│     - Operation name: "Products" (ignored for resolution)           │
│     - Selection set: products → id, name, price, description        │
└─────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────┐
│  2. Validate: Check query against schema                            │
│     - Does "products" field exist on Query type? ✓                  │
│     - Do id, name, price, description exist on Product? ✓           │
└─────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────┐
│  3. Execute: Walk the selection set, calling resolvers              │
│                                                                      │
│     Query.products resolver                                          │
│         ↓                                                            │
│     @Query(() => [Product])                                          │
│     products() { return store.getProducts(); }                       │
│         ↓                                                            │
│     Returns: [{ id: '1', name: 'Laptop', ... }, ...]                │
└─────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────┐
│  4. For each field in selection set (id, name, price, description): │
│                                                                      │
│     - Check if there's a FieldResolver for it                       │
│     - If not, use default resolver (just return obj.fieldName)      │
│                                                                      │
│     Product.id        → default → product.id                        │
│     Product.name      → default → product.name                      │
│     Product.price     → default → product.price                     │
│     Product.description → default → product.description             │
└─────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────┐
│  5. Return JSON response:                                            │
│     {                                                                │
│       "data": {                                                      │
│         "products": [                                                │
│           { "id": "1", "name": "Laptop", ... }                      │
│         ]                                                            │
│       }                                                              │
│     }                                                                │
└─────────────────────────────────────────────────────────────────────┘
```

### Nested Fields Trigger More Resolvers

When you query nested data:

```graphql
query {
  users {
    name
    orders {      ← Triggers User.orders FieldResolver
      total       ← Triggers Order.total FieldResolver
      products {  ← Triggers Order.products FieldResolver
        name
      }
    }
  }
}
```

The flow becomes:

1. `Query.users` resolver runs → returns User objects
2. For each User, `User.orders` FieldResolver runs → returns Order objects
3. For each Order, `Order.total` FieldResolver runs → computes and returns number
4. For each Order, `Order.products` FieldResolver runs → returns Product objects
5. For each Product, default resolvers return `name`

This is why GraphQL is efficient: it only runs resolvers for fields you actually request.

### Key Takeaways

| Concept | What It Does |
|---------|--------------|
| Operation name (`query Products`) | Label for debugging; ignored by resolver matching |
| Field name (`products`) | Matched against resolver method names |
| Class name (`ProductResolver`) | Organizational only; doesn't affect resolution |
| `@Query` decorator | Registers method as a Query field |
| `@FieldResolver` decorator | Runs when that specific field is requested on a type |
| Method name | Becomes the GraphQL field name (unless overridden) |

---

## Next Steps

Now that you understand the basics, explore:

1. **Context** - Pass authentication, database connections to resolvers
2. **Middleware** - Cross-cutting concerns (auth, logging, errors)
3. **DataLoader** - Solve the N+1 query problem
4. **Subscriptions** - Real-time updates with WebSockets
5. **Validation** - Use class-validator decorators on InputTypes

Happy coding!
