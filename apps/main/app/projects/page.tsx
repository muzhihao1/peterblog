/**
 * Projects listing page.
 *
 * Displays all projects sourced from MDX files in the content/projects
 * directory. Each project is rendered using the ProjectCard component
 * with its accent border and tag display.
 */
import type { Metadata } from "next";
import { getAllProjects } from "@/lib/content";
import { ProjectCard } from "@/components/ProjectCard";

export const metadata: Metadata = { title: "Projects" };

export default function ProjectsPage() {
  const projects = getAllProjects();
  return (
    <div className="mx-auto max-w-content px-10 py-16 max-md:px-5">
      <h1 className="mb-8 font-heading text-[28px] font-bold text-text-primary">Projects</h1>
      <div className="space-y-4">
        {projects.map((project) => (
          <ProjectCard key={project.slug} project={project} />
        ))}
      </div>
    </div>
  );
}
