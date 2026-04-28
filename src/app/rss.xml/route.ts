import { getAllBlogPosts } from "@/lib/blog";
import { siteConfig } from "@/lib/site-config";

export const dynamic = "force-static";

export function GET() {
  const posts = getAllBlogPosts();
  const items = posts
    .map(
      (post) => `
        <item>
          <title><![CDATA[${post.title}]]></title>
          <description><![CDATA[${post.description}]]></description>
          <link>${post.canonicalUrl ?? `${siteConfig.url}/blog/${post.slug}`}</link>
          <guid>${post.canonicalUrl ?? `${siteConfig.url}/blog/${post.slug}`}</guid>
          <pubDate>${new Date(post.publishedAt).toUTCString()}</pubDate>
        </item>`,
    )
    .join("");

  return new Response(
    `<?xml version="1.0" encoding="UTF-8" ?>
      <rss version="2.0">
        <channel>
          <title>${siteConfig.name}</title>
          <description>${siteConfig.description}</description>
          <link>${siteConfig.url}</link>
          ${items}
        </channel>
      </rss>`,
    {
      headers: {
        "Content-Type": "application/rss+xml; charset=utf-8",
      },
    },
  );
}
