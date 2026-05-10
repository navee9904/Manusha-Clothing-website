import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function Navbar() {
  const [session, categories] = await Promise.all([
    getServerSession(authOptions),
    prisma.category.findMany({ orderBy: { name: "asc" } }),
  ]);

  return (
    <header className="sticky top-0 z-40 border-b border-black bg-white">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <Link href="/" className="font-serif text-3xl font-black uppercase leading-none">
          MONO TEE
        </Link>
        <nav className="hidden items-center gap-6 text-xs font-bold uppercase tracking-[0.16em] md:flex">
          <Link href="/shop">Shop</Link>
          {categories.slice(0, 5).map((category) => (
            <Link key={category.id} href={`/shop/${category.slug}`}>
              {category.name}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-4 text-xs font-bold uppercase tracking-[0.16em]">
          {session?.user?.role === "admin" ? <Link href="/admin">Admin</Link> : null}
          {session ? <Link href="/orders">Orders</Link> : <Link href="/login">Login</Link>}
          <Link href="/cart">Cart</Link>
        </div>
      </div>
    </header>
  );
}

