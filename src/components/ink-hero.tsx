"use client";

import { useEffect, useRef } from "react";
import { InkForegroundPlaceholder, InkSkyPlaceholder, InkSubjectPlaceholder } from "@/components/ink-placeholder";
import { InkTrail } from "@/components/ink-trail";
import { MusicNotes } from "@/components/music-notes";

export type HeroLayer = {
  /** Resolved (base-path aware) URL of the PNG, or null to render the procedural placeholder. */
  src: string | null;
  alt: string;
};

/** Max travel in px for each layer, back to front. Deeper layers move less. */
const DEPTH = [10, 26, 52] as const;
/** After this long without pointer input (and always on touch screens) the scene drifts on its own. */
const IDLE_MS = 2200;
/** Bleed beyond the viewport so translated edges never show. */
const BLEED = DEPTH[DEPTH.length - 1] + 4;

const STIFFNESS = 90;
const DAMPING = 2 * Math.sqrt(STIFFNESS) * 0.85; // slightly under-damped: settles with a hint of give

const PLACEHOLDERS = [InkSkyPlaceholder, InkSubjectPlaceholder, InkForegroundPlaceholder];

export function InkHero({ layers, children }: { layers: [HeroLayer, HeroLayer, HeroLayer]; children: React.ReactNode }) {
  const rootRef = useRef<HTMLElement>(null);
  const layerRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    // Only fine pointers that can hover get parallax. Touch stays still: no orientation prompts.
    const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)");

    const target = { x: 0, y: 0 };
    const pos = { x: 0, y: 0 };
    const vel = { x: 0, y: 0 };
    let frame = 0;
    let last = 0;
    let visible = true;
    let lastPointer = -Infinity;

    const apply = () => {
      layerRefs.current.forEach((el, i) => {
        if (!el) return;
        const d = DEPTH[i];
        el.style.transform = `translate3d(${(pos.x * d).toFixed(2)}px, ${(pos.y * d).toFixed(2)}px, 0)`;
      });
    };

    const tick = (now: number) => {
      const dt = Math.min(0.05, (now - (last || now)) / 1000 || 1 / 60);
      last = now;
      const drifting = !reduced.matches && (!finePointer.matches || now - lastPointer > IDLE_MS);
      if (drifting) {
        // Slow Lissajous drift so the scene breathes on phones and when the mouse rests.
        const t = now / 1000;
        target.x = 0.38 * Math.sin(t * 0.33);
        target.y = 0.22 * Math.sin(t * 0.47 + 1.2);
      }
      for (const axis of ["x", "y"] as const) {
        const force = STIFFNESS * (target[axis] - pos[axis]) - DAMPING * vel[axis];
        vel[axis] += force * dt;
        pos[axis] += vel[axis] * dt;
      }
      apply();
      const settled =
        Math.abs(target.x - pos.x) < 0.001 &&
        Math.abs(target.y - pos.y) < 0.001 &&
        Math.abs(vel.x) < 0.001 &&
        Math.abs(vel.y) < 0.001;
      frame = settled && !drifting ? 0 : requestAnimationFrame(tick);
      if (settled && !drifting) last = 0;
    };

    const kick = () => {
      if (!frame && visible) frame = requestAnimationFrame(tick);
    };

    const enabled = () => !reduced.matches;

    const onMove = (event: PointerEvent) => {
      if (event.pointerType === "touch" || !finePointer.matches || !enabled()) return;
      lastPointer = performance.now();
      // Normalise to [-1, 1] around the viewport centre; layers move with the pointer.
      target.x = Math.max(-1, Math.min(1, (event.clientX / window.innerWidth) * 2 - 1));
      target.y = Math.max(-1, Math.min(1, (event.clientY / window.innerHeight) * 2 - 1));
      kick();
    };

    const recenter = () => {
      lastPointer = -Infinity; // hand back to the idle drift
      kick();
    };

    const onPreferenceChange = () => {
      if (enabled()) {
        kick();
        return;
      }
      cancelAnimationFrame(frame);
      frame = 0;
      target.x = target.y = pos.x = pos.y = vel.x = vel.y = 0;
      apply();
    };

    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (!visible) {
        cancelAnimationFrame(frame);
        frame = 0;
        last = 0;
      } else {
        kick();
      }
    });
    observer.observe(root);

    window.addEventListener("pointermove", onMove, { passive: true });
    document.documentElement.addEventListener("pointerleave", recenter);
    window.addEventListener("blur", recenter);
    reduced.addEventListener("change", onPreferenceChange);
    finePointer.addEventListener("change", onPreferenceChange);

    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      window.removeEventListener("pointermove", onMove);
      document.documentElement.removeEventListener("pointerleave", recenter);
      window.removeEventListener("blur", recenter);
      reduced.removeEventListener("change", onPreferenceChange);
      finePointer.removeEventListener("change", onPreferenceChange);
    };
  }, []);

  return (
    <section ref={rootRef} className="ink-hero" aria-label="Introduction">
      <div className="ink-art" aria-hidden={layers.every((l) => !l.src)}>
        {layers.map((layer, i) => {
          const Placeholder = PLACEHOLDERS[i];
          return (
            <div
              key={i}
              ref={(el) => {
                layerRefs.current[i] = el;
              }}
              className="ink-layer"
              data-layer={i}
              style={{ inset: -BLEED }}
            >
              <div className="ink-canvas">
              {layer.src ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={layer.src}
                  alt={i === 1 ? layer.alt : ""}
                  width={2400}
                  height={1350}
                  decoding="async"
                  fetchPriority={i === 1 ? "high" : "auto"}
                  className="block h-full w-full"
                />
              ) : (
                <Placeholder />
              )}
              {i === 1 && layer.src ? <MusicNotes /> : null}
              </div>
            </div>
          );
        })}
        <div className="ink-scrim" />
        <InkTrail />
      </div>
      <div className="ink-copy">{children}</div>
    </section>
  );
}
