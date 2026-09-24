import type { Metadata } from "next";
import { ArrowUpRight, GitFork, Star } from "lucide-react";
import { PageHeader, TagList } from "@/components/ui";
import { formatDate } from "@/lib/blog";
import { importedProjects } from "@/lib/generated-projects";

export const metadata: Metadata = {
  title: "Projects",
  description:
    "Security engineering projects: SOAR automation, ATT&CK coverage analysis, deception technology, and open-source security tooling by Mahmoud Halim.",
};

const languageColors: Record<string, string> = {
  Python: "#3572A5",
  JavaScript: "#f1e05a",
  TypeScript: "#3178c6",
  HTML: "#e34c26",
  Java: "#b07219",
  Go: "#00ADD8",
  Shell: "#89e051",
  Code: "#8b8b8b",
};

// Hand-curated showcases get priority; everything else follows by recency.
const priorityOrder = [
  "soar-lite",
  "detection-gap-analyzer",
  "canary-deception-mesh",
];

const projectNotes: Record<string, string> = {
  "soar-lite":
    "Alert enrichment & auto-triage engine for Elastic SIEM — cuts analyst triage time by enriching and scoring alerts before a human ever opens them.",
  "detection-gap-analyzer":
    "ATT&CK coverage gap analysis with an HTML heatmap for Elastic SIEM — maps deployed rules against ATT&CK techniques to expose blind spots.",
  "canary-deception-mesh":
    "Deception layer of honeypots, canary tokens, and near-zero-false-positive sensors that turn intruders into high-fidelity alerts.",
};

function sortProjects() {
  const items = [...importedProjects];
  items.sort((a, b) => {
    const aIndex = priorityOrder.indexOf(a.name);
    const bIndex = priorityOrder.indexOf(b.name);
    const aPriority = aIndex === -1 ? priorityOrder.length : aIndex;
    const bPriority = bIndex === -1 ? priorityOrder.length : bIndex;
    if (aPriority !== bPriority) return aPriority - bPriority;
    return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
  });
  return items;
}

export default function ProjectsPage() {
  const projects = sortProjects();

  return (
    <>
      <PageHeader
        title="Projects"
        eyebrow="Open source"
        description="Security tooling I build and maintain — SIEM automation, detection coverage, deception technology. Everything lives on GitHub."
      />
      <div className="grid gap-3 sm:grid-cols-2">
        {projects.map((project) => {
          const featured = priorityOrder.includes(project.name);
          const description = projectNotes[project.name] ?? project.description;

          return (
            <a
              key={project.name}
              href={project.href}
              className={`group block rounded-lg border p-5 transition-colors hover:border-foreground/25 ${
                featured
                  ? "border-border"
                  : "border-border/70"
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <h2 className="font-medium">{project.name}</h2>
                <div className="flex shrink-0 items-center gap-2 text-muted">
                  {featured ? (
                    <Star className="size-3.5 fill-accent text-accent" aria-label="Featured project" />
                  ) : null}
                  {project.fork ? <GitFork className="size-3.5" aria-label="Forked repository" /> : null}
                  <ArrowUpRight className="size-4 transition group-hover:text-accent" aria-hidden />
                </div>
              </div>
              <p className="mt-2 text-sm leading-6 text-muted">{description}</p>
              <div className="mt-4 flex flex-col gap-3">
                <TagList tags={featured ? project.tags : project.tags.length ? project.tags : [project.language]} />
                <p className="flex items-center gap-2 text-xs text-muted">
                  <span
                    className="inline-block size-2.5 rounded-full"
                    style={{ backgroundColor: languageColors[project.language] ?? "#8b8b8b" }}
                    aria-hidden
                  />
                  {project.language} · Updated {formatDate(project.updatedAt)}
                </p>
              </div>
            </a>
          );
        })}
      </div>
    </>
  );
}
