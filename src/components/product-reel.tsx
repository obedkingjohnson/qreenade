"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { motion, useInView, useReducedMotion, useScroll, useTransform } from "motion/react";
import { ScrollIn } from "@/components/scroll-in";
import type { Product } from "@/lib/catalog";
import { Price } from "@/components/price";

const REEL_LIMIT = 12;
const LOOP_SECONDS = 42;
const DRAG_THRESHOLD = 8;
const RESUME_DELAY_MS = 180;

function ReelCard({ product }: { product: Product }) {
  return (
    <Link
      href={`/product/${product.slug}`}
      draggable={false}
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
          draggable={false}
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
  );
}

export function ProductReel({ products }: { products: Product[] }) {
  const sectionRef = useRef<HTMLElement>(null);
  const scrollerRef = useRef<HTMLDivElement>(null);
  const loopRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef<{
    pointerId: number;
    startX: number;
    startScroll: number;
    moved: boolean;
  } | null>(null);
  const suppressClick = useRef(false);
  const writingScroll = useRef(false);
  const expectedScroll = useRef<number | null>(null);
  const resumeTimer = useRef<number | null>(null);
  const reduce = useReducedMotion();
  const inView = useInView(sectionRef, { amount: 0 });
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });
  const nudge = useTransform(scrollYProgress, [0, 1], [60, -180]);
  const [hovering, setHovering] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [userScroll, setUserScroll] = useState(false);
  const featured = products.slice(0, REEL_LIMIT);
  const reduceMotion = reduce === true;
  const marqueeOn = !reduceMotion && inView && !hovering && !dragging && !userScroll;

  function loopWidth() {
    return loopRef.current?.offsetWidth ?? 0;
  }

  function writeScroll(el: HTMLDivElement, value: number) {
    const width = loopWidth();
    let next = value;
    if (width > 0) {
      next = next % width;
      if (next < 0) next += width;
    }
    writingScroll.current = true;
    expectedScroll.current = next;
    el.scrollLeft = next;
    expectedScroll.current = el.scrollLeft;
    writingScroll.current = false;
  }

  function noteUserScroll() {
    setUserScroll(true);
    if (resumeTimer.current !== null) window.clearTimeout(resumeTimer.current);
    resumeTimer.current = window.setTimeout(() => {
      resumeTimer.current = null;
      setUserScroll(false);
    }, RESUME_DELAY_MS);
  }

  useLayoutEffect(() => {
    if (reduceMotion) return;
    const el = scrollerRef.current;
    const width = loopRef.current?.offsetWidth ?? 0;
    if (!el || width <= 0) return;
    el.scrollLeft = width / 2;
  }, [reduceMotion, featured.length]);

  useEffect(() => {
    return () => {
      if (resumeTimer.current !== null) window.clearTimeout(resumeTimer.current);
    };
  }, []);

  useEffect(() => {
    if (!marqueeOn) return;
    const el = scrollerRef.current;
    if (!el) return;
    let frame = 0;
    let last = performance.now();
    const tick = (now: number) => {
      frame = requestAnimationFrame(tick);
      const width = loopWidth();
      if (width <= 0 || document.hidden) {
        last = now;
        return;
      }
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      writeScroll(el, el.scrollLeft + (width / LOOP_SECONDS) * dt);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [marqueeOn]);

  function onPointerDown(event: React.PointerEvent<HTMLDivElement>) {
    if (event.pointerType === "touch") {
      noteUserScroll();
      return;
    }
    if (event.pointerType !== "mouse" && event.pointerType !== "pen") return;
    if (event.button !== 0) return;
    const el = scrollerRef.current;
    if (!el) return;
    dragRef.current = {
      pointerId: event.pointerId,
      startX: event.clientX,
      startScroll: el.scrollLeft,
      moved: false,
    };
  }

  function onPointerMove(event: React.PointerEvent<HTMLDivElement>) {
    const drag = dragRef.current;
    const el = scrollerRef.current;
    if (!drag || !el || event.pointerId !== drag.pointerId) return;
    const dx = event.clientX - drag.startX;
    if (!drag.moved && Math.abs(dx) <= DRAG_THRESHOLD) return;
    drag.moved = true;
    if (!el.hasPointerCapture(event.pointerId)) {
      el.setPointerCapture(event.pointerId);
      setDragging(true);
    }
    writeScroll(el, drag.startScroll - dx);
  }

  function endDrag(event: React.PointerEvent<HTMLDivElement>) {
    const drag = dragRef.current;
    const el = scrollerRef.current;
    if (!drag || event.pointerId !== drag.pointerId) return;
    if (el?.hasPointerCapture(event.pointerId)) el.releasePointerCapture(event.pointerId);
    if (drag.moved) suppressClick.current = true;
    dragRef.current = null;
    setDragging(false);
  }

  if (reduceMotion) {
    return (
      <section ref={sectionRef} className="overflow-hidden pb-16 md:pb-24">
        <div className="mx-auto max-w-[1400px] px-4 md:px-6">
          <h2 className="text-3xl tracking-tight md:text-4xl">Top sellers</h2>
        </div>
        <ScrollIn className="mt-8">
          <div className="flex flex-wrap gap-4 px-4">
            {featured.map((product) => (
              <ReelCard key={product.slug} product={product} />
            ))}
          </div>
        </ScrollIn>
      </section>
    );
  }

  return (
    <section ref={sectionRef} className="overflow-hidden pb-16 md:pb-24">
      <div className="mx-auto max-w-[1400px] px-4 md:px-6">
        <h2 className="text-3xl tracking-tight md:text-4xl">Top sellers</h2>
      </div>
      <ScrollIn className="mt-8">
        <motion.div style={{ x: nudge }}>
          <div
            ref={scrollerRef}
            className={`product-reel w-full overflow-x-auto${dragging ? " is-dragging" : ""}${marqueeOn ? " is-running" : ""}`}
            onPointerEnter={(event) => {
              if (event.pointerType === "mouse") setHovering(true);
            }}
            onPointerLeave={(event) => {
              if (dragRef.current && !dragRef.current.moved) dragRef.current = null;
              if (event.pointerType !== "mouse") return;
              const active = document.activeElement;
              if (active && scrollerRef.current?.contains(active)) return;
              setHovering(false);
            }}
            onFocusCapture={() => setHovering(true)}
            onBlurCapture={(event) => {
              const next = event.relatedTarget;
              if (!(next instanceof Node) || !scrollerRef.current?.contains(next)) {
                setHovering(false);
              }
            }}
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={endDrag}
            onPointerCancel={endDrag}
            onScroll={() => {
              const el = scrollerRef.current;
              if (!el || writingScroll.current) return;
              if (
                expectedScroll.current !== null &&
                Math.abs(el.scrollLeft - expectedScroll.current) <= 1
              ) {
                return;
              }
              noteUserScroll();
            }}
            onClickCapture={(event) => {
              if (!suppressClick.current) return;
              event.preventDefault();
              event.stopPropagation();
              suppressClick.current = false;
            }}
            onDragStart={(event) => event.preventDefault()}
          >
            <div className="flex w-max">
              <div ref={loopRef} className="flex gap-4 pl-4">
                {featured.map((product) => (
                  <ReelCard key={product.slug} product={product} />
                ))}
              </div>
              <div className="flex gap-4 pl-4" inert aria-hidden="true">
                {featured.map((product) => (
                  <ReelCard key={`${product.slug}-copy`} product={product} />
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </ScrollIn>
    </section>
  );
}
