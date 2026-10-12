"use client";

import { useCallback, useEffect, useId, useRef, useState } from "react";
import type { DragEvent, MouseEvent, PointerEvent, TransitionEvent } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { CaretLeft, CaretRight, X } from "@phosphor-icons/react";
import type { Product } from "@/lib/catalog";

const MAIN_SIZES = "(min-width:1024px) 50vw, 100vw";
const SWIPE_PX = 48;
const LOCK_PX = 12;
const TAP_MS = 300;
const SLIDE_MS = 280;
const BLUR =
  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAgAAAAICAIAAABLbSncAAAAEUlEQVR42mN48ugOVsQwtCQA2JeogQRpkVIAAAAASUVORK5CYII=";

function wrap(index: number, count: number) {
  return ((index % count) + count) % count;
}

function isHat(src: string) {
  return src.endsWith("bucket-hat-red.jpg");
}

function slotsFor(shot: number, count: number, dragX: number) {
  if (count <= 1) return [{ index: 0, delta: 0 }];
  if (count === 2) {
    const delta = dragX > 0 ? -1 : 1;
    return [
      { index: shot, delta: 0 },
      { index: wrap(shot + delta, count), delta },
    ];
  }
  return [-1, 0, 1].map((delta) => ({
    index: wrap(shot + delta, count),
    delta,
  }));
}

type GestureOptions = {
  shot: number;
  count: number;
  enabled: boolean;
  onStep: (dir: 1 | -1) => void;
  onDoubleTap?: () => void;
  onSwipeDown?: () => void;
  keyboard?: boolean;
};

