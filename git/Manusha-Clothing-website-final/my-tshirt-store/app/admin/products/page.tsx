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
        <h2 className="mb-4 text-xs font-black uppercase tracking-[0.2em]">Add new product</h2>
        <AdminProductForm categories={categories} />
      </section>
      <div className="mt-8 overflow-x-auto border border-black">
        <table className="w-full min-w-[900px] text-left text-sm">
          <thead className="bg-[#F5F5F5] text-xs uppercase tracking-[0.18em]">
            <tr>
              <th className="p-4">Image</th>
              <th className="p-4">Name</th>
              <th className="p-4">Category</th>
              <th className="p-4">Price</th>
              <th className="p-4">Stock</th>
              <th className="p-4">Edit</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id} className="border-t border-[#E0E0E0] align-top">
                <td className="p-4"><Image src={product.imageUrl} alt={product.name} width={64} height={80} className="aspect-[4/5] object-cover" /></td>
                <td className="p-4 font-black uppercase">{product.name}</td>
                <td className="p-4">{product.category.name}</td>
                <td className="p-4">{formatMoney(product.price)}</td>
                <td className="p-4">{product.stock}</td>
                <td className="p-4"><AdminProductForm categories={categories} product={product} compact /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}
