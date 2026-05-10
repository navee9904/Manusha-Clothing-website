import Image from "next/image";
import Link from "next/link";
import { formatMoney } from "@/lib/format";

type ProductCardProps = {
  product: {
    id: string;
    name: string;
    price: number;
    imageUrl: string;
    category?: { name: string } | null;
  };
};

export function ProductCard({ product }: ProductCardProps) {
  return (
    <Link href={`/product/${product.id}`} className="group block">
      <div className="aspect-[4/5] overflow-hidden bg-neutral-100">
        <Image
          src={product.imageUrl}
          alt={product.name}
          width={900}
          height={1125}
          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
        />
      </div>
      <div className="mt-4 flex items-start justify-between gap-4 text-sm">
        <div>
          <p className="font-semibold uppercase tracking-wide">{product.name}</p>
          {product.category ? (
            <p className="mt-1 text-neutral-500">{product.category.name}</p>
          ) : null}
        </div>
        <p className="font-semibold">{formatMoney(product.price)}</p>
      </div>
    </Link>
  );
}

