import type { DisplayCurrency, FxRates } from "@/lib/currency";

export const FX_REVALIDATE_SECONDS = 86400;

type FxSource = {
  id: string;
  url: string;
  parse: (payload: unknown) => FxRates;
};

const needed: DisplayCurrency[] = ["NGN", "GBP", "USD", "EUR", "AED"];

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function readRate(rates: Record<string, unknown>, key: string) {
  const value = rates[key];
  if (typeof value !== "number" || !Number.isFinite(value) || value <= 0) {
    throw new Error(`Missing ${key} rate`);
  }
  return value;
}

function ratesFromTable(table: Record<string, unknown>, keyFor: (code: DisplayCurrency) => string) {
  return Object.fromEntries(
    needed.map((code) => [code, readRate(table, keyFor(code))]),
  ) as FxRates["rates"];
}

// Daily naira-base table from the fawazahmed0 currency API (Cloudflare).
// Replace `activeSource` to point this module at another provider.
const currencyApi: FxSource = {
  id: "currency-api.pages.dev",
  url: "https://latest.currency-api.pages.dev/v1/currencies/ngn.json",
  parse(payload) {
    if (!isRecord(payload) || !isRecord(payload.ngn)) {
      throw new Error("Unexpected FX payload");
    }
    return {
      base: "NGN",
      updatedAt: typeof payload.date === "string" ? payload.date : "",
      source: currencyApi.id,
      rates: ratesFromTable(payload.ngn, (code) => code.toLowerCase()),
    };
  },
};

const openErApi: FxSource = {
  id: "open.er-api.com",
  url: "https://open.er-api.com/v6/latest/NGN",
  parse(payload) {
    if (!isRecord(payload) || payload.result !== "success" || payload.base_code !== "NGN") {
      throw new Error("Unexpected FX payload");
    }
    if (!isRecord(payload.rates)) throw new Error("Unexpected FX rates");
    return {
      base: "NGN",
      updatedAt: typeof payload.time_last_update_utc === "string" ? payload.time_last_update_utc : "",
      source: openErApi.id,
      rates: ratesFromTable(payload.rates, (code) => code),
    };
  },
};

const activeSource: FxSource = currencyApi;
const sources: FxSource[] = [activeSource, openErApi];

async function loadSource(source: FxSource): Promise<FxRates> {
  const response = await fetch(source.url, {
    next: { revalidate: FX_REVALIDATE_SECONDS },
  });
  if (!response.ok) throw new Error(`FX source responded ${response.status}`);
  return source.parse(await response.json());
}

export async function getFxRates(): Promise<FxRates> {
  for (const source of sources) {
    try {
      return await loadSource(source);
    } catch {
      // Try the next source. A miss must not be shown as a converted price.
    }
  }
  return {
    base: "NGN",
    updatedAt: "",
    source: "unavailable",
    rates: { NGN: 1 },
  };
}
