import { notFound } from "next/navigation";
import { ProductCard } from "@/components/ProductCard";
import { prisma } from "@/lib/prisma";

export default async function CategoryPage({ params }: { params: { category: string } }) {
  const category = await prisma.category.findUnique({ where: { slug: params.category } });
  if (!category) notFound();

  const products = await prisma.product.findMany({
    where: { categoryId: category.id },
    include: { category: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="border-b border-black pb-8">
        <p className="text-xs font-black uppercase tracking-[0.24em] text-neutral-600">Category</p>
        <h1 className="mt-2 font-serif text-7xl uppercase">{category.name}</h1>
      </div>
      {products.length ? (
        <div className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={{ id: product.id, name: product.name, price: product.price, imageUrl: product.imageUrl, sizes: product.sizes, category: product.category }}
            />
          ))}
        </div>
      ) : (
        <p className="mt-10 border border-black p-8 text-neutral-600">No products in this category yet.</p>
      )}
    </main>
  );
}
