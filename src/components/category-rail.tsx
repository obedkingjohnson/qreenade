import Image from "next/image";
import Link from "next/link";
import { categories, products } from "@/lib/catalog";

export function CategoryRail() {
  return (
    <section className="mx-auto max-w-[1400px] px-4 py-16 md:px-6 md:py-24">
      <h2 className="text-3xl tracking-tight md:text-4xl">Shop by piece</h2>
      <div className="mt-8 grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-4 lg:grid-cols-6">
        {categories.map((category) => {
          const count = products.filter(
            (product) => product.category === category.slug,
          ).length;
          return (
            <Link
              key={category.slug}
              href={`/shop?category=${category.slug}`}
              className="group block min-w-0"
            >
              <div className="aspect-[3/4] overflow-hidden bg-surface">
                <Image
                  src={category.image}
                  alt=""
                  width={800}
                  height={1066}
                  className="size-full object-cover transition-transform duration-700 group-hover:scale-105 motion-reduce:transition-none"
                />
              </div>
              <div className="mt-3 flex items-baseline justify-between gap-3">
                <h3 className="text-base">{category.name}</h3>
                <p className="text-sm text-mute">
                  {count} {count === 1 ? "piece" : "pieces"}
                </p>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
