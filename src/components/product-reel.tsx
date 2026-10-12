"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import { motion, useInView, useReducedMotion, useScroll, useTransform } from "motion/react";
import { ScrollIn } from "@/components/scroll-in";
import type { Product } from "@/lib/catalog";
import { Price } from "@/components/price";

const REEL_LIMIT = 12;

export function ProductReel({ products }: { products: Product[] }) {
  const sectionRef = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const inView = useInView(sectionRef, { amount: 0 });
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });
  const nudge = useTransform(scrollYProgress, [0, 1], [60, -180]);
  const featured = products.slice(0, REEL_LIMIT);
  const loop = [...featured, ...featured];
  const sliding = !reduce && inView;

  return (
    <section ref={sectionRef} className="overflow-hidden pb-16 md:pb-24">
      <div className="mx-auto max-w-[1400px] px-4 md:px-6">
        <h2 className="text-3xl tracking-tight md:text-4xl">Top sellers</h2>
      </div>
      <ScrollIn className="mt-8">
      <motion.div style={reduce ? undefined : { x: nudge }}>
        <div
          className={
            reduce
              ? "flex flex-wrap gap-4 px-4"
              : `product-slide flex w-max gap-4 px-4${sliding ? " is-running" : ""}`
          }
        >
          {(reduce ? featured : loop).map((product, index) => (
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
                  sizes="(min-width:1024px) 30vw, (min-width:640px) 46vw, 78vw"
                  loading="lazy"
                  className="size-full object-cover"
                />
              </div>
              <div className="mt-3 flex items-baseline justify-between gap-3">
                <h3 className="text-sm">{product.name}</h3>
                <p className="shrink-0 text-sm text-mute">
                  <Price amount={product.price} />
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
