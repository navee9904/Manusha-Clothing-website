import { formatMoney } from "@/lib/format";
import { prisma } from "@/lib/prisma";

export default async function AdminOrdersPage() {
  const orders = await prisma.order.findMany({
    include: { user: true, items: { include: { product: true } } },
    orderBy: { createdAt: "desc" },
  });

  return (
    <main className="p-6 lg:p-10">
      <h1 className="font-serif text-6xl font-black uppercase">Orders</h1>
      <div className="mt-8 space-y-4">
        {orders.map((order) => (
          <article key={order.id} className="border border-black p-6">
            <div className="flex flex-wrap justify-between gap-4">
              <div>
                <p className="font-black uppercase">{order.user.email}</p>
                <p className="text-sm text-neutral-500">{order.status}</p>
              </div>
              <p className="font-black">{formatMoney(order.total)}</p>
            </div>
            <div className="mt-4 text-sm text-neutral-600">
              {order.items.map((item) => <p key={item.id}>{item.quantity} x {item.product.name} / {item.size}</p>)}
            </div>
          </article>
        ))}
      </div>
    </main>
  );
}

