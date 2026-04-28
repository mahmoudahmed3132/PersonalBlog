import type { Metadata } from "next";
import { Card, PageHeader } from "@/components/ui";
import { movies } from "@/lib/personal-data";

export const metadata: Metadata = {
  title: "Movies",
};

export default function MoviesPage() {
  return (
    <>
      <PageHeader title="Movies" />
      <div className="space-y-3">
        {movies.map((item) => (
          <Card key={item.title}>
            <div className="flex items-start justify-between gap-3">
              <h2 className="font-medium">{item.title}</h2>
              <span className="rounded-full border border-border px-2 py-0.5 text-xs text-muted">{item.type}</span>
            </div>
          </Card>
        ))}
      </div>
    </>
  );
}
