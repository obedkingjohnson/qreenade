"use client";

import { Component, useEffect, useState, type ReactNode } from "react";
import dynamic from "next/dynamic";
import Image from "next/image";

const LOGO_SRC = "/brand/logo-white.png";

function StaticLogo({ decorative = false }: { decorative?: boolean }) {
  return (
    <div className="flex h-[78vh] min-h-[32rem] items-center justify-center">
      <Image
        src={LOGO_SRC}
        alt={decorative ? "" : "qreenade by Amuta"}
        aria-hidden={decorative || undefined}
        width={1024}
        height={173}
        className="h-auto w-[min(78vw,44rem)]"
      />
    </div>
  );
}

const LogoParticlesCanvas = dynamic(() => import("@/components/logo-particles-canvas"), {
  ssr: false,
  loading: () => <StaticLogo decorative />,
});

class LogoBoundary extends Component<
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

export function LogoParticles() {
  const [allowMotion, setAllowMotion] = useState(false);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setAllowMotion(!media.matches);
    sync();
    media.addEventListener("change", sync);
    return () => media.removeEventListener("change", sync);
  }, []);

  return (
    <section
      className="overflow-hidden border-t border-line bg-[#141414] text-white"
      aria-label={allowMotion ? "qreenade by Amuta" : undefined}
    >
      {allowMotion ? (
        <LogoBoundary fallback={<StaticLogo />}>
          <LogoParticlesCanvas />
        </LogoBoundary>
      ) : (
        <StaticLogo />
      )}
    </section>
  );
}
