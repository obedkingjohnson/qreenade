"use client";

import { useEffect, useRef, useState, type PointerEvent as ReactPointerEvent } from "react";

const FOV = (42 * Math.PI) / 180;
const CAMERA_Z = 8.4;
const CAMERA_Y = 0.15;
const DUST_COUNT = 640;
const RING_STEPS = 96;
const MAX_PIXELS = 1_600_000;

type Progress = { current: number };

type Drag = {
  active: boolean;
  yaw: number;
  pitch: number;
  lastX: number;
  lastY: number;
  pointerId: number;
};

function makeDust() {
  const dust = new Float32Array(DUST_COUNT * 3);
  for (let index = 0; index < DUST_COUNT; index += 1) {
    const phi = Math.acos(-1 + (2 * index) / DUST_COUNT);
    const theta = Math.sqrt(DUST_COUNT * Math.PI) * phi;
    const radius = 4.4 + Math.sin(index * 12.9898) * 0.55;
    dust[index * 3] = radius * Math.cos(theta) * Math.sin(phi);
    dust[index * 3 + 1] = radius * Math.cos(phi);
    dust[index * 3 + 2] = radius * Math.sin(theta) * Math.sin(phi);
  }
  return dust;
}

function makeRing(radius: number, rx: number, ry: number) {
  const points = new Float32Array(RING_STEPS * 3);
  const cx = Math.cos(rx);
  const sx = Math.sin(rx);
  const cy = Math.cos(ry);
  const sy = Math.sin(ry);
  for (let index = 0; index < RING_STEPS; index += 1) {
    const angle = (index / RING_STEPS) * Math.PI * 2;
    const x = radius * Math.cos(angle);
    const y = radius * Math.sin(angle);
    const y1 = y * cx;
    const z1 = y * sx;
    points[index * 3] = x * cy + z1 * sy;
    points[index * 3 + 1] = y1;
    points[index * 3 + 2] = -x * sy + z1 * cy;
  }
  return points;
}

function rotate(x: number, y: number, z: number, rx: number, ry: number) {
  const cx = Math.cos(rx);
  const sx = Math.sin(rx);
  const y1 = y * cx - z * sx;
  const z1 = y * sx + z * cx;
  const cy = Math.cos(ry);
  const sy = Math.sin(ry);
  return {
    x: x * cy + z1 * sy,
    y: y1,
    z: -x * sy + z1 * cy,
  };
}

function smoothstep(edge0: number, edge1: number, value: number) {
  const amount = Math.min(1, Math.max(0, (value - edge0) / (edge1 - edge0)));
  return amount * amount * (3 - 2 * amount);
}

