"use client";

import { useEffect, useRef } from "react";

/**
 * Sumi brush that follows the pointer across the hero: slow strokes are fat, fast ones thin,
 * and the ink fades like it's soaking into the paper. A click flicks a splatter.
 * Fine pointers only; nothing under prefers-reduced-motion.
 */

type Pt = { x: number; y: number; t: number; w: number };
type Blot = { x: number; y: number; r: number; t: number };

const LIFE = 1300; // ms a stroke stays visible
const SPLAT_LIFE = 1400;
const INK = "20, 18, 16";

export function InkTrail() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    const host = canvas?.parentElement?.parentElement; // .ink-hero
    if (!canvas || !host) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)");
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let pts: Pt[] = [];
    let blots: Blot[] = [];
    let frame = 0;
    let dpr = 1;

    const resize = () => {
      dpr = Math.min(2, window.devicePixelRatio || 1);
      const { width, height } = host.getBoundingClientRect();
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const draw = (now: number) => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      pts = pts.filter((p) => now - p.t < LIFE);
      blots = blots.filter((b) => now - b.t < SPLAT_LIFE);

      // Quadratic curves through segment midpoints with butt caps: one continuous, unbeaded stroke.
      for (let i = 1; i < pts.length - 1; i++) {
        const a = pts[i - 1];
        const b = pts[i];
        const c = pts[i + 1];
        if (b.t - a.t > 120 || c.t - b.t > 120) continue; // pointer paused: start a new stroke
        const age = (now - b.t) / LIFE;
        ctx.strokeStyle = `rgba(${INK}, ${(0.85 * (1 - age) ** 1.5).toFixed(3)})`;
        ctx.lineWidth = b.w * (1 - age * 0.5);
        ctx.lineCap = "butt";
        ctx.beginPath();
        ctx.moveTo((a.x + b.x) / 2, (a.y + b.y) / 2);
        ctx.quadraticCurveTo(b.x, b.y, (b.x + c.x) / 2, (b.y + c.y) / 2);
        ctx.stroke();
      }

      for (const b of blots) {
        const age = (now - b.t) / SPLAT_LIFE;
        ctx.fillStyle = `rgba(${INK}, ${(0.75 * (1 - age) ** 1.4).toFixed(3)})`;
        ctx.beginPath();
        ctx.arc(b.x, b.y, b.r * (1 + age * 0.25), 0, Math.PI * 2);
        ctx.fill();
      }

      frame = pts.length || blots.length ? requestAnimationFrame(draw) : 0;
    };

    const kick = () => {
      if (!frame) frame = requestAnimationFrame(draw);
    };

    const local = (e: PointerEvent) => {
      const r = host.getBoundingClientRect();
      return { x: e.clientX - r.left, y: e.clientY - r.top, inside: e.clientY >= r.top && e.clientY <= r.bottom };
    };

    const onMove = (e: PointerEvent) => {
      if (reduced.matches || !fine.matches || e.pointerType === "touch") return;
      const { x, y, inside } = local(e);
      if (!inside) return;
      const now = performance.now();
      const prev = pts[pts.length - 1];
      let w = 7;
      if (prev && now - prev.t < 120) {
        const speed = Math.hypot(x - prev.x, y - prev.y) / Math.max(1, now - prev.t); // px/ms
        const target = Math.max(1.4, Math.min(9, 9 - speed * 3.2));
        w = prev.w + (target - prev.w) * 0.35; // ease the brush pressure
      }
      pts.push({ x, y, t: now, w });
      kick();
    };

    const onDown = (e: PointerEvent) => {
      if (reduced.matches || !fine.matches || e.pointerType === "touch") return;
      if ((e.target as HTMLElement).closest("a, button")) return; // don't splash on links
      const { x, y, inside } = local(e);
      if (!inside) return;
      const now = performance.now();
      blots.push({ x, y, r: 9, t: now });
      for (let i = 0; i < 14; i++) {
        const ang = Math.random() * Math.PI * 2;
        const dist = 10 + Math.random() ** 1.8 * 70;
        blots.push({ x: x + Math.cos(ang) * dist, y: y + Math.sin(ang) * dist, r: 0.8 + Math.random() * 3.6, t: now });
      }
      kick();
    };

    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(host);
    window.addEventListener("pointermove", onMove, { passive: true });
    host.addEventListener("pointerdown", onDown);
    return () => {
      cancelAnimationFrame(frame);
      ro.disconnect();
      window.removeEventListener("pointermove", onMove);
      host.removeEventListener("pointerdown", onDown);
    };
  }, []);

  return <canvas ref={ref} className="pointer-events-none absolute inset-0 h-full w-full" aria-hidden />;
}
