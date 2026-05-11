"use client";

import Image from "next/image";
import Link from "next/link";
import toast from "react-hot-toast";
import { useCart } from "@/components/cart-context";
import { formatMoney } from "@/lib/format";

type ProductCardProps = {
  product: {
    id: string;
    name: string;
    price: number;
    imageUrl: string;
    sizes?: string[];
    category?: { name: string } | null;
  };
};

export function ProductCard({ product }: ProductCardProps) {
  const { addItem, openCart } = useCart();
  const size = product.sizes?.[0] || "M";

  function quickAdd() {
    addItem({ productId: product.id, name: product.name, price: product.price, imageUrl: product.imageUrl, size, quantity: 1 });
    openCart();
    toast.success("Added to cart");
  }

  return (
    <article className="group transition duration-300 hover:-translate-y-1 hover:shadow-2xl">
      <Link href={`/product/${product.id}`} className="block">
        <div className="relative aspect-[4/5] overflow-hidden bg-[#F5F5F5]">
          <Image
            src={product.imageUrl}
            alt={product.name}
            width={900}
            height={1125}
            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
          />
        </div>
      </Link>
      <div className="border-x border-b border-[#E0E0E0] bg-white p-4">
        <div className="flex items-start justify-between gap-4 text-sm">
          <div>
            <Link href={`/product/${product.id}`} className="font-black uppercase tracking-wide">{product.name}</Link>
            {product.category ? <p className="mt-1 text-neutral-500">{product.category.name}</p> : null}
            {product.sizes?.length ? (
              <div className="mt-3 flex flex-wrap gap-1">
                {product.sizes.map((item) => <span key={item} className="border border-[#E0E0E0] px-2 py-1 text-[10px] font-black uppercase">{item}</span>)}
              </div>
            ) : null}
          </div>
          <p className="font-black">{formatMoney(product.price)}</p>
        </div>
        <button
          type="button"
          onClick={quickAdd}
          className="mt-4 w-full translate-y-1 border border-black bg-white px-4 py-3 text-xs font-black uppercase tracking-[0.18em] opacity-100 transition hover:bg-black hover:text-white md:opacity-0 md:group-hover:translate-y-0 md:group-hover:opacity-100"
        >
          Add to cart
        </button>
      </div>
    </article>
  );
}
