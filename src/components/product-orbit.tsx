"use client";

import { Component, useEffect, useRef, type ReactNode, type RefObject } from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
import { motion, useMotionValueEvent, useReducedMotion, useScroll, useTransform } from "motion/react";

const ProductOrbitScene = dynamic(() => import("@/components/product-orbit-scene"), {
  ssr: false,
});

class OrbitBoundary extends Component<
  { children: ReactNode; fallback: ReactNode },
  { failed: boolean }
> {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  render() {
    return this.state.failed ? this.props.fallback : this.props.children;
  }
}

function StillMark() {
  return (
    <div className="flex h-[28rem] items-center justify-center px-6">
      <Image
        src="/brand/logo-white.png"
        alt="qreenade by Amuta"
        width={640}
        height={108}
        className="h-auto w-[min(70vw,28rem)]"
      />
    </div>
  );
}

export function ProductOrbit() {
  const reduce = useReducedMotion();
  const section = useRef<HTMLElement>(null);
  const progress = useRef(0);
  const { scrollYProgress } = useScroll({
    target: section,
    offset: ["start end", "end start"],
  });

  useMotionValueEvent(scrollYProgress, "change", (value) => {
    progress.current = value;
  });

  useEffect(() => {
    progress.current = scrollYProgress.get();
  }, [scrollYProgress]);

  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.82, 1], [0, 1, 1, 0.4]);
  const y = useTransform(scrollYProgress, [0, 0.38], [120, 0]);

  return (
    <section ref={section} className="overflow-hidden border-t border-line bg-[#141414] text-white">
      {reduce ? (
        <StillMark />
      ) : (
        <OrbitBoundary fallback={<StillMark />}>
          <motion.div className="h-[78vh] min-h-[32rem]" style={{ opacity, y }}>
            <ProductOrbitScene progress={progress as RefObject<number>} />
          </motion.div>
        </OrbitBoundary>
      )}
    </section>
  );
}
