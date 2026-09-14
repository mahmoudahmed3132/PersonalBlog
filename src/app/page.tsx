import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  Award,
  BadgeCheck,
  BrainCircuit,
  BriefcaseBusiness,
  CloudCog,
  FileText,
  Mail,
  MapPin,
  MessageCircle,
  Radar,
  ScanEye,
  ShieldCheck,
  Workflow,
} from "lucide-react";
import { Card, Section, StatBand, TagList } from "@/components/ui";
import { TypedRole } from "@/components/typed-role";
import { assetPath } from "@/lib/asset-path";
import { formatDate, getAllBlogPosts } from "@/lib/blog";
import { importedProjects } from "@/lib/generated-projects";
import { certifications, expertise, resumeExperience } from "@/lib/resume-data";
import { developmentLinks, personalLinks, siteConfig } from "@/lib/site-config";

const expertiseIcons = [Radar, Workflow, ScanEye, BrainCircuit, ShieldCheck, CloudCog];

const featuredProjects = [
  {
    name: "soar-lite",
    tagline: "Alert enrichment & auto-triage engine for Elastic SIEM",
    tags: ["Python", "SOAR", "Elastic"],
  },
  {
    name: "detection-gap-analyzer",
    tagline: "ATT&CK coverage gap analysis with an HTML heatmap for Elastic SIEM",
    tags: ["Python", "ATT&CK", "Detection"],
  },
  {
    name: "canary-deception-mesh",
    tagline: "Honeypots, canary tokens, and near-zero-FP deception sensors",
    tags: ["Python", "Deception", "Honeypots"],
  },
];

