import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  BadgeCheck,
  BrainCircuit,
  BriefcaseBusiness,
  CloudCog,
  FileText,
  Mail,
  MapPin,
  MessageCircle,
  Mic,
  Radar,
  ScanEye,
  ShieldCheck,
  Workflow,
} from "lucide-react";
import { Card, Section, StatBand, TagList } from "@/components/ui";
import { Line, Prompt, TerminalWindow } from "@/components/terminal";
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

const str = (value: string) => <span className="term-str">&quot;{value}&quot;</span>;
const list = (values: string[]) => (
  <>
    [
    {values.map((value, index) => (
      <span key={value}>
        {index ? ", " : ""}
        {value}
      </span>
    ))}
    ]
  </>
);

const profileYaml = [
  { key: "name", value: str("Mahmoud Halim") },
  { key: "role", value: str("Senior Security Engineer") },
  { key: "focus", value: list(["detection_engineering", "incident_response", "soar"]) },
  { key: "stack", value: null },
  { key: "edr", indent: true, value: list(["crowdstrike_falcon", "elastic", "fortiedr"]) },
  { key: "siem", indent: true, value: list(["logscale", "elastic", "splunk", "fortisiem"]) },
  { key: "compliance", value: list(["pci_dss", "soc2", "iso27001"]) },
  {
    key: "location",
    value: (
      <>
        {str("Cairo, EG")} <span className="term-comment"># UTC+3</span>
      </>
    ),
  },
];

