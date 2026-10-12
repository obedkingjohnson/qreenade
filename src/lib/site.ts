import type { Metadata } from "next";
import { campaign, type Product } from "@/lib/catalog";

export const SITE_URL = "https://qreenade.vercel.app";
export const SITE_NAME = "Qreenade";
export const SITE_TITLE = "Qreenade, handmade slow fashion from Lagos";
export const SITE_DESCRIPTION =
  "Handmade slow fashion from Lagos. Dresses, skirts, sets, and bags are made to order by our artisans.";
export const INSTAGRAM_URL = "https://www.instagram.com/qreenade";

export const siteTitle = {
  default: SITE_TITLE,
  template: "%s, Qreenade",
};

export const DEFAULT_OG_IMAGE = {
  url: campaign.hero,
  width: 2000,
  height: 2000,
  alt: "Qreenade campaign photograph",
};

type OgImage = {
  url: string;
  alt: string;
  width?: number;
  height?: number;
};

export function pageMetadata({
  title,
  description,
  path,
  image,
  noindex = false,
}: {
  title: string;
  description: string;
  path: string;
  image?: OgImage;
  noindex?: boolean;
}): Metadata {
  const ogImage = image ?? DEFAULT_OG_IMAGE;
  const metadata: Metadata = {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      type: "website",
      siteName: SITE_NAME,
      locale: "en_NG",
      title,
      description,
      url: path,
      images: [ogImage],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage.url],
    },
  };
  if (noindex) metadata.robots = { index: false };
  return metadata;
}

export function absoluteUrl(path: string) {
  if (path.startsWith("http://") || path.startsWith("https://")) return path;
  if (path === "/") return `${SITE_URL}/`;
  return `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}

export function breadcrumbJsonLd(items: { name: string; path: string }[]) {
  return {
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}

export function homeJsonLd() {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": `${SITE_URL}/#organization`,
        name: SITE_NAME,
        url: SITE_URL,
        logo: `${SITE_URL}/brand/logo-black.png`,
        sameAs: [INSTAGRAM_URL],
      },
      {
        "@type": "WebSite",
        "@id": `${SITE_URL}/#website`,
        name: SITE_NAME,
        url: SITE_URL,
        publisher: { "@id": `${SITE_URL}/#organization` },
      },
    ],
  };
}

export function shopJsonLd(category?: { name: string; slug: string }) {
  const crumbs = [
    { name: "Home", path: "/" },
    { name: "Store", path: "/shop" },
  ];
  if (category) {
    crumbs.push({
      name: category.name,
      path: `/shop?category=${category.slug}`,
    });
  }
  return {
    "@context": "https://schema.org",
    "@graph": [breadcrumbJsonLd(crumbs)],
  };
}

export function productJsonLd(product: Product, categoryName: string) {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Product",
        name: product.name,
        image: product.gallery?.length ? product.gallery : [product.image],
        description: product.summary,
        brand: {
          "@type": "Brand",
          name: SITE_NAME,
        },
        offers: {
          "@type": "Offer",
          url: absoluteUrl(`/product/${product.slug}`),
          priceCurrency: "NGN",
          price: product.price,
          availability: "https://schema.org/InStock",
        },
      },
      breadcrumbJsonLd([
        { name: "Home", path: "/" },
        { name: "Store", path: "/shop" },
        {
          name: categoryName,
          path: `/shop?category=${product.category}`,
        },
        { name: product.name, path: `/product/${product.slug}` },
      ]),
    ],
  };
}
