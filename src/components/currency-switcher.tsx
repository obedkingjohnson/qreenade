"use client";

import { useEffect, useId, useRef, useState } from "react";
import { CaretDown } from "@phosphor-icons/react";
import { useCurrency } from "@/components/currency-provider";
import { DISPLAY_CURRENCIES, type DisplayCurrency } from "@/lib/currency";
import { cn } from "@/lib/cn";

export function CurrencySwitcher({ id }: { id?: string }) {
  const { currency, setCurrency } = useCurrency();
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const rootRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const listId = useId();

  useEffect(() => {
    if (!open) return;

    function onPointerDown(event: PointerEvent) {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    }

    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, [open]);

  function openList() {
    const index = DISPLAY_CURRENCIES.indexOf(currency);
    setActive(index < 0 ? 0 : index);
    setOpen(true);
  }

  function choose(next: DisplayCurrency) {
    setCurrency(next);
    setOpen(false);
    buttonRef.current?.focus();
  }

  function onButtonKeyDown(event: React.KeyboardEvent<HTMLButtonElement>) {
    if (event.key === "Escape") {
      if (!open) return;
      event.preventDefault();
      setOpen(false);
      return;
    }

    if (event.key === "Tab") {
      if (open) setOpen(false);
      return;
    }

    if (
      !open &&
      (event.key === "ArrowDown" || event.key === "ArrowUp" || event.key === "Enter" || event.key === " ")
    ) {
      event.preventDefault();
      openList();
      return;
    }

    if (!open) return;

    const last = DISPLAY_CURRENCIES.length - 1;
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setActive((current) => (current >= last ? 0 : current + 1));
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setActive((current) => (current <= 0 ? last : current - 1));
    } else if (event.key === "Home") {
      event.preventDefault();
      setActive(0);
    } else if (event.key === "End") {
      event.preventDefault();
      setActive(last);
    } else if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      const next = DISPLAY_CURRENCIES[active];
      if (next) choose(next);
    }
  }

  const activeCode = DISPLAY_CURRENCIES[active] ?? currency;

  return (
    <div ref={rootRef} className="relative shrink-0">
      <button
        ref={buttonRef}
        id={id}
        type="button"
        aria-label={`Display currency, ${currency}`}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listId}
        onClick={() => {
          if (open) setOpen(false);
          else openList();
        }}
        onKeyDown={onButtonKeyDown}
        className="inline-flex h-10 items-center gap-2 rounded-full border border-line bg-paper px-3 text-sm text-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"
      >
        <span>{currency}</span>
        <CaretDown size={14} aria-hidden />
      </button>
      {open && (
        <ul
          id={listId}
          role="listbox"
          aria-label="Display currency"
          aria-activedescendant={`${listId}-${activeCode}`}
          className="absolute top-[calc(100%+6px)] left-0 z-50 min-w-full overflow-hidden rounded-2xl border border-line bg-paper py-1 shadow-[0_16px_40px_rgba(20,20,20,0.08)]"
        >
          {DISPLAY_CURRENCIES.map((code, index) => (
            <li key={code} role="presentation">
              <button
                id={`${listId}-${code}`}
                type="button"
                role="option"
                tabIndex={-1}
                aria-selected={code === currency}
                onMouseEnter={() => setActive(index)}
                onClick={() => choose(code)}
                className={cn(
                  "flex w-full items-center px-3 py-2 text-left text-sm whitespace-nowrap",
                  index === active && "bg-surface",
                )}
              >
                {code}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
