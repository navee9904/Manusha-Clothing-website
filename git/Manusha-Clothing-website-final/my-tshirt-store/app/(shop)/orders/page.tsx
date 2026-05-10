import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { formatMoney } from "@/lib/format";
import { prisma } from "@/lib/prisma";

export default async function OrdersPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user) redirect("/login");

  const orders = await prisma.order.findMany({
    where: { userId: session.user.id },
    include: { items: { include: { product: true } } },
    orderBy: { createdAt: "desc" },
  });

  return (
    <main className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="font-serif text-6xl font-black uppercase">Orders</h1>
      <div className="mt-10 space-y-6">
        {orders.map((order) => (
          <article key={order.id} className="border border-black p-6">
            <div className="flex flex-wrap justify-between gap-4">
              <p className="font-bold uppercase">{order.status}</p>
              <p className="font-bold">{formatMoney(order.total)}</p>
            </div>
            <div className="mt-4 text-sm text-neutral-600">
              {order.items.map((item) => (
                <p key={item.id}>{item.quantity} x {item.product.name} / {item.size}</p>
              ))}
            </div>
          </article>
        ))}
        {!orders.length ? <p className="text-neutral-500">No orders yet.</p> : null}
      </div>
    </main>
  );
}

