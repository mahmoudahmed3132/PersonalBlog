import type { Metadata } from "next";
import { Card, PageHeader } from "@/components/ui";
import { setupItems } from "@/lib/tools-data";

export const metadata: Metadata = {
  title: "Setup",
  description: "Editor and development setup used by Mahmoud Halim.",
};

export default function SetupPage() {
  return (
    <>
      <PageHeader title="Setup" description="Editor, extensions, and workflow defaults." />
      <div className="grid gap-3 sm:grid-cols-2">
        {setupItems.map(({ title, description }) => (
          <Card key={title}>
            <h2 className="font-medium">{title}</h2>
            <p className="mt-2 text-sm leading-6 text-muted">{description}</p>
          </Card>
        ))}
      </div>
    </>
  );
}
