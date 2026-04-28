import type { Metadata } from "next";
import { Search } from "lucide-react";
import { Card, PageHeader, TagList } from "@/components/ui";
import { formatDate, getAllBlogPosts } from "@/lib/blog";
import { siteConfig } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Blog",
  description: "Technical notes on detection engineering, DFIR, cloud security, and security labs.",
};

export default function BlogPage() {
  const posts = getAllBlogPosts();

  return (
    <>
      <PageHeader
        title="Blog"
        description="Posts mirrored from Mahmoud's Medium profile into local MDX summaries, with Medium kept as the canonical source."
      />
      <a
        href={siteConfig.medium}
        className="mb-6 inline-flex rounded-md border border-border bg-surface px-3 py-2 text-sm transition hover:border-foreground/25"
      >
        Read original posts on Medium
      </a>
      <div className="mb-6 flex items-center gap-2 rounded-lg border border-border bg-surface px-3 py-2 text-sm text-muted">
        <Search className="size-4" aria-hidden />
        <span>Use your browser search for now; tags are visible on every post.</span>
      </div>
      <div className="space-y-3">
        {posts.map((post) => (
          <Card key={post.slug} href={`/blog/${post.slug}`}>
            <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <h2 className="font-medium">{post.title}</h2>
                <p className="mt-2 text-sm leading-6 text-muted">{post.description}</p>
              </div>
              <p className="shrink-0 text-sm text-muted">
                {formatDate(post.publishedAt)}
                {post.source === "medium" ? " · Medium" : ""}
              </p>
            </div>
            <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <TagList tags={post.tags} />
              <p className="text-xs text-muted">{post.readingTime}</p>
            </div>
          </Card>
        ))}
      </div>
    </>
  );
}
