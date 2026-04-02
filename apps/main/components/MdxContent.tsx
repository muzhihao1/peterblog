/**
 * MDX content renderer component.
 *
 * Uses `next-mdx-remote/rsc` to render MDX content as a React Server
 * Component. Each HTML element is mapped to a styled component using
 * Tailwind classes that match the design system's warm editorial theme.
 *
 * @example
 * ```tsx
 * import { MdxContent } from "@/components/MdxContent";
 *
 * export default function PostPage() {
 *   const post = getPostBySlug("hello-world");
 *   return <MdxContent source={post.content} />;
 * }
 * ```
 */

import { MDXRemote } from "next-mdx-remote/rsc";

const components = {
  h1: (props: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h1
      className="mb-4 mt-8 font-heading text-[28px] font-bold text-text-primary"
      {...props}
    />
  ),
  h2: (props: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h2
      className="mb-3 mt-6 font-heading text-[22px] font-bold text-text-primary"
      {...props}
    />
  ),
  h3: (props: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h3
      className="mb-2 mt-5 font-heading text-lg font-semibold text-text-primary"
      {...props}
    />
  ),
  p: (props: React.HTMLAttributes<HTMLParagraphElement>) => (
    <p
      className="mb-4 font-body text-base leading-[1.7] text-text-body"
      {...props}
    />
  ),
  a: (props: React.AnchorHTMLAttributes<HTMLAnchorElement>) => (
    <a
      className="text-accent underline underline-offset-2"
      {...props}
    />
  ),
  ul: (props: React.HTMLAttributes<HTMLUListElement>) => (
    <ul
      className="mb-4 ml-6 list-disc space-y-1 font-body text-text-body"
      {...props}
    />
  ),
  ol: (props: React.HTMLAttributes<HTMLOListElement>) => (
    <ol
      className="mb-4 ml-6 list-decimal space-y-1 font-body text-text-body"
      {...props}
    />
  ),
  blockquote: (props: React.HTMLAttributes<HTMLQuoteElement>) => (
    <blockquote
      className="my-4 border-l-2 border-border pl-4 font-body italic text-text-body"
      {...props}
    />
  ),
  code: (props: React.HTMLAttributes<HTMLElement>) => (
    <code
      className="rounded bg-bg-tag px-1.5 py-0.5 font-mono text-sm text-text-primary"
      {...props}
    />
  ),
  pre: (props: React.HTMLAttributes<HTMLPreElement>) => (
    <pre
      className="my-4 overflow-x-auto rounded-md bg-text-primary p-4 font-mono text-sm text-bg"
      {...props}
    />
  ),
  hr: () => <hr className="my-8 border-border" />,
};

/**
 * Renders MDX source content with design-system-styled components.
 *
 * This is an async Server Component that processes MDX on the server.
 * It should only be used within server-rendered pages or layouts.
 *
 * @param source - Raw MDX string content (without frontmatter).
 */
export function MdxContent({ source }: { source: string }) {
  return <MDXRemote source={source} components={components} />;
}
