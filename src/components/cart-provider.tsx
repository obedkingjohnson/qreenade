"use client";

import { createContext, useContext, useMemo, useSyncExternalStore } from "react";
import { getProduct } from "@/lib/catalog";

export type BagLine = {
  slug: string;
  size: string;
  qty: number;
};

type CartContextValue = {
  lines: BagLine[];
  hydrated: boolean;
  count: number;
  subtotal: number;
  add: (slug: string, size: string) => void;
  setQty: (slug: string, size: string, qty: number) => void;
  remove: (slug: string, size: string) => void;
};

const CartContext = createContext<CartContextValue | null>(null);
const STORAGE_KEY = "qreenade-bag";
const EMPTY: BagLine[] = [];

let clientLines: BagLine[] | null = null;
const listeners = new Set<() => void>();

function readStorage(): BagLine[] {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as BagLine[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function getSnapshot() {
  if (clientLines === null) clientLines = readStorage();
  return clientLines;
}

function getServerSnapshot() {
  return EMPTY;
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function commit(next: BagLine[]) {
  clientLines = next;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  listeners.forEach((listener) => listener());
}

function subscribeHydration() {
  return () => {};
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const lines = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const hydrated = useSyncExternalStore(
    subscribeHydration,
    () => true,
    () => false,
  );
  const visibleLines = hydrated ? lines : EMPTY;

  const value = useMemo<CartContextValue>(() => {
    const count = visibleLines.reduce((sum, line) => sum + line.qty, 0);
    // Subtotal stays in naira. Converted figures are display only.
    const subtotal = visibleLines.reduce((sum, line) => {
      const product = getProduct(line.slug);
      return sum + (product ? product.price * line.qty : 0);
    }, 0);

    return {
      lines: visibleLines,
      hydrated,
      count,
      subtotal,
      add: (slug, size) => {
        const current = getSnapshot();
        const existing = current.find(
          (line) => line.slug === slug && line.size === size,
        );
        commit(
          existing
            ? current.map((line) =>
                line.slug === slug && line.size === size
                  ? { ...line, qty: line.qty + 1 }
                  : line,
              )
            : [...current, { slug, size, qty: 1 }],
        );
      },
      setQty: (slug, size, qty) => {
        const current = getSnapshot();
        commit(
          qty < 1
            ? current.filter(
                (line) => !(line.slug === slug && line.size === size),
              )
            : current.map((line) =>
                line.slug === slug && line.size === size
                  ? { ...line, qty }
                  : line,
              ),
        );
      },
      remove: (slug, size) => {
        commit(
          getSnapshot().filter(
            (line) => !(line.slug === slug && line.size === size),
          ),
        );
      },
    };
  }, [visibleLines, hydrated]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within CartProvider");
  return context;
}
