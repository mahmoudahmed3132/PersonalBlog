"use client";

import Link from "next/link";
import { Search } from "lucide-react";
import { useMemo, useState } from "react";
import { TagList } from "@/components/ui";

export type BlogPostMeta = {
  slug: string;
  title: string;
  description: string;
  publishedAt: string;
  readingTime: string;
  tags: string[];
  source?: string;
};

function formatDate(date: string) {
  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(date));
}

export function BlogExplorer({ posts }: { posts: BlogPostMeta[] }) {
  const [query, setQuery] = useState("");
  const [tag, setTag] = useState<string | null>(null);

  const tags = useMemo(() => {
    const counts = new Map<string, number>();
    for (const post of posts) {
      for (const item of post.tags) {
        counts.set(item, (counts.get(item) ?? 0) + 1);
      }
    }
    return [...counts.entries()].sort((a, b) => b[1] - a[1]);
  }, [posts]);

  const filtered = useMemo(() => {
    const normalized = query.toLowerCase().trim();
    return posts.filter((post) => {
      const matchesTag = !tag || post.tags.includes(tag);
      const matchesQuery =
        !normalized ||
        post.title.toLowerCase().includes(normalized) ||
        post.description.toLowerCase().includes(normalized) ||
        post.tags.some((item) => item.toLowerCase().includes(normalized));
      return matchesTag && matchesQuery;
    });
  }, [posts, query, tag]);

  return (
    <div>
      <div className="mb-8 flex flex-col gap-4">
        <label className="flex items-center gap-2 rounded-lg border border-border px-3 py-2.5 text-sm transition focus-within:border-foreground/40">
          <Search className="size-4 shrink-0 text-muted" aria-hidden />
          <span className="sr-only">Search posts</span>
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search posts by title, summary, or tag…"
            className="w-full bg-transparent outline-none placeholder:text-muted"
            type="search"
          />
        </label>
        <div className="flex flex-wrap gap-2" role="group" aria-label="Filter by tag">
          <button
            type="button"
            onClick={() => setTag(null)}
            aria-pressed={tag === null}
            className={`rounded-full border px-3 py-1 text-xs transition ${
              tag === null
                ? "border-transparent bg-foreground text-background"
                : "border-border text-muted hover:border-foreground/30 hover:text-foreground"
            }`}
          >
            All ({posts.length})
          </button>
          {tags.map(([name, count]) => (
            <button
              key={name}
              type="button"
              onClick={() => setTag((value) => (value === name ? null : name))}
              aria-pressed={tag === name}
              className={`rounded-full border px-3 py-1 text-xs transition ${
                tag === name
                  ? "border-transparent bg-foreground text-background"
                  : "border-border text-muted hover:border-foreground/30 hover:text-foreground"
              }`}
            >
              {name} ({count})
            </button>
          ))}
        </div>
      </div>

      {filtered.length ? (
        <div className="border-t border-border" aria-live="polite">
          {filtered.map((post) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="group block border-b border-border py-6"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="text-lg font-medium decoration-foreground/30 underline-offset-4 group-hover:underline">{post.title}</h2>
                  <p className="mt-2 text-sm leading-6 text-muted">{post.description}</p>
                </div>
              </div>
              <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <TagList tags={post.tags} />
                <p className="shrink-0 text-xs text-muted">
                  {formatDate(post.publishedAt)} · {post.readingTime}
                  {post.source === "medium" ? " · via Medium" : ""}
                </p>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="rounded-xl border border-dashed border-border px-6 py-12 text-center">
          <p className="text-sm font-medium">No posts match your filters.</p>
          <p className="mt-1 text-sm text-muted">
            Try a different keyword or clear the tag filter.
          </p>
          <button
            type="button"
            onClick={() => {
              setQuery("");
              setTag(null);
            }}
            className="btn-outline mt-4 rounded-md px-4 py-2 text-sm"
          >
            Clear filters
          </button>
        </div>
      )}
    </div>
  );
}
