"use client";

import Link from "next/link";
import { useQuery } from "@apollo/client/react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, Button } from "@store-demo/ui";
import { GET_PRODUCTS, GET_ORDERS } from "@/graphql/queries";

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
  products: { id: string; name: string; price: number }[];
}

export default function DashboardPage() {
  const { data: productsData, loading: productsLoading } = useQuery<{ products: Product[] }>(GET_PRODUCTS);
  const { data: ordersData, loading: ordersLoading } = useQuery<{ orders: Order[] }>(GET_ORDERS);

  const productCount = productsData?.products.length ?? 0;
  const orderCount = ordersData?.orders.length ?? 0;
  const totalRevenue = ordersData?.orders.reduce((sum, order) => sum + order.total, 0) ?? 0;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground mt-2">
          Welcome to the Store Admin dashboard
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardDescription>Total Products</CardDescription>
            <CardTitle className="text-4xl">
              {productsLoading ? "..." : productCount}
            </CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <CardDescription>Total Orders</CardDescription>
            <CardTitle className="text-4xl">
              {ordersLoading ? "..." : orderCount}
            </CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <CardDescription>Total Revenue</CardDescription>
            <CardTitle className="text-4xl">
              {ordersLoading
                ? "..."
                : new Intl.NumberFormat("en-US", {
                    style: "currency",
                    currency: "USD",
                  }).format(totalRevenue)}
            </CardTitle>
          </CardHeader>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Products</CardTitle>
            <CardDescription>Manage your product catalog</CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild className="w-full">
              <Link href="/products">View All Products</Link>
            </Button>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Orders</CardTitle>
            <CardDescription>View and manage customer orders</CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild className="w-full">
              <Link href="/orders">View All Orders</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
