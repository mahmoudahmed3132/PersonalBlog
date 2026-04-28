import type { Metadata } from "next";
import Link from "next/link";
import { Card, PageHeader, TagList } from "@/components/ui";
import { resumeExperience, resumeSourceUrl } from "@/lib/resume-data";

export const metadata: Metadata = {
  title: "Work",
  description: "Experience and security work by Mahmoud Halim.",
};

export default function WorkPage() {
  return (
    <>
      <PageHeader
        title="Work"
        description="Experience imported from Mahmoud's resume website: security engineering across fintech, SOC-as-a-Service, detection engineering, and incident response."
      />
      <Link
        href={resumeSourceUrl}
        className="mb-6 inline-flex rounded-md border border-border bg-surface px-3 py-2 text-sm transition hover:border-foreground/25"
      >
        View source resume site
      </Link>
      <div className="space-y-3">
        {resumeExperience.map((item) => (
          <Card key={`${item.company}-${item.role}`}>
            <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <h2 className="font-medium">{item.role}</h2>
                <p className="text-sm text-muted">{item.company} · {item.location}</p>
              </div>
              <p className="text-sm text-muted">{item.period}</p>
            </div>
            <div className="mt-4">
              <TagList tags={item.tags} />
            </div>
            <ul className="mt-4 space-y-2 text-sm leading-6 text-muted">
              {item.highlights.map((highlight) => (
                <li key={highlight}>- {highlight}</li>
              ))}
            </ul>
          </Card>
        ))}
      </div>
    </>
  );
}
