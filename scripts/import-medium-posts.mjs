import fs from "node:fs/promises";
import path from "node:path";
import { XMLParser } from "fast-xml-parser";

const feedUrl = "https://medium.com/feed/@mahmoudhalim466";
const outputDir = path.join(process.cwd(), "content/blog");

const parser = new XMLParser({
  ignoreAttributes: false,
  cdataPropName: "__cdata",
  processEntities: true,
  htmlEntities: true,
});

function value(input) {
  if (input == null) return "";
  if (typeof input === "string") return input;
  if (typeof input === "number") return String(input);
  if (typeof input === "object" && "__cdata" in input) return String(input.__cdata ?? "");
  return String(input);
}

function slugify(input) {
  return input
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 90);
}

function cleanMediumUrl(input) {
  const url = new URL(input);
  url.search = "";
  return url.toString();
}

function stripHtml(html) {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, "")
    .replace(/<style[\s\S]*?<\/style>/gi, "")
    .replace(/<figure[\s\S]*?<\/figure>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function excerptFromHtml(html) {
  const text = stripHtml(html);
  return text.length > 360 ? `${text.slice(0, 357).trim()}...` : text;
}

function yamlString(input) {
  return JSON.stringify(input.replace(/\u2028|\u2029/g, " "));
}

function toTags(item) {
  const category = item.category;
  const categories = Array.isArray(category) ? category : category ? [category] : [];
  const clean = categories.map(value).filter(Boolean);
  return Array.from(new Set(["Medium", "Security", ...clean]));
}

function dateOnly(input) {
  return new Date(input).toISOString().slice(0, 10);
}

function renderPost(item) {
  const title = value(item.title);
  const originalUrl = cleanMediumUrl(value(item.link));
  const publishedAt = dateOnly(value(item.pubDate));
  const updatedAt = item["atom:updated"] ? new Date(value(item["atom:updated"])).toISOString() : "";
  const html = value(item["content:encoded"]);
  const excerpt = excerptFromHtml(html);
  const tags = toTags(item);
  const slug = `medium-${slugify(title)}`;

  return {
    slug,
    body: `---
title: ${yamlString(title)}
description: ${yamlString(excerpt)}
publishedAt: "${publishedAt}"
${updatedAt ? `updatedAt: "${updatedAt}"\n` : ""}tags:
${tags.map((tag) => `  - ${yamlString(tag)}`).join("\n")}
draft: false
source: "medium"
canonicalUrl: ${yamlString(originalUrl)}
externalUrl: ${yamlString(originalUrl)}
---

_Imported from Medium via RSS. This local entry mirrors the title, metadata, and summary while keeping the original article canonical on Medium._

${excerpt}

[Read the full post on Medium](${originalUrl})
`,
  };
}

const response = await fetch(feedUrl, {
  headers: {
    "User-Agent": "mahmoud-halim-portfolio-importer/1.0",
  },
});

if (!response.ok) {
  throw new Error(`Failed to fetch Medium RSS: ${response.status} ${response.statusText}`);
}

const xml = await response.text();
const parsed = parser.parse(xml);
const rawItems = parsed?.rss?.channel?.item ?? [];
const items = Array.isArray(rawItems) ? rawItems : [rawItems];
const posts = items.map(renderPost);

await fs.mkdir(outputDir, { recursive: true });

for (const post of posts) {
  await fs.writeFile(path.join(outputDir, `${post.slug}.mdx`), post.body);
}

console.log(`Imported ${posts.length} Medium posts into content/blog.`);
