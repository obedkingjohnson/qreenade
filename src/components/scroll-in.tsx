"use client";

import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { cn } from "@/lib/cn";

export function ScrollIn({
  children,
  index = 0,
  className,
}: {
  children: React.ReactNode;
  index?: number;
  className?: string;
}) {
  const reduce = useReducedMotion();

  return (
    <motion.div
      className={className}
      initial={reduce ? false : { opacity: 0, y: 128 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -8% 0px" }}
      transition={{
        duration: 0.9,
        delay: reduce ? 0 : (index % 4) * 0.12,
        ease: [0.16, 1, 0.3, 1],
      }}
    >
      {children}
    </motion.div>
  );
}

export function ScrollPhoto({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], ["12%", "-12%"]);

  return (
    <div ref={ref} className={cn("overflow-hidden", className)}>
      <motion.div className="size-full" style={reduce ? undefined : { y }}>
        <div className="size-full origin-center scale-125 transition-transform duration-700 group-hover:scale-[1.32] motion-reduce:transition-none motion-reduce:group-hover:scale-100">
          {children}
        </div>
      </motion.div>
    </div>
  );
}
