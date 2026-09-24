import Link from "next/link";

export function Section({
  title,
  children,
  action,
  id,
}: {
  title: string;
  /** Kept for call-site compatibility; the minimal design shows only the title. */
  eyebrow?: string;
  children: React.ReactNode;
  action?: { label: string; href: string };
  id?: string;
}) {
  return (
    <section className="mt-24 scroll-mt-24" id={id}>
      <div className="flex items-baseline justify-between gap-4 border-b border-border pb-3">
        <h2 className="text-lg font-semibold tracking-tight">{title}</h2>
        {action ? (
          <Link href={action.href} className="shrink-0 text-sm text-muted transition hover:text-foreground">
            {action.label} →
          </Link>
        ) : null}
      </div>
      <div className="mt-6">{children}</div>
    </section>
  );
}

export function PageHeader({
  title,
  description,
  children,
}: {
  title: string;
  /** Kept for call-site compatibility; not rendered. */
  eyebrow?: string;
  description?: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="mb-14">
      <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">{title}</h1>
      {description ? (
        <p className="mt-5 max-w-2xl text-pretty text-lg leading-8 text-secondary">{description}</p>
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
    "block rounded-lg border border-border p-5 transition-colors duration-200 hover:border-foreground/25";
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
    <ul className="flex flex-wrap gap-x-3 gap-y-1 text-xs text-muted">
      {tags.map((tag) => (
        <li key={tag}>#{tag.toLowerCase().replace(/\s+/g, "-")}</li>
      ))}
    </ul>
  );
}

/** A plain list row: title on the left, meta on the right, hairline between rows. */
export function Row({
  href,
  title,
  meta,
  description,
}: {
  href: string;
  title: React.ReactNode;
  meta?: React.ReactNode;
  description?: React.ReactNode;
}) {
  const external = href.startsWith("http");
  const content = (
    <>
      <div className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between sm:gap-6">
        <span className="font-medium decoration-foreground/30 underline-offset-4 group-hover:underline">
          {title}
        </span>
        {meta ? <span className="shrink-0 text-sm tabular-nums text-muted">{meta}</span> : null}
      </div>
      {description ? <p className="mt-1.5 text-sm leading-6 text-muted">{description}</p> : null}
    </>
  );

  return (
    <li className="border-b border-border last:border-b-0">
      {external ? (
        <a href={href} className="group block py-4">
          {content}
        </a>
      ) : (
        <Link href={href} className="group block py-4">
          {content}
        </Link>
      )}
    </li>
  );
}
