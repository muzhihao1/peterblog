/**
 * Content type definitions for the MDX content pipeline.
 *
 * These types define the shape of blog posts, projects, and tools
 * that are sourced from local MDX files and JSON data in the
 * `content/` directory.
 */

/** Frontmatter fields parsed from a blog post's MDX file. */
export interface PostFrontmatter {
  title: string;
  date: string;
  excerpt: string;
  tags?: string[];
}

/** A fully resolved blog post with parsed content and computed metadata. */
export interface Post {
  slug: string;
  frontmatter: PostFrontmatter;
  content: string;
  readingTime: string;
}

/** Frontmatter fields parsed from a project's MDX file. */
export interface ProjectFrontmatter {
  title: string;
  description: string;
  url?: string;
  tags?: string[];
  featured?: boolean;
}

/** A fully resolved project with parsed content. */
export interface Project {
  slug: string;
  frontmatter: ProjectFrontmatter;
  content: string;
}

/** A tool entry from the tools JSON data file. */
export interface Tool {
  name: string;
  description: string;
  url: string;
  category?: string;
}
