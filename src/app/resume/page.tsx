import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowUpRight,
  BadgeCheck,
  GraduationCap,
  Mail,
  MapPin,
} from "lucide-react";
import { PrintButton } from "@/components/print-button";
import { TagList } from "@/components/ui";
import {
  certifications,
  education,
  expertise,
  resumeExperience,
  resumeStats,
  resumeSummary,
} from "@/lib/resume-data";
import { siteConfig } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Résumé",
  description:
    "Résumé of Mahmoud Halim — Senior Security Engineer specialising in detection engineering, incident response, SIEM/SOAR/EDR, and cloud security.",
};

export default function ResumePage() {
  return (
    <article>
      <header className="border-b border-border pb-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-sm text-muted">Résumé</p>
            <h1 className="mt-1 text-3xl font-bold tracking-tight">{siteConfig.name}</h1>
            <p className="mt-2 text-lg font-medium text-secondary">{siteConfig.role}</p>
          </div>
          <PrintButton />
        </div>

        <p className="mt-5 max-w-2xl text-pretty leading-7 text-secondary">{resumeSummary}</p>

        <div className="mt-5 flex flex-wrap gap-x-5 gap-y-2 text-sm text-muted">
          <span className="inline-flex items-center gap-1.5">
            <MapPin className="size-4" aria-hidden /> {siteConfig.location}
          </span>
          <a href={`mailto:${siteConfig.email}`} className="inline-flex items-center gap-1.5 hover:text-foreground">
            <Mail className="size-4" aria-hidden /> {siteConfig.email}
          </a>
          <a
            href="https://www.linkedin.com/in/mahmoudhalim466/"
            className="inline-flex items-center gap-1.5 hover:text-foreground"
          >
            LinkedIn <ArrowUpRight className="size-3.5" aria-hidden />
          </a>
          <a
            href="https://github.com/mahmoudahmed3132"
            className="inline-flex items-center gap-1.5 hover:text-foreground"
          >
            GitHub <ArrowUpRight className="size-3.5" aria-hidden />
          </a>
        </div>

        <dl className="mt-6 flex flex-wrap gap-x-8 gap-y-2 text-sm">
          {resumeStats.map((stat) => (
            <div key={stat.label} className="flex gap-1.5">
              <dt className="text-muted">{stat.label}:</dt>
              <dd className="font-medium">{stat.value}</dd>
            </div>
          ))}
        </dl>
      </header>

      <section className="mt-10" id="experience">
        <h2 className="text-xl font-bold tracking-tight">Experience</h2>
        <div className="mt-5 space-y-8">
          {resumeExperience.map((item) => (
            <section key={`${item.company}-${item.role}`}>
              <div className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between">
                <h3 className="font-semibold">
                  {item.role} —{" "}
                  {item.companyUrl ? (
                    <a
                      href={item.companyUrl}
                      className="text-accent hover:underline underline-offset-4"
                    >
                      {item.company}
                      <ArrowUpRight className="ml-0.5 inline size-3.5" aria-hidden />
                    </a>
                  ) : (
                    item.company
                  )}
                </h3>
                <p className="shrink-0 font-mono text-xs text-muted">
                  {item.period} · {item.location}
                </p>
              </div>
              <ul className="mt-3 space-y-1.5 text-sm leading-6 text-muted">
                {item.highlights.map((highlight) => (
                  <li key={highlight} className="flex gap-2">
                    <span className="mt-[9px] size-1 shrink-0 rounded-full bg-accent" aria-hidden />
                    {highlight}
                  </li>
                ))}
              </ul>
              <div className="mt-3">
                <TagList tags={item.tags} />
              </div>
            </section>
          ))}
        </div>
      </section>

      <section className="mt-10" id="expertise">
        <h2 className="text-xl font-bold tracking-tight">Expertise</h2>
        <dl className="mt-5 grid gap-x-8 gap-y-3 text-sm sm:grid-cols-2">
          {expertise.map((item) => (
            <div key={item.area} className="flex gap-2">
              <dt className="w-24 shrink-0 font-medium">{item.area}</dt>
              <dd className="text-muted">{item.detail}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section className="mt-10" id="certifications">
        <h2 className="text-xl font-bold tracking-tight">Certifications</h2>
        <ul className="mt-5 grid gap-2 text-sm sm:grid-cols-2">
          {certifications.map((cert) => (
            <li key={cert} className="flex items-start gap-2">
              <BadgeCheck className="mt-0.5 size-4 shrink-0 text-accent" aria-hidden />
              <span className="leading-6 text-muted">{cert}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-10" id="education">
        <h2 className="text-xl font-bold tracking-tight">Education</h2>
        <div className="mt-5 flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between">
          <div>
            <h3 className="font-semibold">{education.degree}</h3>
            <p className="text-sm text-muted">
              {education.school} · {education.note}
            </p>
          </div>
          <p className="shrink-0 font-mono text-xs text-muted">{education.period}</p>
        </div>
        <p className="mt-3 inline-flex items-center gap-1.5 text-sm text-muted">
          <GraduationCap className="size-4 text-accent" aria-hidden />
          Faculty of Computers and Artificial Intelligence, Cairo University
        </p>
      </section>

      <footer className="mt-12 border-t border-border pt-6 text-sm text-muted">
        <p>
          Prefer browsing? See <Link href="/work" className="text-accent hover:underline underline-offset-4">Work</Link>,{" "}
          <Link href="/projects" className="text-accent hover:underline underline-offset-4">Projects</Link>, and{" "}
          <Link href="/blog" className="text-accent hover:underline underline-offset-4">Blog</Link> for the full story.
        </p>
      </footer>
    </article>
  );
}
