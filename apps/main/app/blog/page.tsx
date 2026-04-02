/**
 * Blog listing page.
 *
 * Displays all blog posts in reverse chronological order using the
 * PostList component. Posts are sourced from local MDX files at build time.
 */
import type { Metadata } from "next";
import { getAllPosts } from "@/lib/content";
import { PostList } from "@/components/PostList";

export const metadata: Metadata = { title: "Writing" };

export default function BlogPage() {
  const posts = getAllPosts();
  return (
    <div className="mx-auto max-w-content px-10 py-16 max-md:px-5">
      <h1 className="mb-8 font-heading text-[28px] font-bold text-text-primary">Writing</h1>
      <PostList posts={posts} />
    </div>
  );
}
