"use client";

import { useQuery } from "@apollo/client/react";
import { Button } from "@store-demo/ui";
import { OrderCard, CreateOrderDialog } from "@/components/organisms";
import { GET_ORDERS } from "@/graphql/queries";

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

export default function OrdersPage() {
  const { data, loading, error } = useQuery<{ orders: Order[] }>(GET_ORDERS);

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-destructive">Error loading orders: {error.message}</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Orders</h1>
          <p className="text-muted-foreground mt-2">
            View and manage customer orders
          </p>
        </div>
        <CreateOrderDialog>
          <Button>New Order</Button>
        </CreateOrderDialog>
      </div>

      {loading ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-64 rounded-lg bg-muted animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {data?.orders.map((order) => (
            <OrderCard key={order.id} order={order} />
          ))}
        </div>
      )}

      {!loading && data?.orders.length === 0 && (
        <div className="text-center py-8">
          <p className="text-muted-foreground">No orders yet.</p>
        </div>
      )}
    </div>
  );
}
