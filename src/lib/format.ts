type MoneyCurrency = "NGN" | "GBP" | "USD" | "EUR" | "AED";

const locales: Record<MoneyCurrency, string> = {
  NGN: "en-NG",
  GBP: "en-GB",
  USD: "en-US",
  EUR: "en-IE",
  AED: "en-AE",
};

export function formatMoney(amount: number, currency: MoneyCurrency) {
  const digits = currency === "NGN" ? 0 : 2;
  return new Intl.NumberFormat(locales[currency], {
    style: "currency",
    currency,
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  }).format(amount);
}

export function formatNaira(amount: number) {
  return formatMoney(amount, "NGN");
}