function useGalleryGesture({
  shot,
  count,
  enabled,
  onStep,
  onDoubleTap,
  onSwipeDown,
  keyboard = false,
}: GestureOptions) {
  const frameRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef<{
    pointerId: number;
    x: number;
    y: number;
    dx: number;
    dy: number;
    axis: "x" | "y" | null;
  } | null>(null);
  const lastTap = useRef(0);
  const pending = useRef<1 | -1 | 0 | null>(null);
  const timer = useRef<number | null>(null);
  const dragXRef = useRef(0);
  const onStepRef = useRef(onStep);
  const onDoubleTapRef = useRef(onDoubleTap);
  const onSwipeDownRef = useRef(onSwipeDown);
  onStepRef.current = onStep;
  onDoubleTapRef.current = onDoubleTap;
  onSwipeDownRef.current = onSwipeDown;

  const [dragX, setDragX] = useState(0);
  const [dragY, setDragY] = useState(0);
  const [sliding, setSliding] = useState(false);
  const [grabbing, setGrabbing] = useState(false);

  const clearTimer = useCallback(() => {
    if (timer.current !== null) window.clearTimeout(timer.current);
    timer.current = null;
  }, []);

  const finishSlide = useCallback(() => {
    const dir = pending.current;
    if (dir === null) return;
    pending.current = null;
    clearTimer();
    setSliding(false);
    setGrabbing(false);
    if (dir !== 0) {
      dragXRef.current = 0;
      setDragX(0);
      setDragY(0);
      onStepRef.current(dir);
    }
  }, [clearTimer]);

  const animateTo = useCallback(
    (dir: 1 | -1 | 0) => {
      const width = frameRef.current?.clientWidth ?? 0;
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (dir !== 0 && (reduce || width < 2 || count < 2)) {
        pending.current = null;
        clearTimer();
        setSliding(false);
        setGrabbing(false);
        dragXRef.current = 0;
        setDragX(0);
        setDragY(0);
        onStepRef.current(dir);
        return;
      }
      if (dir === 0 && dragXRef.current === 0) {
        setSliding(false);
        setGrabbing(false);
        setDragY(0);
        return;
      }
      pending.current = dir;
      setSliding(true);
      const nextX = dir === 0 ? 0 : dir === 1 ? -width : width;
      dragXRef.current = nextX;
      setDragX(nextX);
      setDragY(0);
      clearTimer();
      timer.current = window.setTimeout(finishSlide, SLIDE_MS + 80);
    },
    [clearTimer, count, finishSlide],
  );

  useEffect(() => clearTimer, [clearTimer]);

  const shotRef = useRef(shot);
  useEffect(() => {
    if (shotRef.current === shot) return;
    shotRef.current = shot;
    if (pending.current === null) return;
    pending.current = null;
    clearTimer();
    dragXRef.current = 0;
    setSliding(false);
    setGrabbing(false);
    setDragX(0);
    setDragY(0);
  }, [clearTimer, shot]);

  const commit = useCallback(
    (dir: 1 | -1) => {
      if (!enabled || count < 2) return;
      animateTo(dir);
    },
    [animateTo, count, enabled],
  );

  useEffect(() => {
    if (!keyboard || !enabled) return;
    function onKey(event: KeyboardEvent) {
      if (event.key === "ArrowRight") {
        event.preventDefault();
        commit(1);
      } else if (event.key === "ArrowLeft") {
        event.preventDefault();
        commit(-1);
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [commit, enabled, keyboard]);

  function onPointerDown(event: PointerEvent<HTMLDivElement>) {
    if (!enabled || sliding || pending.current !== null) return;
    if (event.pointerType === "mouse" && event.button !== 0) return;
    if (event.target instanceof Element && event.target.closest("button, a")) return;
    dragRef.current = {
      pointerId: event.pointerId,
      x: event.clientX,
      y: event.clientY,
      dx: 0,
      dy: 0,
      axis: null,
    };
  }

  function onPointerMove(event: PointerEvent<HTMLDivElement>) {
    const drag = dragRef.current;
    if (!drag || drag.pointerId !== event.pointerId || !enabled) return;
    drag.dx = event.clientX - drag.x;
    drag.dy = event.clientY - drag.y;
    if (!drag.axis) {
      if (Math.abs(drag.dx) < LOCK_PX && Math.abs(drag.dy) < LOCK_PX) return;
      drag.axis = Math.abs(drag.dx) > Math.abs(drag.dy) ? "x" : "y";
      if (drag.axis === "y" && !onSwipeDownRef.current) {
        dragRef.current = null;
        return;
      }
      if (drag.axis === "x" && count < 2) {
        dragRef.current = null;
        return;
      }
      try {
        event.currentTarget.setPointerCapture(event.pointerId);
      } catch {
        dragRef.current = null;
        return;
      }
      setGrabbing(true);
    }
    if (drag.axis === "x") {
      dragXRef.current = drag.dx;
      setDragX(drag.dx);
    } else if (onSwipeDownRef.current) {
      setDragY(Math.max(0, drag.dy));
    }
  }

  function onPointerUp(event: PointerEvent<HTMLDivElement>) {
    const drag = dragRef.current;
    if (!drag || drag.pointerId !== event.pointerId) return;
    dragRef.current = null;
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      try {
        event.currentTarget.releasePointerCapture(event.pointerId);
      } catch {
        // Pointer capture can already be gone.
      }
    }

    if (drag.axis === "x" && Math.abs(drag.dx) >= SWIPE_PX) {
      animateTo(drag.dx < 0 ? 1 : -1);
      return;
    }
    if (drag.axis === "y" && onSwipeDownRef.current && drag.dy >= SWIPE_PX) {
      setGrabbing(false);
      setDragY(0);
      dragXRef.current = 0;
      setDragX(0);
      onSwipeDownRef.current();
      return;
    }

    const tapped = drag.axis === null;
    setGrabbing(false);
    if (!tapped) {
      animateTo(0);
      return;
    }

    const now = Date.now();
    if (now - lastTap.current <= TAP_MS) {
      lastTap.current = 0;
      onDoubleTapRef.current?.();
    } else {
      lastTap.current = now;
    }
  }

  function onPointerLeave(event: PointerEvent<HTMLDivElement>) {
    const drag = dragRef.current;
    if (!drag || drag.pointerId !== event.pointerId || drag.axis) return;
    dragRef.current = null;
  }

  function onDoubleClick(event: MouseEvent<HTMLDivElement>) {
    if (!enabled) return;
    if (event.target instanceof Element && event.target.closest("button, a")) return;
    lastTap.current = 0;
    onDoubleTapRef.current?.();
  }

  function onTransitionEnd(event: TransitionEvent<HTMLDivElement>) {
    if (event.target !== event.currentTarget) return;
    if (event.propertyName !== "transform") return;
    finishSlide();
  }

  function onDragStart(event: DragEvent<HTMLDivElement>) {
    event.preventDefault();
  }

  return {
    frameRef,
    dragX,
    dragY,
    sliding,
    grabbing,
    commit,
    bind: {
      onPointerDown,
      onPointerMove,
      onPointerUp,
      onPointerCancel: onPointerUp,
      onPointerLeave,
      onDoubleClick,
      onDragStart,
    },
    onTransitionEnd,
  };
}

function ShotPicture({
  src,
  alt,
  sizes,
  preload,
  fit,
}: {
  src: string;
  alt: string;
  sizes: string;
  preload: boolean;
  fit: "cover" | "contain" | "natural";
}) {
  const shared = {
    src,
    alt,
    sizes,
    placeholder: "blur" as const,
    blurDataURL: BLUR,
    draggable: false as const,
    ...(preload ? { preload: true as const } : { loading: "eager" as const }),
  };

  if (fit === "natural") {
    return <Image {...shared} width={807} height={568} className="h-auto w-full" />;
  }

  return (
    <Image
      {...shared}
      fill
      className={fit === "contain" ? "object-contain" : "object-cover"}
    />
  );
}

function Filmstrip({
  shots,
  shot,
  name,
  sizes,
  preloadFirst,
  showImages,
  loose,
  containAll,
  enabled,
  onStep,
  onDoubleTap,
  onSwipeDown,
  keyboard,
  commitRef,
  frameClassName,
}: {
  shots: string[];
  shot: number;
  name: string;
  sizes: string;
  preloadFirst: boolean;
  showImages: boolean;
  loose: boolean;
  containAll: boolean;
  enabled: boolean;
  onStep: (dir: 1 | -1) => void;
  onDoubleTap?: () => void;
  onSwipeDown?: () => void;
  keyboard?: boolean;
  commitRef?: { current: (dir: 1 | -1) => void };
  frameClassName: string;
}) {
  const gesture = useGalleryGesture({
    shot,
    count: shots.length,
    enabled,
    onStep,
    onDoubleTap,
    onSwipeDown,
    keyboard,
  });
  if (commitRef) commitRef.current = gesture.commit;
  const slots = slotsFor(shot, shots.length, gesture.dragX);

  return (
    <div
      ref={gesture.frameRef}
      className={`${frameClassName} ${shots.length > 1 ? "cursor-grab" : ""} ${gesture.grabbing ? "cursor-grabbing" : ""}`}
      style={{ touchAction: onSwipeDown ? "none" : "pan-y" }}
      {...gesture.bind}
    >
      <div
        className={loose ? "relative w-full" : "relative h-full w-full"}
        style={{ transform: `translate3d(0, ${gesture.dragY}px, 0)` }}
      >
        {showImages
          ? slots.map((slot) => {
              const src = shots[slot.index] ?? shots[0];
              const natural = loose && slot.delta === 0 && isHat(src);
              const fit = natural ? "natural" : containAll || isHat(src) ? "contain" : "cover";
              return (
                <div
                  key={slot.index}
                  aria-hidden={slot.delta !== 0}
                  onTransitionEnd={gesture.onTransitionEnd}
                  className={natural ? "relative w-full" : "absolute inset-0"}
                  style={{
                    transform: `translate3d(calc(${slot.delta * 100}% + ${gesture.dragX}px), 0, 0)`,
                    transition: gesture.sliding ? `transform ${SLIDE_MS}ms ease-out` : "none",
                    willChange: gesture.sliding || gesture.grabbing ? "transform" : undefined,
                  }}
                >
                  <ShotPicture
                    src={src}
                    alt={slot.delta === 0 ? name : ""}
                    sizes={sizes}
                    preload={preloadFirst && slot.index === 0}
                    fit={fit}
                  />
                </div>
              );
            })
          : loose && <div className="aspect-[807/568] w-full" />}
      </div>
    </div>
  );
}

function Lightbox({
  shots,
  shot,
  name,
  onStep,
  onClose,
  returnFocus,
}: {
  shots: string[];
  shot: number;
  name: string;
  onStep: (dir: 1 | -1) => void;
  onClose: () => void;
  returnFocus: { current: HTMLElement | null };
}) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const commitRef = useRef<(dir: 1 | -1) => void>(() => {});
  const titleId = useId();
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;

  const closeFromGesture = useCallback(() => {
    const stopClick = (event: Event) => {
      event.preventDefault();
      event.stopPropagation();
      document.removeEventListener("click", stopClick, true);
    };
    document.addEventListener("click", stopClick, true);
    window.setTimeout(() => document.removeEventListener("click", stopClick, true), 400);
    onCloseRef.current();
  }, []);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    const overlay = dialog;
    const siblings = [...document.body.children].filter((node) => node !== dialog);
    for (const node of siblings) node.setAttribute("inert", "");
    const previousBody = document.body.style.overflow;
    const previousHtml = document.documentElement.style.overflow;
    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";
    closeRef.current?.focus();

    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") {
        event.preventDefault();
        onCloseRef.current();
        return;
      }
      if (event.key !== "Tab") return;
      const items = [...overlay.querySelectorAll<HTMLElement>("button, [href], input, select, textarea")].filter(
        (el) => !el.hasAttribute("disabled") && el.tabIndex >= 0 && el.getClientRects().length > 0,
      );
      if (items.length === 0) return;
      const first = items[0];
      const last = items[items.length - 1];
      const active = document.activeElement;
      if (event.shiftKey && (active === first || !overlay.contains(active))) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && (active === last || !overlay.contains(active))) {
        event.preventDefault();
        first.focus();
      }
    }

    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = previousBody;
      document.documentElement.style.overflow = previousHtml;
      for (const node of siblings) node.removeAttribute("inert");
      returnFocus.current?.focus();
    };
  }, [returnFocus]);

  const count = shots.length;

  return createPortal(
    <div
      ref={dialogRef}
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
      className="fixed inset-0 z-[80] overflow-hidden bg-[#141414] text-paper"
    >
      <h2 id={titleId} className="sr-only">
        {name} photos
      </h2>
      <button
        type="button"
        tabIndex={-1}
        aria-label="Close photo"
        className="absolute inset-0"
        onClick={() => onCloseRef.current()}
      />
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center px-4 py-16 md:px-20">
        <div className="pointer-events-auto relative h-[min(100%,86vh)] w-full max-w-[960px]">
          <Filmstrip
            shots={shots}
            shot={shot}
            name={name}
            sizes="100vw"
            preloadFirst={false}
            showImages
            loose={false}
            containAll
            enabled
            onStep={onStep}
            onSwipeDown={closeFromGesture}
            keyboard
            commitRef={commitRef}
            frameClassName="h-full w-full overflow-hidden select-none"
          />
        </div>
      </div>
      <p className="pointer-events-none absolute top-4 left-4 text-sm text-paper/80">
        {shot + 1} / {count}
      </p>
      <button
        ref={closeRef}
        type="button"
        onClick={() => onCloseRef.current()}
        className="absolute top-3 right-3 grid size-11 place-items-center rounded-full bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-paper"
        aria-label="Close gallery"
      >
        <X size={18} />
      </button>
      {count > 1 && (
        <>
          <button
            type="button"
            aria-label="Previous photo"
            onClick={() => commitRef.current(-1)}
            className="absolute top-1/2 left-3 hidden size-11 -translate-y-1/2 place-items-center rounded-full bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-paper md:grid"
          >
            <CaretLeft size={18} />
          </button>
          <button
            type="button"
            aria-label="Next photo"
            onClick={() => commitRef.current(1)}
            className="absolute top-1/2 right-3 hidden size-11 -translate-y-1/2 place-items-center rounded-full bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-paper md:grid"
          >
            <CaretRight size={18} />
          </button>
        </>
      )}
    </div>,
    document.body,
  );
}

