import type { Metadata } from "next";
import { getAllTools } from "@/lib/content";

export const metadata: Metadata = { title: "Toolkit" };

const WORKFLOW_ORDER = ["写作流", "开发流", "学习流", "生活流"];

export default function ToolsPage() {
  const tools = getAllTools();

  const grouped = new Map<string, typeof tools>();
  for (const tool of tools) {
    const wf = tool.workflow || "其他";
    const list = grouped.get(wf) || [];
    list.push(tool);
    grouped.set(wf, list);
  }

  const sortedGroups = WORKFLOW_ORDER
    .filter((wf) => grouped.has(wf))
    .map((wf) => [wf, grouped.get(wf)!] as const);

  return (
    <div className="mx-auto max-w-content-wide px-10 py-16 max-md:px-5">
      <div className="animate-slide-up">
        <h1 className="font-heading text-[28px] font-bold text-text-primary">
          My Toolkit
        </h1>
        <p className="mt-2 font-body text-[14px] text-text-body">
          我每天实际在用的工具，附上真实使用心得。
        </p>
      </div>

      {sortedGroups.map(([workflow, items], groupIndex) => (
        <section
          key={workflow}
          className={`animate-slide-up delay-${groupIndex + 1} mt-10`}
        >
          <h2 className="mb-4 border-b border-border pb-2 font-mono text-section-label uppercase text-accent">
            {workflow}
          </h2>
          <div className="grid gap-4 md:grid-cols-2">
            {items.map((tool) => (
              <div
                key={tool.name}
                className="rounded-lg border border-border bg-bg-card p-4"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <a
                      href={tool.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-heading text-[15px] font-semibold text-text-primary hover:text-accent"
                    >
                      {tool.name}
                    </a>
                    <p className="mt-0.5 font-mono text-[10px] text-text-muted">
                      {tool.description} · {tool.pricing}
                    </p>
                  </div>
                </div>
                <p className="mt-3 font-body text-[13px] leading-relaxed text-text-body">
                  {tool.note}
                </p>
              </div>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
