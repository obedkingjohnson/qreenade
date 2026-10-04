import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AddToBag } from "@/components/add-to-bag";
import { ProductCard } from "@/components/product-card";
import { TryOn } from "@/components/try-on";
import {
  categories,
  getProduct,
  products,
  productsIn,
} from "@/lib/catalog";
import { formatNaira } from "@/lib/format";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return products.map((product) => ({ slug: product.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = getProduct(slug);
  if (!product) return { title: "Piece" };
  return {
    title: product.name,
    description: `${product.name}. ${formatNaira(product.price)}. ${product.summary}`,
  };
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;
  const product = getProduct(slug);
  if (!product) notFound();

  const category = categories.find((item) => item.slug === product.category);
  const related = productsIn(product.category)
    .filter((item) => item.slug !== product.slug)
    .slice(0, 3);

  return (
    <div className="mx-auto max-w-[1400px] px-4 py-8 md:px-6 md:py-12">
      <p className="text-sm text-mute">
        <Link href="/shop" className="hover:text-ink">
          Store
        </Link>
        {category && (
          <>
            {" / "}
            <Link
              href={`/shop?category=${category.slug}`}
              className="hover:text-ink"
            >
              {category.name}
            </Link>
          </>
        )}
      </p>
      <div className="mt-6 grid items-start gap-8 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:gap-16">
        <TryOn product={product} />
        <div className="lg:sticky lg:top-24">
          <h1 className="text-4xl tracking-tight md:text-5xl">{product.name}</h1>
          <p className="mt-4 text-lg">{formatNaira(product.price)}</p>
          <p className="mt-4 max-w-[46ch] leading-relaxed text-mute">
            {product.summary}
          </p>
          <AddToBag slug={product.slug} category={product.category} />
        </div>
      </div>

      {related.length > 0 && (
        <section className="mt-20 border-t border-line pt-12">
          <h2 className="text-2xl tracking-tight">Also in {category?.name}</h2>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((item, index) => (
              <ProductCard key={item.slug} product={item} index={index} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
