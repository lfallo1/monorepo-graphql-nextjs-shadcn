"use client";

import { useState } from "react";
import { useMutation } from "@apollo/client/react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  Button,
  FormField,
} from "@store-demo/ui";
import { CREATE_PRODUCT } from "@/graphql/mutations";
import { GET_PRODUCTS } from "@/graphql/queries";

interface CreateProductDialogProps {
  children: React.ReactNode;
}

export function CreateProductDialog({ children }: CreateProductDialogProps) {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    description: "",
  });

  const [createProduct, { loading }] = useMutation(CREATE_PRODUCT, {
    refetchQueries: [{ query: GET_PRODUCTS }],
    onCompleted: () => {
      setOpen(false);
      setFormData({ name: "", price: "", description: "" });
    },
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createProduct({
      variables: {
        input: {
          name: formData.name,
          price: parseFloat(formData.price),
          description: formData.description,
        },
      },
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Product</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <FormField
            label="Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Product name"
            required
          />
          <FormField
            label="Price"
            name="price"
            type="number"
            value={formData.price}
            onChange={handleChange}
            placeholder="0.00"
            step="0.01"
            min="0"
            required
          />
          <FormField
            label="Description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Product description"
            required
          />
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Creating..." : "Create Product"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
