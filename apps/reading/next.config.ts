import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["@peterblog/design-system"],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },
};

export default nextConfig;
