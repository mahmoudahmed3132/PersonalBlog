import Link from "next/link";

/**
 * A numbered section on the twelve-column grid: hairline on top, the number
 * and an optional label in the left gutter, a large title and actions on the right.
 */
export function Section({
  title,
  children,
  action,
  actions,
  id,
  number,
  eyebrow,
}: {
  title: string;
  /** Small caps label under the number in the gutter. */
  eyebrow?: string;
  children: React.ReactNode;
  action?: { label: string; href: string };
  actions?: { label: string; href: string; external?: boolean }[];
  id?: string;
  number?: number;
}) {
  const links = [...(action ? [action] : []), ...(actions ?? [])] as { label: string; href: string; external?: boolean }[];
  return (
    <section className="mt-24 scroll-mt-28 border-t border-rule pt-6 sm:mt-32" id={id}>
      <div className="grid gap-y-4 md:grid-cols-12 md:gap-x-6">
        <div className="md:col-span-3">
          {number ? <p className="font-mono text-xs tabular-nums">{String(number).padStart(2, "0")}</p> : null}
          {eyebrow ? <p className="label mt-1">{eyebrow}</p> : null}
        </div>
        <div className="flex flex-wrap items-end justify-between gap-x-6 gap-y-3 md:col-span-9">
          <h2 className="text-4xl font-semibold tracking-tighter sm:text-5xl">{title}</h2>
          {links.length ? (
            <div className="flex gap-5 pb-1.5">
              {links.map((link) =>
                link.external ? (
                  <a key={link.href} href={link.href} className="label text-foreground transition-opacity hover:opacity-70">
                    {link.label} →
                  </a>
                ) : (
                  <Link key={link.href} href={link.href} className="label text-foreground transition-opacity hover:opacity-70">
                    {link.label} →
                  </Link>
                ),
              )}
            </div>
          ) : null}
        </div>
      </div>
      <div className="mt-10">{children}</div>
    </section>
  );
}

/** Wraps section content so it sits in columns 4–12, aligned under the title. */
export function Indent({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`grid md:grid-cols-12 md:gap-x-6 ${className}`}>
      <div className="md:col-span-9 md:col-start-4">{children}</div>
    </div>
  );
}

export function PageHeader({
  title,
  eyebrow,
  description,
  children,
}: {
  title: string;
  eyebrow?: string;
  description?: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="mb-16">
      {eyebrow ? <p className="label mb-4">{eyebrow}</p> : null}
      <h1 className="text-5xl font-bold tracking-tighter sm:text-7xl">{title}</h1>
      {description ? (
        <p className="mt-6 max-w-2xl text-pretty text-lg leading-8 text-secondary sm:text-xl sm:leading-9">{description}</p>
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
    "block border border-border p-5 transition-colors duration-200 hover:border-foreground";
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

export function CertificationList({
  items,
}: {
  items: readonly { name: string; issuer?: string; url: string }[];
}) {
  return (
    <ul className="grid gap-x-10 text-sm sm:grid-cols-2">
      {items.map((cert) => (
        <li key={cert.name} className="border-b border-border py-3 leading-6">
          {cert.url ? (
            <a href={cert.url} className="link text-foreground">
              {cert.name}
              <span className="text-muted" aria-hidden>
                {" "}
                ↗
              </span>
            </a>
          ) : (
            <span className="text-foreground">{cert.name}</span>
          )}
          {cert.issuer ? <span className="block text-xs text-muted">{cert.issuer}</span> : null}
        </li>
      ))}
    </ul>
  );
}
