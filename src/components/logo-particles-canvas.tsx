"use client";

import { useEffect, useRef, useState } from "react";

const LOGO_SRC = "/brand/logo-white.png";
const MAX_DPR = 2;
const DESKTOP_CAP = 3000;
const MOBILE_CAP = 1100;
const MIN_STRIDE = 1.75;
const ALPHA_MIN = 40;
const LOGO_WIDTH_RATIO = 0.78;
const LOGO_MAX_PX = 704;

type Particle = {
  hx: number;
  hy: number;
  x: number;
  y: number;
  size: number;
  alpha: number;
  ease: number;
};

function unit(n: number) {
  const value = Math.sin(n * 127.1 + 311.7) * 43758.5453123;
  return value - Math.floor(value);
}

function pixelRatio() {
  return Math.min(Math.max(window.devicePixelRatio || 1, 1), MAX_DPR);
}

function particleCap() {
  return window.matchMedia("(max-width: 767px)").matches ? MOBILE_CAP : DESKTOP_CAP;
}

function sampleLogo(
  image: HTMLImageElement,
  logoWidth: number,
  logoHeight: number,
  originX: number,
  originY: number,
  cap: number,
  scatter: boolean,
) {
  const width = Math.max(1, Math.round(logoWidth));
  const height = Math.max(1, Math.round(logoHeight));
  const offscreen = document.createElement("canvas");
  offscreen.width = width;
  offscreen.height = height;
  const offscreenContext = offscreen.getContext("2d", { willReadFrequently: true });
  if (!offscreenContext) return [];
  offscreenContext.drawImage(image, 0, 0, width, height);
  const pixels = offscreenContext.getImageData(0, 0, width, height).data;

  const collect = (stride: number) => {
    const found: Particle[] = [];
    let index = 0;
    for (let y0 = 0; y0 < height; y0 += stride) {
      const yStart = Math.floor(y0);
      const yStop = Math.min(height, Math.floor(y0 + stride));
      if (yStop <= yStart) continue;
      for (let x0 = 0; x0 < width; x0 += stride) {
        const xStart = Math.floor(x0);
        const xStop = Math.min(width, Math.floor(x0 + stride));
        if (xStop <= xStart) continue;
        let sumA = 0;
        let sumX = 0;
        let sumY = 0;
        let maxA = 0;
        for (let y = yStart; y < yStop; y += 1) {
          const row = y * width;
          for (let x = xStart; x < xStop; x += 1) {
            const alpha = pixels[(row + x) * 4 + 3];
            if (alpha < ALPHA_MIN) continue;
            sumA += alpha;
            sumX += (x + 0.5) * alpha;
            sumY += (y + 0.5) * alpha;
            if (alpha > maxA) maxA = alpha;
          }
        }
        if (sumA < ALPHA_MIN) continue;
        const hx = originX + sumX / sumA;
        const hy = originY + sumY / sumA;
        const n = index + 1;
        let x = hx;
        let y = hy;
        if (scatter) {
          const angle = unit(n * 2.3) * Math.PI * 2;
          const dist = 20 + Math.pow(unit(n * 4.1), 0.75) * 128;
          x = hx + Math.cos(angle) * dist;
          y = hy + Math.sin(angle) * dist;
        }
        found.push({
          hx,
          hy,
          x,
          y,
          size: 1 + unit(n * 1.7) * 0.5,
          alpha: 0.58 + (maxA / 255) * 0.34,
          ease: 0.84 + unit(n * 5.9) * 0.32,
        });
        index += 1;
      }
    }
    return found;
  };

  const atMin = collect(MIN_STRIDE);
  if (atMin.length <= cap) return atMin;

  let low = MIN_STRIDE;
  let high = 12;
  let best = collect(high);
  if (best.length > cap) {
    const step = best.length / cap;
    const thinned: Particle[] = [];
    for (let index = 0; index < cap; index += 1) {
      thinned.push(best[Math.floor(index * step)]);
    }
    return thinned;
  }

  for (let attempt = 0; attempt < 8; attempt += 1) {
    const mid = (low + high) / 2;
    const found = collect(mid);
    if (found.length > cap) low = mid;
    else {
      best = found;
      high = mid;
    }
  }
  return best;
}

