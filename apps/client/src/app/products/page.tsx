"use client";

import { useQuery } from "@apollo/client/react";
import { Button } from "@store-demo/ui";
import { ProductCard, CreateProductDialog } from "@/components/organisms";
import { GET_PRODUCTS } from "@/graphql/queries";

interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
}

export default function ProductsPage() {
  const { data, loading, error } = useQuery<{ products: Product[] }>(GET_PRODUCTS);

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-destructive">Error loading products: {error.message}</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Products</h1>
          <p className="text-muted-foreground mt-2">
            Manage your product catalog
          </p>
        </div>
        <CreateProductDialog>
          <Button>New Product</Button>
        </CreateProductDialog>
      </div>

      {loading ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-48 rounded-lg bg-muted animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {data?.products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}

      {!loading && data?.products.length === 0 && (
        <div className="text-center py-8">
          <p className="text-muted-foreground">No products yet. Create your first product!</p>
        </div>
      )}
    </div>
  );
}
