import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import { CodeBlock } from "@/components/code-block";
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
    };
  } catch {
    return {};
  }
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = getAllBlogPosts({ includeDrafts: process.env.NODE_ENV !== "production" }).find(
    (item) => item.slug === slug,
  );

  if (!post) notFound();

  return (
    <article>
      <header className="border-b border-border pb-8">
        <p className="text-sm text-muted">
          {formatDate(post.publishedAt)} · {post.readingTime}
        </p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight">{post.title}</h1>
        <p className="mt-3 text-pretty leading-7 text-muted">{post.description}</p>
        {post.externalUrl ? (
          <a
            href={post.externalUrl}
            className="mt-5 inline-flex rounded-md border border-border bg-surface px-3 py-2 text-sm transition hover:border-foreground/25"
          >
            Read original on Medium
          </a>
        ) : null}
        <div className="mt-5">
          <TagList tags={post.tags} />
        </div>
      </header>
      <div className="prose mt-8">
        <MDXRemote source={post.content} components={{ pre: CodeBlock }} />
      </div>
    </article>
  );
}
