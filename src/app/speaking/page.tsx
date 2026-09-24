import type { Metadata } from "next";
import Link from "next/link";
import { CalendarDays, MapPin, Mic } from "lucide-react";
import { PageHeader } from "@/components/ui";
import { speakingEvents } from "@/lib/speaking-data";
import { assetPath } from "@/lib/asset-path";

export const metadata: Metadata = {
  title: "Speaking",
  description:
    "Conference talks and public speaking by Mahmoud Halim — security engineering, detection, and incident response.",
};

export default function SpeakingPage() {
  return (
    <>
      <PageHeader
        title="Speaking"
        eyebrow="On stage"
        description="Talks, panels, and community events where I share detection engineering, incident response, and security operations experience."
      />
      <div className="space-y-12">
        {speakingEvents.map((item) => (
          <section key={item.event} aria-label={item.event}>
            <div className="flex flex-col gap-2 sm:flex-row sm:items-baseline sm:justify-between">
              <h2 className="text-xl font-semibold tracking-tight">{item.event}</h2>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted">
                {item.date ? (
                  <span className="inline-flex items-center gap-1.5">
                    <CalendarDays className="size-4" aria-hidden /> {item.date}
                  </span>
                ) : null}
                {item.location ? (
                  <span className="inline-flex items-center gap-1.5">
                    <MapPin className="size-4" aria-hidden /> {item.location}
                  </span>
                ) : null}
                {item.talkTitle ? (
                  <span className="inline-flex items-center gap-1.5">
                    <Mic className="size-4" aria-hidden /> {item.talkTitle}
                  </span>
                ) : null}
              </div>
            </div>

            {item.description ? (
              <p className="mt-3 max-w-2xl text-pretty leading-7 text-secondary">{item.description}</p>
            ) : null}

            <div className="mt-8 grid gap-6 sm:grid-cols-2">
              {item.photos.map((photo) => (
                <figure
                  key={photo.src}
                  className="group"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={assetPath(photo.src)}
                    alt={photo.alt}
                    width={1600}
                    height={1066}
                    loading="lazy"
                    className="photo aspect-[3/2] w-full rounded-xl"
                  />
                  <figcaption className="mt-2.5 text-xs leading-5 text-muted">
                    {photo.caption}
                  </figcaption>
                </figure>
              ))}
            </div>

            <div className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-sm font-medium">
              {item.postSlug ? (
                <Link href={`/blog/${item.postSlug}`} className="link">
                  Read the write-up →
                </Link>
              ) : null}
              {item.url ? (
                <a href={item.url} className="link">
                  Event post ↗
                </a>
              ) : null}
            </div>
          </section>
        ))}
      </div>
    </>
  );
}
