"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { CommandPalette } from "@/components/command-palette";
import { OPEN_CONSOLE_EVENT } from "@/components/console";
import { ThemeToggle } from "@/components/theme-toggle";
import { assetPath } from "@/lib/asset-path";
import { siteConfig } from "@/lib/site-config";

const pad = (n: number) => String(n).padStart(2, "0");

export function Header() {
  const pathname = usePathname();

  function isActive(href: string) {
    if (href === "/blog") return pathname === "/blog" || Boolean(pathname?.startsWith("/blog/"));
    return pathname?.startsWith(href) ?? false;
  }

  return (
    <header className="sticky top-0 z-40 border-b border-rule bg-background">
      <div className="mx-auto grid h-[var(--header-h)] w-full max-w-[1180px] grid-cols-[1fr_auto] content-center gap-y-3 px-5 sm:px-8 md:grid-cols-12 md:items-center">
        <Link href="/" className="leading-tight md:col-span-3">
          <span className="block text-[0.95rem] font-semibold tracking-tight">{siteConfig.name}</span>
          <span className="hidden text-xs text-muted md:block">{siteConfig.tagline}</span>
        </Link>

        <div className="flex items-center justify-end md:order-last md:col-span-2">
          <CommandPalette />
          <ThemeToggle />
        </div>

        <nav
          className="col-span-2 grid grid-cols-5 gap-2 text-sm md:col-span-7 md:gap-4 lg:text-[0.95rem]"
          aria-label="Main"
        >
          {siteConfig.nav.map((item, index) => {
            const active = isActive(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={`group flex flex-col leading-tight transition-colors lg:flex-row lg:items-baseline lg:gap-2 ${
                  active ? "text-foreground" : "text-foreground/75 hover:text-foreground"
                }`}
              >
                <span className="font-mono text-[0.65rem] tabular-nums text-muted">{pad(index + 1)}</span>
                <span className={active ? "underline decoration-1 underline-offset-[6px]" : ""}>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}

const colophon = [
  {
    title: "Read",
    links: [
      { label: "All writing", href: "/blog" },
      { label: "Speaking", href: "/speaking" },
      { label: "See More, Stop More", href: "/blog/see-more-stop-more" },
    ],
  },
  {
    title: "Explore",
    links: [
      { label: "Work", href: "/work" },
      { label: "Projects", href: "/projects" },
      { label: "Résumé", href: "/resume" },
      { label: "Gears & setup", href: "/gears" },
    ],
  },
  {
    title: "Subscribe",
    links: [
      { label: "RSS", href: "/rss.xml", file: true },
      { label: "Medium", href: siteConfig.medium },
    ],
  },
  {
    title: "Elsewhere",
    links: [
      { label: "GitHub", href: "https://github.com/mahmoudahmed3132" },
      { label: "LinkedIn", href: "https://www.linkedin.com/in/mahmoudhalim466/" },
      { label: "Email", href: `mailto:${siteConfig.email}` },
    ],
  },
] as const;

export function Footer() {
  const year = new Date().getFullYear();
  const sha = process.env.BUILD_SHA;
  const built = (process.env.BUILD_TIME ?? "").slice(0, 10);

  return (
    <footer className="mt-24 border-t border-rule">
      <div className="mx-auto w-full max-w-[1180px] px-5 sm:px-8">
        <div className="grid gap-6 py-14 md:grid-cols-12">
          <p className="label md:col-span-3">Colophon</p>
          <p className="max-w-2xl text-2xl font-semibold leading-tight tracking-tight sm:text-3xl md:col-span-9">
            Notes on detection engineering, incident response, and the systems around them. Written from Cairo.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-x-6 gap-y-10 pb-14 md:grid-cols-12">
          {colophon.map((group, index) => (
            <div key={group.title} className="md:col-span-3">
              <p className="label">
                {pad(index + 1)} {group.title}
              </p>
              <ul className="mt-4 space-y-2 text-sm">
                {group.links.map((link) => {
                  const cls = "text-foreground/80 transition-colors hover:text-foreground";
                  if ("file" in link) {
                    // Plain anchor: a feed, not a route, so Link prefetching would 404.
                    return (
                      <li key={link.href}>
                        <a href={assetPath(link.href)} className={cls}>
                          {link.label}
                        </a>
                      </li>
                    );
                  }
                  return (
                    <li key={link.href}>
                      {link.href.startsWith("/") ? (
                        <Link href={link.href} className={cls}>
                          {link.label}
                        </Link>
                      ) : (
                        <a href={link.href} className={cls}>
                          {link.label}
                        </a>
                      )}
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>

        <dl className="grid grid-cols-1 gap-6 border-t border-border py-8 text-sm sm:grid-cols-3 md:grid-cols-12">
          <div className="md:col-span-3 md:col-start-4">
            <dt className="label">Type</dt>
            <dd className="mt-1.5 text-muted">Geist and Geist Mono</dd>
          </div>
          <div className="md:col-span-3">
            <dt className="label">Grid</dt>
            <dd className="mt-1.5 text-muted">Twelve columns, 1px rules</dd>
          </div>
          <div className="md:col-span-3">
            <dt className="label">Built with</dt>
            <dd className="mt-1.5 text-muted">
              Next.js static export on GitHub Pages
              {sha ? (
                <>
                  {" · "}
                  <a
                    href={`https://github.com/mahmoudahmed3132/PersonalBlog/commit/${sha}`}
                    className="font-mono text-xs transition-colors hover:text-foreground"
                    title={`The commit this page was built from (${built})`}
                  >
                    {sha}
                  </a>
                </>
              ) : null}
            </dd>
          </div>
        </dl>

        <div className="flex flex-wrap items-center justify-between gap-4 border-t border-border py-6 font-mono text-xs text-muted">
          <p className="uppercase tracking-wider">© {year} {siteConfig.name}</p>
          <button
            type="button"
            onClick={() => window.dispatchEvent(new Event(OPEN_CONSOLE_EVENT))}
            className="transition-colors hover:text-foreground"
          >
            &gt;_ press <kbd className="border border-border px-1">~</kbd> for a console
          </button>
          <a href="#main-content" className="uppercase tracking-wider transition-colors hover:text-foreground">
            Back to top ↑
          </a>
        </div>
      </div>
    </footer>
  );
}
