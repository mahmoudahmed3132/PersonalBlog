"use client";

import { Search, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { siteConfig } from "@/lib/site-config";

export function CommandPalette() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const links = useMemo(() => {
    const normalized = query.toLowerCase().trim();
    if (!normalized) return siteConfig.commandLinks;

    return siteConfig.commandLinks.filter((item) =>
      item.label.toLowerCase().includes(normalized),
    );
  }, [query]);

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setOpen((value) => !value);
      }

      if (event.key === "Escape") setOpen(false);
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  useEffect(() => {
    if (open) requestAnimationFrame(() => inputRef.current?.focus());
  }, [open]);

  function navigate(href: string) {
    setOpen(false);
    setQuery("");
    router.push(href);
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex h-9 items-center gap-2 rounded-md border border-border bg-surface px-2.5 text-sm text-muted transition hover:border-foreground/25 hover:text-foreground"
        aria-label="Open command palette"
      >
        <Search className="size-4" aria-hidden />
        <span className="hidden sm:inline">Ctrl K</span>
      </button>
      {open ? (
        <div className="fixed inset-0 z-50 bg-background/70 px-4 py-20 backdrop-blur-sm">
          <button
            type="button"
            className="absolute inset-0 cursor-default"
            aria-label="Close command palette"
            onClick={() => setOpen(false)}
          />
          <div className="relative mx-auto max-w-xl overflow-hidden rounded-lg border border-border bg-background shadow-2xl">
            <div className="flex items-center gap-2 border-b border-border px-3">
              <Search className="size-4 text-muted" aria-hidden />
              <input
                ref={inputRef}
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search pages..."
                className="h-12 flex-1 bg-transparent text-sm outline-none"
              />
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="rounded-md p-1.5 text-muted transition hover:bg-subtle hover:text-foreground"
                aria-label="Close"
              >
                <X className="size-4" aria-hidden />
              </button>
            </div>
            <div className="max-h-80 overflow-y-auto p-2">
              {links.length ? (
                links.map((item) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.href}
                      type="button"
                      onClick={() => navigate(item.href)}
                      className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-left text-sm transition hover:bg-subtle"
                    >
                      <Icon className="size-4 text-muted" aria-hidden />
                      <span>{item.label}</span>
                    </button>
                  );
                })
              ) : (
                <p className="px-3 py-8 text-center text-sm text-muted">No page found.</p>
              )}
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