export default function ProductOrbitScene({ progress }: { progress: Progress }) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const dragRef = useRef<Drag>({
    active: false,
    yaw: 0,
    pitch: 0,
    lastX: 0,
    lastY: 0,
    pointerId: -1,
  });
  const [grabbing, setGrabbing] = useState(false);

  useEffect(() => {
    const wrap = wrapRef.current;
    const canvas = canvasRef.current;
    if (!wrap || !canvas) return;
    const context = canvas.getContext("2d", { alpha: true });
    if (!context) return;

    const dust = makeDust();
    const rings = [
      { points: makeRing(2.35, Math.PI / 2.4, 0), width: 0.012, alpha: 0.45 },
      { points: makeRing(3.15, Math.PI / 2, 0.4), width: 0.006, alpha: 0.22 },
    ];
    const logo = new Image();
    logo.decoding = "async";
    logo.src = "/brand/logo-white.png";

    let frame = 0;
    let visible = false;
    let pageHidden = document.hidden;
    let last = performance.now();
    let spin = 0;
    let width = 1;
    let height = 1;
    let dpr = 1;
    const far: { x: number; y: number; size: number }[] = [];
    const near: { x: number; y: number; size: number }[] = [];

    const resize = () => {
      const rect = wrap.getBoundingClientRect();
      width = Math.max(1, rect.width);
      height = Math.max(1, rect.height);
      dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      if (width * height * dpr * dpr > MAX_PIXELS) {
        dpr = Math.max(1, Math.sqrt(MAX_PIXELS / (width * height)));
      }
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
    };

    const paint = (now: number) => {
      const delta = Math.min(0.05, (now - last) / 1000);
      last = now;
      const drag = dragRef.current;
      if (!drag.active) spin += delta * 0.18;
      const amount = progress.current ?? 0;
      const arrive = smoothstep(0.02, 0.45, amount);
      const leave = smoothstep(0.78, 1, amount);
      const scale = 0.38 + arrive * (1 - leave * 0.28) * 0.62;
      const scrollX = (0.5 - amount) * 0.75 + drag.pitch;
      const scrollY = amount * Math.PI * 1.8 + drag.yaw;
      const fieldX = drag.active ? 0 : Math.sin(now * 0.00015) * 0.08;

      context.setTransform(dpr, 0, 0, dpr, 0, 0);
      context.clearRect(0, 0, width, height);

      const focal = height / 2 / Math.tan(FOV / 2);
      const project = (x: number, y: number, z: number) => {
        const placed = rotate(x, y, z, scrollX, scrollY);
        const dz = CAMERA_Z - placed.z * scale;
        if (dz < 0.4) return null;
        return {
          x: width / 2 + ((placed.x * scale * focal) / dz),
          y: height / 2 - (((placed.y * scale - CAMERA_Y) * focal) / dz),
          dz,
          depth: placed.z,
        };
      };

      far.length = 0;
      near.length = 0;
      for (let index = 0; index < DUST_COUNT; index += 1) {
        const spun = rotate(
          dust[index * 3],
          dust[index * 3 + 1],
          dust[index * 3 + 2],
          fieldX,
          spin,
        );
        const point = project(spun.x, spun.y, spun.z);
        if (!point) continue;
        const size = Math.max(0.8, (0.03 * focal) / point.dz);
        const bucket = point.depth > 0.2 ? near : far;
        bucket.push({ x: point.x, y: point.y, size });
      }

      context.fillStyle = "#f4f4f0";
      const drawDust = (points: { x: number; y: number; size: number }[]) => {
        for (const point of points) {
          context.fillRect(point.x, point.y, point.size, point.size);
        }
      };
      drawDust(far);

      for (const ring of rings) {
        context.beginPath();
        let started = false;
        for (let index = 0; index <= RING_STEPS; index += 1) {
          const source = (index % RING_STEPS) * 3;
          const spun = rotate(
            ring.points[source],
            ring.points[source + 1],
            ring.points[source + 2],
            fieldX,
            spin,
          );
          const point = project(spun.x, spun.y, spun.z);
          if (!point) {
            started = false;
            continue;
          }
          if (!started) {
            context.moveTo(point.x, point.y);
            started = true;
          } else {
            context.lineTo(point.x, point.y);
          }
        }
        context.strokeStyle = `rgba(244, 244, 240, ${ring.alpha})`;
        context.lineWidth = Math.max(0.6, (ring.width * focal) / CAMERA_Z);
        context.stroke();
      }

      drawDust(near);

      if (logo.complete && logo.naturalWidth > 0) {
        const time = now / 1000;
        const bob = Math.sin(time * 0.85) * 0.16;
        const logoRx = Math.sin(time * 0.32) * 0.08;
        const logoRy = Math.sin(time * 0.55) * 0.7;
        const place = (x: number, y: number, z: number) => {
          const turned = rotate(x, y, z, logoRx, logoRy);
          return project(turned.x, turned.y + bob, turned.z);
        };
        const center = place(0, 0, 0);
        const rightPoint = place(1.575, 0, 0);
        const topPoint = place(0, 0.265, 0);
        if (center && rightPoint && topPoint) {
          const rx = rightPoint.x - center.x;
          const ry = rightPoint.y - center.y;
          const ux = topPoint.x - center.x;
          const uy = topPoint.y - center.y;
          if (Math.hypot(rx, ry) > 2) {
            context.save();
            context.transform(
              (2 * rx) / logo.naturalWidth,
              (2 * ry) / logo.naturalWidth,
              (-2 * ux) / logo.naturalHeight,
              (-2 * uy) / logo.naturalHeight,
              center.x - rx + ux,
              center.y - ry + uy,
            );
            context.drawImage(logo, 0, 0);
            context.restore();
          }
        }
      }
    };

    const loop = (now: number) => {
      if (!visible || pageHidden) {
        frame = 0;
        return;
      }
      paint(now);
      frame = requestAnimationFrame(loop);
    };

    const start = () => {
      if (frame) return;
      last = performance.now();
      frame = requestAnimationFrame(loop);
    };
    const stop = () => {
      if (!frame) return;
      cancelAnimationFrame(frame);
      frame = 0;
    };
    const sync = () => {
      if (visible && !pageHidden) start();
      else stop();
    };

    const observer = new IntersectionObserver(([entry]) => {
      visible = entry?.isIntersecting ?? false;
      sync();
    });
    observer.observe(wrap);
    const onVisibility = () => {
      pageHidden = document.hidden;
      sync();
    };
    document.addEventListener("visibilitychange", onVisibility);
    const resizeObserver = new ResizeObserver(() => {
      resize();
      if (visible && !pageHidden) paint(performance.now());
    });
    resizeObserver.observe(wrap);
    resize();
    sync();

    return () => {
      stop();
      observer.disconnect();
      resizeObserver.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [progress]);

  function onPointerDown(event: ReactPointerEvent<HTMLDivElement>) {
    if (event.pointerType === "mouse" && event.button !== 0) return;
    const drag = dragRef.current;
    drag.pointerId = event.pointerId;
    drag.lastX = event.clientX;
    drag.lastY = event.clientY;
    drag.active = event.pointerType !== "touch";
    if (drag.active) {
      event.currentTarget.setPointerCapture(event.pointerId);
      setGrabbing(true);
    }
  }

  function onPointerMove(event: ReactPointerEvent<HTMLDivElement>) {
    const drag = dragRef.current;
    if (drag.pointerId !== event.pointerId) return;
    const dx = event.clientX - drag.lastX;
    const dy = event.clientY - drag.lastY;
    if (!drag.active) {
      if (Math.hypot(dx, dy) < 10) return;
      if (Math.abs(dy) > Math.abs(dx)) {
        drag.pointerId = -1;
        return;
      }
      drag.active = true;
      event.currentTarget.setPointerCapture(event.pointerId);
      setGrabbing(true);
    }
    drag.lastX = event.clientX;
    drag.lastY = event.clientY;
    drag.yaw -= dx * 0.0045;
    if (event.pointerType !== "touch") drag.pitch -= dy * 0.0035;
  }

  function onPointerUp(event: ReactPointerEvent<HTMLDivElement>) {
    const drag = dragRef.current;
    if (drag.pointerId !== event.pointerId) return;
    drag.pointerId = -1;
    drag.active = false;
    setGrabbing(false);
  }

  return (
    <div
      ref={wrapRef}
      className={`h-full w-full touch-pan-y select-none ${grabbing ? "cursor-grabbing" : "cursor-grab"}`}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
    >
      <canvas ref={canvasRef} className="block h-full w-full" aria-hidden />
    </div>
  );
}
