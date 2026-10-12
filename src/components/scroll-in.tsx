"use client";

import { useEffect, useRef, useState } from "react";
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

function useDesktopParallax() {
  const reduce = useReducedMotion();
  const [desktop, setDesktop] = useState(false);

  useEffect(() => {
    const media = window.matchMedia("(min-width: 768px)");
    const onChange = () => setDesktop(media.matches);
    onChange();
    media.addEventListener("change", onChange);
    return () => media.removeEventListener("change", onChange);
  }, []);

  return desktop && reduce === false;
}

export function ScrollPhoto({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const parallax = useDesktopParallax();
  if (!parallax) {
    return (
      <div className={cn("overflow-hidden", className)}>
        <div className="size-full md:origin-center md:scale-125 md:transition-transform md:duration-700 md:group-hover:scale-[1.32] motion-reduce:transition-none motion-reduce:md:scale-100">
          {children}
        </div>
      </div>
    );
  }
  return <ScrollPhotoMotion className={className}>{children}</ScrollPhotoMotion>;
}

function ScrollPhotoMotion({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], ["12%", "-12%"]);

  return (
    <div ref={ref} className={cn("overflow-hidden", className)}>
      <motion.div className="size-full" style={{ y }}>
        <div className="size-full origin-center scale-125 transition-transform duration-700 group-hover:scale-[1.32] motion-reduce:transition-none motion-reduce:scale-100">
          {children}
        </div>
      </motion.div>
    </div>
  );
}
