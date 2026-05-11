"use client";

import Image from "next/image";
import { useState } from "react";
import toast from "react-hot-toast";
import { formatMoney } from "@/lib/format";
import { useCart } from "@/components/cart-context";

export function CartDrawer({ mode = "drawer" }: { mode?: "drawer" | "page" }) {
  const [loading, setLoading] = useState(false);
  const { items, total, count, updateQuantity, removeItem, clearCart, isCartOpen, closeCart } = useCart();
  const shipping = total > 0 ? 0 : 0;
  const content = (
    <div className={mode === "page" ? "mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8" : "flex h-full flex-col bg-white"}>
      <div className={mode === "page" ? "" : "flex items-center justify-between border-b border-black p-5"}>
        <h1 className="font-serif text-6xl uppercase">Cart</h1>
        {mode === "drawer" ? <button type="button" onClick={closeCart} className="border border-black px-3 py-2 text-xs font-black uppercase">Close</button> : null}
      </div>
      <div className={mode === "page" ? "mt-10 space-y-6" : "flex-1 space-y-5 overflow-y-auto p-5"}>
        {items.length === 0 ? <p className="text-neutral-500">Your cart is empty.</p> : null}
        {items.map((item) => (
          <div key={`${item.productId}-${item.size}`} className="grid grid-cols-[88px_1fr] gap-4 border-b border-[#E0E0E0] pb-5">
            <Image src={item.imageUrl} alt={item.name} width={160} height={200} className="aspect-[4/5] object-cover" />
            <div className="min-w-0">
              <div className="flex justify-between gap-4">
                <div>
                  <p className="font-black uppercase">{item.name}</p>
                  <p className="text-sm text-neutral-500">Size {item.size}</p>
                </div>
                <p className="font-black">{formatMoney(item.price * item.quantity)}</p>
              </div>
              <div className="mt-4 flex items-center justify-between gap-3">
                <div className="flex border border-black">
                  <button type="button" className="h-9 w-9 font-black" onClick={() => updateQuantity(item.productId, item.size, item.quantity - 1)}>-</button>
                  <input
                    aria-label={`Quantity for ${item.name}`}
                    type="number"
                    min="1"
                    value={item.quantity}
                    onChange={(event) => updateQuantity(item.productId, item.size, Number(event.target.value))}
                    className="h-9 w-12 border-x border-black text-center"
                  />
                  <button type="button" className="h-9 w-9 font-black" onClick={() => updateQuantity(item.productId, item.size, item.quantity + 1)}>+</button>
                </div>
                <button className="text-xs font-black uppercase underline" onClick={() => removeItem(item.productId, item.size)}>Remove</button>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className={mode === "page" ? "mt-8 border-t border-black pt-6" : "border-t border-black p-5"}>
        <div className="space-y-3 text-sm">
          <div className="flex justify-between"><span>Items</span><span>{count}</span></div>
          <div className="flex justify-between"><span>Subtotal</span><span>{formatMoney(total)}</span></div>
          <div className="flex justify-between"><span>Shipping</span><span>{shipping === 0 ? "Free" : formatMoney(shipping)}</span></div>
          <div className="flex justify-between border-t border-[#E0E0E0] pt-3 text-xl font-black"><span>Total</span><span>{formatMoney(total + shipping)}</span></div>
        </div>
        <button
          disabled={items.length === 0 || loading}
          onClick={async () => {
            setLoading(true);
            const response = await fetch("/api/stripe/checkout", {
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
          }}
          className="mt-6 w-full bg-black px-6 py-4 text-sm font-black uppercase tracking-[0.2em] text-white disabled:bg-neutral-300"
        >
          {loading ? "Opening checkout" : "Checkout"}
        </button>
      </div>
    </div>
  );

  if (mode === "page") return content;

  return (
    <div className={`fixed inset-0 z-50 ${isCartOpen ? "" : "pointer-events-none"}`}>
      <button type="button" aria-label="Close cart" onClick={closeCart} className={`absolute inset-0 bg-black/30 transition ${isCartOpen ? "opacity-100" : "opacity-0"}`} />
      <aside className={`absolute right-0 top-0 h-full w-full max-w-md transform transition duration-300 ${isCartOpen ? "translate-x-0" : "translate-x-full"}`}>
        {content}
      </aside>
    </div>
  );
}