export default function LogoParticlesCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const stillRef = useRef<HTMLImageElement>(null);
  const markRef = useRef<HTMLDivElement>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    const still = stillRef.current;
    const mark = markRef.current;
    const context = canvas?.getContext("2d");
    if (!canvas || !still || !mark || !context) return;

    const hoverCapable = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    let introPending = !hoverCapable;
    let introMs = introPending ? 1700 : 0;
    let particles: Particle[] = [];
    let cssWidth = 0;
    let cssHeight = 0;
    let logoWidth = LOGO_MAX_PX;
    let builtWidth = 0;
    let builtHeight = 0;
    let builtCap = 0;
    let onScreen = false;
    let pageVisible = !document.hidden;
    let running = false;
    let raf = 0;
    let last = 0;
    let revealed = false;
    let resizeTimer = 0;
    let cancelled = false;
    const pointer = { x: 0, y: 0, vx: 0, vy: 0, active: false, seen: false };

    const draw = () => {
      context.setTransform(pixelRatio(), 0, 0, pixelRatio(), 0, 0);
      context.clearRect(0, 0, cssWidth, cssHeight);
      context.fillStyle = "#f4f4f0";
      for (const particle of particles) {
        context.globalAlpha = particle.alpha;
        context.fillRect(
          particle.x - particle.size * 0.5,
          particle.y - particle.size * 0.5,
          particle.size,
          particle.size,
        );
      }
      context.globalAlpha = 1;
    };

    const step = (dt: number, now: number) => {
      const radius = Math.max(68, Math.min(112, logoWidth * 0.15));
      const radiusSq = radius * radius;
      if (pointer.active) {
        for (const particle of particles) {
          let dx = particle.x - pointer.x;
          let dy = particle.y - pointer.y;
          const distSq = dx * dx + dy * dy;
          if (distSq >= radiusSq) continue;
          const dist = Math.sqrt(distSq) || 0.001;
          const falloff = 1 - dist / radius;
          const push = falloff * falloff * 3.4 * dt;
          if (dist < 0.001) {
            dx = 0;
            dy = -1;
          }
          particle.x += (dx / dist) * push;
          particle.y += (dy / dist) * push;
          particle.x += pointer.vx * falloff * 0.45;
          particle.y += pointer.vy * falloff * 0.45;
        }
        pointer.vx = 0;
        pointer.vy = 0;
      }

      if (introMs > 0) {
        introMs -= dt * 16.6667;
        if (introMs <= 0) introPending = false;
      }

      const glide = 1 - Math.pow(0.958, dt);
      for (const particle of particles) {
        const ox = Math.sin(now * 0.00045 + particle.hy * 0.02) * 0.35;
        const oy = Math.cos(now * 0.00038 + particle.hx * 0.016) * 0.28;
        const mix = glide * particle.ease;
        particle.x += (particle.hx + ox - particle.x) * mix;
        particle.y += (particle.hy + oy - particle.y) * mix;
      }
    };

    const layout = () => {
      if (cancelled || !still.naturalWidth) return;
      const rect = canvas.getBoundingClientRect();
      if (rect.width < 2 || rect.height < 2) return;
      const dpr = pixelRatio();
      const nextWidth = Math.round(rect.width * dpr);
      const nextHeight = Math.round(rect.height * dpr);
      const cap = particleCap();
      const sameFrame =
        particles.length > 0 &&
        Math.abs(rect.width - builtWidth) < 1 &&
        Math.abs(rect.height - builtHeight) < 1 &&
        cap === builtCap &&
        canvas.width === nextWidth &&
        canvas.height === nextHeight;
      if (sameFrame) {
        reveal();
        sync();
        return;
      }
      if (canvas.width !== nextWidth || canvas.height !== nextHeight) {
        canvas.width = nextWidth;
        canvas.height = nextHeight;
      }
      cssWidth = rect.width;
      cssHeight = rect.height;
      const stillRect = still.getBoundingClientRect();
      const aspect = still.naturalHeight / still.naturalWidth;
      logoWidth = stillRect.width > 2 ? stillRect.width : Math.min(rect.width * LOGO_WIDTH_RATIO, LOGO_MAX_PX);
      const logoHeight = stillRect.height > 2 ? stillRect.height : logoWidth * aspect;
      const originX = stillRect.width > 2 ? stillRect.left - rect.left : (rect.width - logoWidth) / 2;
      const originY = stillRect.height > 2 ? stillRect.top - rect.top : (rect.height - logoHeight) / 2;
      builtWidth = rect.width;
      builtHeight = rect.height;
      builtCap = cap;
      particles = sampleLogo(still, logoWidth, logoHeight, originX, originY, cap, introPending);
      draw();
      reveal();
      sync();
    };

    const reveal = () => {
      if (!onScreen || revealed || particles.length === 0) return;
      revealed = true;
      setReady(true);
    };

    const tick = (now: number) => {
      if (!running) return;
      raf = requestAnimationFrame(tick);
      const dt = last ? Math.min(2.2, (now - last) / 16.6667) : 1;
      last = now;
      step(dt, now);
      draw();
    };

    const startLoop = () => {
      if (running) return;
      running = true;
      last = 0;
      raf = requestAnimationFrame(tick);
    };

    const stopLoop = () => {
      running = false;
      cancelAnimationFrame(raf);
    };

    const sync = () => {
      if (onScreen && pageVisible && particles.length > 0) startLoop();
      else stopLoop();
    };

    const placePointer = (event: PointerEvent, active: boolean) => {
      const rect = canvas.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      if (pointer.seen) {
        pointer.vx += x - pointer.x;
        pointer.vy += y - pointer.y;
      }
      pointer.seen = true;
      pointer.x = x;
      pointer.y = y;
      pointer.active = active;
    };

    const onPointerMove = (event: PointerEvent) => {
      if (event.pointerType === "touch" && event.buttons === 0) return;
      placePointer(event, true);
    };
    const onPointerDown = (event: PointerEvent) => {
      if (canvas.setPointerCapture) canvas.setPointerCapture(event.pointerId);
      placePointer(event, true);
    };
    const onPointerUp = (event: PointerEvent) => {
      if (event.pointerType !== "mouse") pointer.active = false;
    };
    const onPointerLeave = () => {
      pointer.active = false;
    };

    const onResize = () => {
      window.clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(layout, 60);
    };

    const onVisibility = () => {
      pageVisible = !document.hidden;
      sync();
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        onScreen = entry.isIntersecting;
        reveal();
        sync();
      },
      { threshold: 0.35 },
    );
    observer.observe(mark);

    let dprMedia = window.matchMedia(`(resolution: ${window.devicePixelRatio}dppx)`);
    const onDpr = () => {
      dprMedia.removeEventListener("change", onDpr);
      layout();
      dprMedia = window.matchMedia(`(resolution: ${window.devicePixelRatio}dppx)`);
      dprMedia.addEventListener("change", onDpr);
    };
    dprMedia.addEventListener("change", onDpr);

    const resizeObserver = new ResizeObserver(onResize);
    resizeObserver.observe(canvas);
    canvas.addEventListener("pointermove", onPointerMove);
    canvas.addEventListener("pointerdown", onPointerDown);
    canvas.addEventListener("pointerup", onPointerUp);
    canvas.addEventListener("pointercancel", onPointerLeave);
    canvas.addEventListener("pointerleave", onPointerLeave);
    document.addEventListener("visibilitychange", onVisibility);

    const onLoad = () => layout();
    if (still.complete && still.naturalWidth > 0) layout();
    else still.addEventListener("load", onLoad);

    return () => {
      cancelled = true;
      stopLoop();
      window.clearTimeout(resizeTimer);
      observer.disconnect();
      resizeObserver.disconnect();
      dprMedia.removeEventListener("change", onDpr);
      canvas.removeEventListener("pointermove", onPointerMove);
      canvas.removeEventListener("pointerdown", onPointerDown);
      canvas.removeEventListener("pointerup", onPointerUp);
      canvas.removeEventListener("pointercancel", onPointerLeave);
      canvas.removeEventListener("pointerleave", onPointerLeave);
      document.removeEventListener("visibilitychange", onVisibility);
      still.removeEventListener("load", onLoad);
    };
  }, []);

  return (
    <div className="relative h-[78vh] min-h-[32rem]">
      <canvas
        ref={canvasRef}
        aria-hidden="true"
        className={`absolute inset-0 h-full w-full touch-pan-y transition-opacity duration-700 ease-out ${
          ready ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      />
      {/* Same element is sampled onto the canvas, so the dust matches this still. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <div
        ref={markRef}
        className="pointer-events-none absolute top-1/2 left-1/2 h-28 w-[min(78vw,44rem)] -translate-x-1/2 -translate-y-1/2"
      />
      <img
        ref={stillRef}
        src={LOGO_SRC}
        alt=""
        aria-hidden="true"
        width={1024}
        height={173}
        className={`pointer-events-none absolute top-1/2 left-1/2 h-auto w-[min(78vw,44rem)] -translate-x-1/2 -translate-y-1/2 transition-opacity duration-700 ease-out ${
          ready ? "opacity-0" : "opacity-100"
        }`}
      />
    </div>
  );
}
