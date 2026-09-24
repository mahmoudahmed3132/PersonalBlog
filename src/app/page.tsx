import Link from "next/link";
import { CertificationList, Row, Section } from "@/components/ui";
import { assetPath } from "@/lib/asset-path";
import { formatDate, getAllBlogPosts, postHref } from "@/lib/blog";
import { importedProjects } from "@/lib/generated-projects";
import { certifications, credentialsProfileUrl, resumeExperience } from "@/lib/resume-data";
import { developmentLinks, personalLinks, siteConfig } from "@/lib/site-config";
import { speakingEvents } from "@/lib/speaking-data";

const featuredProjects = [
  {
    name: "soar-lite",
    tagline: "Alert enrichment & auto-triage engine for Elastic SIEM",
  },
  {
    name: "detection-gap-analyzer",
    tagline: "ATT&CK coverage gap analysis with an HTML heatmap for Elastic SIEM",
  },
  {
    name: "canary-deception-mesh",
    tagline: "Honeypots, canary tokens, and near-zero-FP deception sensors",
  },
];

const heroLinks = [
  { label: "Résumé", href: "/resume" },
  { label: "Email", href: `mailto:${siteConfig.email}` },
  { label: "LinkedIn", href: "https://www.linkedin.com/in/mahmoudhalim466/" },
  { label: "GitHub", href: "https://github.com/mahmoudahmed3132" },
  { label: "Medium", href: siteConfig.medium },
];

export default function HomePage() {
  const posts = getAllBlogPosts().slice(0, 5);
  const talk = speakingEvents[0];
  const [stagePhoto, hallwayPhoto] = talk.photos;

  return (
    <>
      <section className="grid items-center gap-10 md:grid-cols-[1.15fr_1fr] md:gap-14">
        <div>
          <p className="text-sm text-muted">
            {siteConfig.role} at Kashier · {siteConfig.location}
          </p>
          <h1 className="mt-4 text-5xl font-semibold tracking-tight sm:text-6xl">Hi, I&apos;m Mahmoud.</h1>
          <div className="mt-7 space-y-4 text-lg leading-8 text-secondary">
            <p>
              I build detections and lead incident response for a fintech in Cairo — SIEM, SOAR, EDR, and the
              compliance work that comes with handling payments.
            </p>
            <p>
              Before that I spent years in managed security at BARQ Systems and Limatrix, rolling out CrowdStrike,
              Elastic, and Fortinet stacks for SOC-as-a-Service clients. Outside work: the sea, music, philosophy, and
              beautifully strange ideas.
            </p>
          </div>
          <nav className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-sm" aria-label="Contact and profiles">
            {heroLinks.map((item) =>
              item.href.startsWith("/") ? (
                <Link key={item.label} href={item.href} className="link font-medium">
                  {item.label}
                </Link>
              ) : (
                <a key={item.label} href={item.href} className="link font-medium">
                  {item.label}
                </a>
              ),
            )}
          </nav>
        </div>

        <figure>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={assetPath(hallwayPhoto.src)}
            alt={hallwayPhoto.alt}
            width={1600}
            height={1066}
            fetchPriority="high"
            className="photo aspect-[4/5] w-full rounded-xl object-[80%_center]"
          />
          <figcaption className="mt-3 text-xs text-muted">
            {talk.event}, {talk.date.replace(/^\d+\s/, "")}.
          </figcaption>
        </figure>
      </section>

      <Section title="Writing" action={{ label: "All posts", href: "/blog" }}>
        <ul>
          {posts.map((post) => (
            <Row
              key={post.slug}
              href={postHref(post)}
              title={
                <>
                  {post.title}
                  {post.externalUrl ? <span className="font-normal text-muted"> ↗</span> : null}
                </>
              }
              meta={formatDate(post.publishedAt)}
            />
          ))}
        </ul>
      </Section>

      <Section title="Speaking" action={{ label: "All talks", href: "/speaking" }}>
        <Link href="/speaking" className="group block">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={assetPath(stagePhoto.src)}
            alt={stagePhoto.alt}
            width={1600}
            height={1066}
            loading="lazy"
            className="photo aspect-[16/9] w-full rounded-xl object-[center_65%] transition-opacity duration-300 group-hover:opacity-90"
          />
          <div className="mt-4 flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between sm:gap-6">
            <p className="font-medium decoration-foreground/30 underline-offset-4 group-hover:underline">
              “{talk.talkTitle}” — {talk.event}
            </p>
            <p className="shrink-0 text-sm tabular-nums text-muted">{talk.date}</p>
          </div>
          <p className="mt-1.5 max-w-2xl text-sm leading-6 text-muted">
            Detection visibility, and what it takes to stop more adversaries.
          </p>
        </Link>
      </Section>


      <Section title="Experience" action={{ label: "Full history", href: "/work" }}>
        <ul>
          {resumeExperience.map((item) => (
            <Row
              key={`${item.company}-${item.role}`}
              href={item.companyUrl}
              title={
                <>
                  {item.role} <span className="font-normal text-muted">at {item.company}</span>
                </>
              }
              meta={item.period.replace(" - ", " – ")}
            />
          ))}
        </ul>
      </Section>

      <Section title="Projects" action={{ label: `All ${importedProjects.length}`, href: "/projects" }}>
        <ul>
          {featuredProjects.map((project) => (
            <Row
              key={project.name}
              href={`https://github.com/mahmoudahmed3132/${project.name}`}
              title={project.name}
              description={project.tagline}
            />
          ))}
        </ul>
      </Section>

      <Section
        title="Certifications"
        id="certifications"
        action={credentialsProfileUrl ? { label: "Verify on Credly", href: credentialsProfileUrl } : undefined}
      >
        <CertificationList items={certifications} />
      </Section>

      <Section title="Get in touch">
        <p className="max-w-2xl text-lg leading-8 text-secondary">
          I&apos;m open to senior security engineering roles and detection engineering work. Email is the fastest
          way to reach me:{" "}
          <a href={`mailto:${siteConfig.email}`} className="link text-foreground">
            {siteConfig.email.toLowerCase()}
          </a>
          .
        </p>
        <p className="mt-6 text-sm text-muted">
          Also on this site:{" "}
          {[...developmentLinks, ...personalLinks].map((item, index, all) => (
            <span key={item.href}>
              <Link href={item.href} className="link">
                {item.title}
              </Link>
              {index < all.length - 1 ? ", " : "."}
            </span>
          ))}
        </p>
      </Section>
    </>
  );
}
