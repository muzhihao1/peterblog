import type { MetadataRoute } from "next";
import { getAllPosts } from "@/lib/content";

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://petermu.com";

/**
 * Generates the sitemap for the main site.
 *
 * Includes all static pages plus dynamically generated entries
 * for every blog post. Search engines use this to discover and
 * index all publicly available URLs.
 *
 * @returns An array of sitemap entries with URL and last-modified date.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const posts = getAllPosts();
  const postUrls = posts.map((post) => ({
    url: `${BASE_URL}/blog/${post.slug}`,
    lastModified: new Date(post.frontmatter.date),
  }));
  return [
    { url: BASE_URL, lastModified: new Date() },
    { url: `${BASE_URL}/blog`, lastModified: new Date() },
    { url: `${BASE_URL}/projects`, lastModified: new Date() },
    { url: `${BASE_URL}/tools`, lastModified: new Date() },
    { url: `${BASE_URL}/about`, lastModified: new Date() },
    ...postUrls,
  ];
}
