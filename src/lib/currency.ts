import { formatMoney } from "@/lib/format";

export const DISPLAY_CURRENCIES = ["GBP", "USD", "EUR", "AED", "NGN"] as const;

export type DisplayCurrency = (typeof DISPLAY_CURRENCIES)[number];

export const CURRENCY_COOKIE = "qreenade-currency";

export type FxRates = {
  base: "NGN";
  updatedAt: string;
  source: string;
  rates: Partial<Record<DisplayCurrency, number>>;
};

const displayCurrencySet = new Set<string>(DISPLAY_CURRENCIES);

export function isDisplayCurrency(value: string): value is DisplayCurrency {
  return displayCurrencySet.has(value);
}

// Countries that use the euro. Bulgaria joined the euro area in 2026.
const euroCountries = new Set([
  "AD",
  "AT",
  "BE",
  "BG",
  "BL",
  "CY",
  "DE",
  "EE",
  "ES",
  "FI",
  "FR",
  "GF",
  "GP",
  "GR",
  "HR",
  "IE",
  "IT",
  "LT",
  "LU",
  "LV",
  "MC",
  "ME",
  "MF",
  "MQ",
  "MT",
  "NL",
  "PM",
  "PT",
  "RE",
  "SI",
  "SK",
  "SM",
  "VA",
  "XK",
  "YT",
]);

export function currencyForCountry(country: string | null | undefined): DisplayCurrency {
  const code = country?.trim().toUpperCase() ?? "";
  if (code === "NG") return "NGN";
  if (code === "GB" || code === "UK") return "GBP";
  if (code === "US") return "USD";
  if (code === "AE") return "AED";
  if (euroCountries.has(code)) return "EUR";
  return "GBP";
}

export function regionFromAcceptLanguage(header: string | null | undefined): string | null {
  if (!header) return null;
  for (const part of header.split(",")) {
    const tag = part.split(";")[0]?.trim();
    if (!tag) continue;
    const region = tag.split("-").at(-1)?.toUpperCase();
    if (region && /^[A-Z]{2}$/.test(region) && region !== tag.toUpperCase()) {
      return region;
    }
  }
  return null;
}

export function resolveCurrency(input: {
  cookie?: string | null;
  country?: string | null;
  acceptLanguage?: string | null;
}): DisplayCurrency {
  const cookie = input.cookie?.trim().toUpperCase() ?? "";
  if (isDisplayCurrency(cookie)) return cookie;
  const country = input.country?.trim();
  if (country) return currencyForCountry(country);
  const region = regionFromAcceptLanguage(input.acceptLanguage);
  if (region) return currencyForCountry(region);
  return "GBP";
}

export function formatFromNgn(
  amountNgn: number,
  currency: DisplayCurrency,
  rates: FxRates,
): string {
  if (currency === "NGN") return formatMoney(amountNgn, "NGN");
  const rate = rates.rates[currency];
  if (typeof rate !== "number" || !Number.isFinite(rate) || rate <= 0) {
    return formatMoney(amountNgn, "NGN");
  }
  const converted = Math.round((amountNgn * rate + Number.EPSILON) * 100) / 100;
  return formatMoney(converted, currency);
}
