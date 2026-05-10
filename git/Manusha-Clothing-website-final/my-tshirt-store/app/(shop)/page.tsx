import Link from "next/link";
import { ProductCard } from "@/components/ProductCard";
import { prisma } from "@/lib/prisma";

export default async function HomePage() {
  const [featuredProducts, categories] = await Promise.all([
    prisma.product.findMany({
      where: { featured: true },
      include: { category: true },
      orderBy: { createdAt: "desc" },
      take: 4,
    }),
    prisma.category.findMany({ orderBy: { name: "asc" } }),
  ]);

  return (
    <main>
      <section className="border-b border-black">
        <div className="mx-auto grid min-h-[72vh] max-w-7xl items-end px-4 py-12 sm:px-6 lg:grid-cols-[1.2fr_0.8fr] lg:px-8">
          <div>
            <p className="mb-4 text-xs font-black uppercase tracking-[0.24em]">Black / White / Essential</p>
            <h1 className="max-w-4xl font-serif text-7xl font-black uppercase leading-[0.9] sm:text-8xl lg:text-9xl">
              MONO TEE
            </h1>
          </div>
          <div className="mt-10 max-w-md lg:justify-self-end">
            <p className="text-lg leading-8 text-neutral-700">
              Precision basics, graphic drops, and oversized silhouettes pulled from the database and managed in one admin panel.
            </p>
            <Link href="/shop" className="mt-8 inline-block bg-black px-8 py-4 text-sm font-black uppercase tracking-[0.2em] text-white">
              Shop now
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-end justify-between gap-4">
          <h2 className="font-serif text-5xl font-black uppercase">Featured</h2>
          <Link href="/shop" className="text-xs font-black uppercase tracking-[0.2em] underline">View all</Link>
        </div>
        {featuredProducts.length ? (
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {featuredProducts.map((product) => <ProductCard key={product.id} product={product} />)}
          </div>
        ) : (
          <p className="border border-black p-8 text-neutral-600">No featured products yet. Add products in the admin panel after connecting your database.</p>
        )}
      </section>

      <section className="bg-neutral-100 py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="font-serif text-5xl font-black uppercase">Categories</h2>
          <div className="mt-8 grid gap-px bg-black sm:grid-cols-2 lg:grid-cols-5">
            {categories.map((category) => (
              <Link key={category.id} href={`/shop/${category.slug}`} className="bg-white p-8 transition hover:bg-black hover:text-white">
                <span className="text-xs font-black uppercase tracking-[0.2em]">Shop</span>
                <h3 className="mt-12 text-3xl font-black uppercase">{category.name}</h3>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}

