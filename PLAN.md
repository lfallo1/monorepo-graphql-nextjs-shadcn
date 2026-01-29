# Monorepo Store Demo - Implementation Plan

## Overview

A monorepo containing:
1. **GraphQL Server** (`apps/server`) - Apollo Server with products/orders/users API
2. **Admin Client** (`apps/client`) - Next.js + shadcn UI for managing products and orders
3. **Shared UI Package** (`packages/ui`) - Reusable components with Storybook

## Project Structure

```
monorepo-store-demo/
├── apps/
│   ├── server/                    # GraphQL API server (Apollo Server)
│   │   ├── src/
│   │   │   ├── index.ts           # Server entry point
│   │   │   ├── schema.ts          # GraphQL type definitions
│   │   │   ├── resolvers.ts       # Query/Mutation resolvers
│   │   │   ├── types.ts           # TypeScript interfaces
│   │   │   └── data/
│   │   │       └── store.ts       # In-memory data store
│   │   ├── package.json
│   │   └── tsconfig.json
│   └── client/                    # Next.js admin client
│       ├── src/
│       │   ├── app/
│       │   │   ├── layout.tsx     # Root layout with providers
│       │   │   ├── page.tsx       # Dashboard
│       │   │   ├── orders/        # Order pages
│       │   │   └── products/      # Product pages
│       │   ├── components/
│       │   │   ├── organisms/     # App-specific components (Header, Cards, Dialogs)
│       │   │   ├── templates/     # MainLayout
│       │   │   └── providers/     # ApolloProvider
│       │   ├── lib/
│       │   └── graphql/           # Queries and mutations
│       └── package.json           # Uses @store-demo/ui
├── packages/
│   └── ui/                        # Shared UI component library
│       ├── src/
│       │   ├── atoms/             # Base components (Button, Input, Card, etc.)
│       │   ├── molecules/         # Composite components (FormField, PriceDisplay)
│       │   ├── lib/               # Utilities (cn function)
│       │   ├── styles/            # CSS variables and theme
│       │   └── index.ts           # Main exports
│       ├── .storybook/            # Storybook configuration
│       ├── package.json
│       ├── tsconfig.json
│       └── tsup.config.ts
├── package.json                   # Root workspace config
├── turbo.json                     # Turborepo config
├── PLAN.md                        # This file
└── REFACTOR.md                    # UI refactor documentation
```

## Atomic Design Structure

### Atoms (in @store-demo/ui)
- `Button`, `buttonVariants` - shadcn button with variants
- `Input` - Text input component
- `Label` - Form label component
- `Badge`, `badgeVariants` - Status badges
- `Card`, `CardHeader`, `CardTitle`, `CardDescription`, `CardContent`, `CardFooter`
- `Dialog`, `DialogTrigger`, `DialogContent`, `DialogHeader`, `DialogTitle`, `DialogFooter`
- `Table`, `TableHeader`, `TableBody`, `TableRow`, `TableHead`, `TableCell`
- `Select`, `SelectTrigger`, `SelectContent`, `SelectItem`, `SelectValue`

### Molecules (in @store-demo/ui)
- `FormField` - Label + Input combination
- `PriceDisplay` - Formatted currency display

### Organisms (in client app)
- `Header` - Site navigation
- `ProductCard` - Product display card
- `OrderCard` - Order display card
- `CreateProductDialog` - Product creation form
- `CreateOrderDialog` - Order creation form

### Templates (in client app)
- `MainLayout` - Standard page layout

---

## How to Run

### Install Dependencies
```bash
cd monorepo-store-demo
npm install
```

### Development Mode
```bash
# Run all apps
npm run dev

# Run individually:
cd apps/server && npm run dev  # Server on http://localhost:4000
cd apps/client && npm run dev  # Client on http://localhost:3000
```

### Build
```bash
npm run build
```

### Storybook
```bash
cd packages/ui
npm run storybook  # Opens on http://localhost:6006
```

### GraphQL Playground
Visit http://localhost:4000 when server is running for Apollo Sandbox.

---

## Tech Stack

- **Build System**: Turborepo
- **Package Manager**: npm workspaces
- **Server**: Apollo Server 5, TypeScript, Node.js
- **Client**: Next.js 16, React 19, TypeScript
- **UI Library**: @store-demo/ui (shadcn/ui based, Tailwind CSS v4)
- **GraphQL Client**: Apollo Client 4
- **Component Documentation**: Storybook 8
- **Architecture**: Atomic Design

---

## Shared UI Package (@store-demo/ui)

### Features
- Built with tsup for ESM output
- Full TypeScript support with declarations
- Storybook documentation for all components
- Tailwind CSS v4 with CSS variables for theming

### Available Stories
- **Atoms**: Button, Input, Label, Badge, Card, Dialog, Table, Select
- **Molecules**: FormField, PriceDisplay

### Usage
```typescript
import { Button, Card, FormField, PriceDisplay } from "@store-demo/ui";
```

---

## Client Pages

| Route | Description |
|-------|-------------|
| `/` | Dashboard with stats (products, orders, revenue) |
| `/products` | List all products with "New Product" button |
| `/products/[id]` | Product detail view |
| `/orders` | List all orders with "New Order" button |
| `/orders/[id]` | Order detail view with product table |

---

## GraphQL API

### Types
- `Product`: id, name, price, description
- `Order`: id, userId, products, total, createdAt
- `User`: id, name, email, orders

### Queries
- `products` / `product(id)`
- `orders` / `order(id)`
- `users` / `user(id)`

### Mutations
- `createProduct(input: CreateProductInput)`
- `createOrder(input: CreateOrderInput)`

---

## Seed Data

**Users:**
- Alice Johnson (alice@example.com)
- Bob Smith (bob@example.com)

**Products:**
- Laptop ($999.99)
- Mouse ($29.99)
- Keyboard ($79.99)

**Orders:**
- Order #1: Laptop + Mouse = $1,029.98
- Order #2: Keyboard = $79.99

---

## Implementation Status

| Component | Status |
|-----------|--------|
| Monorepo Setup | ✅ Complete |
| GraphQL Server | ✅ Complete |
| Next.js Client | ✅ Complete |
| Shared UI Package | ✅ Complete |
| Storybook | ✅ Complete |
| Products Feature | ✅ Complete |
| Orders Feature | ✅ Complete |
