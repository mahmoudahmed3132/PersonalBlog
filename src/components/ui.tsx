import Link from "next/link";

export function Section({
  title,
  eyebrow = "Featured",
  children,
  action,
  id,
}: {
  title: string;
  eyebrow?: string;
  children: React.ReactNode;
  action?: { label: string; href: string };
  id?: string;
}) {
  return (
    <section className="mt-20 scroll-mt-24" id={id}>
      <div>
        <p className="font-mono text-xs uppercase tracking-widest text-accent">{eyebrow}</p>
        <h2 className="mt-1 text-2xl font-bold tracking-tight">{title}</h2>
      </div>
      <div className="mt-7">{children}</div>
      {action ? (
        <div className="mt-8 flex justify-center">
          <Link
            href={action.href}
            className="btn-outline rounded-md px-4 py-2 text-sm"
          >
            {action.label}
          </Link>
        </div>
      ) : null}
    </section>
  );
}

export function PageHeader({
  title,
  eyebrow = "Index",
  description,
  children,
}: {
  title: string;
  eyebrow?: string;
  description?: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="mb-10">
      <p className="font-mono text-xs uppercase tracking-widest text-accent">{eyebrow}</p>
      <h1 className="mt-1 text-3xl font-bold tracking-tight">{title}</h1>
      {description ? (
        <p className="mt-4 max-w-2xl text-pretty leading-7 text-secondary">{description}</p>
      ) : null}
      {children}
    </div>
  );
}

export function Card({
  children,
  href,
  className = "",
}: {
  children: React.ReactNode;
  href?: string;
  className?: string;
}) {
  const base =
    "block rounded-xl border border-border bg-card/70 p-4 transition duration-300 hover:-translate-y-0.5 hover:border-foreground/25 hover:bg-subtle/70";
  const resolved = `${base} ${className}`.trim();

  if (href) {
    return (
      <Link href={href} className={resolved}>
        {children}
      </Link>
    );
  }

  return <div className={resolved}>{children}</div>;
}

export function TagList({ tags }: { tags: readonly string[] }) {
  return (
    <div className="flex flex-wrap gap-2">
      {tags.map((tag) => (
        <span
          key={tag}
          className="tag-inner-shadow rounded-md border border-dashed border-foreground/20 bg-foreground/5 px-2.5 py-1 text-xs text-secondary dark:border-white/25 dark:bg-white/10"
        >
          {tag}
        </span>
      ))}
    </div>
  );
}

export function StatBand({
  stats,
}: {
  stats: { label: string; value: string; hint?: string }[];
}) {
  return (
    <dl className="grid grid-cols-2 gap-3 sm:grid-cols-4">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="skill-inner-shadow rounded-xl border border-border bg-card/70 px-4 py-3"
        >
          <dd className="text-xl font-bold tracking-tight">{stat.value}</dd>
          <dt className="mt-0.5 text-xs font-medium text-muted">{stat.label}</dt>
          {stat.hint ? <p className="mt-1 text-[11px] leading-4 text-muted">{stat.hint}</p> : null}
        </div>
      ))}
    </dl>
  );
}
