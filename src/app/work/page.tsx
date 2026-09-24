import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight, FileText } from "lucide-react";
import { PageHeader, TagList } from "@/components/ui";
import { certifications, expertise, resumeExperience, resumeStats } from "@/lib/resume-data";

export const metadata: Metadata = {
  title: "Work",
  description:
    "Security engineering experience: detection engineering, incident response, SOC engineering, and compliance across fintech and managed security services.",
};

export default function WorkPage() {
  return (
    <>
      <PageHeader
        title="Work & Experience"
        eyebrow="Career"
        description="Security engineering across fintech, SOC-as-a-Service, and enterprise defense: detection engineering, incident response, SIEM/SOAR/EDR implementation, and compliance readiness."
      >
        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            href="/resume"
            className="btn-accent inline-flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium"
          >
            <FileText className="size-4" aria-hidden />
            View résumé
          </Link>
          <a
            href="https://www.linkedin.com/in/mahmoudhalim466/"
            className="btn-outline inline-flex items-center gap-2 rounded-md px-4 py-2 text-sm"
          >
            LinkedIn profile
            <ArrowUpRight className="size-4" aria-hidden />
          </a>
        </div>
      </PageHeader>

      <div className="mb-12 flex flex-wrap gap-x-8 gap-y-2 border-y border-border py-4 text-sm">
        {resumeStats.map((stat) => (
          <div key={stat.label} className="flex gap-1.5">
            <span className="text-muted">{stat.label}:</span>
            <span className="font-medium">{stat.value}</span>
          </div>
        ))}
      </div>

      <ol className="space-y-14">
        {resumeExperience.map((item) => (
          <li key={`${item.company}-${item.role}`} className="relative">
            <div className="flex flex-col gap-1.5 sm:flex-row sm:items-baseline sm:justify-between">
              <h2 className="text-lg font-semibold tracking-tight">
                {item.role} —{" "}
                <a
                  href={item.companyUrl}
                  className="link"
                >
                  {item.company}
                  <ArrowUpRight className="ml-0.5 inline size-4" aria-hidden />
                </a>
              </h2>
              <p className="shrink-0 text-sm tabular-nums text-muted">
                {item.period} · {item.location}
              </p>
            </div>
            <ul className="mt-4 space-y-2 text-sm leading-6 text-muted">
              {item.highlights.map((highlight) => (
                <li key={highlight} className="flex gap-2.5">
                  <span className="mt-[11px] h-px w-3 shrink-0 bg-muted" aria-hidden />
                  {highlight}
                </li>
              ))}
            </ul>
            <div className="mt-4">
              <TagList tags={item.tags} />
            </div>
          </li>
        ))}
      </ol>

      <section className="mt-24" id="expertise">
        <h2 className="border-b border-border pb-3 text-lg font-semibold tracking-tight">Toolbox</h2>
        <dl className="mt-5 grid gap-x-8 gap-y-3 text-sm sm:grid-cols-2">
          {expertise.map((item) => (
            <div key={item.area} className="flex gap-2">
              <dt className="w-24 shrink-0 font-medium">{item.area}</dt>
              <dd className="text-muted">{item.detail}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section className="mt-20" id="certifications">
        <h2 className="border-b border-border pb-3 text-lg font-semibold tracking-tight">Certifications</h2>
        <ul className="mt-2 grid gap-x-10 text-sm sm:grid-cols-2">
          {certifications.map((cert) => (
            <li
              key={cert}
              className="border-b border-border py-3 leading-6 text-secondary"
            >
              {cert}
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}
