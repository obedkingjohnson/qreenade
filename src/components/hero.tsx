"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { CaretLeft, CaretRight } from "@phosphor-icons/react";
import {
  AnimatePresence,
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from "motion/react";
import { getProduct, heroSlides } from "@/lib/catalog";
import { formatNaira } from "@/lib/format";

const SLIDE_MS = 5200;

const slideVariants = {
  enter: (direction: number) => ({ x: direction > 0 ? "100%" : "-100%" }),
  center: { x: "0%" },
  exit: (direction: number) => ({
    x: direction > 0 ? "-100%" : "100%",
    pointerEvents: "none" as const,
  }),
};

export function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });
  const photoScale = useTransform(scrollYProgress, [0, 1], [1, 1.12]);
  const count = heroSlides.length;
  const slide = heroSlides[index];
  const product = getProduct(slide.slug);

  useEffect(() => {
    if (reduce) return;
    const id = window.setInterval(() => {
      setDirection(1);
      setIndex((current) => (current + 1) % count);
    }, SLIDE_MS);
    return () => window.clearInterval(id);
  }, [reduce, index, count]);

  function go(step: number) {
    setDirection(step);
    setIndex((current) => (current + step + count) % count);
  }

  return (
    <section
      ref={sectionRef}
      className="relative min-h-[calc(100dvh-6rem)] overflow-hidden bg-[#141414]"
    >
      <motion.div
        className="absolute inset-0"
        style={reduce ? undefined : { scale: photoScale }}
      >
        <AnimatePresence initial={false} custom={direction}>
          <motion.div
            key={slide.slug}
            className="absolute inset-0"
            custom={direction}
            variants={slideVariants}
            initial={reduce ? "center" : "enter"}
            animate="center"
            exit="exit"
            transition={{ duration: reduce ? 0 : 0.95, ease: [0.76, 0, 0.24, 1] }}
          >
            <div className="hero-drift absolute inset-0">
              <Image
                src={slide.src}
                alt={slide.alt}
                fill
                priority={index === 0}
                sizes="100vw"
                className="object-cover object-center"
              />
            </div>
            <div className="absolute inset-x-0 bottom-0 z-10 flex items-end bg-gradient-to-t from-[#141414] via-[#141414]/75 to-transparent pb-10 pt-28 md:pb-14">
              <div className="mx-auto flex w-full max-w-[1400px] items-end px-4 md:px-6">
                <div className="flex max-w-xl flex-col items-start gap-5 pr-28">
                  <h1 className="text-5xl leading-[1.05] tracking-[-0.04em] text-white md:text-6xl">
                    {slide.title}
                  </h1>
                  <p className="text-base text-white/90">
                    {product ? formatNaira(product.price) : "Made to order in Lagos."}
                  </p>
                  <Link
                    href={slide.href}
                    className="inline-flex h-11 items-center rounded-full bg-white px-5 text-sm text-[#141414] active:scale-[0.98] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                  >
                    {slide.cta}
                  </Link>
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </motion.div>

      <div className="absolute right-4 bottom-10 z-30 flex gap-2 md:right-6 md:bottom-14">
        <button
          type="button"
          aria-label={`Previous piece, ${slide.title} is showing`}
          onClick={() => go(-1)}
          className="grid size-11 place-items-center rounded-full bg-white text-[#141414] active:scale-[0.98]"
        >
          <CaretLeft size={18} />
        </button>
        <button
          type="button"
          aria-label={`Next piece, ${slide.title} is showing`}
          onClick={() => go(1)}
          className="grid size-11 place-items-center rounded-full bg-white text-[#141414] active:scale-[0.98]"
        >
          <CaretRight size={18} />
        </button>
      </div>

      <div className="absolute inset-x-0 bottom-0 z-20 h-0.5 bg-white/30">
        {reduce ? null : (
          <motion.div
            key={slide.slug}
            className="h-full origin-left bg-white"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: SLIDE_MS / 1000, ease: "linear" }}
          />
        )}
      </div>
    </section>
  );
}
