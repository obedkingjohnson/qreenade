"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { CategorySlug } from "@/lib/catalog";
import { sizesFor } from "@/lib/catalog";
import { useCart } from "@/components/cart-provider";
import { cn } from "@/lib/cn";

export function AddToBag({
  slug,
  category,
}: {
  slug: string;
  category: CategorySlug;
}) {
  const sizes = sizesFor(category);
  const [size, setSize] = useState<string>(sizes[0]);
  const [added, setAdded] = useState(false);
  const { add } = useCart();
  const router = useRouter();

  return (
    <form
      className="mt-8"
      onSubmit={(event) => {
        event.preventDefault();
        add(slug, size);
        setAdded(true);
        router.refresh();
      }}
    >
      <fieldset>
        <legend className="text-sm">Size</legend>
        <div className="mt-3 flex flex-wrap gap-2">
          {sizes.map((option) => (
            <button
              key={option}
              type="button"
              aria-pressed={size === option}
              onClick={() => {
                setSize(option);
                setAdded(false);
              }}
              className={cn(
                "h-10 min-w-10 rounded-full border px-3 text-sm active:scale-[0.98]",
                size === option
                  ? "border-ink bg-ink text-paper"
                  : "border-line bg-surface text-ink",
              )}
            >
              {option}
            </button>
          ))}
        </div>
      </fieldset>
      <button
        type="submit"
        className="mt-6 flex h-12 w-full items-center justify-center rounded-full bg-ink text-sm text-paper active:scale-[0.98] md:w-auto md:px-10"
      >
        {added ? "Added to bag" : "Add to bag"}
      </button>
      {added && (
        <p className="mt-3 text-sm text-mute" role="status">
          Added in size {size}.
        </p>
      )}
    </form>
  );
}
