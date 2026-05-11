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
    stock: number;
  };
};

const sizeOptions = ["S", "M", "L", "XL", "XXL"];

export function AddToCart({ product }: AddToCartProps) {
  const availableSizes = product.sizes.length ? product.sizes : sizeOptions;
  const [size, setSize] = useState(availableSizes[0] || "M");
  const { addItem, openCart } = useCart();

  return (
    <div className="mt-8 space-y-6">
      <div>
        <p className="mb-3 text-xs font-bold uppercase tracking-[0.18em]">Size</p>
        <div className="grid grid-cols-4 gap-2">
          {sizeOptions.map((option) => {
            const available = availableSizes.includes(option);
            return (
            <button
              key={option}
              type="button"
              disabled={!available || product.stock <= 0}
              onClick={() => setSize(option)}
              className={`border px-4 py-3 text-sm font-bold ${size === option ? "border-black bg-black text-white" : "border-neutral-300 bg-white"} disabled:cursor-not-allowed disabled:bg-[#F5F5F5] disabled:text-neutral-400`}
            >
              {option}
            </button>
            );
          })}
        </div>
        <p className="mt-3 text-xs text-neutral-600">{product.stock > 0 ? "In stock" : "Out of stock"}</p>
      </div>
      <button
        type="button"
        disabled={product.stock <= 0}
        onClick={() => {
          addItem({ productId: product.id, name: product.name, price: product.price, imageUrl: product.imageUrl, size, quantity: 1 });
          openCart();
          toast.success("Added to cart");
        }}
        className="w-full bg-black px-6 py-4 text-sm font-black uppercase tracking-[0.2em] text-white disabled:bg-neutral-300"
      >
        {product.stock > 0 ? "Add to cart" : "Sold out"}
      </button>
    </div>
  );
}
