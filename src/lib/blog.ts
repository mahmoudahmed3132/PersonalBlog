import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

const blogDirectory = path.join(process.cwd(), "content/blog");

export type BlogPost = {
  slug: string;
  title: string;
  description: string;
  publishedAt: string;
  updatedAt?: string;
  tags: string[];
  draft: boolean;
  readingTime: string;
  content: string;
  source?: string;
  canonicalUrl?: string;
  externalUrl?: string;
};

type Frontmatter = {
  title?: string;
  description?: string;
  publishedAt?: string;
  updatedAt?: string;
  tags?: string[];
  draft?: boolean;
  source?: string;
  canonicalUrl?: string;
  externalUrl?: string;
};

function getReadingTime(content: string) {
  const words = content.trim().split(/\s+/).filter(Boolean).length;
  return `${Math.max(1, Math.ceil(words / 200))} min read`;
}

function requiredString(value: unknown, field: string, file: string) {
  if (typeof value !== "string" || value.length === 0) {
    throw new Error(`Missing required frontmatter field "${field}" in ${file}`);
  }

  return value;
}

export function getBlogSlugs() {
  if (!fs.existsSync(blogDirectory)) return [];

  return fs
    .readdirSync(blogDirectory)
    .filter((file) => file.endsWith(".mdx"))
    .map((file) => file.replace(/\.mdx$/, ""));
}

export function getBlogPost(slug: string): BlogPost {
  const filePath = path.join(blogDirectory, `${slug}.mdx`);
  const source = fs.readFileSync(filePath, "utf8");
  const { content, data } = matter(source);
  const frontmatter = data as Frontmatter;

  return {
    slug,
    title: requiredString(frontmatter.title, "title", filePath),
    description: requiredString(frontmatter.description, "description", filePath),
    publishedAt: requiredString(frontmatter.publishedAt, "publishedAt", filePath),
    updatedAt: frontmatter.updatedAt,
    tags: Array.isArray(frontmatter.tags) ? frontmatter.tags : [],
    draft: Boolean(frontmatter.draft),
    readingTime: getReadingTime(content),
    content,
    source: frontmatter.source,
    canonicalUrl: frontmatter.canonicalUrl,
    externalUrl: frontmatter.externalUrl,
  };
}

export function getAllBlogPosts(options: { includeDrafts?: boolean } = {}) {
  return getBlogSlugs()
    .map(getBlogPost)
    .filter((post) => options.includeDrafts || !post.draft || process.env.NODE_ENV !== "production")
    .sort(
      (a, b) =>
        new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime(),
    );
}

export function formatDate(date: string) {
  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(date));
}
