import Link from "next/link";

export default function NotFound() {
  return (
    <div className="py-16">
      <p className="text-sm text-muted">404</p>
      <h1 className="mt-3 text-4xl font-semibold tracking-tight sm:text-5xl">Page not found.</h1>
      <p className="mt-5 text-lg leading-8 text-secondary">
        The link may be stale, or the page has moved.{" "}
        <Link href="/" className="link text-foreground">
          Go home
        </Link>{" "}
        or{" "}
        <Link href="/blog" className="link text-foreground">
          read the blog
        </Link>
        .
      </p>
    </div>
  );
}