const hireMeRule = [
  { depth: 0, key: "title", value: str("Senior Security Engineer Available") },
  { depth: 0, key: "status", value: <span className="term-num">stable</span> },
  { depth: 0, key: "logsource", value: null },
  { depth: 1, key: "product", value: "inbox" },
  { depth: 0, key: "detection", value: null },
  { depth: 1, key: "selection", value: null },
  {
    depth: 2,
    key: "subject|contains",
    value: list(["detection engineering", "incident response", "soar", "dfir"]),
  },
  { depth: 1, key: "condition", value: "selection" },
  { depth: 0, key: "falsepositives", value: list(["recruiter spam"]) },
  { depth: 0, key: "level", value: <span className="term-num">high</span> },
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
            className="size-24 rounded-full bg-[#93c5fd] object-cover ring-2 ring-accent/50 ring-offset-4 ring-offset-background dark:bg-[#fde68a]"
          />
        </div>

        <div className="animate-fade-up stagger-1 mt-7 flex flex-col gap-3">
          <p className="inline-flex w-fit items-center gap-2 rounded-full border border-accent/30 bg-accent-soft px-3 py-1 font-mono text-xs text-foreground/80">
            <span className="inline-block size-2 rounded-full bg-accent" style={{ animation: "pulse-dot 2.2s ease-in-out infinite" }} aria-hidden />
            status: <span className="text-accent">open_to_senior_security_roles</span>
          </p>
          <h1 className="text-4xl font-bold tracking-tight sm:text-[2.6rem] sm:leading-[1.15]">
            <span className="glitch">Mahmoud Halim</span> <span className="text-muted">—</span> <TypedRole />
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

        <TerminalWindow title="mahmoud@kashier: ~ — zsh" className="animate-fade-up stagger-5 mt-10">
          <Line delay={0.4}>
            <Prompt>whoami</Prompt>
          </Line>
          <Line delay={0.7}>
            mahmoud.halim <span className="term-comment">—</span> senior security engineer @ kashier
          </Line>
          <Line delay={1.0}>
            <Prompt>cat profile.yaml</Prompt>
          </Line>
          {profileYaml.map((row, index) => (
            <Line key={row.key} delay={1.3 + index * 0.12}>
              {row.indent ? "  " : ""}
              <span className="term-key">{row.key}</span>
              <span className="term-comment">:</span> {row.value}
            </Line>
          ))}
          <Line delay={1.3 + profileYaml.length * 0.12 + 0.3}>
            <Prompt>fortune</Prompt>
          </Line>
          <Line delay={1.3 + profileYaml.length * 0.12 + 0.6}>
            <span className="term-comment italic">{siteConfig.quote}</span>
          </Line>
          <Line delay={1.3 + profileYaml.length * 0.12 + 0.9}>
            <Prompt>
              <span className="typed-caret !bg-[#3ee6a1]" aria-hidden />
            </Prompt>
          </Line>
        </TerminalWindow>
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
              <Card key={item.area} className="group">
                <span className="absolute right-3 top-3 font-mono text-[10px] text-muted transition group-hover:text-accent">
                  0x{(index + 1).toString(16).padStart(2, "0")}
                </span>
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
          {resumeExperience.map((item, index) => (
            <li key={`${item.company}-${item.role}`} className="relative">
              <span
                className={`absolute -left-[31px] top-1.5 size-2.5 rounded-full border-2 border-background ${
                  index === 0 ? "bg-accent" : "bg-muted"
                }`}
                style={index === 0 ? { animation: "pulse-dot 2.2s ease-in-out infinite" } : undefined}
                aria-hidden
              />
              {index === 0 ? (
                <p className="mb-1 font-mono text-[11px] text-accent">
                  (HEAD -&gt; <span className="text-accent-2">{item.company.toLowerCase()}</span>)
                </p>
              ) : null}
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

      <Section title="Speaking" eyebrow="On stage" action={{ label: "All speaking", href: "/speaking" }}>
        <Card href="/speaking" className="overflow-hidden !p-0">
          <div className="flex flex-col sm:flex-row">
            <div className="sm:w-3/5">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={assetPath("/speaking/speaking-stage.jpg")}
                alt="Mahmoud Halim presenting “See More, Stop More” with a microphone at the CrowdStrike Adversary Simulation event"
                width={1600}
                height={1066}
                loading="lazy"
                className="aspect-[3/2] h-full w-full object-cover"
              />
            </div>
            <div className="flex flex-1 flex-col justify-center p-5 sm:w-2/5">
              <p className="font-mono text-xs uppercase tracking-widest text-accent">CrowdStrike Adversary Simulation · July 2026</p>
              <h3 className="mt-2 font-medium leading-6">
                “See More, Stop More”
              </h3>
              <p className="mt-2 text-sm leading-6 text-muted">
                On stage and in the hallway track — sharing detection engineering and incident
                response lessons.
              </p>
              <p className="mt-3 inline-flex items-center gap-1.5 text-sm text-accent">
                <Mic className="size-4" aria-hidden /> See the photos
              </p>
            </div>
          </div>
        </Card>
      </Section>

      <Section title="Certifications" eyebrow="Credentials" id="certifications">
        <ul className="grid gap-2.5 sm:grid-cols-2">
          {certifications.map((cert) => (
            <li
              key={cert}
              className="skill-inner-shadow flex items-start gap-2.5 rounded-lg border border-border bg-card/70 px-3.5 py-3 text-sm"
            >
              <BadgeCheck className="mt-0.5 size-4 shrink-0 text-accent" aria-hidden />
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
              <p className="mt-3 font-mono text-[11px] text-muted">
                <span className="text-accent">▸</span> {formatDate(post.publishedAt)} · {post.readingTime}
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
        <TerminalWindow title="rules/hire_me.yml — sigma">
          <div className="term-comment"># fires on interesting security problems</div>
          {hireMeRule.map((row) => (
            <div key={row.key} className="whitespace-pre-wrap break-words">
              {"  ".repeat(row.depth)}
              <span className="term-key">{row.key}</span>
              <span className="term-comment">:</span>
              {row.value ? <> {row.value}</> : null}
            </div>
          ))}
        </TerminalWindow>
        <p className="mt-5 text-sm leading-7 text-secondary">
          Open to senior security engineering roles, detection engineering work, and interesting collaborations.
          Email is fastest — I usually reply within a day.
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
      </Section>
    </>
  );
}
