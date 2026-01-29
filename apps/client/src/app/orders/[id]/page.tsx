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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  PriceDisplay,
} from "@store-demo/ui";
import { GET_ORDER } from "@/graphql/queries";

interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
}

interface Order {
  id: string;
  userId: string;
  total: number;
  createdAt: string;
  products: Product[];
}

export default function OrderDetailPage() {
  const params = useParams();
  const id = params.id as string;

  const { data, loading, error } = useQuery<{ order: Order | null }>(GET_ORDER, {
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
        <p className="text-destructive">Error loading order: {error.message}</p>
      </div>
    );
  }

  if (!data?.order) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">Order not found</p>
        <Button asChild className="mt-4">
          <Link href="/orders">Back to Orders</Link>
        </Button>
      </div>
    );
  }

  const order = data.order;
  const formattedDate = new Date(order.createdAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button asChild variant="outline" size="sm">
          <Link href="/orders">← Back to Orders</Link>
        </Button>
      </div>

      <Card className="max-w-3xl">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="text-2xl">Order #{order.id}</CardTitle>
              <CardDescription className="mt-2">
                Placed on {formattedDate}
              </CardDescription>
            </div>
            <Badge variant="secondary">{order.products.length} items</Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h3 className="font-medium text-sm text-muted-foreground mb-1">Customer</h3>
            <p>User #{order.userId}</p>
          </div>

          <div>
            <h3 className="font-medium text-sm text-muted-foreground mb-3">Products</h3>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Product</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead className="text-right">Price</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {order.products.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell className="font-medium">
                      <Link
                        href={`/products/${product.id}`}
                        className="hover:underline text-primary"
                      >
                        {product.name}
                      </Link>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {product.description}
                    </TableCell>
                    <TableCell className="text-right">
                      <PriceDisplay amount={product.price} />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          <div className="flex justify-end pt-4 border-t">
            <div className="text-right">
              <p className="text-sm text-muted-foreground">Total</p>
              <p className="text-2xl font-bold">
                <PriceDisplay amount={order.total} />
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
