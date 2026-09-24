import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, ArrowUpRight } from "lucide-react";
import { MDXRemote } from "next-mdx-remote/rsc";
import { CodeBlock } from "@/components/code-block";
import { assetPath } from "@/lib/asset-path";
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
    <article className="mx-auto max-w-2xl">
      <ScriptJsonLd data={articleJsonLd} />

      <nav className="mb-8" aria-label="Back to blog">
        <Link
          href="/blog"
          className="inline-flex items-center gap-1.5 text-sm text-muted transition hover:text-foreground"
        >
          <ArrowLeft className="size-4" aria-hidden />
          All posts
        </Link>
      </nav>

      <header className="border-b border-border pb-8">
        <p className="text-sm text-muted">
          {formatDate(post.publishedAt)} · {post.readingTime}
          {post.source === "medium" ? " · via Medium" : ""}
        </p>
        <h1 className="mt-3 text-4xl font-semibold tracking-tight sm:text-5xl sm:leading-[1.1]">{post.title}</h1>
        <p className="mt-5 text-pretty text-lg leading-8 text-muted">{post.description}</p>
        {post.externalUrl ? (
          <a
            href={post.externalUrl}
            className="link mt-5 inline-flex items-center gap-1 text-sm font-medium"
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
        <MDXRemote source={post.content} components={{ pre: CodeBlock, img: PostImage }} />
      </div>

      {(newer || older) && (
        <nav
          className="mt-14 flex flex-col gap-3 border-t border-border pt-8 sm:flex-row sm:items-stretch sm:justify-between"
          aria-label="Post navigation"
        >
          {older ? (
            <Link
              href={`/blog/${older.slug}`}
              className="group flex-1 rounded-lg border border-border p-4 transition-colors hover:border-foreground/25"
            >
              <p className="inline-flex items-center gap-1.5 text-xs text-muted">
                <ArrowLeft className="size-3.5" aria-hidden /> Older
              </p>
              <p className="mt-1.5 text-sm font-medium leading-6 group-hover:underline underline-offset-4">
                {older.title}
              </p>
            </Link>
          ) : (
            <div className="flex-1" />
          )}
          {newer ? (
            <Link
              href={`/blog/${newer.slug}`}
              className="group flex-1 rounded-lg border border-border p-4 text-right transition-colors hover:border-foreground/25"
            >
              <p className="inline-flex items-center gap-1.5 text-xs text-muted">
                Newer <ArrowRight className="size-3.5" aria-hidden />
              </p>
              <p className="mt-1.5 text-sm font-medium leading-6 group-hover:underline underline-offset-4">
                {newer.title}
              </p>
            </Link>
          ) : null}
        </nav>
      )}
    </article>
  );
}

/** Local images need the GitHub Pages base path; alt text doubles as the caption. */
function PostImage({ src, alt }: React.ComponentPropsWithoutRef<"img">) {
  const resolved = typeof src === "string" && src.startsWith("/") ? assetPath(src) : src;
  return (
    <span className="my-8 block">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={resolved} alt={alt ?? ""} loading="lazy" className="photo w-full rounded-xl" />
      {alt ? <span className="mt-2.5 block text-center text-xs text-muted">{alt}</span> : null}
    </span>
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
