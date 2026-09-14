import type { Metadata } from "next";
import { ArrowUpRight } from "lucide-react";
import { PageHeader } from "@/components/ui";
import { BlogExplorer } from "@/components/blog-explorer";
import { getAllBlogPosts } from "@/lib/blog";
import { siteConfig } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Technical notes on detection engineering, DFIR, cloud security, and security labs — mirrored from Mahmoud Halim's Medium.",
};

export default function BlogPage() {
  const posts = getAllBlogPosts().map((post) => ({
    slug: post.slug,
    title: post.title,
    description: post.description,
    publishedAt: post.publishedAt,
    readingTime: post.readingTime,
    tags: post.tags,
    source: post.source,
  }));

  return (
    <>
      <PageHeader
        title="Blog"
        eyebrow="Writing"
        description="Detection engineering, DFIR walkthroughs, and security lab notes. Full posts live on Medium; these are mirrored summaries with the key takeaways."
      >
        <a
          href={siteConfig.medium}
          className="btn-outline mb-8 mt-6 inline-flex items-center gap-1.5 rounded-md px-3 py-2 text-sm"
        >
          Read original posts on Medium
          <ArrowUpRight className="size-3.5" aria-hidden />
        </a>
      </PageHeader>
      <BlogExplorer posts={posts} />
    </>
  );
}
