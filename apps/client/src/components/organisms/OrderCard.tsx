"use client";

import Link from "next/link";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
  Button,
  Badge,
  PriceDisplay,
} from "@store-demo/ui";

interface Product {
  id: string;
  name: string;
  price: number;
}

interface Order {
  id: string;
  userId: string;
  total: number;
  createdAt: string;
  products: Product[];
}

interface OrderCardProps {
  order: Order;
}

export function OrderCard({ order }: OrderCardProps) {
  const formattedDate = new Date(order.createdAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Order #{order.id}</CardTitle>
          <Badge variant="secondary">{order.products.length} items</Badge>
        </div>
        <CardDescription>
          {formattedDate} • User #{order.userId}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-1">
          {order.products.slice(0, 3).map((product) => (
            <div key={product.id} className="text-sm text-muted-foreground">
              {product.name}
            </div>
          ))}
          {order.products.length > 3 && (
            <div className="text-sm text-muted-foreground">
              +{order.products.length - 3} more...
            </div>
          )}
        </div>
        <div className="mt-4 pt-4 border-t">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium">Total</span>
            <PriceDisplay amount={order.total} className="text-lg font-bold" />
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button asChild variant="outline" className="w-full">
          <Link href={`/orders/${order.id}`}>View Details</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
