"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";
import ImageUpload from "@/components/ImageUpload";

type Category = { id: string; name: string };
type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  stock: number;
  sizes: string[];
  categoryId: string;
  featured: boolean;
};

export function AdminProductForm({ categories, product, compact = false }: { categories: Category[]; product?: Product; compact?: boolean }) {
  const router = useRouter();
  const [form, setForm] = useState({
    name: product?.name || "",
    description: product?.description || "",
    price: String(product?.price || ""),
    imageUrl: product?.imageUrl || "",
    stock: String(product?.stock ?? 0),
    sizes: product?.sizes.join(", ") || "S, M, L, XL",
    categoryId: product?.categoryId || categories[0]?.id || "",
    featured: product?.featured || false,
  });

  const [loading, setLoading] = useState(false);

  async function save() {
    if (!form.name || !form.description || !form.imageUrl || !form.categoryId || Number(form.price) <= 0) {
      toast.error("Complete the product details");
      return;
    }
    setLoading(true);
    const payload = {
      ...form,
      price: Number(form.price),
      stock: Number(form.stock),
      sizes: form.sizes.split(",").map((size) => size.trim()).filter(Boolean),
    };
    const response = await fetch(product ? `/api/products/${product.id}` : "/api/products", {
      method: product ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    setLoading(false);
    if (!response.ok) return toast.error("Save failed");
    toast.success("Product saved");
    router.refresh();
  }

  async function remove() {
    if (!product || !window.confirm(`Delete ${product.name}?`)) return;
    setLoading(true);
    const response = await fetch(`/api/products/${product.id}`, { method: "DELETE" });
    setLoading(false);
    if (!response.ok) return toast.error("Delete failed");
    toast.success("Product deleted");
    router.refresh();
  }

  return (
    <div className={`grid gap-3 text-sm ${compact ? "md:grid-cols-6" : "md:grid-cols-8"}`}>
      <input className="border border-black px-3 py-2 md:col-span-2" placeholder="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
      <input className="border border-black px-3 py-2 md:col-span-2" placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
      <input className="border border-black px-3 py-2" placeholder="Price" type="number" step="0.01" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} />
      <input className="border border-black px-3 py-2" placeholder="Stock" type="number" value={form.stock} onChange={(e) => setForm({ ...form, stock: e.target.value })} />
      <select className="border border-black px-3 py-2" value={form.categoryId} onChange={(e) => setForm({ ...form, categoryId: e.target.value })}>
        {categories.map((category) => <option key={category.id} value={category.id}>{category.name}</option>)}
      </select>
      <button disabled={loading} onClick={save} className="bg-black px-4 py-2 font-bold uppercase text-white disabled:bg-neutral-300">{loading ? "Saving" : "Save"}</button>
      <input className="border border-black px-3 py-2 md:col-span-3" placeholder="Image URL" value={form.imageUrl} onChange={(e) => setForm({ ...form, imageUrl: e.target.value })} />
      <input className="border border-black px-3 py-2 md:col-span-2" placeholder="Sizes" value={form.sizes} onChange={(e) => setForm({ ...form, sizes: e.target.value })} />
      <label className="flex items-center gap-2 border border-black px-3 py-2">
        <input type="checkbox" checked={form.featured} onChange={(e) => setForm({ ...form, featured: e.target.checked })} />
        Featured
      </label>
      <ImageUpload onUpload={(url) => setForm((current) => ({ ...current, imageUrl: url }))} />
      {product ? <button disabled={loading} onClick={remove} className="border border-black px-4 py-2 font-bold uppercase disabled:text-neutral-400">Delete</button> : null}
    </div>
  );
}
