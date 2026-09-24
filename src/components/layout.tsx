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
            className="group flex shrink-0 items-center gap-1 font-mono text-sm font-bold tracking-tight"
          >
            <span className="text-accent">~/</span>
            <span className="lowercase">{siteConfig.author.initials}</span>
            <span className="typed-caret !h-4 opacity-0 transition group-hover:opacity-100" aria-hidden />
          </Link>

          <nav className="-mx-1 flex min-w-0 items-center overflow-x-auto px-1 [scrollbar-width:none] sm:gap-1 sm:overflow-visible" aria-label="Main">
            {siteConfig.nav.map((item) => {
              const active = isActive(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  className={`relative shrink-0 rounded-md px-1.5 py-1.5 font-mono ${item.href === "/" ? "hidden sm:block" : ""} text-xs lowercase transition sm:px-2.5 sm:text-[13px] ${
                    active
                      ? "text-foreground"
                      : "text-muted hover:text-foreground"
                  }`}
                >
                  <span className={active ? "text-accent" : "hidden sm:inline sm:opacity-40"} aria-hidden>
                    {active ? "> " : "/"}
                  </span>
                  {item.label}
                  <span
                    aria-hidden
                    className={`absolute inset-x-2 -bottom-[9px] h-0.5 rounded-full shadow-[0_0_8px_var(--glow)] transition-all sm:inset-x-2.5 ${
                      active ? "bg-accent opacity-100" : "opacity-0"
                    }`}
                  />
                </Link>
              );
            })}
          </nav>

          <div className="flex shrink-0 items-center justify-end gap-2">
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
            <p className="font-mono text-sm font-bold">
              <span className="text-accent">~/</span>
              {siteConfig.author.initials.toLowerCase()} <span className="font-normal text-muted">— {siteConfig.name}</span>
            </p>
            <p className="mt-2 text-sm leading-6 text-secondary">
              {siteConfig.role} based in {siteConfig.location}. Writing detections, chasing adversaries, shipping
              automation.
            </p>
          </div>
          <nav className="grid grid-cols-2 gap-x-8 gap-y-2 font-mono text-xs sm:text-right" aria-label="Footer">
            {siteConfig.footer.map((item) => (
              <Link key={item.href} href={item.href} className="text-muted transition hover:text-accent">
                {item.label.toLowerCase()}
              </Link>
            ))}
            <Link href="/resume" className="text-accent transition hover:text-accent-strong">
              resume.pdf →
            </Link>
          </nav>
        </div>

        <div className="statusline mt-10" aria-label="Site status">
          <span className="mode">NORMAL</span>
          <span className="text-foreground/80">~/personal-blog</span>
          <span className="hidden sm:inline">
            <span className="text-accent">⎇</span> main
          </span>
          <span className="hidden sm:inline">next.js · tailwind</span>
          <span className="ml-auto">
            <span className="text-accent">●</span> utf-8 · © {year}
          </span>
        </div>
      </div>
    </footer>
  );
}
