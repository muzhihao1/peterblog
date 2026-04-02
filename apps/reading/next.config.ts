import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["@peterblog/design-system"],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
      {
        protocol: "http",
        hostname: "**",
      },
    ],
  },
};

export default nextConfig;
