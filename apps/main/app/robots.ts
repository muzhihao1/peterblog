import type { MetadataRoute } from "next";

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://petermu.com";

/**
 * Generates the robots.txt directives for the main site.
 *
 * Allows all crawlers to index every page and points them
 * to the sitemap for efficient discovery.
 *
 * @returns The robots.txt configuration object.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: `${BASE_URL}/sitemap.xml`,
  };
}
