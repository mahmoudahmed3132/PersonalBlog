import Link from "next/link";
import Image from "next/image";
import { ArrowRight, BriefcaseBusiness, MessageCircle } from "lucide-react";
import { Card, Section, TagList } from "@/components/ui";
import { formatDate, getAllBlogPosts } from "@/lib/blog";
import { importedProjects } from "@/lib/generated-projects";
import { resumeExperience } from "@/lib/resume-data";
import {
  developmentLinks,
  personalLinks,
  siteConfig,
} from "@/lib/site-config";

export default function HomePage() {
  const posts = getAllBlogPosts().slice(0, 3);

  return (
    <>
      <section>
        <Image
          src="/avatar-pixel.png"
          alt="Animated pixel portrait of Mahmoud Halim"
          width={100}
          height={100}
          priority
          className="size-24 rounded-full bg-[#93c5fd] object-cover dark:bg-[#fde68a]"
        />

        <div className="mt-8 flex flex-col gap-2">
          <h1 className="text-4xl font-bold">
            Hi, I&apos;m Mahmoud — <span className="text-secondary">a thalassophile security engineer obsessed with security, AI systems, music, philosophy, and beautifully strange ideas.</span>
          </h1>
        </div>

        <div className="mt-8 flex flex-wrap gap-4">
          <Link href="/work" className="btn-inner-shadow inline-flex items-center gap-2 rounded-md border border-border px-4 py-2 text-sm transition hover:bg-subtle">
            <BriefcaseBusiness className="size-4" aria-hidden />
            Work / CV
          </Link>
          <Link href={`mailto:${siteConfig.email}`} className="btn-inner-shadow inline-flex items-center gap-2 rounded-md bg-foreground px-4 py-2 text-sm text-background transition hover:opacity-85">
            <MessageCircle className="size-4" aria-hidden />
            Get in touch
          </Link>
        </div>

        <nav className="mt-8 flex flex-wrap gap-3 text-secondary" aria-label="Social links">
          {siteConfig.socials.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.label}
                href={item.href}
                title={item.label}
                aria-label={item.label}
                className="inline-flex size-6 items-center justify-center transition hover:text-foreground"
              >
                <Icon className="size-5" aria-hidden />
              </Link>
            );
          })}
        </nav>

        <p className="mt-8 max-w-2xl text-pretty font-mono text-sm leading-7 text-secondary italic">
          {siteConfig.quote}
        </p>
      </section>

      <Section title="Experience" action={{ label: "View work", href: "/work" }}>
        <div className="space-y-3">
          {resumeExperience.slice(0, 2).map((item) => (
            <Card key={`${item.company}-${item.role}`}>
              <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <h3 className="font-medium">{item.role}</h3>
                  <p className="text-sm text-muted">{item.company} · {item.location}</p>
                </div>
                <p className="text-sm text-muted">{item.period}</p>
              </div>
              <p className="mt-3 text-sm leading-6 text-muted">{item.highlights[0]}</p>
            </Card>
          ))}
        </div>
      </Section>

      <Section title="Latest Posts" action={{ label: "All posts", href: "/blog" }}>
        <p className="mb-4 text-sm leading-6 text-secondary">
          Pulled from <Link href={siteConfig.medium} className="underline underline-offset-4">Mahmoud&apos;s Medium</Link> and mirrored locally as MDX summaries.
        </p>
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
              <p className="mt-3 text-xs text-muted">{formatDate(post.publishedAt)} · {post.readingTime}</p>
            </Card>
          ))}
        </div>
      </Section>

      <Section title="Projects" action={{ label: "View projects", href: "/projects" }}>
        <div className="grid gap-3 sm:grid-cols-2">
          {importedProjects.slice(0, 2).map((project) => (
            <Card key={project.name} href={project.href}>
              <h3 className="font-medium">{project.name}</h3>
              <p className="mt-2 text-sm leading-6 text-muted">{project.description}</p>
              <div className="mt-4">
                <TagList tags={project.tags.length ? project.tags : [project.language]} />
              </div>
            </Card>
          ))}
        </div>
      </Section>

      <Section title="Development">
        <div className="grid gap-3 sm:grid-cols-3">
          {developmentLinks.map((item) => (
            <Card key={item.href} href={item.href}>
              <h3 className="font-medium">{item.title}</h3>
              <p className="mt-2 text-sm leading-6 text-muted">{item.description}</p>
            </Card>
          ))}
        </div>
      </Section>

      <Section title="Personal">
        <div className="grid gap-3 sm:grid-cols-2">
          {personalLinks.map((item) => (
            <Card key={item.href} href={item.href}>
              <h3 className="font-medium">{item.title}</h3>
            </Card>
          ))}
        </div>
      </Section>
    </>
  );
}
