/**
 * Tools listing page.
 *
 * Displays all recommended tools sourced from content/data/tools.json.
 * Each tool is rendered as a simple row with its name (linking to the
 * external URL) and a short description.
 */
import type { Metadata } from "next";
import { getAllTools } from "@/lib/content";

export const metadata: Metadata = { title: "Tools" };

export default function ToolsPage() {
  const tools = getAllTools();
  return (
    <div className="mx-auto max-w-content px-10 py-16 max-md:px-5">
      <h1 className="mb-8 font-heading text-[28px] font-bold text-text-primary">Tools</h1>
      <div>
        {tools.map((tool) => (
          <div key={tool.name} className="border-b border-border py-4 first:pt-0 last:border-b-0">
            <a href={tool.url} target="_blank" rel="noopener noreferrer"
              className="font-heading text-[15px] font-semibold text-text-primary hover:text-accent">
              {tool.name}
            </a>
            <p className="mt-1 font-body text-[13px] text-text-body">{tool.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
