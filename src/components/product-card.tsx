import Image from "next/image";
import Link from "next/link";
import type { Product } from "@/lib/catalog";
import { formatNaira } from "@/lib/format";
import { ScrollIn, ScrollPhoto } from "@/components/scroll-in";

export function ProductCard({
  product,
  index = 0,
}: {
  product: Product;
  index?: number;
}) {
  return (
    <ScrollIn index={index}>
      <Link href={`/product/${product.slug}`} className="group block">
        <ScrollPhoto className="aspect-[3/4] bg-surface">
          <Image
            src={product.image}
            alt={product.name}
            width={800}
            height={1000}
            className="size-full object-cover"
          />
        </ScrollPhoto>
        <div className="mt-3 flex items-baseline justify-between gap-3">
          <h3 className="text-sm">{product.name}</h3>
          <p className="shrink-0 text-sm text-mute">{formatNaira(product.price)}</p>
        </div>
      </Link>
    </ScrollIn>
  );
}

export function ProductMasonry({
  items,
  heading,
}: {
  items: Product[];
  heading?: string;
}) {
  if (items.length === 0) {
    return (
      <div className="py-16">
        <p className="text-lg">Nothing in this edit yet.</p>
        <Link href="/shop" className="mt-4 inline-block text-sm underline">
          View the full store
        </Link>
      </div>
    );
  }

  return (
    <div>
      {heading && (
        <h2 className="mb-8 text-3xl tracking-tight md:text-4xl">{heading}</h2>
      )}
      <div className="grid grid-cols-2 gap-x-3 gap-y-10 md:grid-cols-3 md:gap-x-4 lg:grid-cols-4">
        {items.map((product, index) => (
          <ProductCard key={product.slug} product={product} index={index} />
        ))}
      </div>
    </div>
  );
}
