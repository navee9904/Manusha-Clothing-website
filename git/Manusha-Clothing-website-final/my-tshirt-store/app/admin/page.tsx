import { prisma } from "@/lib/prisma";
import { formatMoney } from "@/lib/format";

export default async function AdminPage() {
  const [products, orders, recentOrders] = await Promise.all([
    prisma.product.count(),
    prisma.order.findMany(),
    prisma.order.findMany({
      include: { user: true },
      orderBy: { createdAt: "desc" },
      take: 6,
    }),
  ]);
  const revenue = orders.reduce((sum, order) => sum + order.total, 0);

  return (
    <main className="p-6 lg:p-10">
      <h1 className="font-serif text-6xl font-black uppercase">Dashboard</h1>
      <div className="mt-10 grid gap-px bg-black md:grid-cols-3">
        {[
          ["Products", products],
          ["Orders", orders.length],
          ["Revenue", formatMoney(revenue)],
        ].map(([label, value]) => (
          <div key={label} className="bg-white p-8">
            <p className="text-xs font-black uppercase tracking-[0.2em]">{label}</p>
            <p className="mt-8 text-4xl font-black">{value}</p>
          </div>
        ))}
      </div>
      <section className="mt-10">
        <h2 className="text-xs font-black uppercase tracking-[0.2em]">Recent orders</h2>
        <div className="mt-4 overflow-x-auto border border-black">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead className="bg-[#F5F5F5] text-xs uppercase tracking-[0.18em]">
              <tr>
                <th className="p-4">Order</th>
                <th className="p-4">Customer</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Total</th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.map((order) => (
                <tr key={order.id} className="border-t border-[#E0E0E0]">
                  <td className="p-4 font-bold uppercase">{order.id.slice(0, 8)}</td>
                  <td className="p-4">{order.user.email}</td>
                  <td className="p-4"><span className="border border-black px-2 py-1 text-xs font-black uppercase">{order.status}</span></td>
                  <td className="p-4 text-right font-black">{formatMoney(order.total)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
}
