import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin";
import { prisma } from "@/lib/prisma";

function orderBy(sort: string | null) {
  if (sort === "price-asc") return { price: "asc" as const };
  if (sort === "price-desc") return { price: "desc" as const };
  return { createdAt: "desc" as const };
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    const q = searchParams.get("q");
    const products = await prisma.product.findMany({
      where: {
        category: category ? { is: { OR: [{ slug: category }, { name: category }] } } : undefined,
        name: q ? { contains: q, mode: "insensitive" } : undefined,
      },
      include: { category: true },
      orderBy: orderBy(searchParams.get("sort")),
    });
    return NextResponse.json(products);
  } catch {
    return NextResponse.json({ error: "Could not load products" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const denied = await requireAdmin();
  if (denied) return denied;

  try {
    const body = await request.json();
    if (!body.name || !body.description || !body.imageUrl || !body.categoryId || Number(body.price) <= 0) {
      return NextResponse.json({ error: "Valid product details are required" }, { status: 400 });
    }

    const product = await prisma.product.create({
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
    return NextResponse.json(product, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Could not create product" }, { status: 500 });
  }
}
