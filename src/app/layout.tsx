import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/components/cart-provider";
import { CurrencyProvider } from "@/components/currency-provider";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Price } from "@/components/price";
import { UK_FREE_DELIVERY } from "@/lib/catalog";
import { getDisplayCurrency } from "@/lib/currency-request";
import { getFxRates } from "@/lib/fx";
import { INDEXING_ALLOWED } from "@/lib/indexing";
import {
  DEFAULT_OG_IMAGE,
  SITE_DESCRIPTION,
  SITE_NAME,
  SITE_URL,
  siteTitle,
} from "@/lib/site";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: siteTitle,
  description: SITE_DESCRIPTION,
  alternates: { canonical: "/" },
  ...(INDEXING_ALLOWED ? {} : { robots: { index: false, follow: false } }),
  openGraph: {
    type: "website",
    siteName: SITE_NAME,
    locale: "en_NG",
    title: siteTitle,
    description: SITE_DESCRIPTION,
    url: "/",
    images: [DEFAULT_OG_IMAGE],
  },
  twitter: {
    card: "summary_large_image",
    title: siteTitle,
    description: SITE_DESCRIPTION,
    images: [DEFAULT_OG_IMAGE.url],
  },
};

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const [currency, rates] = await Promise.all([getDisplayCurrency(), getFxRates()]);

  return (
    <html lang="en" className={`${outfit.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col font-sans">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:absolute focus:top-3 focus:left-3 focus:z-50 focus:rounded-full focus:bg-ink focus:px-4 focus:py-2 focus:text-sm focus:text-paper"
        >
          Skip to content
        </a>
        <CurrencyProvider initialCurrency={currency} rates={rates}>
          <CartProvider>
            <p className="border-b border-line px-4 py-2 text-center text-xs text-mute">
              Free UK delivery from <Price amount={UK_FREE_DELIVERY} />. Express is
              charged separately.
            </p>
            <Header />
            <main id="main" className="flex-1">
              {children}
            </main>
            <Footer />
          </CartProvider>
        </CurrencyProvider>
      </body>
    </html>
  );
}
