import { cookies, headers } from "next/headers";
import { CURRENCY_COOKIE, resolveCurrency, type DisplayCurrency } from "@/lib/currency";

export async function getDisplayCurrency(): Promise<DisplayCurrency> {
  const headerList = await headers();
  const cookieList = await cookies();
  return resolveCurrency({
    cookie: cookieList.get(CURRENCY_COOKIE)?.value,
    country: headerList.get("x-vercel-ip-country"),
    acceptLanguage: headerList.get("accept-language"),
  });
}
