"use client";

import { Component, useEffect, useRef, useState, type ReactNode } from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
import { motion, useScroll, useTransform } from "motion/react";

const ProductOrbitScene = dynamic(() => import("@/components/product-orbit-scene"), {
  ssr: false,
  loading: () => <OrbitHold />,
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

function Wordmark({ alt }: { alt: string }) {
  return (
    <Image
      src="/brand/logo-white.png"
      alt={alt}
      width={640}
      height={108}
      sizes="(min-width: 768px) 448px, 70vw"
      className="h-auto w-[min(70vw,28rem)]"
    />
  );
}

function OrbitHold() {
  return (
    <div className="flex h-full items-center justify-center px-6">
      <Wordmark alt="" />
    </div>
  );
}

function StillMark() {
  return (
    <div className="flex h-[28rem] items-center justify-center px-6">
      <Wordmark alt="qreenade by Amuta" />
    </div>
  );
}

export function ProductOrbit() {
  const section = useRef<HTMLElement>(null);
  const progress = useRef(0);
  const [reduce, setReduce] = useState(false);
  const { scrollYProgress } = useScroll({
    target: section,
    offset: ["start end", "end start"],
  });
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.82, 1], [0, 1, 1, 0.4]);
  const y = useTransform(scrollYProgress, [0, 0.38], [120, 0]);

  useEffect(() => {
    progress.current = scrollYProgress.get();
    return scrollYProgress.on("change", (value) => {
      progress.current = value;
    });
  }, [scrollYProgress]);

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const apply = () => setReduce(query.matches);
    apply();
    query.addEventListener("change", apply);
    return () => query.removeEventListener("change", apply);
  }, []);

  return (
    <section
      ref={section}
      aria-label="qreenade by Amuta"
      className="overflow-hidden border-t border-line bg-[#141414] text-white"
    >
      {reduce ? (
        <StillMark />
      ) : (
        <OrbitBoundary fallback={<div className="h-[78vh] min-h-[32rem]"><StillMark /></div>}>
          <motion.div className="h-[78vh] min-h-[32rem]" style={{ opacity, y }}>
            <ProductOrbitScene progress={progress} />
          </motion.div>
        </OrbitBoundary>
      )}
    </section>
  );
}
