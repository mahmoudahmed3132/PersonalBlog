"use client";

import { useEffect, useRef } from "react";

export function ReadingProgress() {
  const bar = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let frame = 0;

    function update() {
      frame = 0;
      const doc = document.documentElement;
      const max = doc.scrollHeight - doc.clientHeight;
      const ratio = max > 0 ? Math.min(1, doc.scrollTop / max) : 0;
      if (bar.current) bar.current.style.transform = `scaleX(${ratio})`;
    }

    function onScroll() {
      if (!frame) frame = requestAnimationFrame(update);
    }

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      cancelAnimationFrame(frame);
    };
  }, []);

  return <div ref={bar} className="reading-progress" style={{ transform: "scaleX(0)" }} aria-hidden />;
}
