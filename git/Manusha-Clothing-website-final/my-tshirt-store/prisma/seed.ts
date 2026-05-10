import bcrypt from "bcryptjs";
import { PrismaClient } from "@prisma/client";
import { slugify } from "../lib/format";

const prisma = new PrismaClient();

const categoryNames = [
  "Oversized Tees",
  "Graphic Tees",
  "Plain Basics",
  "Limited Drops",
  "Accessories",
];

async function main() {
  for (const name of categoryNames) {
    await prisma.category.upsert({
      where: { slug: slugify(name) },
      update: { name },
      create: { name, slug: slugify(name) },
    });
  }

  await prisma.user.upsert({
    where: { email: "admin@example.com" },
    update: { role: "admin" },
    create: {
      email: "admin@example.com",
      name: "Admin",
      role: "admin",
      password: await bcrypt.hash("admin123", 12),
    },
  });
}

main()
  .finally(async () => {
    await prisma.$disconnect();
  });

