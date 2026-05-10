import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin";
import { slugify } from "@/lib/format";
import { prisma } from "@/lib/prisma";

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  const denied = await requireAdmin();
  if (denied) return denied;

  const body = await request.json();
  const name = String(body.name || "");
  const category = await prisma.category.update({
    where: { id: params.id },
    data: { name, slug: slugify(name) },
  });
  return NextResponse.json(category);
}

export async function DELETE(_request: Request, { params }: { params: { id: string } }) {
  const denied = await requireAdmin();
  if (denied) return denied;

  await prisma.category.delete({ where: { id: params.id } });
  return NextResponse.json({ ok: true });
}

