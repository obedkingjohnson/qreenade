"use client";

import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, X } from "@phosphor-icons/react";
import { getProduct } from "@/lib/catalog";
import { DeliveryNote } from "@/components/delivery-note";
import { Price } from "@/components/price";
import { useCart } from "@/components/cart-provider";

export function BagDrawer({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const { lines, subtotal, setQty, remove } = useCart();

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50">
      <button
        type="button"
        aria-label="Close bag"
        className="absolute inset-0 bg-[#141414]/40"
        onClick={onClose}
      />
      <aside
        role="dialog"
        aria-modal="true"
        aria-label="Bag"
        className="absolute top-0 right-0 flex h-full w-full max-w-md flex-col bg-paper"
      >
        <div className="flex h-16 items-center justify-between border-b border-line px-5">
          <h2 className="text-base font-medium">Bag</h2>
          <button
            type="button"
            onClick={onClose}
            className="grid size-10 place-items-center rounded-full hover:bg-surface"
            aria-label="Close bag"
          >
            <X size={18} />
          </button>
        </div>

        {lines.length === 0 ? (
          <div className="flex flex-1 flex-col items-start justify-center px-5">
            <p className="text-lg">Your bag is empty.</p>
            <Link
              href="/shop"
              onClick={onClose}
              className="mt-6 inline-flex h-11 items-center rounded-full bg-ink px-5 text-sm text-paper active:scale-[0.98]"
            >
              Browse the store
            </Link>
          </div>
        ) : (
          <>
            <ul className="flex-1 overflow-y-auto px-5">
              {lines.map((line) => {
                const product = getProduct(line.slug);
                if (!product) return null;
                return (
                  <li
                    key={`${line.slug}-${line.size}`}
                    className="flex gap-4 border-b border-line py-5"
                  >
                    <Image
                      src={product.image}
                      alt=""
                      width={72}
                      height={96}
                      className="h-24 w-[4.5rem] object-cover"
                    />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-3">
                        <Link
                          href={`/product/${product.slug}`}
                          onClick={onClose}
                          className="text-sm"
                        >
                          {product.name}
                        </Link>
                        <p className="text-sm">
                          <Price amount={product.price * line.qty} />
                        </p>
                      </div>
                      <p className="mt-1 text-xs text-mute">{line.size}</p>
                      <div className="mt-3 flex items-center justify-between">
                        <div className="flex items-center rounded-full border border-line">
                          <button
                            type="button"
                            aria-label={`Decrease ${product.name}`}
                            className="grid size-8 place-items-center"
                            onClick={() =>
                              setQty(line.slug, line.size, line.qty - 1)
                            }
                          >
                            <Minus size={12} />
                          </button>
                          <span className="w-6 text-center text-sm">
                            {line.qty}
                          </span>
                          <button
                            type="button"
                            aria-label={`Increase ${product.name}`}
                            className="grid size-8 place-items-center"
                            onClick={() =>
                              setQty(line.slug, line.size, line.qty + 1)
                            }
                          >
                            <Plus size={12} />
                          </button>
                        </div>
                        <button
                          type="button"
                          className="text-xs text-mute underline-offset-4 hover:text-ink hover:underline"
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
            <div className="border-t border-line px-5 py-5">
              <div className="flex items-baseline justify-between">
                <span className="text-sm">Subtotal</span>
                <span className="text-base">
                  <Price amount={subtotal} />
                </span>
              </div>
              <DeliveryNote
                subtotal={subtotal}
                className="mt-2 text-xs leading-relaxed text-mute"
              />
              <Link
                href="/cart"
                onClick={onClose}
                className="mt-4 flex h-11 items-center justify-center rounded-full bg-ink text-sm text-paper active:scale-[0.98]"
              >
                Review bag
              </Link>
            </div>
          </>
        )}
      </aside>
    </div>
  );
}
