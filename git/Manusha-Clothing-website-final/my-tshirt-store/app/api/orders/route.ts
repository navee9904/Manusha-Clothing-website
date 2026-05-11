import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

type OrderInputItem = {
  productId: string;
  size: string;
  quantity: number;
};

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Login required" }, { status: 401 });

  try {
    const orders = await prisma.order.findMany({
      where: session.user.role === "admin" ? {} : { userId: session.user.id },
      include: { items: { include: { product: true } }, user: true },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(orders);
  } catch {
    return NextResponse.json({ error: "Could not load orders" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Login required" }, { status: 401 });

  try {
    const body = await request.json();
    const items = body.items as OrderInputItem[];
    if (!Array.isArray(items) || items.length === 0) return NextResponse.json({ error: "Order items are required" }, { status: 400 });

    const products = await prisma.product.findMany({ where: { id: { in: items.map((item) => item.productId) } } });
    const total = items.reduce((sum, item) => {
      const product = products.find((candidate) => candidate.id === item.productId);
      return sum + (product?.price || 0) * item.quantity;
    }, 0);

    const order = await prisma.order.create({
      data: {
        userId: session.user.id,
        total,
        status: String(body.status || "paid"),
        stripeId: body.stripeId ? String(body.stripeId) : null,
        items: {
          create: items.map((item) => {
            const product = products.find((candidate) => candidate.id === item.productId);
            if (!product) throw new Error("Product not found");
            return { productId: product.id, quantity: item.quantity, size: item.size, price: product.price };
          }),
        },
      },
    });
    return NextResponse.json(order, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Could not create order" }, { status: 500 });
  }
}
