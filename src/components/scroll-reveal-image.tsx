"use client";

import Image from "next/image";
import { useRef } from "react";
import {
  motion,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "motion/react";

type ScrollRevealImageProps = {
  src: string;
  alt: string;
  height?: string;
  fromWidth?: string;
  toWidth?: string;
  fromScale?: number;
  toScale?: number;
};

function sideInset(width: string) {
  const value = Number.parseFloat(width);
  if (!Number.isFinite(value)) return 0;
  return Math.max(0, (100 - value) / 2);
}

export function ScrollRevealImage({
  src,
  alt,
  height = "70vh",
  fromWidth = "42%",
  toWidth = "100%",
  fromScale = 1.45,
  toScale = 1,
}: ScrollRevealImageProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "center center"],
  });

  const inset = useSpring(
    useTransform(scrollYProgress, [0, 1], [sideInset(fromWidth), sideInset(toWidth)]),
    { stiffness: 120, damping: 80 },
  );
  const clipPath = useTransform(inset, (value) => `inset(0% ${value}% 0% ${value}%)`);
  const scale = useSpring(
    useTransform(scrollYProgress, [0, 1], [fromScale, toScale]),
    { stiffness: 120, damping: 80 },
  );

  if (reduce) {
    return (
      <div className="relative w-full overflow-hidden" style={{ height }}>
        <Image src={src} alt={alt} fill sizes="100vw" className="object-cover" />
      </div>
    );
  }

  return (
    <div ref={containerRef} className="relative w-full overflow-hidden" style={{ height }}>
      <motion.div className="absolute inset-0" style={{ clipPath }}>
        <motion.div className="absolute inset-0" style={{ scale }}>
          <Image src={src} alt={alt} fill sizes="100vw" className="object-cover" />
        </motion.div>
      </motion.div>
    </div>
  );
}
