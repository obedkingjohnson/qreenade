"use client";

import { useEffect, useState } from "react";
import { CaretLeft, CaretRight } from "@phosphor-icons/react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { testimonials } from "@/lib/catalog";

const SLIDE_MS = 5600;

const variants = {
  enter: (direction: number) => ({ x: direction > 0 ? 48 : -48, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (direction: number) => ({ x: direction > 0 ? -48 : 48, opacity: 0 }),
};

export function Testimonials() {
  const reduce = useReducedMotion();
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const count = testimonials.length;
  const item = testimonials[index];

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
    <section className="border-t border-line px-4 py-16 md:px-6 md:py-24">
      <div className="mx-auto grid max-w-[1100px] grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-4 md:gap-10">
        <button
          type="button"
          aria-label="Previous note"
          onClick={() => go(-1)}
          className="grid size-11 place-items-center rounded-full border border-line text-ink active:scale-[0.98]"
        >
          <CaretLeft size={18} />
        </button>

        <div className="relative min-h-40 overflow-hidden">
          <AnimatePresence initial={false} custom={direction} mode="wait">
            <motion.blockquote
              key={item.name}
              custom={direction}
              variants={variants}
              initial={reduce ? "center" : "enter"}
              animate="center"
              exit="exit"
              transition={{ duration: reduce ? 0 : 0.45, ease: [0.76, 0, 0.24, 1] }}
              className="mx-auto max-w-3xl text-center"
            >
              <p className="text-2xl leading-snug tracking-tight md:text-4xl">
                “{item.quote}”
              </p>
              <footer className="mt-6 text-base">
                <span className="text-mute">— </span>
                <span className="font-medium">{item.name}</span>
              </footer>
              <div className="mx-auto mt-5 h-px w-16 overflow-hidden bg-line">
                {reduce ? null : (
                  <motion.div
                    key={item.name}
                    className="h-full origin-left bg-ink"
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ duration: SLIDE_MS / 1000, ease: "linear" }}
                  />
                )}
              </div>
            </motion.blockquote>
          </AnimatePresence>
        </div>

        <button
          type="button"
          aria-label="Next note"
          onClick={() => go(1)}
          className="grid size-11 place-items-center rounded-full border border-line text-ink active:scale-[0.98]"
        >
          <CaretRight size={18} />
        </button>
      </div>
    </section>
  );
}
