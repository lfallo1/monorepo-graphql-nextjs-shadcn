"use client";

import { useState } from "react";
import { useMutation, useQuery } from "@apollo/client/react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  Button,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Label,
  Badge,
  PriceDisplay,
} from "@store-demo/ui";
import { CREATE_ORDER } from "@/graphql/mutations";
import { GET_ORDERS, GET_PRODUCTS, GET_USERS } from "@/graphql/queries";

interface CreateOrderDialogProps {
  children: React.ReactNode;
}

interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
}

interface User {
  id: string;
  name: string;
  email: string;
}

export function CreateOrderDialog({ children }: CreateOrderDialogProps) {
  const [open, setOpen] = useState(false);
  const [userId, setUserId] = useState("");
  const [selectedProductIds, setSelectedProductIds] = useState<string[]>([]);

  const { data: productsData } = useQuery<{ products: Product[] }>(GET_PRODUCTS);
  const { data: usersData } = useQuery<{ users: User[] }>(GET_USERS);

  const [createOrder, { loading }] = useMutation(CREATE_ORDER, {
    refetchQueries: [{ query: GET_ORDERS }],
    onCompleted: () => {
      setOpen(false);
      setUserId("");
      setSelectedProductIds([]);
    },
  });

  const toggleProduct = (productId: string) => {
    setSelectedProductIds((prev) =>
      prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId]
    );
  };

  const selectedProducts = productsData?.products.filter((p) =>
    selectedProductIds.includes(p.id)
  ) || [];

  const total = selectedProducts.reduce((sum, p) => sum + p.price, 0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId || selectedProductIds.length === 0) return;

    createOrder({
      variables: {
        input: {
          userId,
          productIds: selectedProductIds,
        },
      },
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Create New Order</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label>Customer</Label>
            <Select value={userId} onValueChange={setUserId}>
              <SelectTrigger>
                <SelectValue placeholder="Select a customer" />
              </SelectTrigger>
              <SelectContent>
                {usersData?.users.map((user) => (
                  <SelectItem key={user.id} value={user.id}>
                    {user.name} ({user.email})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Products</Label>
            <div className="border rounded-md p-3 space-y-2 max-h-48 overflow-y-auto">
              {productsData?.products.map((product) => (
                <div
                  key={product.id}
                  onClick={() => toggleProduct(product.id)}
                  className={`flex items-center justify-between p-2 rounded cursor-pointer transition-colors ${
                    selectedProductIds.includes(product.id)
                      ? "bg-primary/10 border border-primary"
                      : "hover:bg-muted"
                  }`}
                >
                  <span className="text-sm">{product.name}</span>
                  <PriceDisplay amount={product.price} className="text-sm" />
                </div>
              ))}
            </div>
            {selectedProductIds.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-2">
                {selectedProducts.map((p) => (
                  <Badge key={p.id} variant="secondary">
                    {p.name}
                  </Badge>
                ))}
              </div>
            )}
          </div>

          {selectedProductIds.length > 0 && (
            <div className="flex justify-between items-center pt-4 border-t">
              <span className="font-medium">Total</span>
              <PriceDisplay amount={total} className="text-xl font-bold" />
            </div>
          )}

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading || !userId || selectedProductIds.length === 0}
            >
              {loading ? "Creating..." : "Create Order"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
