import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const products = await prisma.product.findMany({
    include: { category: true },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(products);
}

export async function POST(request: Request) {
  const denied = await requireAdmin();
  if (denied) return denied;

  const body = await request.json();
  const product = await prisma.product.create({
    data: {
      name: String(body.name),
      description: String(body.description),
      price: Number(body.price),
      imageUrl: String(body.imageUrl),
      stock: Number(body.stock || 0),
      sizes: Array.isArray(body.sizes) ? body.sizes : [],
      categoryId: String(body.categoryId),
      featured: Boolean(body.featured),
    },
  });
  return NextResponse.json(product);
}

