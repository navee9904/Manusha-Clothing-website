"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";

export type CartItem = {
  productId: string;
  name: string;
  price: number;
  imageUrl: string;
  size: string;
  quantity: number;
};

type CartContextValue = {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  updateQuantity: (productId: string, size: string, quantity: number) => void;
  removeItem: (productId: string, size: string) => void;
  clearCart: () => void;
  isCartOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  total: number;
  count: number;
};

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  useEffect(() => {
    const saved = window.localStorage.getItem("manusha-cart");
    if (saved) setItems(JSON.parse(saved));
  }, []);

  useEffect(() => {
    window.localStorage.setItem("manusha-cart", JSON.stringify(items));
  }, [items]);

  const value = useMemo<CartContextValue>(() => {
    return {
      items,
      addItem(item) {
        setItems((current) => {
          const existing = current.find(
            (cartItem) => cartItem.productId === item.productId && cartItem.size === item.size,
          );
          if (!existing) return [...current, item];
          return current.map((cartItem) =>
            cartItem.productId === item.productId && cartItem.size === item.size
              ? { ...cartItem, quantity: cartItem.quantity + item.quantity }
              : cartItem,
          );
        });
      },
      updateQuantity(productId, size, quantity) {
        setItems((current) =>
          current
            .map((item) => (item.productId === productId && item.size === size ? { ...item, quantity } : item))
            .filter((item) => item.quantity > 0),
        );
      },
      removeItem(productId, size) {
        setItems((current) => current.filter((item) => item.productId !== productId || item.size !== size));
      },
      clearCart() {
        setItems([]);
      },
      isCartOpen,
      openCart() {
        setIsCartOpen(true);
      },
      closeCart() {
        setIsCartOpen(false);
      },
      total: items.reduce((sum, item) => sum + item.price * item.quantity, 0),
      count: items.reduce((sum, item) => sum + item.quantity, 0),
    };
  }, [isCartOpen, items]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used inside CartProvider");
  return context;
}
