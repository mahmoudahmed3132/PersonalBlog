import { createHash } from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import Link from "next/link";
import { InkHero, type HeroLayer } from "@/components/ink-hero";
import { CertificationList, Indent, Section } from "@/components/ui";
import { assetPath } from "@/lib/asset-path";
import { formatDate, getAllBlogPosts, postHref, type BlogPost } from "@/lib/blog";
import { importedProjects } from "@/lib/generated-projects";
import { certifications, credentialsProfileUrl, resumeExperience } from "@/lib/resume-data";
import { developmentLinks, personalLinks, siteConfig } from "@/lib/site-config";
import { speakingEvents } from "@/lib/speaking-data";

/**
 * Hero art lives in public/hero/. Presence is checked at build time so a
 * missing file never becomes a 404 on the live site; the procedural ink
 * placeholder for that layer renders instead. See public/hero/README.md.
 */
const HERO_FILES = ["layer-0-sky.png", "layer-1-subject.png", "layer-2-foreground.png"] as const;

function heroLayers(): [HeroLayer, HeroLayer, HeroLayer] {
  const [sky, subject, foreground] = HERO_FILES.map((file) => {
    const filePath = path.join(process.cwd(), "public/hero", file);
    if (!fs.existsSync(filePath)) return null;
    // Content hash, so replacing the art busts browser/CDN caches without touching assetVersion.
    const hash = createHash("sha1").update(fs.readFileSync(filePath)).digest("hex").slice(0, 8);
    return assetPath(`/hero/${file}?h=${hash}`);
  });
  return [
    { src: sky, alt: "" },
    {
      src: subject,
      alt: "Ink illustration of Mahmoud in headphones, standing in front of an Alfa Romeo Giulia Quadrifoglio.",
    },
    { src: foreground, alt: "" },
  ];
}

const startHere = [
  { slug: "see-more-stop-more", kicker: "Talk / Vendor testing" },
  { slug: "medium-active-defense-and-testing-the-security-gaps-in-edrs-using-atomic-red-team", kicker: "Detection / EDR" },
  { slug: "medium-threat-hunting-using-deepbluecli", kicker: "Hunting / Windows" },
];

const featuredProjects = [
  {
    name: "soar-lite",
    area: "Automation",
    note: "Elastic SIEM",
    title: "Enrich and triage alerts before a human sees them.",
    tagline: "Alert enrichment and auto-triage engine for Elastic SIEM.",
  },
  {
    name: "detection-gap-analyzer",
    area: "Coverage",
    note: "MITRE ATT&CK",
    title: "Find the techniques nothing is watching.",
    tagline: "ATT&CK coverage gap analysis with an HTML heatmap for Elastic SIEM.",
  },
  {
    name: "canary-deception-mesh",
    area: "Deception",
    note: "Near-zero FP",
    title: "Tripwires that only fire on attackers.",
    tagline: "Honeypots, canary tokens, and deception sensors with almost no false positives.",
  },
];

const pad = (n: number) => String(n).padStart(2, "0");

function postKicker(post: BlogPost) {
  const origin = post.source === "medium" ? "Medium" : "Notes";
  const tag = post.tags.find((t) => t.toLowerCase() !== origin.toLowerCase());
  return [tag, origin].filter(Boolean).join(" / ");
}

function PostLink({ post, className, children }: { post: BlogPost; className?: string; children: React.ReactNode }) {
  return post.externalUrl ? (
    <a href={post.externalUrl} className={className}>
      {children}
    </a>
  ) : (
    <Link href={postHref(post)} className={className}>
      {children}
    </Link>
  );
}

