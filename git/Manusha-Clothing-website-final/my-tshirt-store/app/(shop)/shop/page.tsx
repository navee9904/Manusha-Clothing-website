import Link from "next/link";
import { ProductCard } from "@/components/ProductCard";
import { prisma } from "@/lib/prisma";

export default async function ShopPage({ searchParams }: { searchParams: { sort?: string } }) {
  const sort = searchParams.sort === "price-desc" ? "desc" : "asc";
  const [products, categories] = await Promise.all([
    prisma.product.findMany({
      include: { category: true },
      orderBy: { price: sort },
    }),
    prisma.category.findMany({ orderBy: { name: "asc" } }),
  ]);

  return (
    <main className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 lg:grid-cols-[240px_1fr] lg:px-8">
      <aside>
        <h1 className="font-serif text-5xl font-black uppercase">Shop</h1>
        <nav className="mt-8 flex flex-col gap-3 text-sm font-bold uppercase">
          <Link href="/shop">All products</Link>
          {categories.map((category) => (
            <Link key={category.id} href={`/shop/${category.slug}`}>{category.name}</Link>
          ))}
        </nav>
      </aside>
      <section>
        <div className="mb-8 flex justify-end gap-3 text-sm">
          <Link className="border border-black px-4 py-2" href="/shop?sort=price-asc">Price low</Link>
          <Link className="border border-black px-4 py-2" href="/shop?sort=price-desc">Price high</Link>
        </div>
        <div className="grid gap-8 sm:grid-cols-2 xl:grid-cols-3">
          {products.map((product) => <ProductCard key={product.id} product={product} />)}
        </div>
      </section>
    </main>
  );
}

