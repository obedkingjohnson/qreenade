"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="mx-auto max-w-[1400px] px-4 py-24 md:px-6">
      <h1 className="text-4xl tracking-tight">Something went wrong.</h1>
      <p className="mt-4 text-mute">
        Please try again, or head back to the store.
      </p>
      <div className="mt-8 flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={() => reset()}
          className="inline-flex h-11 items-center rounded-full bg-ink px-5 text-sm text-paper"
        >
          Try again
        </button>
        <Link
          href="/shop"
          className="inline-flex h-11 items-center rounded-full bg-ink px-5 text-sm text-paper"
        >
          Browse the store
        </Link>
      </div>
    </div>
  );
}
