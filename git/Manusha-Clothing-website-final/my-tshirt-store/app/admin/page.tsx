import { prisma } from "@/lib/prisma";
import { formatMoney } from "@/lib/format";

export default async function AdminPage() {
  const [products, orders, categories] = await Promise.all([
    prisma.product.count(),
    prisma.order.findMany(),
    prisma.category.count(),
  ]);
  const revenue = orders.reduce((sum, order) => sum + order.total, 0);

  return (
    <main className="p-6 lg:p-10">
      <h1 className="font-serif text-6xl font-black uppercase">Dashboard</h1>
      <div className="mt-10 grid gap-px bg-black md:grid-cols-3">
        {[
          ["Products", products],
          ["Categories", categories],
          ["Revenue", formatMoney(revenue)],
        ].map(([label, value]) => (
          <div key={label} className="bg-white p-8">
            <p className="text-xs font-black uppercase tracking-[0.2em]">{label}</p>
            <p className="mt-8 text-4xl font-black">{value}</p>
          </div>
        ))}
      </div>
    </main>
  );
}

