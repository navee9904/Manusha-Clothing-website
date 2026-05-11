import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin";
import { prisma } from "@/lib/prisma";

export async function GET(_request: Request, { params }: { params: { id: string } }) {
  try {
    const product = await prisma.product.findUnique({
      where: { id: params.id },
      include: { category: true },
    });
    if (!product) return NextResponse.json({ error: "Product not found" }, { status: 404 });
    return NextResponse.json(product);
  } catch {
    return NextResponse.json({ error: "Could not load product" }, { status: 500 });
  }
}

async function updateProduct(request: Request, { params }: { params: { id: string } }) {
  const denied = await requireAdmin();
  if (denied) return denied;

  try {
    const body = await request.json();
    const product = await prisma.product.update({
      where: { id: params.id },
      data: {
        name: String(body.name),
        description: String(body.description),
        price: Number(body.price),
        imageUrl: String(body.imageUrl),
        stock: Number(body.stock || 0),
        sizes: Array.isArray(body.sizes) ? body.sizes.map(String) : [],
        categoryId: String(body.categoryId),
        featured: Boolean(body.featured),
      },
    });
    return NextResponse.json(product);
  } catch {
    return NextResponse.json({ error: "Could not update product" }, { status: 500 });
  }
}

export const PUT = updateProduct;
export const PATCH = updateProduct;

export async function DELETE(_request: Request, { params }: { params: { id: string } }) {
  const denied = await requireAdmin();
  if (denied) return denied;

  try {
    await prisma.product.delete({ where: { id: params.id } });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Could not delete product" }, { status: 500 });
  }
}
