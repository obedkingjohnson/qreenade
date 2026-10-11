"use client";

import { useCallback, useEffect, useId, useRef, useState } from "react";
import { X } from "@phosphor-icons/react";

const MAX_EDGE = 1600;
const TARGET_BYTES = Math.floor(2.5 * 1024 * 1024);
const MIN_EDGE = 15;

type Phase = "edit" | "loading" | "result";

export function AiTryOn({ slug, name }: { slug: string; name: string }) {
  const titleId = useId();
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const libraryRef = useRef<HTMLInputElement>(null);
  const cameraRef = useRef<HTMLInputElement>(null);
  const abortRef = useRef<AbortController | null>(null);
  const generationRef = useRef(0);

  const [open, setOpen] = useState(false);
  const [phase, setPhase] = useState<Phase>("edit");
  const [photo, setPhoto] = useState<string | null>(null);
  const [consent, setConsent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [images, setImages] = useState<string[]>([]);

  const reset = useCallback(() => {
    generationRef.current += 1;
    abortRef.current?.abort();
    abortRef.current = null;
    setPhase("edit");
    setPhoto(null);
    setConsent(false);
    setError(null);
    setImages([]);
  }, []);

  const close = useCallback(() => {
    reset();
    setOpen(false);
  }, [reset]);

  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeButtonRef.current?.focus();

    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") close();
    }

    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener("keydown", onKey);
    };
  }, [open, close]);

  async function onFile(file: File | undefined) {
    if (!file) return;
    setError(null);
    setImages([]);
    setPhase("edit");
    setConsent(false);
    try {
      const dataUri = await preparePhoto(file);
      setPhoto(dataUri);
    } catch (caught) {
      setPhoto(null);
      setError(caught instanceof Error ? caught.message : "Use a JPEG or PNG photo.");
    }
  }

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!photo || !consent || phase === "loading") return;

    const generation = generationRef.current + 1;
    generationRef.current = generation;
    const controller = new AbortController();
    abortRef.current?.abort();
    abortRef.current = controller;
    setPhase("loading");
    setError(null);
    setImages([]);

    try {
      const response = await fetch("/api/tryon", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug, modelImage: photo, consent: true }),
        signal: controller.signal,
      });
      const payload: unknown = await response.json().catch(() => null);
      if (generation !== generationRef.current) return;
      if (!response.ok) {
        throw new Error(errorText(payload));
      }
      const next = readImages(payload);
      if (next.length === 0) throw new Error("Try-on did not return an image.");
      setImages(next);
      setPhase("result");
    } catch (caught) {
      if (generation !== generationRef.current || isAbort(caught)) return;
      setPhase("edit");
      setError(caught instanceof Error ? caught.message : "Try-on could not be completed. Please try again.");
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="absolute bottom-4 left-4 inline-flex h-11 items-center rounded-full bg-white px-4 text-sm text-[#141414] active:scale-[0.98]"
      >
        Try it on
      </button>

      {open && (
        <div className="fixed inset-0 z-50">
          <button
            type="button"
            aria-label="Close try-on"
            className="absolute inset-0 bg-[#141414]/40"
            onClick={close}
          />
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            className="absolute inset-x-0 bottom-0 flex max-h-[min(100%,760px)] flex-col bg-paper md:inset-x-auto md:top-1/2 md:bottom-auto md:left-1/2 md:w-full md:max-w-lg md:-translate-x-1/2 md:-translate-y-1/2"
          >
            <div className="flex h-16 shrink-0 items-center justify-between border-b border-line px-5">
              <h2 id={titleId} className="text-base font-medium">
                Try it on
              </h2>
              <button
                ref={closeButtonRef}
                type="button"
                onClick={close}
                className="grid size-10 place-items-center rounded-full hover:bg-surface"
                aria-label="Close try-on"
              >
                <X size={18} />
              </button>
            </div>

            <div className="overflow-y-auto px-5 py-5">
              <p className="text-sm text-mute">{name}</p>
              <p className="mt-2 text-sm leading-relaxed text-mute">
                Use a full-body photo with a plain background, good light, and one person.
              </p>

              {phase === "result" ? (
                <Result
                  name={name}
                  images={images}
                  onAgain={() => {
                    reset();
                  }}
                />
              ) : (
                <form className="mt-5" onSubmit={onSubmit}>
                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      disabled={phase === "loading"}
                      onClick={() => libraryRef.current?.click()}
                      className="inline-flex h-11 items-center rounded-full border border-line bg-surface px-4 text-sm disabled:opacity-40"
                    >
                      Upload a photo
                    </button>
                    <button
                      type="button"
                      disabled={phase === "loading"}
                      onClick={() => cameraRef.current?.click()}
                      className="inline-flex h-11 items-center rounded-full border border-line bg-surface px-4 text-sm disabled:opacity-40"
                    >
                      Use camera
                    </button>
                  </div>
                  <input
                    ref={libraryRef}
                    type="file"
                    accept="image/jpeg,image/png,image/webp,image/*"
                    className="sr-only"
                    onChange={(event) => {
                      const file = event.target.files?.[0];
                      event.target.value = "";
                      void onFile(file);
                    }}
                  />
                  <input
                    ref={cameraRef}
                    type="file"
                    accept="image/jpeg,image/png,image/webp,image/*"
                    capture="environment"
                    className="sr-only"
                    onChange={(event) => {
                      const file = event.target.files?.[0];
                      event.target.value = "";
                      void onFile(file);
                    }}
                  />

                  {photo && (
                    // Data URIs stay in the browser. The image optimizer must not receive them.
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={photo}
                      alt="Your photo, ready for try-on"
                      className="mt-4 max-h-72 w-full bg-surface object-contain"
                    />
                  )}

                  <label className="mt-5 flex items-start gap-3 text-sm leading-relaxed">
                    <input
                      type="checkbox"
                      checked={consent}
                      required
                      disabled={phase === "loading"}
                      onChange={(event) => setConsent(event.target.checked)}
                      className="mt-1 size-4 shrink-0 accent-ink"
                    />
                    <span>
                      I am 18 or older. This photo is of me. It is sent to a third-party AI provider
                      (FASHN) to generate a try-on image. It is not stored by us beyond generating the
                      result. The result is an AI visualisation, not a guarantee of fit.
                    </span>
                  </label>

                  {phase === "loading" ? (
                    <p className="mt-5 text-sm leading-relaxed" role="status">
                      Generating your try-on. This usually takes about 25 seconds.
                    </p>
                  ) : (
                    <button
                      type="submit"
                      disabled={!photo || !consent}
                      className="mt-5 flex h-12 w-full items-center justify-center rounded-full bg-ink text-sm text-paper disabled:opacity-30"
                    >
                      Generate try-on
                    </button>
                  )}

                  {error && (
                    <p className="mt-3 text-sm leading-relaxed text-mute" role="alert">
                      {error}
                    </p>
                  )}
                </form>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function Result({
  name,
  images,
  onAgain,
}: {
  name: string;
  images: string[];
  onAgain: () => void;
}) {
  return (
    <div className="mt-5">
      <ul className="flex flex-col gap-4">
        {images.map((src, index) => (
          <li key={`${index}-${src.slice(0, 48)}`}>
            {/* Data URIs stay in the browser. The image optimizer must not receive them. */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={src}
              alt={`AI try-on of ${name}`}
              className="max-h-[28rem] w-full bg-surface object-contain"
            />
            <button
              type="button"
              onClick={() => downloadImage(src, index)}
              className="mt-3 inline-flex h-11 items-center rounded-full bg-ink px-5 text-sm text-paper active:scale-[0.98]"
            >
              {images.length > 1 ? `Download ${index + 1}` : "Download"}
            </button>
          </li>
        ))}
      </ul>
      <p className="mt-4 text-sm leading-relaxed text-mute">
        AI-generated visualisation, not a guarantee of fit.
      </p>
      <button
        type="button"
        onClick={onAgain}
        className="mt-4 inline-flex h-11 items-center rounded-full border border-line px-5 text-sm"
      >
        Try another photo
      </button>
    </div>
  );
}

function errorText(payload: unknown) {
  if (payload && typeof payload === "object" && "error" in payload) {
    const error = (payload as { error?: unknown }).error;
    if (typeof error === "string" && error.trim()) return error;
  }
  return "Try-on could not be completed. Please try again.";
}

function readImages(payload: unknown) {
  if (!payload || typeof payload !== "object" || !("images" in payload)) return [];
  const images = (payload as { images?: unknown }).images;
  if (!Array.isArray(images)) return [];
  return images.filter((item): item is string => typeof item === "string" && isImageDataUri(item));
}

function isImageDataUri(value: string) {
  const header = /^data:image\/(jpeg|jpg|png|webp);base64,/.exec(value.slice(0, 40));
  if (!header) return false;
  const data = value.slice(header[0].length);
  return data.length > 32 && data.length % 4 === 0 && /^[A-Za-z0-9+/]+={0,2}$/.test(data);
}

function isAbort(error: unknown) {
  return error instanceof Error && error.name === "AbortError";
}

function downloadImage(dataUri: string, index: number) {
  const header = /^data:(image\/(?:jpeg|jpg|png|webp));base64,/.exec(dataUri.slice(0, 40));
  if (!header) return;
  const mime = header[1] === "image/jpg" ? "image/jpeg" : header[1];
  const data = dataUri.slice(header[0].length);
  const binary = atob(data);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i += 1) bytes[i] = binary.charCodeAt(i);
  const url = URL.createObjectURL(new Blob([bytes], { type: mime }));
  const extension = mime === "image/png" ? "png" : mime === "image/webp" ? "webp" : "jpg";
  const link = document.createElement("a");
  link.href = url;
  link.download = index === 0 ? `qreenade-try-on.${extension}` : `qreenade-try-on-${index + 1}.${extension}`;
  link.click();
  URL.revokeObjectURL(url);
}

async function preparePhoto(file: File): Promise<string> {
  if (file.size > 30 * 1024 * 1024) {
    throw new Error("That photo is too large.");
  }

  let bitmap: ImageBitmap;
  try {
    bitmap = await createImageBitmap(file, { imageOrientation: "from-image" });
  } catch {
    throw new Error("Use a JPEG or PNG photo.");
  }

  try {
    if (bitmap.width < MIN_EDGE || bitmap.height < MIN_EDGE) {
      throw new Error("That photo is too small.");
    }
    const ratio = bitmap.width / bitmap.height;
    if (ratio < 1 / 16 || ratio > 16) {
      throw new Error("That photo is too wide or too tall.");
    }

    let edge = MAX_EDGE;
    let quality = 0.82;
    let dataUri = "";
    for (let attempt = 0; attempt < 4; attempt += 1) {
      dataUri = await renderJpeg(bitmap, edge, quality);
      if (decodedBytes(dataUri) <= TARGET_BYTES) return dataUri;
      edge = Math.max(MIN_EDGE, Math.round(edge * 0.75));
      quality = Math.max(0.6, quality - 0.08);
    }

    if (decodedBytes(dataUri) > 3 * 1024 * 1024) {
      throw new Error("That photo is too large. Try a smaller image.");
    }
    return dataUri;
  } finally {
    bitmap.close();
  }
}

function renderJpeg(bitmap: ImageBitmap, maxEdge: number, quality: number): Promise<string> {
  const scale = Math.min(1, maxEdge / Math.max(bitmap.width, bitmap.height));
  const width = Math.max(1, Math.round(bitmap.width * scale));
  const height = Math.max(1, Math.round(bitmap.height * scale));
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const context = canvas.getContext("2d");
  if (!context) return Promise.reject(new Error("Use a JPEG or PNG photo."));
  context.drawImage(bitmap, 0, 0, width, height);

  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (!blob) {
          reject(new Error("Use a JPEG or PNG photo."));
          return;
        }
        const reader = new FileReader();
        reader.onload = () => {
          if (typeof reader.result === "string") resolve(reader.result);
          else reject(new Error("Use a JPEG or PNG photo."));
        };
        reader.onerror = () => reject(new Error("Use a JPEG or PNG photo."));
        reader.readAsDataURL(blob);
      },
      "image/jpeg",
      quality,
    );
  });
}

function decodedBytes(dataUri: string) {
  const comma = dataUri.indexOf(",");
  if (comma < 0) return Number.POSITIVE_INFINITY;
  const data = dataUri.slice(comma + 1);
  const padding = data.endsWith("==") ? 2 : data.endsWith("=") ? 1 : 0;
  return Math.floor((data.length * 3) / 4) - padding;
}
