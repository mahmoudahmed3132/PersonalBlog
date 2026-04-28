import { getAllBlogPosts } from "@/lib/blog";
import { siteConfig } from "@/lib/site-config";

export const dynamic = "force-static";

const staticRoutes = [
  "",
  "/blog",
  "/work",
  "/projects",
  "/gears",
  "/setup",
  "/terminal",
  "/books",
  "/movies",
];

export function GET() {
  const blogRoutes = getAllBlogPosts().map((post) => `/blog/${post.slug}`);
  const urls = [...staticRoutes, ...blogRoutes]
    .map((route) => `<url><loc>${siteConfig.url}${route}</loc></url>`)
    .join("");

  return new Response(`<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls}</urlset>`, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
    },
  });
}
