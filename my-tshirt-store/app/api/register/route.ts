import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  const body = await request.json();
  const email = String(body.email || "").toLowerCase();
  const password = String(body.password || "");
  const name = body.name ? String(body.name) : null;

  if (!email || password.length < 6) {
    return NextResponse.json({ error: "Email and a 6 character password are required" }, { status: 400 });
  }

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) return NextResponse.json({ error: "Email already registered" }, { status: 409 });

  const user = await prisma.user.create({
    data: {
      email,
      name,
      password: await bcrypt.hash(password, 12),
    },
  });

  return NextResponse.json({ id: user.id, email: user.email });
}

