"use client";

import { useState } from "react";
import Image from "next/image";
import type { Product } from "@/lib/catalog";

export function ProductGallery({ product }: { product: Product }) {
  const shots = product.gallery?.length ? product.gallery : [product.image];
  const [shot, setShot] = useState(0);
  const selected = shots[shot] ?? shots[0];

  return (
    <div>
      <div className="relative overflow-hidden bg-surface">
        <Image
          key={selected}
          src={selected}
          alt={product.name}
          width={1200}
          height={1500}
          priority={shot === 0}
          sizes="(min-width: 1024px) 55vw, 100vw"
          className={
            selected.endsWith("bucket-hat-red.jpg")
              ? "h-auto w-full"
              : "aspect-[4/5] w-full object-cover"
          }
        />
      </div>
      {shots.length > 1 && (
        <div className="mt-3 flex gap-2 overflow-x-auto">
          {shots.map((src, index) => (
            <button
              key={`${src}-${index}`}
              type="button"
              aria-label={`Photo ${index + 1} of ${product.name}`}
              aria-pressed={shot === index}
              onClick={() => setShot(index)}
              className={`shrink-0 overflow-hidden border ${shot === index ? "border-ink" : "border-transparent"}`}
            >
              <Image
                src={src}
                alt={`${product.name}, photo ${index + 1}`}
                width={96}
                height={120}
                sizes="64px"
                className={`h-20 w-16 bg-surface ${src.endsWith("bucket-hat-red.jpg") ? "object-contain" : "object-cover"}`}
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
