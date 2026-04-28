import type { Metadata } from "next";
import { Card, PageHeader } from "@/components/ui";
import { terminalItems } from "@/lib/tools-data";

export const metadata: Metadata = {
  title: "Terminal",
  description: "Terminal setup used by Mahmoud Halim.",
};

export default function TerminalPage() {
  return (
    <>
      <PageHeader title="Terminal" description="Shell, prompt, aliases, and command-line tools." />
      <div className="grid gap-3 sm:grid-cols-2">
        {terminalItems.map(({ title, description }) => (
          <Card key={title}>
            <h2 className="font-medium">{title}</h2>
            <p className="mt-2 text-sm leading-6 text-muted">{description}</p>
          </Card>
        ))}
      </div>
    </>
  );
}
