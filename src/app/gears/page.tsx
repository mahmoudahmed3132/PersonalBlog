import type { Metadata } from "next";
import { Card, PageHeader } from "@/components/ui";
import { gearItems } from "@/lib/tools-data";

export const metadata: Metadata = {
  title: "Gears",
  description: "Hardware, devices, and tools used by Mahmoud Halim.",
};

export default function GearsPage() {
  return (
    <>
      <PageHeader title="Gears" description="Devices, software, and niche security tooling I rely on." />
      <div className="grid gap-3 sm:grid-cols-2">
        {gearItems.map(({ title, description }) => (
          <Card key={title}>
            <h2 className="font-medium">{title}</h2>
            <p className="mt-2 text-sm leading-6 text-muted">{description}</p>
          </Card>
        ))}
      </div>
    </>
  );
}
