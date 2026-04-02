/**
 * Content reading utilities for the MDX content pipeline.
 *
 * Reads MDX files from the `content/` directory at build time,
 * parses frontmatter with gray-matter, and computes reading time.
 * All functions are synchronous and intended for use in server
 * components and static generation.
 */

import fs from "fs";
import path from "path";
import matter from "gray-matter";
import readingTime from "reading-time";
import type {
  Post,
  PostFrontmatter,
  Project,
  ProjectFrontmatter,
  Tool,
} from "./types";

const CONTENT_DIR = path.join(process.cwd(), "content");

/**
 * Retrieves all blog posts from the `content/posts/` directory.
 *
 * Each `.mdx` file is parsed for frontmatter and content. Posts are
 * sorted by date in descending order (newest first). Returns an empty
 * array if the posts directory does not exist.
 *
 * @returns An array of Post objects sorted by date descending.
 */
export function getAllPosts(): Post[] {
  const postsDir = path.join(CONTENT_DIR, "posts");
  if (!fs.existsSync(postsDir)) return [];

  const files = fs.readdirSync(postsDir).filter((f) => f.endsWith(".mdx"));

  const posts = files.map((filename) => {
    const slug = filename.replace(/\.mdx$/, "");
    const filePath = path.join(postsDir, filename);
    const fileContent = fs.readFileSync(filePath, "utf-8");
    const { data, content } = matter(fileContent);
    const stats = readingTime(content);

    return {
      slug,
      frontmatter: data as PostFrontmatter,
      content,
      readingTime: stats.text,
    };
  });

  return posts.sort(
    (a, b) =>
      new Date(b.frontmatter.date).getTime() -
      new Date(a.frontmatter.date).getTime()
  );
}

/**
 * Retrieves a single blog post by its slug.
 *
 * Looks for a file named `{slug}.mdx` in the `content/posts/` directory.
 * Returns null if the file does not exist.
 *
 * @param slug - The URL-friendly identifier for the post (filename without .mdx).
 * @returns The Post object, or null if not found.
 */
export function getPostBySlug(slug: string): Post | null {
  const filePath = path.join(CONTENT_DIR, "posts", `${slug}.mdx`);
  if (!fs.existsSync(filePath)) return null;

  const fileContent = fs.readFileSync(filePath, "utf-8");
  const { data, content } = matter(fileContent);
  const stats = readingTime(content);

  return {
    slug,
    frontmatter: data as PostFrontmatter,
    content,
    readingTime: stats.text,
  };
}

/**
 * Retrieves all projects from the `content/projects/` directory.
 *
 * Each `.mdx` file is parsed for frontmatter and content. Returns an
 * empty array if the projects directory does not exist.
 *
 * @returns An array of Project objects.
 */
export function getAllProjects(): Project[] {
  const projectsDir = path.join(CONTENT_DIR, "projects");
  if (!fs.existsSync(projectsDir)) return [];

  const files = fs.readdirSync(projectsDir).filter((f) => f.endsWith(".mdx"));

  return files.map((filename) => {
    const slug = filename.replace(/\.mdx$/, "");
    const filePath = path.join(projectsDir, filename);
    const fileContent = fs.readFileSync(filePath, "utf-8");
    const { data, content } = matter(fileContent);

    return {
      slug,
      frontmatter: data as ProjectFrontmatter,
      content,
    };
  });
}

/**
 * Retrieves all tools from the `content/data/tools.json` file.
 *
 * Returns an empty array if the file does not exist.
 *
 * @returns An array of Tool objects.
 */
export function getAllTools(): Tool[] {
  const toolsPath = path.join(CONTENT_DIR, "data", "tools.json");
  if (!fs.existsSync(toolsPath)) return [];

  const fileContent = fs.readFileSync(toolsPath, "utf-8");
  return JSON.parse(fileContent) as Tool[];
}
