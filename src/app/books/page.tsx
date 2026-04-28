import type { Metadata } from "next";
import { Card, PageHeader } from "@/components/ui";
import { books } from "@/lib/personal-data";

export const metadata: Metadata = {
  title: "Books",
};

export default function BooksPage() {
  return (
    <>
      <PageHeader title="Books" />
      <div className="space-y-3">
        {books.map((book) => (
          <Card key={book.title}>
            <h2 className="font-medium">{book.title}</h2>
            <p className="mt-1 text-sm text-muted">{book.author}</p>
          </Card>
        ))}
      </div>
    </>
  );
}
