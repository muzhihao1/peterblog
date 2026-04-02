/**
 * ProjectCard component for showcasing a project.
 *
 * Renders a card with a left accent border, displaying the project title,
 * description, and optional technology tags. If the project has a URL,
 * the title becomes an external link that opens in a new tab.
 *
 * @param project - A Project object containing slug, frontmatter, and content.
 */
import type { Project } from "@/lib/types";

export function ProjectCard({ project }: { project: Project }) {
  const { title, description, tags, url } = project.frontmatter;

  return (
    <div className="rounded border-l-[3px] border-accent bg-bg-section p-5">
      <h3 className="font-heading text-base font-semibold text-text-primary">
        {url ? (
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-accent"
          >
            {title}
          </a>
        ) : (
          title
        )}
      </h3>
      <p className="mt-1.5 font-body text-[13px] leading-relaxed text-text-body">
        {description}
      </p>
      {tags && tags.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-1.5">
          {tags.map((tag) => (
            <span
              key={tag}
              className="rounded bg-bg-tag px-2 py-0.5 font-mono text-[10px] text-text-muted"
            >
              {tag}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
