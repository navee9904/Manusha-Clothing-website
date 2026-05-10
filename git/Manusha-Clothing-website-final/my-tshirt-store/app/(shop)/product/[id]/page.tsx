import Image from "next/image";
import { notFound } from "next/navigation";
import { AddToCart } from "@/components/AddToCart";
import { formatMoney } from "@/lib/format";
import { prisma } from "@/lib/prisma";

export default async function ProductPage({ params }: { params: { id: string } }) {
  const product = await prisma.product.findUnique({ where: { id: params.id }, include: { category: true } });
  if (!product) notFound();

  return (
    <main className="mx-auto grid max-w-7xl gap-12 px-4 py-12 sm:px-6 lg:grid-cols-2 lg:px-8">
      <div className="grid gap-4 sm:grid-cols-2">
        {[product.imageUrl, product.imageUrl].map((imageUrl, index) => (
          <div key={index} className="aspect-[4/5] overflow-hidden bg-neutral-100">
            <Image src={imageUrl} alt={product.name} width={900} height={1125} className="h-full w-full object-cover" priority={index === 0} />
          </div>
        ))}
      </div>
      <section className="lg:sticky lg:top-28 lg:self-start">
        <p className="text-xs font-black uppercase tracking-[0.2em]">{product.category.name}</p>
        <h1 className="mt-4 font-serif text-6xl font-black uppercase leading-none">{product.name}</h1>
        <p className="mt-5 text-2xl font-black">{formatMoney(product.price)}</p>
        <p className="mt-8 max-w-xl leading-8 text-neutral-700">{product.description}</p>
        <AddToCart product={product} />
      </section>
    </main>
  );
}

