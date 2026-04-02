/**
 * About page.
 *
 * Renders the content/about.mdx file through the MdxContent renderer
 * if it exists. Falls back to a simple introductory paragraph when
 * the MDX file is not present.
 */
import type { Metadata } from "next";
import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { MdxContent } from "@/components/MdxContent";

export const metadata: Metadata = { title: "About" };

export default function AboutPage() {
  const aboutPath = path.join(process.cwd(), "content", "about.mdx");
  const hasAboutFile = fs.existsSync(aboutPath);

  if (!hasAboutFile) {
    return (
      <div className="mx-auto max-w-content px-10 py-16 max-md:px-5">
        <h1 className="mb-8 font-heading text-[28px] font-bold text-text-primary">About</h1>
        <p className="font-body text-base leading-[1.7] text-text-body">
          Hi, I&apos;m Peter. I build things, read widely, and write about what I learn.
        </p>
      </div>
    );
  }

  const fileContent = fs.readFileSync(aboutPath, "utf-8");
  const { content } = matter(fileContent);

  return (
    <div className="mx-auto max-w-content px-10 py-16 max-md:px-5">
      <h1 className="mb-8 font-heading text-[28px] font-bold text-text-primary">About</h1>
      <MdxContent source={content} />
    </div>
  );
}
