"use client";

import { useEffect } from "react";
import "./globals.css";

export default function GlobalError({
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
    <html lang="en">
      <body className="bg-paper text-ink antialiased">
        <title>Something went wrong</title>
        <div className="mx-auto max-w-[1400px] px-4 py-24 md:px-6">
          <h1 className="text-4xl tracking-tight">Something went wrong.</h1>
          <p className="mt-4 text-mute">Please try again.</p>
          <button
            type="button"
            onClick={() => reset()}
            className="mt-8 inline-flex h-11 items-center rounded-full bg-ink px-5 text-sm text-paper"
          >
            Try again
          </button>
        </div>
      </body>
    </html>
  );
}
