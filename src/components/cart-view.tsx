"use client";

import Image from "next/image";
import Link from "next/link";
import { Minus, Plus } from "@phosphor-icons/react";
import { getProduct, UK_FREE_DELIVERY } from "@/lib/catalog";
import { formatNaira } from "@/lib/format";
import { useCart } from "@/components/cart-provider";

export function CartView() {
  const { lines, subtotal, setQty, remove, hydrated } = useCart();

  if (!hydrated) {
    return (
      <div className="mt-10 space-y-4" aria-hidden>
        <div className="h-24 animate-pulse bg-surface" />
        <div className="h-24 animate-pulse bg-surface" />
      </div>
    );
  }

  if (lines.length === 0) {
    return (
      <div className="mt-12">
        <p className="text-lg">Your bag is empty.</p>
        <Link
          href="/shop"
          className="mt-6 inline-flex h-11 items-center rounded-full bg-ink px-5 text-sm text-paper"
        >
          Browse the store
        </Link>
      </div>
    );
  }

  return (
    <div className="mt-10 grid gap-12 lg:grid-cols-[minmax(0,1fr)_20rem]">
      <ul>
        {lines.map((line) => {
          const product = getProduct(line.slug);
          if (!product) return null;
          return (
            <li
              key={`${line.slug}-${line.size}`}
              className="flex gap-4 border-b border-line py-6"
            >
              <Image
                src={product.image}
                alt=""
                width={96}
                height={128}
                className="h-32 w-24 object-cover"
              />
              <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between gap-4">
                  <Link href={`/product/${product.slug}`} className="text-base">
                    {product.name}
                  </Link>
                  <p>{formatNaira(product.price * line.qty)}</p>
                </div>
                <p className="mt-1 text-sm text-mute">{line.size}</p>
                <div className="mt-4 flex items-center justify-between">
                  <div className="flex items-center rounded-full border border-line">
                    <button
                      type="button"
                      aria-label={`Decrease ${product.name}`}
                      className="grid size-9 place-items-center"
                      onClick={() => setQty(line.slug, line.size, line.qty - 1)}
                    >
                      <Minus size={14} />
                    </button>
                    <span className="w-6 text-center text-sm">{line.qty}</span>
                    <button
                      type="button"
                      aria-label={`Increase ${product.name}`}
                      className="grid size-9 place-items-center"
                      onClick={() => setQty(line.slug, line.size, line.qty + 1)}
                    >
                      <Plus size={14} />
                    </button>
                  </div>
                  <button
                    type="button"
                    className="text-sm text-mute underline-offset-4 hover:text-ink hover:underline"
                    onClick={() => remove(line.slug, line.size)}
                  >
                    Remove
                  </button>
                </div>
              </div>
            </li>
          );
        })}
      </ul>
      <aside className="h-fit border border-line bg-surface p-5">
        <h2 className="text-base">Summary</h2>
        <div className="mt-4 flex items-baseline justify-between">
          <span className="text-sm text-mute">Subtotal</span>
          <span>{formatNaira(subtotal)}</span>
        </div>
        <p className="mt-3 text-sm leading-relaxed text-mute">
          {subtotal >= UK_FREE_DELIVERY
            ? "UK delivery is included. Express is charged separately."
            : `UK delivery is included from ${formatNaira(UK_FREE_DELIVERY)}. Express is charged separately.`}
        </p>
        <p className="mt-4 text-sm leading-relaxed text-mute">
          Checkout is handled by the studio. Email the order from the contact
          page and the team will confirm it.
        </p>
        <Link
          href="/contact"
          className="mt-5 flex h-11 items-center justify-center rounded-full bg-ink text-sm text-paper"
        >
          Email the studio
        </Link>
      </aside>
    </div>
  );
}