export function ProductGallery({ product }: { product: Product }) {
  const shots = product.gallery?.length ? product.gallery : [product.image];
  const [shot, setShot] = useState(0);
  const [open, setOpen] = useState(false);
  const zoomRef = useRef<HTMLButtonElement>(null);
  const returnFocus = useRef<HTMLElement | null>(null);
  const count = shots.length;
  const selected = shots[shot] ?? shots[0];
  const hat = isHat(selected);

  const step = useCallback(
    (dir: 1 | -1) => {
      setShot((current) => wrap(current + dir, count));
    },
    [count],
  );

  function openLightbox() {
    const active = document.activeElement;
    returnFocus.current =
      active instanceof HTMLElement && active !== document.body ? active : zoomRef.current;
    setOpen(true);
  }

  return (
    <div className="min-w-0 overflow-x-clip">
      <div className="relative">
        <Filmstrip
          shots={shots}
          shot={shot}
          name={product.name}
          sizes={MAIN_SIZES}
          preloadFirst
          showImages={!open}
          loose={hat}
          containAll={false}
          enabled={!open}
          onStep={step}
          onDoubleTap={openLightbox}
          frameClassName={`w-full overflow-hidden bg-surface select-none ${hat ? "" : "aspect-[4/5]"}`}
        />
        <button
          ref={zoomRef}
          type="button"
          onClick={openLightbox}
          aria-haspopup="dialog"
          aria-expanded={open}
          className="absolute right-3 bottom-3 z-10 inline-flex h-9 items-center rounded-full border border-line bg-paper px-3 text-xs"
        >
          View larger
        </button>
      </div>
      {count > 1 && (
        <div className="mt-3 flex max-w-full gap-2 overflow-x-auto overscroll-x-contain">
          {shots.map((src, index) => (
            <button
              key={`${src}-${index}`}
              type="button"
              aria-label={`Photo ${index + 1} of ${product.name}`}
              aria-pressed={shot === index}
              onClick={() => setShot(index)}
              className={`shrink-0 overflow-hidden border ${shot === index ? "border-ink" : "border-transparent"}`}
            >
              <Image
                src={src}
                alt={`${product.name}, photo ${index + 1}`}
                width={96}
                height={120}
                sizes="64px"
                className={`h-20 w-16 bg-surface ${isHat(src) ? "object-contain" : "object-cover"}`}
              />
            </button>
          ))}
        </div>
      )}
      <p className="sr-only" aria-live="polite">
        Photo {shot + 1} of {count}
      </p>
      {open && (
        <Lightbox
          shots={shots}
          shot={shot}
          name={product.name}
          onStep={step}
          onClose={() => setOpen(false)}
          returnFocus={returnFocus}
        />
      )}
    </div>
  );
}
