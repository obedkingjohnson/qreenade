import type { MetadataRoute } from "next";
import { categories, products } from "@/lib/catalog";
import { INDEXING_ALLOWED } from "@/lib/indexing";
import { SITE_URL } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  if (!INDEXING_ALLOWED) return [];

  const lastModified = new Date();

  const pages: MetadataRoute.Sitemap = [
    { path: "/", priority: 1 },
    { path: "/shop", priority: 0.9 },
    { path: "/about", priority: 0.5 },
    { path: "/contact", priority: 0.4 },
    { path: "/shipping", priority: 0.4 },
  ].map(({ path, priority }) => ({
    url: path === "/" ? `${SITE_URL}/` : `${SITE_URL}${path}`,
    lastModified,
    changeFrequency: "weekly",
    priority,
  }));

  const categoryPages: MetadataRoute.Sitemap = categories.map((category) => ({
    url: `${SITE_URL}/shop?category=${category.slug}`,
    lastModified,
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  const productPages: MetadataRoute.Sitemap = products.map((product) => ({
    url: `${SITE_URL}/product/${product.slug}`,
    lastModified,
    changeFrequency: "weekly",
    priority: 0.7,
  }));

  return [...pages, ...categoryPages, ...productPages];
}
