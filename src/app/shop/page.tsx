import type { Metadata } from "next";
import Link from "next/link";
import { categories, productsIn } from "@/lib/catalog";
import { ProductMasonry } from "@/components/product-card";
import { cn } from "@/lib/cn";

export const metadata: Metadata = {
  title: "Store",
  description: "Dresses, skirts, tops, sets, and bags from qreenade.",
};

export default async function ShopPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const { category } = await searchParams;
  const active = categories.find((item) => item.slug === category);
  const items = productsIn(active?.slug);

  return (
    <div className="mx-auto max-w-[1400px] px-4 py-10 md:px-6 md:py-14">
      <h1 className="text-4xl tracking-tight md:text-5xl">
        {active ? active.name : "Store"}
      </h1>
      <p className="mt-3 max-w-[42ch] text-mute">
        {items.length} {items.length === 1 ? "piece" : "pieces"}, made to order
        in Lagos.
      </p>
      <div className="mt-8 flex gap-2 overflow-x-auto pb-2">
        <Link
          href="/shop"
          className={cn(
            "inline-flex h-10 shrink-0 items-center rounded-full border px-4 text-sm",
            !active ? "border-ink bg-ink text-paper" : "border-line bg-surface",
          )}
        >
          All
        </Link>
        {categories.map((item) => (
          <Link
            key={item.slug}
            href={`/shop?category=${item.slug}`}
            className={cn(
              "inline-flex h-10 shrink-0 items-center rounded-full border px-4 text-sm",
              active?.slug === item.slug
                ? "border-ink bg-ink text-paper"
                : "border-line bg-surface",
            )}
          >
            {item.name}
          </Link>
        ))}
      </div>
      <div className="mt-10">
        <ProductMasonry items={items} />
      </div>
    </div>
  );
}
