import Link from "next/link";
import { ProductCard } from "@/components/ProductCard";
import { prisma } from "@/lib/prisma";

type ShopPageProps = {
  searchParams?: {
    category?: string;
    min?: string;
    max?: string;
    sort?: string;
    q?: string;
  };
};

function orderBy(sort?: string) {
  if (sort === "price-asc") return { price: "asc" as const };
  if (sort === "price-desc") return { price: "desc" as const };
  return { createdAt: "desc" as const };
}

export default async function ShopPage({ searchParams }: ShopPageProps) {
  const min = Number(searchParams?.min || 0);
  const max = Number(searchParams?.max || 0);
  const [categories, products] = await Promise.all([
    prisma.category.findMany({ orderBy: { name: "asc" } }),
    prisma.product.findMany({
      where: {
        category: searchParams?.category ? { name: searchParams.category } : undefined,
        price: { gte: min || undefined, lte: max || undefined },
        name: searchParams?.q ? { contains: searchParams.q, mode: "insensitive" } : undefined,
      },
      include: { category: true },
      orderBy: orderBy(searchParams?.sort),
    }),
  ]);

  return (
    <main className="mx-auto grid max-w-7xl gap-10 px-4 py-10 sm:px-6 lg:grid-cols-[260px_1fr] lg:px-8">
      <aside className="lg:sticky lg:top-24 lg:self-start">
        <h1 className="font-serif text-6xl uppercase">Shop</h1>
        <form className="mt-8 space-y-6">
          <div>
            <label className="text-xs font-black uppercase tracking-[0.2em]">Category</label>
            <select name="category" defaultValue={searchParams?.category || ""} className="mt-3 w-full border border-black px-3 py-3">
              <option value="">All</option>
              {categories.map((category) => <option key={category.id} value={category.name}>{category.name}</option>)}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <input name="min" defaultValue={searchParams?.min || ""} type="number" min="0" placeholder="Min" className="border border-black px-3 py-3" />
            <input name="max" defaultValue={searchParams?.max || ""} type="number" min="0" placeholder="Max" className="border border-black px-3 py-3" />
          </div>
          <input name="q" defaultValue={searchParams?.q || ""} placeholder="Search" className="w-full border border-black px-3 py-3" />
          <button className="w-full bg-black px-5 py-3 text-xs font-black uppercase tracking-[0.2em] text-white">Apply</button>
          <Link href="/shop" className="block text-xs font-black uppercase tracking-[0.2em] underline">Clear filters</Link>
        </form>
      </aside>

      <section>
        <div className="mb-8 flex flex-col justify-between gap-4 border-b border-black pb-4 sm:flex-row sm:items-center">
          <p className="text-sm text-neutral-600">{products.length} products</p>
          <form>
            {searchParams?.category ? <input type="hidden" name="category" value={searchParams.category} /> : null}
            {searchParams?.min ? <input type="hidden" name="min" value={searchParams.min} /> : null}
            {searchParams?.max ? <input type="hidden" name="max" value={searchParams.max} /> : null}
            {searchParams?.q ? <input type="hidden" name="q" value={searchParams.q} /> : null}
            <select name="sort" defaultValue={searchParams?.sort || "newest"} className="border border-black px-3 py-3">
              <option value="newest">Newest</option>
              <option value="price-asc">Price low-high</option>
              <option value="price-desc">Price high-low</option>
            </select>
            <button className="ml-2 border border-black px-4 py-3 text-xs font-black uppercase">Sort</button>
          </form>
        </div>
        {products.length ? (
          <div className="grid gap-8 sm:grid-cols-2 xl:grid-cols-3">
            {products.map((product) => (
              <ProductCard
                key={product.id}
                product={{ id: product.id, name: product.name, price: product.price, imageUrl: product.imageUrl, sizes: product.sizes, category: product.category }}
              />
            ))}
          </div>
        ) : (
          <p className="border border-black p-8 text-neutral-600">No products match these filters.</p>
        )}
      </section>
    </main>
  );
}
