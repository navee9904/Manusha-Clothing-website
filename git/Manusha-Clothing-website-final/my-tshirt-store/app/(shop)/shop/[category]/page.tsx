import { notFound } from "next/navigation";
import Link from "next/link";
import { ProductCard } from "@/components/ProductCard";
import { prisma } from "@/lib/prisma";

export default async function CategoryPage({ params }: { params: { category: string } }) {
  const category = await prisma.category.findUnique({
    where: { slug: params.category },
    include: { products: { include: { category: true }, orderBy: { createdAt: "desc" } } },
  });
  if (!category) notFound();

  return (
    <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <Link href="/shop" className="text-xs font-black uppercase tracking-[0.2em] underline">All products</Link>
      <h1 className="mt-6 font-serif text-6xl font-black uppercase">{category.name}</h1>
      <div className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
        {category.products.map((product) => <ProductCard key={product.id} product={product} />)}
      </div>
    </main>
  );
}

