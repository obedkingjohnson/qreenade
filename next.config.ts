import type { NextConfig } from "next";

const indexingAllowed = process.env.ALLOW_INDEXING?.trim() === "true";

const nextConfig: NextConfig = {
  async headers() {
    if (indexingAllowed) return [];
    return [
      {
        source: "/:path*",
        headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow" }],
      },
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "d2j6dbq0eux0bg.cloudfront.net",
      },
      {
        protocol: "https",
        hostname: "d2gt4h1eeousrn.cloudfront.net",
      },
    ],
  },
};

export default nextConfig;
