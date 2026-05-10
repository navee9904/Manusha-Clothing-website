import Image from "next/image";
import { AdminProductForm } from "@/components/AdminProductForm";
import { formatMoney } from "@/lib/format";
import { prisma } from "@/lib/prisma";

export default async function AdminProductsPage() {
  const [products, categories] = await Promise.all([
    prisma.product.findMany({ include: { category: true }, orderBy: { createdAt: "desc" } }),
    prisma.category.findMany({ orderBy: { name: "asc" } }),
  ]);

  return (
    <main className="p-6 lg:p-10">
      <h1 className="font-serif text-6xl font-black uppercase">Products</h1>
      <section className="mt-8 border border-black p-4">
        <h2 className="mb-4 text-xs font-black uppercase tracking-[0.2em]">Add product</h2>
        <AdminProductForm categories={categories} />
      </section>
      <div className="mt-8 space-y-6">
        {products.map((product) => (
          <article key={product.id} className="border border-black p-4">
            <div className="mb-4 flex items-center gap-4">
              <Image src={product.imageUrl} alt={product.name} width={64} height={80} className="aspect-[4/5] object-cover" />
              <div>
                <p className="font-black uppercase">{product.name}</p>
                <p className="text-sm text-neutral-500">{product.category.name} / {formatMoney(product.price)}</p>
              </div>
            </div>
            <AdminProductForm categories={categories} product={product} />
          </article>
        ))}
      </div>
    </main>
  );
}
