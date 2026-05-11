"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";

export function CategoryManager({ categories }: { categories: { id: string; name: string; slug: string }[] }) {
  const router = useRouter();
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);

  async function createCategory() {
    if (!name.trim()) return toast.error("Category name is required");
    setLoading(true);
    const response = await fetch("/api/categories", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name }),
    });
    setLoading(false);
    if (!response.ok) return toast.error("Could not create category");
    setName("");
    toast.success("Category saved");
    router.refresh();
  }

  async function deleteCategory(id: string, label: string) {
    if (!window.confirm(`Delete ${label}?`)) return;
    setLoading(true);
    const response = await fetch(`/api/categories/${id}`, { method: "DELETE" });
    setLoading(false);
    if (!response.ok) return toast.error("Could not delete category");
    toast.success("Category deleted");
    router.refresh();
  }

  return (
    <section className="mt-8">
      <div className="flex max-w-xl gap-3">
        <input className="flex-1 border border-black px-4 py-3" placeholder="Category name" value={name} onChange={(e) => setName(e.target.value)} />
        <button disabled={loading} onClick={createCategory} className="bg-black px-6 py-3 text-sm font-black uppercase text-white disabled:bg-neutral-300">{loading ? "Saving" : "Add"}</button>
      </div>
      <div className="mt-8 grid gap-px bg-black md:grid-cols-2">
        {categories.map((category) => (
          <div key={category.id} className="bg-white p-6">
            <p className="font-black uppercase">{category.name}</p>
            <p className="text-sm text-neutral-500">{category.slug}</p>
            <button disabled={loading} onClick={() => deleteCategory(category.id, category.name)} className="mt-5 border border-black px-4 py-2 text-xs font-black uppercase disabled:text-neutral-400">Delete</button>
          </div>
        ))}
      </div>
    </section>
  );
}
