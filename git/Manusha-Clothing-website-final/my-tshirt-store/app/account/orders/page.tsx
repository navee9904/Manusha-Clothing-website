import { getServerSession } from "next-auth";
import Image from "next/image";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { formatMoney } from "@/lib/format";
import { prisma } from "@/lib/prisma";

export default async function AccountOrdersPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user) redirect("/login");

  const orders = await prisma.order.findMany({
    where: { userId: session.user.id },
    include: { items: { include: { product: true } } },
    orderBy: { createdAt: "desc" },
  });

  return (
    <main className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="font-serif text-7xl uppercase">Orders</h1>
      <div className="mt-10 space-y-6">
        {orders.length ? orders.map((order) => (
          <article key={order.id} className="border border-black p-5">
            <div className="flex flex-col justify-between gap-4 border-b border-[#E0E0E0] pb-4 sm:flex-row">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.2em]">Order {order.id.slice(0, 8)}</p>
                <p className="mt-1 text-sm text-neutral-600">{order.createdAt.toLocaleDateString()}</p>
              </div>
              <div className="flex items-center gap-4">
                <span className="border border-black px-3 py-1 text-xs font-black uppercase">{order.status}</span>
                <p className="font-black">{formatMoney(order.total)}</p>
              </div>
            </div>
            <div className="mt-4 space-y-3">
              {order.items.map((item) => (
                <div key={item.id} className="flex items-center gap-4">
                  <Image src={item.product.imageUrl} alt={item.product.name} width={56} height={70} className="aspect-[4/5] object-cover" />
                  <div className="flex-1">
                    <p className="font-bold uppercase">{item.product.name}</p>
                    <p className="text-sm text-neutral-600">Size {item.size} / Qty {item.quantity}</p>
                  </div>
                </div>
              ))}
            </div>
          </article>
        )) : <p className="border border-black p-8 text-neutral-600">You have no orders yet.</p>}
      </div>
    </main>
  );
}
