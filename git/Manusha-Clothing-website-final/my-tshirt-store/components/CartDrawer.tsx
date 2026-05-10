"use client";

import Image from "next/image";
import { useState } from "react";
import toast from "react-hot-toast";
import { formatMoney } from "@/lib/format";
import { useCart } from "@/components/cart-context";

export function CartDrawer() {
  const [loading, setLoading] = useState(false);
  const { items, total, updateQuantity, removeItem, clearCart } = useCart();

  async function checkout() {
    setLoading(true);
    const response = await fetch("/api/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ items }),
    });
    const data = await response.json();
    setLoading(false);
    if (data.url) {
      clearCart();
      window.location.href = data.url;
    } else {
      toast.error(data.error || "Checkout failed");
    }
  }

  return (
    <section className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="font-serif text-6xl font-black uppercase">Cart</h1>
      <div className="mt-10 space-y-6">
        {items.length === 0 ? <p className="text-neutral-500">Your cart is empty.</p> : null}
        {items.map((item) => (
          <div key={`${item.productId}-${item.size}`} className="grid grid-cols-[96px_1fr] gap-4 border-b border-neutral-200 pb-6">
            <Image src={item.imageUrl} alt={item.name} width={160} height={200} className="aspect-[4/5] object-cover" />
            <div className="flex flex-col justify-between gap-4 sm:flex-row">
              <div>
                <p className="font-bold uppercase">{item.name}</p>
                <p className="text-sm text-neutral-500">Size {item.size}</p>
                <button className="mt-4 text-xs font-bold uppercase underline" onClick={() => removeItem(item.productId, item.size)}>
                  Remove
                </button>
              </div>
              <div className="flex items-center gap-4">
                <input
                  aria-label={`Quantity for ${item.name}`}
                  type="number"
                  min="1"
                  value={item.quantity}
                  onChange={(event) => updateQuantity(item.productId, item.size, Number(event.target.value))}
                  className="w-20 border border-black px-3 py-2"
                />
                <p className="w-24 text-right font-bold">{formatMoney(item.price * item.quantity)}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-8 flex items-center justify-between border-t border-black pt-6">
        <p className="text-xl font-black uppercase">Total</p>
        <p className="text-xl font-black">{formatMoney(total)}</p>
      </div>
      <button
        disabled={items.length === 0 || loading}
        onClick={checkout}
        className="mt-6 w-full bg-black px-6 py-4 text-sm font-black uppercase tracking-[0.2em] text-white disabled:bg-neutral-300"
      >
        {loading ? "Opening checkout" : "Checkout"}
      </button>
    </section>
  );
}

