import { CategoryManager } from "@/components/CategoryManager";
import { prisma } from "@/lib/prisma";

export default async function AdminCategoriesPage() {
  const categories = await prisma.category.findMany({ orderBy: { name: "asc" } });

  return (
    <main className="p-6 lg:p-10">
      <h1 className="font-serif text-6xl font-black uppercase">Categories</h1>
      <CategoryManager categories={categories} />
    </main>
  );
}
