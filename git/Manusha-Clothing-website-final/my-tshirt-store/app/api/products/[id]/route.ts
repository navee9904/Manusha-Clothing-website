import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin";
import { prisma } from "@/lib/prisma";

export async function GET(_request: Request, { params }: { params: { id: string } }) {
  const product = await prisma.product.findUnique({
    where: { id: params.id },
    include: { category: true },
  });
  if (!product) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(product);
}

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  const denied = await requireAdmin();
  if (denied) return denied;

  const body = await request.json();
  const product = await prisma.product.update({
    where: { id: params.id },
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

export async function DELETE(_request: Request, { params }: { params: { id: string } }) {
  const denied = await requireAdmin();
  if (denied) return denied;

  await prisma.product.delete({ where: { id: params.id } });
  return NextResponse.json({ ok: true });
}

