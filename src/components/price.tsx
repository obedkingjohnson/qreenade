"use client";

import { useCurrency } from "@/components/currency-provider";

export function Price({ amount }: { amount: number }) {
  const { format } = useCurrency();
  return <span>{format(amount)}</span>;
}
