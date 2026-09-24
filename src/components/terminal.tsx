import type { ReactNode } from "react";

export function TerminalWindow({
  title,
  children,
  className = "",
}: {
  title: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={`term-window ${className}`.trim()}>
      <div className="term-bar">
        <span className="term-dots" aria-hidden>
          <span />
          <span />
          <span />
        </span>
        <span className="ml-2 truncate">{title}</span>
      </div>
      <div className="term-body">{children}</div>
    </div>
  );
}

export function Prompt({ cwd = "~", children }: { cwd?: string; children: ReactNode }) {
  return (
    <>
      <span className="term-prompt">mahmoud@kashier</span>
      <span className="term-comment">:</span>
      <span className="term-path">{cwd}</span>
      <span className="term-comment">$ </span>
      <span>{children}</span>
    </>
  );
}

/** Line that "prints" after a delay — pure CSS, content stays in the static HTML. */
export function Line({ delay = 0, children }: { delay?: number; children?: ReactNode }) {
  return (
    <div className="term-line whitespace-pre-wrap break-words" style={{ animationDelay: `${delay}s` }}>
      {children ?? " "}
    </div>
  );
}
