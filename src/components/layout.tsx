"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { CommandPalette } from "@/components/command-palette";
import { OPEN_CONSOLE_EVENT } from "@/components/console";
import { ThemeToggle } from "@/components/theme-toggle";
import { assetPath } from "@/lib/asset-path";
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
    <header className="sticky top-0 z-40 bg-background/85 backdrop-blur">
      <div className="mx-auto w-full max-w-4xl px-5 sm:px-8">
        <div className="flex h-16 items-center justify-between gap-4">
          <Link href="/" className="shrink-0 font-semibold tracking-tight">
            <span className="sm:hidden">{siteConfig.name.split(" ")[0]}</span>
            <span className="hidden sm:inline">{siteConfig.name}</span>
          </Link>

          <div className="flex min-w-0 items-center gap-1 sm:gap-5">
            <nav className="flex min-w-0 items-center gap-3.5 overflow-x-auto text-sm [scrollbar-width:none] sm:gap-6" aria-label="Main">
              {siteConfig.nav
                .filter((item) => item.href !== "/")
                .map((item) => {
                  const active = isActive(item.href);
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      aria-current={active ? "page" : undefined}
                      className={`shrink-0 transition-colors ${
                        active ? "text-foreground" : "text-muted hover:text-foreground"
                      }`}
                    >
                      {item.label}
                    </Link>
                  );
                })}
            </nav>
            <div className="flex shrink-0 items-center">
              <div className="hidden sm:block">
                <CommandPalette />
              </div>
              <ThemeToggle />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

export function Footer() {
  const year = new Date().getFullYear();
  const sha = process.env.BUILD_SHA;
  const built = (process.env.BUILD_TIME ?? "").slice(0, 10);

  return (
    <footer className="mt-16">
      <div className="mx-auto w-full max-w-4xl border-t border-border px-5 py-10 text-sm text-muted sm:px-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {year} {siteConfig.name} · {siteConfig.location}
          </p>
          <nav className="flex flex-wrap gap-x-5 gap-y-2" aria-label="Footer">
            {siteConfig.footer.map((item) => (
              // Plain anchors: these are feeds/external URLs, not routes, so Link prefetching would 404.
              <a
                key={item.href}
                href={item.href.startsWith("/") ? assetPath(item.href) : item.href}
                className="transition-colors hover:text-foreground"
              >
                {item.label}
              </a>
            ))}
            <Link href="/resume" className="transition-colors hover:text-foreground">
              Résumé
            </Link>
          </nav>
        </div>
        <div className="mt-6 flex flex-wrap items-center justify-between gap-3 font-mono text-xs">
          <button
            type="button"
            onClick={() => window.dispatchEvent(new Event(OPEN_CONSOLE_EVENT))}
            className="transition-colors hover:text-foreground"
          >
            &gt;_ press <kbd className="rounded border border-border px-1">~</kbd> for a console
          </button>
          {sha ? (
            <a
              href={`https://github.com/mahmoudahmed3132/PersonalBlog/commit/${sha}`}
              className="transition-colors hover:text-foreground"
              title="The commit this page was built from"
            >
              build {sha} · {built}
            </a>
          ) : null}
        </div>
      </div>
    </footer>
  );
}
