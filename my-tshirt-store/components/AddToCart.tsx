"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import { useCart } from "@/components/cart-context";

type AddToCartProps = {
  product: {
    id: string;
    name: string;
    price: number;
    imageUrl: string;
    sizes: string[];
  };
};

export function AddToCart({ product }: AddToCartProps) {
  const [size, setSize] = useState(product.sizes[0] || "M");
  const { addItem } = useCart();

  return (
    <div className="mt-8 space-y-6">
      <div>
        <p className="mb-3 text-xs font-bold uppercase tracking-[0.18em]">Size</p>
        <div className="grid grid-cols-4 gap-2">
          {product.sizes.map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => setSize(option)}
              className={`border px-4 py-3 text-sm font-bold ${size === option ? "border-black bg-black text-white" : "border-neutral-300 bg-white"}`}
            >
              {option}
            </button>
          ))}
        </div>
      </div>
      <button
        type="button"
        onClick={() => {
          addItem({ productId: product.id, name: product.name, price: product.price, imageUrl: product.imageUrl, size, quantity: 1 });
          toast.success("Added to cart");
        }}
        className="w-full bg-black px-6 py-4 text-sm font-black uppercase tracking-[0.2em] text-white"
      >
        Add to cart
      </button>
    </div>
  );
}

