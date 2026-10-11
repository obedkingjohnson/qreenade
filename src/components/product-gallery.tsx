"use client";

import { useState } from "react";
import Image from "next/image";
import { AiTryOn } from "@/components/ai-try-on";
import type { Product } from "@/lib/catalog";

export function ProductGallery({ product }: { product: Product }) {
  const shots = product.gallery?.length ? product.gallery : [product.image];
  const [shot, setShot] = useState(0);

  return (
    <div>
      <div className="relative overflow-hidden bg-surface">
        <Image
          src={shots[shot]}
          alt={product.name}
          width={1200}
          height={1500}
          priority={shot === 0}
          className={
            shots[shot].endsWith("bucket-hat-red.jpg")
              ? "h-auto w-full"
              : "aspect-[4/5] w-full object-cover"
          }
        />
        <AiTryOn slug={product.slug} name={product.name} />
      </div>
      {shots.length > 1 && (
        <div className="mt-3 flex gap-2">
          {shots.map((src, index) => (
            <button
              key={src}
              type="button"
              aria-label={`Photo ${index + 1} of ${product.name}`}
              aria-pressed={shot === index}
              onClick={() => setShot(index)}
              className={`overflow-hidden border ${shot === index ? "border-ink" : "border-transparent"}`}
            >
              <Image
                src={src}
                alt=""
                width={96}
                height={120}
                className={`h-20 w-16 bg-surface ${src.endsWith("bucket-hat-red.jpg") ? "object-contain" : "object-cover"}`}
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
