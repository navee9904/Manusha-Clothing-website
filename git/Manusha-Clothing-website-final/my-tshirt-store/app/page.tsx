import Link from "next/link";
import { ProductCard } from "@/components/ProductCard";
import { prisma } from "@/lib/prisma";

const categoryNames = ["Oversized Tees", "Graphic Tees", "Plain Basics", "Limited Drops", "Accessories"];

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

  const categoryLinks = categoryNames.map((name) => {
    const category = categories.find((item) => item.name.toLowerCase() === name.toLowerCase());
    return { name, href: category ? `/shop/${category.slug}` : `/shop?category=${encodeURIComponent(name)}` };
  });

  return (
    <main>
      <section className="flex min-h-screen items-end border-b border-black bg-white px-4 pb-10 pt-24 sm:px-6 lg:px-8">
        <div className="mx-auto grid w-full max-w-7xl gap-10 lg:grid-cols-[1.2fr_0.8fr] lg:items-end">
          <div>
            <p className="mb-5 text-xs font-black uppercase tracking-[0.24em] text-neutral-600">MANUSHA / black white essentials</p>
            <h1 className="max-w-5xl font-serif text-[6.2rem] font-black uppercase leading-[0.82] sm:text-[9rem] lg:text-[12rem]">
              WEAR THE SILENCE
            </h1>
          </div>
          <div className="max-w-md lg:justify-self-end">
            <p className="text-lg leading-8 text-neutral-700">
              Precision-cut T-shirts, graphic statements, and restrained essentials built for everyday uniform dressing.
            </p>
            <Link href="/shop" className="mt-8 inline-flex bg-black px-8 py-4 text-sm font-black uppercase tracking-[0.2em] text-white transition hover:bg-neutral-800">
              Shop Now
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-end justify-between gap-4">
          <h2 className="font-serif text-6xl uppercase">Featured Products</h2>
          <Link href="/shop" className="text-xs font-black uppercase tracking-[0.2em] underline">View all</Link>
        </div>
        {featuredProducts.length ? (
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {featuredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={{ id: product.id, name: product.name, price: product.price, imageUrl: product.imageUrl, sizes: product.sizes, category: product.category }}
              />
            ))}
          </div>
        ) : (
          <p className="border border-black p-8 text-neutral-600">No featured products yet. Add products in the admin panel.</p>
        )}
      </section>

      <section className="bg-[#F5F5F5] py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="font-serif text-6xl uppercase">Categories</h2>
          <div className="mt-8 grid gap-px bg-black sm:grid-cols-2 lg:grid-cols-5">
            {categoryLinks.map((category) => (
              <Link key={category.name} href={category.href} className="bg-white p-8 transition hover:bg-black hover:text-white">
                <span className="text-xs font-black uppercase tracking-[0.2em]">Shop</span>
                <h3 className="mt-12 text-4xl uppercase">{category.name}</h3>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="border-y border-black px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-end">
          <h2 className="font-serif text-6xl uppercase sm:text-8xl">Join the quiet list</h2>
          <form className="flex flex-col gap-3 sm:flex-row">
            <input aria-label="Email address" type="email" required placeholder="Email address" className="min-h-14 flex-1 border border-black px-4 text-sm outline-none" />
            <button className="min-h-14 bg-black px-8 text-sm font-black uppercase tracking-[0.2em] text-white transition hover:bg-neutral-800">Sign up</button>
          </form>
        </div>
      </section>
    </main>
  );
}
