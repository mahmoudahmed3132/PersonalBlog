import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight, Award, FileText } from "lucide-react";
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

      <div className="mb-10 flex flex-wrap gap-x-8 gap-y-2 rounded-xl border border-border bg-card/70 px-4 py-3 text-sm">
        {resumeStats.map((stat) => (
          <div key={stat.label} className="flex gap-1.5">
            <span className="text-muted">{stat.label}:</span>
            <span className="font-medium">{stat.value}</span>
          </div>
        ))}
      </div>

      <ol className="relative space-y-10 border-l border-border pl-7">
        {resumeExperience.map((item) => (
          <li key={`${item.company}-${item.role}`} className="relative">
            <span
              className="absolute -left-[35px] top-1.5 size-3 rounded-full border-[3px] border-background bg-accent"
              aria-hidden
            />
            <div className="flex flex-col gap-1.5 sm:flex-row sm:items-baseline sm:justify-between">
              <h2 className="text-lg font-semibold">
                {item.role} —{" "}
                <a
                  href={item.companyUrl}
                  className="text-accent hover:underline underline-offset-4"
                >
                  {item.company}
                  <ArrowUpRight className="ml-0.5 inline size-4" aria-hidden />
                </a>
              </h2>
              <p className="shrink-0 font-mono text-xs text-muted">
                {item.period} · {item.location}
              </p>
            </div>
            <ul className="mt-4 space-y-2 text-sm leading-6 text-muted">
              {item.highlights.map((highlight) => (
                <li key={highlight} className="flex gap-2.5">
                  <span className="mt-[9px] size-1.5 shrink-0 rounded-full bg-accent/70" aria-hidden />
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

      <section className="mt-16" id="expertise">
        <h2 className="text-xl font-bold tracking-tight">Toolbox</h2>
        <dl className="mt-5 grid gap-x-8 gap-y-3 text-sm sm:grid-cols-2">
          {expertise.map((item) => (
            <div key={item.area} className="flex gap-2">
              <dt className="w-24 shrink-0 font-medium">{item.area}</dt>
              <dd className="text-muted">{item.detail}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section className="mt-12" id="certifications">
        <h2 className="text-xl font-bold tracking-tight">Certifications</h2>
        <ul className="mt-5 grid gap-2 text-sm sm:grid-cols-2">
          {certifications.map((cert) => (
            <li
              key={cert}
              className="skill-inner-shadow flex items-start gap-2.5 rounded-lg border border-border bg-card/70 px-3.5 py-3"
            >
              <Award className="mt-0.5 size-4 shrink-0 text-accent" aria-hidden />
              <span className="leading-6">{cert}</span>
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}
