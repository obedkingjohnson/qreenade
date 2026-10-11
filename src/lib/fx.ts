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

function readRate(rates: Record<string, unknown>, code: DisplayCurrency) {
  const value = rates[code];
  if (typeof value !== "number" || !Number.isFinite(value) || value <= 0) {
    throw new Error(`Missing ${code} rate`);
  }
  return value;
}

// open.er-api.com publishes a free daily table with naira as the base.
// Replace `activeSource` to point this module at another provider.
const openErApi: FxSource = {
  id: "open.er-api.com",
  url: "https://open.er-api.com/v6/latest/NGN",
  parse(payload) {
    if (!isRecord(payload) || payload.result !== "success" || payload.base_code !== "NGN") {
      throw new Error("Unexpected FX payload");
    }
    if (!isRecord(payload.rates)) throw new Error("Unexpected FX rates");
    const rates = Object.fromEntries(
      needed.map((code) => [code, readRate(payload.rates as Record<string, unknown>, code)]),
    ) as FxRates["rates"];
    return {
      base: "NGN",
      updatedAt: typeof payload.time_last_update_utc === "string" ? payload.time_last_update_utc : "",
      source: openErApi.id,
      rates,
    };
  },
};

const activeSource: FxSource = openErApi;

export async function getFxRates(): Promise<FxRates> {
  try {
    const response = await fetch(activeSource.url, {
      next: { revalidate: FX_REVALIDATE_SECONDS },
    });
    if (!response.ok) throw new Error(`FX source responded ${response.status}`);
    return activeSource.parse(await response.json());
  } catch {
    return {
      base: "NGN",
      updatedAt: "",
      source: activeSource.id,
      rates: { NGN: 1 },
    };
  }
}
