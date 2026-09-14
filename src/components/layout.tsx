"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { CommandPalette } from "@/components/command-palette";
import { ThemeToggle } from "@/components/theme-toggle";
import { siteConfig } from "@/lib/site-config";

export function Header() {
  const pathname = usePathname();
  const isBlogPost = pathname?.startsWith("/blog/");

  function isActive(href: string) {
    if (href === "/") return pathname === "/";
    if (href === "/blog") return pathname === "/blog" || Boolean(isBlogPost);
    return pathname?.startsWith(href) ?? false;
  }

  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/80 backdrop-blur-md">
      <div className="mx-auto w-full max-w-3xl px-4">
        <div className="flex h-14 items-center justify-between gap-3">
          <Link
            href="/"
            aria-label="Home"
            className="skill-inner-shadow flex size-9 shrink-0 items-center justify-center rounded-md border border-border bg-surface font-mono text-sm font-bold tracking-tight transition hover:border-foreground/30"
          >
            {siteConfig.author.initials}
          </Link>

          <nav className="flex items-center gap-1 text-sm" aria-label="Main">
            {siteConfig.nav.map((item) => {
              const active = isActive(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  className={`relative rounded-md px-2.5 py-1.5 transition sm:px-3 ${
                    active
                      ? "font-medium text-foreground"
                      : "text-muted hover:text-foreground"
                  }`}
                >
                  {item.label}
                  <span
                    aria-hidden
                    className={`absolute inset-x-2.5 -bottom-[9px] h-0.5 rounded-full transition-all sm:inset-x-3 ${
                      active ? "bg-accent opacity-100" : "opacity-0"
                    }`}
                  />
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center justify-end gap-2">
            <CommandPalette />
            <ThemeToggle />
          </div>
        </div>
      </div>
    </header>
  );
}

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-24 border-t border-border/60">
      <div className="mx-auto w-full max-w-3xl px-4 py-12">
        <div className="flex flex-col gap-8 sm:flex-row sm:items-start sm:justify-between">
          <div className="max-w-xs">
            <p className="font-mono text-sm font-bold">{siteConfig.author.initials} — {siteConfig.name}</p>
            <p className="mt-2 text-sm leading-6 text-secondary">
              {siteConfig.role} based in {siteConfig.location}.
            </p>
            <p className="mt-3 text-xs text-muted">
              © {year}. Built with Next.js, Tailwind CSS, and too much coffee.
            </p>
          </div>
          <nav
            className="flex flex-col gap-2 text-sm"
            aria-label="Footer"
          >
            {siteConfig.footer.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-muted transition hover:text-foreground"
              >
                {item.label}
              </Link>
            ))}
            <Link href="/resume" className="text-accent transition hover:text-accent-strong">
              Résumé →
            </Link>
          </nav>
        </div>
      </div>
    </footer>
  );
}
