import Image from "next/image";
import { notFound } from "next/navigation";
import { AddToCart } from "@/components/AddToCart";
import { ProductCard } from "@/components/ProductCard";
import { formatMoney } from "@/lib/format";
import { prisma } from "@/lib/prisma";

export default async function ProductPage({ params }: { params: { id: string } }) {
  const product = await prisma.product.findUnique({
    where: { id: params.id },
    include: { category: true },
  });
  if (!product) notFound();

  const related = await prisma.product.findMany({
    where: { categoryId: product.categoryId, id: { not: product.id } },
    include: { category: true },
    orderBy: { createdAt: "desc" },
    take: 4,
  });

  return (
    <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <section className="grid gap-10 lg:grid-cols-2">
        <div className="aspect-[4/5] overflow-hidden bg-[#F5F5F5]">
          <Image src={product.imageUrl} alt={product.name} width={1200} height={1500} priority className="h-full w-full object-cover" />
        </div>
        <div className="lg:sticky lg:top-24 lg:self-start">
          <p className="text-xs font-black uppercase tracking-[0.24em] text-neutral-600">{product.category.name}</p>
          <h1 className="mt-4 font-serif text-7xl uppercase">{product.name}</h1>
          <p className="mt-4 text-2xl font-black">{formatMoney(product.price)}</p>
          <p className="mt-6 text-sm font-bold uppercase text-neutral-600">{product.stock > 0 ? `${product.stock} in stock` : "Out of stock"}</p>
          <AddToCart product={{ id: product.id, name: product.name, price: product.price, imageUrl: product.imageUrl, sizes: product.sizes, stock: product.stock }} />
          <div className="mt-10 border-t border-black pt-6">
            <h2 className="text-xs font-black uppercase tracking-[0.2em]">Description</h2>
            <p className="mt-4 leading-7 text-neutral-700">{product.description}</p>
          </div>
        </div>
      </section>

      <section className="mt-20 border-t border-black pt-10">
        <h2 className="font-serif text-6xl uppercase">Related Products</h2>
        {related.length ? (
          <div className="mt-8 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {related.map((item) => (
              <ProductCard
                key={item.id}
                product={{ id: item.id, name: item.name, price: item.price, imageUrl: item.imageUrl, sizes: item.sizes, category: item.category }}
              />
            ))}
          </div>
        ) : (
          <p className="mt-8 text-neutral-600">No related products yet.</p>
        )}
      </section>
    </main>
  );
}
