"use client";

import { Check, Copy } from "lucide-react";
import { ComponentPropsWithoutRef, isValidElement, useRef, useState } from "react";

function languageOf(children: React.ReactNode) {
  if (!isValidElement<{ className?: string }>(children)) return "text";
  const match = /language-([\w-]+)/.exec(children.props.className ?? "");
  return match?.[1] ?? "text";
}

export function CodeBlock(props: ComponentPropsWithoutRef<"pre">) {
  const ref = useRef<HTMLPreElement>(null);
  const [copied, setCopied] = useState(false);
  const language = languageOf(props.children);

  async function copy() {
    const text = ref.current?.innerText ?? "";
    await navigator.clipboard.writeText(text);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1200);
  }

  return (
    <div className="term-window mt-5">
      <div className="term-bar">
        <span className="term-dots" aria-hidden>
          <span />
          <span />
          <span />
        </span>
        <span className="ml-2">{language}</span>
        <button
          type="button"
          onClick={copy}
          className="ml-auto inline-flex items-center gap-1.5 rounded px-1.5 py-0.5 transition hover:bg-white/10 hover:text-white"
          aria-label="Copy code"
        >
          {copied ? <Check className="size-3.5" aria-hidden /> : <Copy className="size-3.5" aria-hidden />}
          {copied ? "copied" : "copy"}
        </button>
      </div>
      <pre ref={ref} {...props} />
    </div>
  );
}
