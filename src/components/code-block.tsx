"use client";

import { Check, Copy } from "lucide-react";
import { ComponentPropsWithoutRef, useRef, useState } from "react";

export function CodeBlock(props: ComponentPropsWithoutRef<"pre">) {
  const ref = useRef<HTMLPreElement>(null);
  const [copied, setCopied] = useState(false);

  async function copy() {
    const text = ref.current?.innerText ?? "";
    await navigator.clipboard.writeText(text);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1200);
  }

  return (
    <div className="group relative mt-5 rounded-lg bg-[var(--code-bg)]">
      <button
        type="button"
        onClick={copy}
        className="absolute right-2 top-2 inline-flex size-8 items-center justify-center rounded-md text-muted opacity-0 transition hover:text-foreground group-hover:opacity-100 focus-visible:opacity-100"
        aria-label="Copy code"
      >
        {copied ? <Check className="size-4" aria-hidden /> : <Copy className="size-4" aria-hidden />}
      </button>
      <pre ref={ref} {...props} />
    </div>
  );
}
