/**
 * PostList component for rendering a collection of blog posts.
 *
 * Iterates over the provided posts array and renders each one using
 * the PostItem component. Displays a muted message when the array
 * is empty.
 *
 * @param posts - An array of Post objects to display.
 */
import { PostItem } from "./PostItem";
import type { Post } from "@/lib/types";

export function PostList({ posts }: { posts: Post[] }) {
  if (posts.length === 0) {
    return <p className="font-body text-sm text-text-muted">No posts yet.</p>;
  }
  return (
    <div>
      {posts.map((post) => (
        <PostItem key={post.slug} post={post} />
      ))}
    </div>
  );
}
