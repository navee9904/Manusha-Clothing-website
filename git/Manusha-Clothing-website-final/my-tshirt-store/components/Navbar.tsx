"use client";

import Link from "next/link";
import { signOut, useSession } from "next-auth/react";
import { useState } from "react";
import { useCart } from "@/components/cart-context";
import { CartDrawer } from "@/components/CartDrawer";

const links = [
  { href: "/shop", label: "Shop" },
  { href: "/shop", label: "Categories" },
  { href: "/#about", label: "About" },
];

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { data: session } = useSession();
  const { count, openCart } = useCart();

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-black bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <Link href="/" className="font-serif text-5xl uppercase leading-none">
            MANUSHA
          </Link>
          <nav className="hidden items-center gap-8 text-xs font-black uppercase tracking-[0.18em] md:flex">
            {links.map((link) => <Link key={link.label} href={link.href}>{link.label}</Link>)}
          </nav>
          <div className="hidden items-center gap-5 text-xs font-black uppercase tracking-[0.18em] md:flex">
            {session?.user?.role === "admin" ? <Link href="/admin">Admin</Link> : null}
            {session ? <Link href="/account/orders">Account</Link> : <Link href="/login">Login</Link>}
            {session ? <button type="button" onClick={() => signOut()} className="uppercase">Logout</button> : null}
            <button type="button" onClick={openCart} className="relative uppercase">
              Cart
              <span className="ml-2 inline-flex min-w-5 justify-center bg-black px-1 text-white">{count}</span>
            </button>
          </div>
          <button type="button" className="border border-black px-3 py-2 text-xs font-black uppercase md:hidden" onClick={() => setMobileOpen((open) => !open)}>
            Menu
          </button>
        </div>
        {mobileOpen ? (
          <div className="border-t border-black px-4 py-5 md:hidden">
            <nav className="grid gap-4 text-sm font-black uppercase tracking-[0.18em]">
              {links.map((link) => <Link key={link.label} href={link.href} onClick={() => setMobileOpen(false)}>{link.label}</Link>)}
              {session?.user?.role === "admin" ? <Link href="/admin" onClick={() => setMobileOpen(false)}>Admin</Link> : null}
              {session ? <Link href="/account/orders" onClick={() => setMobileOpen(false)}>Account</Link> : <Link href="/login" onClick={() => setMobileOpen(false)}>Login</Link>}
              <button type="button" onClick={() => { openCart(); setMobileOpen(false); }} className="text-left uppercase">Cart ({count})</button>
            </nav>
          </div>
        ) : null}
      </header>
      <CartDrawer mode="drawer" />
    </>
  );
}
