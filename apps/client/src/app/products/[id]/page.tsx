"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { useQuery } from "@apollo/client/react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  Button,
  Badge,
  PriceDisplay,
} from "@store-demo/ui";
import { GET_PRODUCT } from "@/graphql/queries";

interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
}

export default function ProductDetailPage() {
  const params = useParams();
  const id = params.id as string;

  const { data, loading, error } = useQuery<{ product: Product | null }>(GET_PRODUCT, {
    variables: { id },
  });

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="h-8 w-48 bg-muted animate-pulse rounded" />
        <div className="h-64 bg-muted animate-pulse rounded-lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-destructive">Error loading product: {error.message}</p>
      </div>
    );
  }

  if (!data?.product) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">Product not found</p>
        <Button asChild className="mt-4">
          <Link href="/products">Back to Products</Link>
        </Button>
      </div>
    );
  }

  const product = data.product;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button asChild variant="outline" size="sm">
          <Link href="/products">← Back to Products</Link>
        </Button>
      </div>

      <Card className="max-w-2xl">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="text-2xl">{product.name}</CardTitle>
              <CardDescription className="mt-2">Product ID: {product.id}</CardDescription>
            </div>
            <Badge variant="secondary" className="text-lg px-4 py-2">
              <PriceDisplay amount={product.price} />
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h3 className="font-medium text-sm text-muted-foreground mb-1">Description</h3>
              <p className="text-lg">{product.description}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
