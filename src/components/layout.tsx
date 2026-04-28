import Link from "next/link";
import { CommandPalette } from "@/components/command-palette";
import { ThemeToggle } from "@/components/theme-toggle";
import { siteConfig } from "@/lib/site-config";

export function Header() {
  return (
    <header className="sticky top-0 z-40">
      <div className="mx-auto w-full max-w-3xl rounded-md px-4 py-4 backdrop-blur-sm">
        <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-3 px-2">
          <nav className="flex items-center justify-center gap-4 text-sm" aria-label="Main">
            {[...siteConfig.nav, { label: "Projects", href: "/projects" }].map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="transition duration-300 hover:underline hover:decoration-2 hover:underline-offset-4"
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <div className="flex items-center justify-center gap-2">
            <CommandPalette />
            <ThemeToggle />
          </div>
        </div>
      </div>
    </header>
  );
}

export function Footer() {
  return (
    <footer className="mt-20">
      <div className="mx-auto flex w-full max-w-3xl flex-col items-center justify-center gap-4 px-4 py-16 text-center text-sm text-secondary">
        <p>
          Built by <b className="text-foreground">{siteConfig.name}</b>
          <br />© {new Date().getFullYear()}. All rights reserved.
        </p>
        <nav className="flex flex-wrap items-center justify-center gap-4" aria-label="Footer">
          {siteConfig.footer.map((item) => (
            <Link key={item.href} href={item.href} className="transition hover:text-foreground">
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </footer>
  );
}