export default function HomePage() {
  const posts = getAllBlogPosts();
  const [latest, second, third, ...rest] = posts;
  const talk = speakingEvents[0];
  const stagePhoto = talk.photos[0];
  const firstYear = posts.length ? posts[posts.length - 1].publishedAt.slice(0, 4) : "";
  const picks = startHere
    .map((pick) => ({ ...pick, post: posts.find((p) => p.slug === pick.slug) }))
    .filter((pick): pick is typeof pick & { post: BlogPost } => Boolean(pick.post));

  const index = [
    { value: posts.length, label: "Posts" },
    { value: speakingEvents.length, label: "Talks" },
    { value: importedProjects.length, label: "Projects" },
    { value: certifications.length, label: "Certifications" },
    { value: firstYear, label: "First post" },
  ];

  const meta = [
    { label: "Author", value: siteConfig.name },
    { label: "Work", value: `${siteConfig.role}, Kashier` },
    { label: "Based", value: siteConfig.location },
    { label: "Focus", value: "Detection engineering, IR" },
  ];

  return (
    <>
      <div className="full-bleed -mt-16 sm:-mt-20">
        <InkHero layers={heroLayers()}>
          <div className="mx-auto flex h-full w-full max-w-[1180px] flex-col px-5 pt-10 sm:px-8 md:justify-center md:pt-0">
            <div className="max-w-xl">
              <h1 className="text-[3.25rem] font-bold leading-[0.95] tracking-tighter sm:text-7xl lg:text-[5.5rem]">
                Hi, I&apos;m Mahmoud.
              </h1>
              <p className="mt-4 text-xl font-medium leading-snug tracking-tight sm:text-3xl">
                I build detections and lead incident response for a fintech in Cairo.
              </p>
              <div className="mt-8 flex flex-wrap gap-2">
                <Link href="/blog" className="btn-ink px-5 py-3 text-sm font-medium">
                  Read the writing
                </Link>
                <Link href="/resume" className="btn-ink-outline px-5 py-3 text-sm font-medium">
                  Résumé
                </Link>
              </div>
            </div>
          </div>
        </InkHero>
      </div>

      <dl className="mt-14 grid grid-cols-2 gap-x-6 gap-y-6 md:grid-cols-12">
        {meta.map((item) => (
          <div key={item.label} className="md:col-span-3">
            <dt className="label">{item.label}</dt>
            <dd className="mt-1.5 text-sm">{item.value}</dd>
          </div>
        ))}
      </dl>

      <div className="mt-16 grid gap-10 md:grid-cols-12 md:gap-x-6">
        <div className="space-y-5 text-lg leading-8 sm:text-xl sm:leading-9 md:col-span-7">
          <p>
            I&apos;m a {siteConfig.role.toLowerCase()} at Kashier: SIEM, SOAR, EDR, and the compliance work that comes
            with handling payments: PCI DSS, SOC 2, ISO 27001.
          </p>
          <p className="text-secondary">
            Before that I spent years in managed security at BARQ Systems and Limatrix, rolling out CrowdStrike,
            Elastic, and Fortinet stacks for SOC-as-a-Service clients. Outside work: the sea, music, philosophy, and
            beautifully strange ideas.
          </p>
        </div>
        <nav className="md:col-span-3 md:col-start-10" aria-label="Contact and profiles">
          <p className="label">Reach me</p>
          <ul className="mt-3 space-y-2 text-sm">
            <li>
              <a href={`mailto:${siteConfig.email}`} className="link">
                {siteConfig.email.toLowerCase()}
              </a>
            </li>
            <li>
              <a href="https://www.linkedin.com/in/mahmoudhalim466/" className="link">
                LinkedIn
              </a>
            </li>
            <li>
              <a href="https://github.com/mahmoudahmed3132" className="link">
                GitHub
              </a>
            </li>
            <li>
              <a href={siteConfig.medium} className="link">
                Medium
              </a>
            </li>
          </ul>
        </nav>
      </div>

      {/* Index */}
      <div className="mt-20 grid gap-y-6 border-t border-rule pt-5 md:grid-cols-12 md:gap-x-6">
        <p className="label md:col-span-2">Index</p>
        <dl className="grid grid-cols-3 gap-y-6 sm:grid-cols-5 md:col-span-10">
          {index.map((item) => (
            <div key={item.label} className="flex flex-col-reverse justify-end border-l border-border pl-3 sm:pl-4">
              <dt className="label mt-1">{item.label}</dt>
              <dd className="text-4xl font-semibold tabular-nums tracking-tighter sm:text-5xl">{item.value}</dd>
            </div>
          ))}
        </dl>
      </div>

      {/* Start here */}
      {picks.length ? (
        <div className="mt-24 grid gap-y-6 md:grid-cols-12 md:gap-x-6">
          <div className="border-t border-rule pt-4 md:col-span-3">
            <h2 className="text-lg font-semibold leading-tight tracking-tight">New here? Start with these.</h2>
            <Link href="/work" className="label mt-3 inline-block text-foreground hover:opacity-70">
              Who writes this →
            </Link>
          </div>
          <ol className="border-t border-rule md:col-span-9">
            {picks.map((pick, i) => (
              <li key={pick.slug} className="border-b border-border last:border-b-0">
                <PostLink post={pick.post} className="group grid grid-cols-[2.5rem_1fr] gap-x-4 py-5 sm:grid-cols-[3rem_1fr_auto]">
                  <span className="font-mono text-xs tabular-nums text-muted">{pad(i + 1)}</span>
                  <span className="text-lg font-semibold leading-snug tracking-tight decoration-1 underline-offset-4 group-hover:underline sm:text-xl">
                    {pick.post.title}
                  </span>
                  <span className="label col-start-2 mt-2 sm:col-start-3 sm:mt-0 sm:pt-1.5">{pick.kicker}</span>
                </PostLink>
              </li>
            ))}
          </ol>
        </div>
      ) : null}

      {/* 01 Writing */}
      <Section
        number={1}
        title="Recent writing"
        eyebrow={latest ? `Latest · ${formatDate(latest.publishedAt)}` : undefined}
        actions={[
          { label: "All writing", href: "/blog" },
          { label: "RSS", href: assetPath("/rss.xml"), external: true },
        ]}
      >
        {latest ? (
          <Indent>
            <PostLink post={latest} className="group block">
              <h3 className="text-4xl font-bold leading-[1.05] tracking-tighter decoration-2 underline-offset-[6px] group-hover:underline sm:text-5xl">
                {latest.title}
              </h3>
              <p className="mt-5 max-w-2xl text-lg leading-8 text-secondary">{latest.description}</p>
              <p className="label mt-4">
                {postKicker(latest)} · {latest.readingTime}
              </p>
            </PostLink>

            <div className="mt-14 grid gap-10 sm:grid-cols-2 sm:gap-6">
              {[second, third].filter(Boolean).map((post) => (
                <PostLink key={post.slug} post={post} className="group block border-t border-rule pt-4">
                  <p className="label">
                    {formatDate(post.publishedAt)} · {postKicker(post)}
                  </p>
                  <h3 className="mt-3 text-2xl font-semibold leading-tight tracking-tight decoration-1 underline-offset-4 group-hover:underline">
                    {post.title}
                    {post.externalUrl ? <span className="font-normal text-muted"> ↗</span> : null}
                  </h3>
                  <p className="mt-3 line-clamp-3 text-sm leading-6 text-secondary">{post.description}</p>
                </PostLink>
              ))}
            </div>

            {rest.length ? (
              <ol className="mt-14 border-t border-rule">
                {rest.slice(0, 4).map((post, i) => (
                  <li key={post.slug} className="border-b border-border">
                    <PostLink post={post} className="group grid grid-cols-[2.5rem_1fr] gap-x-4 py-4 sm:grid-cols-[3rem_1fr_auto]">
                      <span className="font-mono text-xs tabular-nums text-muted">{pad(i + 4)}</span>
                      <span className="font-medium decoration-1 underline-offset-4 group-hover:underline">
                        {post.title}
                        {post.externalUrl ? <span className="font-normal text-muted"> ↗</span> : null}
                      </span>
                      <span className="label col-start-2 mt-1 tabular-nums sm:col-start-3 sm:mt-0">
                        {formatDate(post.publishedAt)}
                      </span>
                    </PostLink>
                  </li>
                ))}
              </ol>
            ) : null}
          </Indent>
        ) : null}
      </Section>

      {/* 02 Speaking */}
      <Section number={2} title="Speaking" eyebrow={talk.date} action={{ label: "All talks", href: "/speaking" }}>
        <Indent>
          <Link href={talk.postSlug ? `/blog/${talk.postSlug}` : "/speaking"} className="group block">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={assetPath(stagePhoto.src)}
              alt={stagePhoto.alt}
              width={1600}
              height={1066}
              loading="lazy"
              className="photo aspect-[16/9] w-full object-[center_65%] transition-opacity duration-300 group-hover:opacity-90"
            />
            <div className="mt-5 grid gap-4 sm:grid-cols-[1fr_auto] sm:gap-10">
              <div>
                <h3 className="text-2xl font-semibold tracking-tight decoration-1 underline-offset-4 group-hover:underline sm:text-3xl">
                  “{talk.talkTitle}”
                </h3>
                <p className="mt-3 max-w-2xl leading-7 text-secondary">
                  Why a vendor POC can&apos;t tell you whether a product will stop a breach, and how to test it through
                  adversary eyes instead.
                </p>
              </div>
              <p className="label sm:pt-2">{talk.event}</p>
            </div>
          </Link>
        </Indent>
      </Section>

      {/* 03 Experience */}
      <Section number={3} title="Experience" eyebrow="Fintech & managed security" action={{ label: "Full history", href: "/work" }}>
        <Indent>
          <ol className="border-t border-rule">
            {resumeExperience.map((item, i) => (
              <li key={`${item.company}-${item.role}`} className="border-b border-border">
                <a
                  href={item.companyUrl}
                  className="group grid grid-cols-[2.5rem_1fr] gap-x-4 py-5 sm:grid-cols-[3rem_1fr_auto]"
                >
                  <span className="font-mono text-xs tabular-nums text-muted">{pad(i + 1)}</span>
                  <span>
                    <span className="block text-lg font-semibold tracking-tight decoration-1 underline-offset-4 group-hover:underline">
                      {item.role}
                    </span>
                    <span className="text-sm text-muted">{item.company}</span>
                  </span>
                  <span className="label col-start-2 mt-2 tabular-nums sm:col-start-3 sm:mt-1.5">
                    {item.period.replace(" - ", " – ")}
                  </span>
                </a>
              </li>
            ))}
          </ol>
        </Indent>
      </Section>

      {/* 04 Projects */}
      <Section
        number={4}
        title="Projects"
        eyebrow="Open-source tooling"
        action={{ label: `All ${importedProjects.length}`, href: "/projects" }}
      >
        <div className="border-t border-border">
          {featuredProjects.map((project, i) => (
            <div key={project.name} className="grid gap-y-4 border-b border-border py-8 md:grid-cols-12 md:gap-x-6">
              <div className="md:col-span-3">
                <p className="label text-foreground">
                  {pad(i + 1)} {project.area}
                </p>
                <p className="label mt-1">{project.note}</p>
              </div>
              <div className="md:col-span-6">
                <h3 className="text-2xl font-semibold leading-tight tracking-tight sm:text-3xl">{project.title}</h3>
                <p className="mt-3 text-sm leading-6 text-secondary">{project.tagline}</p>
              </div>
              <div className="md:col-span-3 md:text-right">
                <a
                  href={`https://github.com/mahmoudahmed3132/${project.name}`}
                  className="btn-outline inline-block px-4 py-2.5 font-mono text-sm"
                >
                  {project.name} ↗
                </a>
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* 05 Certifications */}
      <Section
        number={5}
        title="Certifications"
        id="certifications"
        eyebrow={`${certifications.length} credentials`}
        actions={credentialsProfileUrl ? [{ label: "Verify on Credly", href: credentialsProfileUrl, external: true }] : undefined}
      >
        <Indent>
          <CertificationList items={certifications} />
        </Indent>
      </Section>

      {/* 06 Now */}
      <Section number={6} title="Now" eyebrow="Get in touch">
        <div className="grid gap-12 md:grid-cols-12 md:gap-x-6">
          <div className="md:col-span-5 md:col-start-4">
            <p className="text-2xl font-semibold leading-tight tracking-tight sm:text-3xl">
              Building detections and running incident response at Kashier, and open to senior security and detection
              engineering work.
            </p>
          </div>
          <div className="md:col-span-3 md:col-start-10">
            <p className="label">Contact</p>
            <p className="mt-3 text-sm leading-6 text-secondary">
              Email is the fastest way to reach me:{" "}
              <a href={`mailto:${siteConfig.email}`} className="link text-foreground">
                {siteConfig.email.toLowerCase()}
              </a>
            </p>
            <div className="mt-5 flex flex-wrap gap-2 text-sm">
              <Link href="/resume" className="btn-outline px-3 py-2">
                Résumé
              </Link>
              <a href="https://www.linkedin.com/in/mahmoudhalim466/" className="btn-outline px-3 py-2">
                LinkedIn
              </a>
              <a href="https://github.com/mahmoudahmed3132" className="btn-outline px-3 py-2">
                GitHub
              </a>
            </div>
            <p className="mt-8 text-sm text-muted">
              Also here:{" "}
              {[...developmentLinks, ...personalLinks].map((item, i, all) => (
                <span key={item.href}>
                  <Link href={item.href} className="link">
                    {item.title}
                  </Link>
                  {i < all.length - 1 ? ", " : "."}
                </span>
              ))}
            </p>
          </div>
        </div>
      </Section>
    </>
  );
}
