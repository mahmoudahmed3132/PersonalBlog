import Link from "next/link";

export function Section({
  title,
  children,
  action,
  subHeading = "Featured",
}: {
  title: string;
  children: React.ReactNode;
  action?: { label: string; href: string };
  subHeading?: string;
}) {
  return (
    <section className="mt-20">
      <div>
        <p className="text-sm text-secondary">{subHeading}</p>
        <h2 className="text-2xl font-bold">{title}</h2>
      </div>
      <div className="mt-8">{children}</div>
      {action ? (
        <div className="mt-8 flex justify-center">
          <Link href={action.href} className="btn-inner-shadow rounded-md border border-border px-4 py-2 text-sm transition hover:bg-subtle">
            {action.label}
          </Link>
        </div>
      ) : null}
    </section>
  );
}

export function PageHeader({ title, description }: { title: string; description?: string }) {
  return (
    <div className="mb-10">
      <p className="text-sm text-secondary">Index</p>
      <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
      {description ? <p className="mt-4 max-w-2xl text-pretty leading-7 text-secondary">{description}</p> : null}
    </div>
  );
}

export function Card({ children, href }: { children: React.ReactNode; href?: string }) {
  const className =
    "block rounded-xl border border-border bg-card/70 p-4 transition duration-300 hover:-translate-y-0.5 hover:border-foreground/25 hover:bg-subtle/70";

  if (href) {
    return (
      <Link href={href} className={className}>
        {children}
      </Link>
    );
  }

  return <div className={className}>{children}</div>;
}

export function TagList({ tags }: { tags: readonly string[] }) {
  return (
    <div className="flex flex-wrap gap-2">
      {tags.map((tag) => (
        <span key={tag} className="tag-inner-shadow rounded-md border border-dashed border-foreground/20 bg-foreground/5 px-2.5 py-1 text-xs text-secondary dark:border-white/25 dark:bg-white/10">
          {tag}
        </span>
      ))}
    </div>
  );
}
