import type { NextConfig } from "next";

const nextConfig: NextConfig = {
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
