import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, ArrowUpRight } from "lucide-react";
import { MDXRemote } from "next-mdx-remote/rsc";
import { CodeBlock } from "@/components/code-block";
import { ReadingProgress } from "@/components/reading-progress";
import { TagList } from "@/components/ui";
import { formatDate, getAllBlogPosts, getBlogPost, getBlogSlugs } from "@/lib/blog";
import { siteConfig } from "@/lib/site-config";

type Props = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return getBlogSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;

  try {
    const post = getBlogPost(slug);
    return {
      title: post.title,
      description: post.description,
      alternates: {
        canonical: post.canonicalUrl ?? `${siteConfig.url}/blog/${post.slug}`,
      },
      openGraph: {
        title: post.title,
        description: post.description,
        type: "article",
        publishedTime: post.publishedAt,
        tags: post.tags,
      },
    };
  } catch {
    return {};
  }
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const posts = getAllBlogPosts({ includeDrafts: process.env.NODE_ENV !== "production" });
  const index = posts.findIndex((item) => item.slug === slug);
  const post = posts[index];

  if (!post) notFound();

  const newer = index > 0 ? posts[index - 1] : null;
  const older = index < posts.length - 1 ? posts[index + 1] : null;

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.description,
    datePublished: post.publishedAt,
    ...(post.updatedAt ? { dateModified: post.updatedAt } : {}),
    author: {
      "@type": "Person",
      name: siteConfig.name,
      url: siteConfig.url,
    },
    keywords: post.tags.join(", "),
    ...(post.canonicalUrl ? { isBasedOn: post.canonicalUrl } : {}),
  };

  return (
    <article>
      <ScriptJsonLd data={articleJsonLd} />
      <ReadingProgress />

      <nav className="mb-8" aria-label="Back to blog">
        <Link
          href="/blog"
          className="inline-flex items-center gap-1.5 text-sm text-muted transition hover:text-foreground"
        >
          <ArrowLeft className="size-4" aria-hidden />
          <span className="font-mono">cd ../blog</span>
        </Link>
      </nav>

      <header className="border-b border-border pb-8">
        <p className="font-mono text-xs text-muted">
          <span className="text-accent">$</span> stat {post.slug}.mdx
          <span className="mx-2 text-border">|</span>
          {formatDate(post.publishedAt)} · {post.readingTime}
          {post.source === "medium" ? " · via Medium" : ""}
        </p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight">{post.title}</h1>
        <p className="mt-3 text-pretty leading-7 text-muted">{post.description}</p>
        {post.externalUrl ? (
          <a
            href={post.externalUrl}
            className="btn-outline mt-5 inline-flex items-center gap-1.5 rounded-md px-3 py-2 text-sm"
          >
            Read original on Medium
            <ArrowUpRight className="size-3.5" aria-hidden />
          </a>
        ) : null}
        <div className="mt-5">
          <TagList tags={post.tags} />
        </div>
      </header>

      <div className="prose mt-8">
        <MDXRemote source={post.content} components={{ pre: CodeBlock }} />
      </div>

      {(newer || older) && (
        <nav
          className="mt-14 flex flex-col gap-3 border-t border-border pt-8 sm:flex-row sm:items-stretch sm:justify-between"
          aria-label="Post navigation"
        >
          {older ? (
            <Link
              href={`/blog/${older.slug}`}
              className="group flex-1 hud-card rounded-xl border border-border bg-card/70 p-4 transition hover:-translate-y-0.5 hover:border-foreground/25"
            >
              <p className="inline-flex items-center gap-1.5 font-mono text-xs text-muted">
                <ArrowLeft className="size-3.5" aria-hidden /> Older
              </p>
              <p className="mt-1.5 text-sm font-medium leading-6 group-hover:text-accent">
                {older.title}
              </p>
            </Link>
          ) : (
            <div className="flex-1" />
          )}
          {newer ? (
            <Link
              href={`/blog/${newer.slug}`}
              className="group flex-1 hud-card rounded-xl border border-border bg-card/70 p-4 text-right transition hover:-translate-y-0.5 hover:border-foreground/25"
            >
              <p className="inline-flex items-center gap-1.5 font-mono text-xs text-muted">
                Newer <ArrowRight className="size-3.5" aria-hidden />
              </p>
              <p className="mt-1.5 text-sm font-medium leading-6 group-hover:text-accent">
                {newer.title}
              </p>
            </Link>
          ) : null}
        </nav>
      )}
    </article>
  );
}

function ScriptJsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
