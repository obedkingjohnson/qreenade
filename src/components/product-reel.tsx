"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { ScrollIn } from "@/components/scroll-in";
import type { Product } from "@/lib/catalog";
import { formatNaira } from "@/lib/format";

export function ProductReel({ products }: { products: Product[] }) {
  const sectionRef = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });
  const nudge = useTransform(scrollYProgress, [0, 1], [60, -180]);
  const loop = [...products, ...products];

  return (
    <section ref={sectionRef} className="overflow-hidden pb-16 md:pb-24">
      <div className="mx-auto max-w-[1400px] px-4 md:px-6">
        <h2 className="text-3xl tracking-tight md:text-4xl">Top sellers</h2>
      </div>
      <ScrollIn className="mt-8">
      <motion.div style={reduce ? undefined : { x: nudge }}>
        <div className={reduce ? "flex flex-wrap gap-4 px-4" : "product-slide flex w-max gap-4 px-4"}>
          {(reduce ? products : loop).map((product, index) => (
            <Link
              key={`${product.slug}-${index}`}
              href={`/product/${product.slug}`}
              className="group block w-[78vw] shrink-0 sm:w-[46vw] lg:w-[30vw]"
            >
              <div className="aspect-[3/4] overflow-hidden bg-surface">
                <Image
                  src={product.image}
                  alt={product.name}
                  width={900}
                  height={1200}
                  className={`size-full object-cover ${
                    reduce
                      ? ""
                      : index % 2 === 0
                        ? "product-pan"
                        : "product-pan product-pan-reverse"
                  }`}
                />
              </div>
              <div className="mt-3 flex items-baseline justify-between gap-3">
                <h3 className="text-sm">{product.name}</h3>
                <p className="shrink-0 text-sm text-mute">
                  {formatNaira(product.price)}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </motion.div>
      </ScrollIn>
    </section>
  );
}
