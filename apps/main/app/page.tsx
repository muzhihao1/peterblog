/**
 * Homepage for Peter's Lab.
 *
 * Displays a hero section with the site title and tagline,
 * a list of the five most recent blog posts, and an optional
 * featured project card. Content is sourced from local MDX files
 * at build time via the content pipeline.
 */
import Link from "next/link";
import { getAllPosts, getAllProjects } from "@/lib/content";
import { SectionHeading } from "@/components/SectionHeading";
import { PostItem } from "@/components/PostItem";
import { ProjectCard } from "@/components/ProjectCard";

export default function Home() {
  const posts = getAllPosts().slice(0, 5);
  const featuredProject = getAllProjects().find(
    (p) => p.frontmatter.featured
  );

  return (
    <div className="mx-auto max-w-content px-10 max-md:px-5">
      {/* Hero */}
      <section className="pb-12 pt-16">
        <h1 className="font-heading text-[42px] font-extrabold italic leading-tight tracking-tight text-text-primary max-md:text-[32px]">
          Peter&apos;s Lab
        </h1>
        <p className="mt-4 font-body text-[15px] leading-[1.7] text-text-body">
          A place for experiments in technology, reading, and intentional
          living. I build things, read widely, and write about what I learn
          along the way.
        </p>
      </section>

      <hr className="border-border" />

      {/* Recent Writing */}
      <section className="py-8">
        <SectionHeading>Recent Writing</SectionHeading>
        <div>
          {posts.map((post) => (
            <PostItem key={post.slug} post={post} />
          ))}
        </div>
        <div className="mt-2 text-right">
          <Link
            href="/blog"
            className="font-mono text-nav-item uppercase text-accent"
          >
            All posts →
          </Link>
        </div>
      </section>

      {/* Featured Project */}
      {featuredProject && (
        <section className="pb-12">
          <SectionHeading>Featured Project</SectionHeading>
          <ProjectCard project={featuredProject} />
        </section>
      )}
    </div>
  );
}
