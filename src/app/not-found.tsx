import Link from "next/link";
import { Line, Prompt, TerminalWindow } from "@/components/terminal";

export default function NotFound() {
  return (
    <div className="py-10">
      <p className="font-mono text-xs text-danger">HTTP/1.1 404 Not Found</p>
      <h1 className="mt-2 text-4xl font-bold tracking-tight">
        <span className="glitch">No hits.</span>
      </h1>
      <p className="mt-3 text-secondary">The query ran clean — this page doesn&apos;t exist.</p>

      <TerminalWindow title="threat-hunt — zsh" className="mt-8">
        <Line delay={0.2}>
          <Prompt>grep -r &quot;this-page&quot; /var/www</Prompt>
        </Line>
        <Line delay={0.6}>
          <span className="term-comment">(no matches)</span>
        </Line>
        <Line delay={0.9}>
          <Prompt>echo $?</Prompt>
        </Line>
        <Line delay={1.2}>
          <span className="term-num">1</span>
        </Line>
        <Line delay={1.5}>
          <span className="term-comment"># verdict: benign. probably a stale link.</span>
        </Line>
      </TerminalWindow>

      <div className="mt-8 flex flex-wrap gap-3">
        <Link href="/" className="btn-accent inline-flex items-center rounded-md px-4 py-2 font-mono text-sm">
          cd ~
        </Link>
        <Link href="/blog" className="btn-outline inline-flex items-center rounded-md px-4 py-2 font-mono text-sm">
          ls ./blog
        </Link>
      </div>
    </div>
  );
}