export default function HomePage() {
  const posts = getAllBlogPosts().slice(0, 3);

  return (
    <>
      <section className="hero-glow relative">
        <div className="bg-grid pointer-events-none absolute inset-x-0 -top-14 -z-10 h-72" aria-hidden />

        <div className="animate-fade-up">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={assetPath("/avatar-pixel.png")}
            alt="Animated pixel portrait of Mahmoud Halim"
            width={100}
            height={100}
            className="size-24 rounded-full bg-[#93c5fd] object-cover ring-2 ring-border dark:bg-[#fde68a]"
          />
        </div>

        <div className="animate-fade-up stagger-1 mt-7 flex flex-col gap-3">
          <p className="inline-flex w-fit items-center gap-2 rounded-full border border-border bg-surface px-3 py-1 font-mono text-xs text-muted">
            <span className="inline-block size-2 rounded-full bg-accent" style={{ animation: "pulse-dot 2.2s ease-in-out infinite" }} aria-hidden />
            Open to senior security roles
          </p>
          <h1 className="text-4xl font-bold tracking-tight sm:text-[2.6rem] sm:leading-[1.15]">
            Mahmoud Halim — <TypedRole />
            <span className="mt-3 block text-xl font-medium text-secondary sm:text-2xl">
              a thalassophile security engineer obsessed with security, AI systems, music, philosophy, and beautifully strange ideas.
            </span>
          </h1>
        </div>

        <p className="animate-fade-up stagger-2 mt-6 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted">
          <span className="inline-flex items-center gap-1.5">
            <MapPin className="size-4" aria-hidden /> {siteConfig.location}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <BriefcaseBusiness className="size-4" aria-hidden /> Kashier · Fintech
          </span>
          <span className="inline-flex items-center gap-1.5">
            <BadgeCheck className="size-4" aria-hidden /> 8 certifications
          </span>
        </p>

        <div className="animate-fade-up stagger-3 mt-7 flex flex-wrap gap-3">
          <Link
            href="/resume"
            className="btn-accent inline-flex items-center gap-2 rounded-md px-4 py-2.5 text-sm font-medium"
          >
            <FileText className="size-4" aria-hidden />
            View résumé
          </Link>
          <Link href="/work" className="btn-outline inline-flex items-center gap-2 rounded-md px-4 py-2.5 text-sm">
            <BriefcaseBusiness className="size-4" aria-hidden />
            Work &amp; experience
          </Link>
          <Link
            href={`mailto:${siteConfig.email}`}
            className="btn-outline inline-flex items-center gap-2 rounded-md px-4 py-2.5 text-sm"
          >
            <MessageCircle className="size-4" aria-hidden />
            Get in touch
          </Link>
        </div>

        <nav className="animate-fade-up stagger-4 mt-7 flex flex-wrap gap-4 text-secondary" aria-label="Social links">
          {siteConfig.socials.map((item) => {
            const Icon = item.icon;
            return (
              <a
                key={item.label}
                href={item.href}
                title={item.label}
                aria-label={item.label}
                className="inline-flex size-6 items-center justify-center transition hover:text-foreground"
              >
                <Icon className="size-5" aria-hidden />
              </a>
            );
          })}
        </nav>

        <p className="animate-fade-up stagger-5 mt-8 max-w-2xl border-l-2 border-accent/40 pl-4 font-mono text-sm italic leading-7 text-secondary">
          {siteConfig.quote}
        </p>
      </section>

      <div className="animate-fade-up stagger-6 mt-12">
        <StatBand
          stats={[
            { label: "Years in security", value: "3+" },
            { label: "Certifications", value: "8", hint: "CrowdStrike, Fortinet, CEH, CCNA" },
            { label: "SIEM / SOAR / EDR platforms", value: "10+", hint: "Splunk, Elastic, CrowdStrike, Forti" },
            { label: "Compliance frameworks", value: "3", hint: "PCI DSS · SOC 2 · ISO 27001" },
          ]}
        />
      </div>

      <Section title="Expertise" eyebrow="What I do" action={{ label: "Full skill matrix", href: "/resume#expertise" }}>
        <div className="grid gap-3 sm:grid-cols-2">
          {expertise.map((item, index) => {
            const Icon = expertiseIcons[index % expertiseIcons.length];
            return (
              <Card key={item.area}>
                <div className="flex items-start gap-3">
                  <span className="skill-inner-shadow mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-lg border border-border bg-surface">
                    <Icon className="size-4.5 text-accent" aria-hidden />
                  </span>
                  <div>
                    <h3 className="font-medium">{item.area}</h3>
                    <p className="mt-1 text-sm leading-6 text-muted">{item.detail}</p>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      </Section>

      <Section title="Experience" eyebrow="Career" action={{ label: "View work history", href: "/work" }}>
        <ol className="relative space-y-6 border-l border-border pl-6">
          {resumeExperience.map((item) => (
            <li key={`${item.company}-${item.role}`} className="relative">
              <span
                className="absolute -left-[31px] top-1.5 size-2.5 rounded-full border-2 border-background bg-accent"
                aria-hidden
              />
              <div className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between">
                <h3 className="font-medium">
                  {item.role} · <span className="text-secondary">{item.company}</span>
                </h3>
                <p className="shrink-0 font-mono text-xs text-muted">{item.period}</p>
              </div>
              <p className="mt-1.5 text-sm leading-6 text-muted">{item.highlights[0]}</p>
            </li>
          ))}
        </ol>
      </Section>

      <Section title="Certifications" eyebrow="Credentials" id="certifications">
        <ul className="grid gap-2.5 sm:grid-cols-2">
          {certifications.map((cert) => (
            <li
              key={cert}
              className="skill-inner-shadow flex items-start gap-2.5 rounded-lg border border-border bg-card/70 px-3.5 py-3 text-sm"
            >
              <Award className="mt-0.5 size-4 shrink-0 text-accent" aria-hidden />
              <span className="leading-6">{cert}</span>
            </li>
          ))}
        </ul>
      </Section>

      <Section title="Latest writing" eyebrow="Blog" action={{ label: "All posts", href: "/blog" }}>
        <div className="space-y-3">
          {posts.map((post) => (
            <Card key={post.slug} href={`/blog/${post.slug}`}>
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="font-medium">{post.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-muted">{post.description}</p>
                </div>
                <ArrowRight className="mt-1 size-4 shrink-0 text-muted" aria-hidden />
              </div>
              <p className="mt-3 text-xs text-muted">
                {formatDate(post.publishedAt)} · {post.readingTime}
              </p>
            </Card>
          ))}
        </div>
      </Section>

      <Section title="Selected projects" eyebrow="Open source" action={{ label: "All projects", href: "/projects" }}>
        <div className="grid gap-3 sm:grid-cols-2">
          {featuredProjects.map((project) => (
            <Card
              key={project.name}
              href={`https://github.com/mahmoudahmed3132/${project.name}`}
              className="group"
            >
              <div className="flex items-center justify-between gap-2">
                <h3 className="font-mono text-sm font-semibold">{project.name}</h3>
                <ArrowUpRight className="size-4 shrink-0 text-muted transition group-hover:text-accent" aria-hidden />
              </div>
              <p className="mt-2 text-sm leading-6 text-muted">{project.tagline}</p>
              <div className="mt-4">
                <TagList tags={project.tags} />
              </div>
            </Card>
          ))}
          <Card href="/projects" className="flex flex-col justify-center border-dashed text-center">
            <p className="text-sm font-medium">+ {Math.max(0, importedProjects.length - featuredProjects.length)} more on GitHub</p>
            <p className="mt-1 text-sm text-muted">Labs, forks, and experiments</p>
          </Card>
        </div>
      </Section>

      <Section title="Beyond security" eyebrow="Personal">
        <div className="grid gap-3 sm:grid-cols-3">
          {developmentLinks.map((item) => (
            <Card key={item.href} href={item.href}>
              <h3 className="font-medium">{item.title}</h3>
              <p className="mt-2 text-sm leading-6 text-muted">{item.description}</p>
            </Card>
          ))}
        </div>
        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          {personalLinks.map((item) => (
            <Card key={item.href} href={item.href}>
              <h3 className="font-medium">{item.title}</h3>
            </Card>
          ))}
        </div>
      </Section>

      <Section title="Let's talk" eyebrow="Contact">
        <Card>
          <p className="text-sm leading-7 text-secondary">
            I&apos;m open to senior security engineering roles, detection engineering projects, and interesting
            collaborations. The fastest way to reach me is email — I usually reply within a day.
          </p>
          <div className="mt-4 flex flex-wrap gap-3">
            <a
              href={`mailto:${siteConfig.email}`}
              className="btn-accent inline-flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium"
            >
              <Mail className="size-4" aria-hidden />
              {siteConfig.email}
            </a>
            <a
              href="https://www.linkedin.com/in/mahmoudhalim466/"
              className="btn-outline inline-flex items-center gap-2 rounded-md px-4 py-2 text-sm"
            >
              Connect on LinkedIn
              <ArrowUpRight className="size-4" aria-hidden />
            </a>
          </div>
        </Card>
      </Section>
    </>
  );
}
