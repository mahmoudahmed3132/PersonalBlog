import type { Metadata } from "next";
import { Card, PageHeader, TagList } from "@/components/ui";
import { formatDate } from "@/lib/blog";
import { importedProjects } from "@/lib/generated-projects";

export const metadata: Metadata = {
  title: "Projects",
  description: "Security projects and notebooks by Mahmoud Halim.",
};

export default function ProjectsPage() {
  return (
    <>
      <PageHeader
        title="Projects"
        description="Public repositories imported from GitHub. Run npm run import:github to refresh this list."
      />
      <div className="grid gap-3 sm:grid-cols-2">
        {importedProjects.map((project) => (
          <Card key={project.name} href={project.href}>
            <div className="flex items-start justify-between gap-3">
              <h2 className="font-medium">{project.name}</h2>
              {project.fork ? (
                <span className="rounded-full border border-border px-2 py-0.5 text-xs text-muted">Fork</span>
              ) : null}
            </div>
            <p className="mt-2 text-sm leading-6 text-muted">{project.description}</p>
            <div className="mt-4 flex flex-col gap-3">
              <TagList tags={project.tags.length ? project.tags : [project.language]} />
              <p className="text-xs text-muted">
                {project.language} · Updated {formatDate(project.updatedAt)}
              </p>
            </div>
          </Card>
        ))}
      </div>
    </>
  );
}
