"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
import type { Product } from "@/lib/catalog";
import {
  accessories,
  bodies,
  defaultLook,
  faces,
  hairColors,
  hairStyles,
  makeups,
  skinTones,
  tryOnSteps,
  type TryOnLook,
} from "@/components/try-on-look";

const TryOnScene = dynamic(() => import("@/components/try-on-scene"), {
  ssr: false,
});

function textureSrc(src: string) {
  return `/_next/image?url=${encodeURIComponent(src)}&w=1080&q=75`;
}

function Choice({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex h-10 items-center rounded-full px-4 text-sm ${
        active ? "bg-ink text-paper" : "bg-surface text-ink"
      }`}
    >
      {children}
    </button>
  );
}

function Swatch({
  color,
  label,
  active,
  onClick,
}: {
  color: string;
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      aria-pressed={active}
      onClick={onClick}
      className={`size-9 rounded-full border ${active ? "border-ink ring-2 ring-ink ring-offset-2 ring-offset-paper" : "border-line"}`}
      style={{ background: color }}
    />
  );
}

export function TryOn({ product }: { product: Product }) {
  const shots = product.gallery?.length ? product.gallery : [product.image];
  const [shot, setShot] = useState(0);
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(0);
  const [look, setLook] = useState<TryOnLook>(defaultLook);
  const current = tryOnSteps[step];

  function close() {
    setOpen(false);
    setStep(0);
  }

  function patch(next: Partial<TryOnLook>) {
    setLook((value) => ({ ...value, ...next }));
  }

  if (!open) {
    return (
      <div>
        <div className="relative overflow-hidden bg-surface">
          <Image
            src={shots[shot]}
            alt={product.name}
            width={1200}
            height={1500}
            priority={shot === 0}
            className={
              shots[shot].endsWith("bucket-hat-red.jpg")
                ? "h-auto w-full"
                : "aspect-[4/5] w-full object-cover"
            }
          />
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="absolute bottom-4 left-4 inline-flex h-11 items-center rounded-full bg-white px-4 text-sm text-[#141414] active:scale-[0.98]"
          >
            Try in 3D
          </button>
        </div>
        {shots.length > 1 && (
          <div className="mt-3 flex gap-2 overflow-x-auto">
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
                  alt=""
                  width={96}
                  height={120}
                  className={`h-20 w-16 bg-surface ${src.endsWith("bucket-hat-red.jpg") ? "object-contain" : "object-cover"}`}
                />
              </button>
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="overflow-hidden bg-paper">
      <div className="relative aspect-[4/5] w-full bg-[#141414]">
        <TryOnScene image={textureSrc(product.image)} category={product.category} look={look} />
        <button
          type="button"
          onClick={close}
          className="absolute top-4 right-4 inline-flex h-11 items-center rounded-full bg-white px-4 text-sm text-[#141414] active:scale-[0.98]"
        >
          Exit 3D
        </button>
        <p className="pointer-events-none absolute bottom-4 left-4 text-sm text-white/80">
          Drag to turn
        </p>
      </div>
      <div className="border-t border-line px-4 py-4">
        <div className="flex items-baseline justify-between gap-3">
          <p className="text-sm text-mute">
            {step + 1} of {tryOnSteps.length} · {current.label}
          </p>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setStep((value) => Math.max(0, value - 1))}
              disabled={step === 0}
              className="inline-flex h-9 items-center rounded-full px-3 text-sm text-ink disabled:text-mute"
            >
              Back
            </button>
            <button
              type="button"
              onClick={() => setStep((value) => Math.min(tryOnSteps.length - 1, value + 1))}
              disabled={step === tryOnSteps.length - 1}
              className="inline-flex h-9 items-center rounded-full bg-ink px-4 text-sm text-paper disabled:opacity-30"
            >
              Next
            </button>
          </div>
        </div>
        <div className="mt-3 flex gap-2 overflow-x-auto">
          {tryOnSteps.map((item, index) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setStep(index)}
              className={`shrink-0 text-sm ${index === step ? "text-ink" : "text-mute"}`}
            >
              {item.label}
            </button>
          ))}
        </div>
        <div className="mt-4 flex flex-wrap items-center gap-2">
          {current.id === "body" &&
            bodies.map((item) => (
              <Choice key={item.id} active={look.body === item.id} onClick={() => patch({ body: item.id })}>
                {item.label}
              </Choice>
            ))}
          {current.id === "height" && (
            <label className="flex w-full items-center gap-4 text-sm">
              <input
                type="range"
                min={150}
                max={190}
                value={look.height}
                onChange={(event) => patch({ height: Number(event.target.value) })}
                className="h-1 flex-1 accent-ink"
              />
              <span className="w-16 text-right">{look.height} cm</span>
            </label>
          )}
          {current.id === "skin" &&
            skinTones.map((item) => (
              <Swatch
                key={item.id}
                color={item.color}
                label={item.label}
                active={look.skin === item.color}
                onClick={() => patch({ skin: item.color })}
              />
            ))}
          {current.id === "hair" && (
            <>
              {hairStyles.map((item) => (
                <Choice key={item.id} active={look.hair === item.id} onClick={() => patch({ hair: item.id })}>
                  {item.label}
                </Choice>
              ))}
              <span className="mx-1 h-6 w-px bg-line" />
              {hairColors.map((item) => (
                <Swatch
                  key={item.id}
                  color={item.color}
                  label={item.label}
                  active={look.hairColor === item.color}
                  onClick={() => patch({ hairColor: item.color })}
                />
              ))}
            </>
          )}
          {current.id === "face" &&
            faces.map((item) => (
              <Choice key={item.id} active={look.face === item.id} onClick={() => patch({ face: item.id })}>
                {item.label}
              </Choice>
            ))}
          {current.id === "makeup" &&
            makeups.map((item) => (
              <Choice key={item.id} active={look.makeup === item.id} onClick={() => patch({ makeup: item.id })}>
                {item.label}
              </Choice>
            ))}
          {current.id === "extras" &&
            accessories.map((item) => (
              <Choice
                key={item.id}
                active={look.accessory === item.id}
                onClick={() => patch({ accessory: item.id })}
              >
                {item.label}
              </Choice>
            ))}
        </div>
      </div>
    </div>
  );
}
