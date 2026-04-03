import Link from "next/link";
import { getAllPosts, getAllProjects } from "@/lib/content";
import { SectionHeading } from "@/components/SectionHeading";
import { ProjectCard } from "@/components/ProjectCard";

export default function Home() {
  const posts = getAllPosts().slice(0, 3);
  const featuredProject = getAllProjects().find(
    (p) => p.frontmatter.featured
  );

  return (
    <div className="mx-auto max-w-content-wide px-10 max-md:px-5">
      {/* Hero */}
      <section className="animate-slide-up pb-8 pt-16">
        <h1 className="font-heading text-[42px] font-extrabold italic leading-tight tracking-tight text-text-primary max-md:text-[32px]">
          Peter&apos;s Lab
        </h1>
        <p className="mt-3 font-body text-[15px] leading-[1.7] text-text-body">
          边学边做，边做边写。
        </p>
      </section>

      <hr className="border-border" />

      {/* Magazine layout: two columns */}
      <section className="grid gap-12 py-10 md:grid-cols-[3fr_2fr]">
        {/* Left column: Writing */}
        <div className="animate-slide-up delay-1">
          <SectionHeading>写作</SectionHeading>
          <div>
            {posts.map((post) => (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}`}
                className="group mb-5 block border-l-2 border-border py-1 pl-4 hover:border-accent"
              >
                <h3 className="font-heading text-[16px] font-semibold text-text-primary group-hover:text-accent">
                  {post.frontmatter.title}
                </h3>
                {post.frontmatter.excerpt && (
                  <p className="mt-1 line-clamp-1 font-body text-[13px] text-text-body">
                    {post.frontmatter.excerpt}
                  </p>
                )}
              </Link>
            ))}
          </div>
          <div className="mt-2">
            <Link
              href="/blog"
              className="font-mono text-nav-item uppercase text-accent"
            >
              All posts →
            </Link>
          </div>
        </div>

        {/* Right column: Reading + Projects */}
        <div>
          {/* Recent reads */}
          <div className="animate-slide-up delay-2 mb-10">
            <SectionHeading>阅读</SectionHeading>
            <p className="mb-3 font-body text-[13px] text-text-body">
              最近在读的书和想法，同步自 Readwise。
            </p>
            <a
              href={
                process.env.NEXT_PUBLIC_READING_URL ||
                "https://reading.petermu.com"
              }
              className="font-mono text-nav-item uppercase text-accent"
            >
              Reading Journal →
            </a>
          </div>

          {/* Featured project */}
          {featuredProject && (
            <div className="animate-slide-up delay-3">
              <SectionHeading>项目</SectionHeading>
              <ProjectCard project={featuredProject} />
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
