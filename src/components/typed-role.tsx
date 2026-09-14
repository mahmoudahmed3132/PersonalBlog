"use client";

import { useEffect, useState } from "react";

const ROLES = [
  "Senior Security Engineer",
  "Detection Engineer",
  "Incident Responder",
  "SIEM / SOAR / EDR Specialist",
  "Threat Hunter",
];

export function TypedRole({ className = "" }: { className?: string }) {
  const [reduced] = useState(
    () =>
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches,
  );
  const [roleIndex, setRoleIndex] = useState(0);
  const [text, setText] = useState(() => (reduced ? ROLES[0] : ""));
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (reduced) return;

    const current = ROLES[roleIndex];
    const done = !deleting && text === current;
    const empty = deleting && text === "";

    if (done) {
      const hold = window.setTimeout(() => setDeleting(true), 2200);
      return () => window.clearTimeout(hold);
    }

    if (empty) {
      const flip = window.setTimeout(() => {
        setDeleting(false);
        setRoleIndex((value) => (value + 1) % ROLES.length);
      }, 0);
      return () => window.clearTimeout(flip);
    }

    const tick = window.setTimeout(
      () => {
        setText((value) =>
          deleting ? current.slice(0, value.length - 1) : current.slice(0, value.length + 1),
        );
      },
      deleting ? 28 : 62,
    );

    return () => window.clearTimeout(tick);
  }, [text, deleting, roleIndex, reduced]);

  return (
    <span className={`font-mono text-accent ${className}`} aria-live="polite">
      {text}
      <span className="typed-caret" aria-hidden />
    </span>
  );
}
