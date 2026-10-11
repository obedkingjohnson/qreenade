"use client";

import { DISPLAY_CURRENCIES, isDisplayCurrency } from "@/lib/currency";
import { useCurrency } from "@/components/currency-provider";

export function CurrencySwitcher({ id }: { id?: string }) {
  const { currency, setCurrency } = useCurrency();

  return (
    <select
      id={id}
      aria-label="Display currency"
      value={currency}
      onChange={(event) => {
        const next = event.target.value;
        if (isDisplayCurrency(next)) setCurrency(next);
      }}
      className="h-10 rounded-full border border-line bg-paper px-3 text-sm text-ink"
    >
      {DISPLAY_CURRENCIES.map((code) => (
        <option key={code} value={code}>
          {code}
        </option>
      ))}
    </select>
  );
}
