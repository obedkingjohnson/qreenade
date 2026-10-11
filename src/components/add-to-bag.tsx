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
  children,
}: {
  slug: string;
  category: CategorySlug;
  children?: React.ReactNode;
}) {
  const sizes = sizesFor(category);
  const [size, setSize] = useState<string>(sizes[0]);
  const [added, setAdded] = useState(false);
  const { add } = useCart();
  const router = useRouter();

  const formId = `add-to-bag-${slug}`;

  return (
    <div className="mt-8">
      <form
        id={formId}
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
      </form>
      <div className="mt-6 flex flex-wrap items-center gap-3">
        <button
          type="submit"
          form={formId}
          className="inline-flex h-12 items-center justify-center rounded-full bg-ink px-8 text-sm text-paper active:scale-[0.98]"
        >
          {added ? "Added to bag" : "Add to bag"}
        </button>
        {children}
      </div>
      {added && (
        <p className="mt-3 text-sm text-mute" role="status">
          Added in size {size}.
        </p>
      )}
    </div>
  );
}
