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

  const width = useSpring(
    useTransform(scrollYProgress, [0, 1], [fromWidth, toWidth]),
    { stiffness: 120, damping: 80 },
  );
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
    <motion.div
      ref={containerRef}
      className="relative mx-auto overflow-hidden"
      style={{ width, height }}
    >
      <motion.div
        className="absolute top-0 left-1/2 h-full w-full"
        style={{ x: "-50%", scale }}
      >
        <Image src={src} alt={alt} fill sizes="100vw" className="object-cover" />
      </motion.div>
    </motion.div>
  );
}
