import type { MetadataRoute } from "next";
import { INDEXING_ALLOWED } from "@/lib/indexing";
import { SITE_URL } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  if (!INDEXING_ALLOWED) {
    return { rules: { userAgent: "*", disallow: "/" } };
  }
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/api", "/cart"],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
