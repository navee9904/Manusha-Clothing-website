import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { stripe } from "@/lib/stripe";

type CheckoutItem = {
  productId: string;
  size: string;
  quantity: number;
};

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Login required" }, { status: 401 });

  try {
    const { items } = (await request.json()) as { items: CheckoutItem[] };
    if (!Array.isArray(items) || items.length === 0) return NextResponse.json({ error: "Cart is empty" }, { status: 400 });

    const products = await prisma.product.findMany({
      where: { id: { in: items.map((item) => item.productId) } },
    });
    if (products.length !== new Set(items.map((item) => item.productId)).size) {
      return NextResponse.json({ error: "One or more products were not found" }, { status: 404 });
    }

    const lineItems = items.map((item) => {
      const product = products.find((candidate) => candidate.id === item.productId);
      if (!product) throw new Error("Product not found");
      return {
        price_data: {
          currency: "usd",
          product_data: { name: `${product.name} / ${item.size}`, images: [product.imageUrl] },
          unit_amount: Math.round(product.price * 100),
        },
        quantity: item.quantity,
      };
    });

    const total = items.reduce((sum, item) => {
      const product = products.find((candidate) => candidate.id === item.productId);
      return sum + (product?.price || 0) * item.quantity;
    }, 0);

    const order = await prisma.order.create({
      data: {
        userId: session.user.id,
        total,
        status: "pending",
        items: {
          create: items.map((item) => {
            const product = products.find((candidate) => candidate.id === item.productId);
            if (!product) throw new Error("Product not found");
            return { productId: product.id, quantity: item.quantity, size: item.size, price: product.price };
          }),
        },
      },
    });

    const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";
    const checkoutSession = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: lineItems,
      success_url: `${baseUrl}/account/orders`,
      cancel_url: `${baseUrl}/cart`,
      metadata: { orderId: order.id },
    });

    await prisma.order.update({ where: { id: order.id }, data: { stripeId: checkoutSession.id } });

    return NextResponse.json({ url: checkoutSession.url });
  } catch {
    return NextResponse.json({ error: "Could not create checkout session" }, { status: 500 });
  }
}
