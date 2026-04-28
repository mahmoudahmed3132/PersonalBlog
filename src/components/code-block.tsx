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
    <div className="group relative">
      <button
        type="button"
        onClick={copy}
        className="absolute right-2 top-2 inline-flex size-8 items-center justify-center rounded-md border border-white/10 bg-black/40 text-white opacity-0 transition group-hover:opacity-100"
        aria-label="Copy code"
      >
        {copied ? <Check className="size-4" /> : <Copy className="size-4" />}
      </button>
      <pre ref={ref} {...props} />
    </div>
  );
}
