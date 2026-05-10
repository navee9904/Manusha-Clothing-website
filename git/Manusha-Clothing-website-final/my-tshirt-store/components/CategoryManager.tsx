"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";

export function CategoryManager({ categories }: { categories: { id: string; name: string; slug: string }[] }) {
  const router = useRouter();
  const [name, setName] = useState("");

  async function createCategory() {
    const response = await fetch("/api/categories", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name }),
    });
    if (!response.ok) return toast.error("Could not create category");
    setName("");
    toast.success("Category saved");
    router.refresh();
  }

  return (
    <section className="mt-8">
      <div className="flex max-w-xl gap-3">
        <input className="flex-1 border border-black px-4 py-3" placeholder="Category name" value={name} onChange={(e) => setName(e.target.value)} />
        <button onClick={createCategory} className="bg-black px-6 py-3 text-sm font-black uppercase text-white">Add</button>
      </div>
      <div className="mt-8 grid gap-px bg-black md:grid-cols-2">
        {categories.map((category) => (
          <div key={category.id} className="bg-white p-6">
            <p className="font-black uppercase">{category.name}</p>
            <p className="text-sm text-neutral-500">{category.slug}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

