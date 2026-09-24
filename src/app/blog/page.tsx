import type { Metadata } from "next";
import { PageHeader, Row } from "@/components/ui";
import { formatDate, getAllBlogPosts, postHref } from "@/lib/blog";
import { siteConfig } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Technical notes on detection engineering, DFIR, cloud security, and security labs by Mahmoud Halim.",
};

export default function BlogPage() {
  const posts = getAllBlogPosts();
  const years = new Map<string, typeof posts>();
  for (const post of posts) {
    const year = post.publishedAt.slice(0, 4);
    years.set(year, [...(years.get(year) ?? []), post]);
  }

  return (
    <>
      <PageHeader
        title="Blog"
        description="Detection engineering, DFIR walkthroughs, and notes from the lab. Posts marked ↗ live on Medium."
      >
        <p className="mt-5 text-sm text-muted">
          Subscribe via{" "}
          <a href={`${siteConfig.url}/rss.xml`} className="link text-foreground">
            RSS
          </a>{" "}
          or follow on{" "}
          <a href={siteConfig.medium} className="link text-foreground">
            Medium
          </a>
          .
        </p>
      </PageHeader>

      <div className="space-y-14">
        {[...years.entries()].map(([year, items]) => (
          <section key={year} aria-label={`Posts from ${year}`}>
            <h2 className="border-b border-border pb-3 text-sm tabular-nums text-muted">{year}</h2>
            <ul>
              {items.map((post) => (
                <Row
                  key={post.slug}
                  href={postHref(post)}
                  title={
                    <>
                      {post.title}
                      {post.externalUrl ? <span className="font-normal text-muted"> ↗</span> : null}
                    </>
                  }
                  meta={formatDate(post.publishedAt).replace(/,?\s*\d{4}$/, "")}
                />
              ))}
            </ul>
          </section>
        ))}
      </div>
    </>
  );
}
