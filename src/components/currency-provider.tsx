"use client";

import { createContext, useContext, useMemo, useState } from "react";
import {
  CURRENCY_COOKIE,
  formatFromNgn,
  type DisplayCurrency,
  type FxRates,
} from "@/lib/currency";

type CurrencyContextValue = {
  currency: DisplayCurrency;
  rates: FxRates;
  setCurrency: (currency: DisplayCurrency) => void;
  format: (amountNgn: number) => string;
};

const CurrencyContext = createContext<CurrencyContextValue | null>(null);
const YEAR_SECONDS = 60 * 60 * 24 * 365;

export function CurrencyProvider({
  initialCurrency,
  rates,
  children,
}: {
  initialCurrency: DisplayCurrency;
  rates: FxRates;
  children: React.ReactNode;
}) {
  const [currency, setCurrencyState] = useState(initialCurrency);

  const value = useMemo<CurrencyContextValue>(
    () => ({
      currency,
      rates,
      setCurrency: (next) => {
        setCurrencyState(next);
        document.cookie = `${CURRENCY_COOKIE}=${next}; Path=/; Max-Age=${YEAR_SECONDS}; SameSite=Lax`;
      },
      format: (amountNgn) => formatFromNgn(amountNgn, currency, rates),
    }),
    [currency, rates],
  );

  return <CurrencyContext.Provider value={value}>{children}</CurrencyContext.Provider>;
}

export function useCurrency() {
  const context = useContext(CurrencyContext);
  if (!context) throw new Error("useCurrency must be used within CurrencyProvider");
  return context;
}
