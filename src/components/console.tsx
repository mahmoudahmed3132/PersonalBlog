"use client";

import { useRouter } from "next/navigation";
import { KeyboardEvent, ReactNode, useCallback, useEffect, useRef, useState } from "react";
import { certifications } from "@/lib/resume-data";
import { siteConfig } from "@/lib/site-config";

export const OPEN_CONSOLE_EVENT = "console:open";

type Post = { title: string; href: string };
type Line = { id: number; kind: "in" | "out" | "err"; body: ReactNode };

const PROMPT = "guest@halim:~$";

const PAGES: Record<string, string> = {
  home: "/",
  work: "/work",
  speaking: "/speaking",
  projects: "/projects",
  blog: "/blog",
  resume: "/resume",
  gears: "/gears",
  setup: "/setup",
  terminal: "/terminal",
  books: "/books",
  movies: "/movies",
};

const HELP: [string, string][] = [
  ["help", "show this list"],
  ["whoami", "who runs this place"],
  ["ls", "list pages"],
  ["cd <page>", "go to a page"],
  ["posts", "latest writing"],
  ["open <n>", "open post n from `posts`"],
  ["certs", "certifications"],
  ["contact", "how to reach me"],
  ["theme [light|dark]", "switch theme"],
  ["uname -a", "what this site runs on"],
  ["history", "previous commands"],
  ["clear", "clear the screen"],
  ["exit", "close the console (or Esc)"],
];

const COMMANDS = ["help", "whoami", "ls", "cd", "posts", "open", "certs", "contact", "theme", "uname", "history", "clear", "exit", "echo", "date", "sudo"];

function isTypingTarget(target: EventTarget | null) {
  const el = target as HTMLElement | null;
  if (!el) return false;
  return el.isContentEditable || ["INPUT", "TEXTAREA", "SELECT"].includes(el.tagName);
}

function setTheme(mode: "light" | "dark") {
  document.documentElement.classList.toggle("dark", mode === "dark");
  try {
    window.localStorage.setItem("theme", mode);
  } catch {}
}

export function Console({ posts }: { posts: Post[] }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [lines, setLines] = useState<Line[]>([]);
  const [value, setValue] = useState("");
  const [history, setHistory] = useState<string[]>([]);
  const [cursor, setCursor] = useState<number | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const returnFocus = useRef<HTMLElement | null>(null);
  const nextId = useRef(0);

  const print = useCallback((kind: Line["kind"], body: ReactNode) => {
    setLines((current) => [...current, { id: nextId.current++, kind, body }]);
  }, []);

  const show = useCallback(() => {
    returnFocus.current = document.activeElement as HTMLElement | null;
    setOpen(true);
  }, []);

  const hide = useCallback(() => {
    setOpen(false);
    returnFocus.current?.focus?.();
  }, []);

  useEffect(() => {
    function onKeyDown(event: globalThis.KeyboardEvent) {
      if (event.key !== "`" && event.key !== "~") return;
      if (event.metaKey || event.ctrlKey || event.altKey) return;
      if (isTypingTarget(event.target) && event.target !== inputRef.current) return;
      event.preventDefault();
      if (open) hide();
      else show();
    }

    window.addEventListener("keydown", onKeyDown);
    window.addEventListener(OPEN_CONSOLE_EVENT, show);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener(OPEN_CONSOLE_EVENT, show);
    };
  }, [open, show, hide]);

  useEffect(() => {
    if (!open) return;
    inputRef.current?.focus();
    if (lines.length === 0) {
      print("out", <span className="text-muted">Type `help` to see what this can do. Esc to close.</span>);
    }
  }, [open, lines.length, print]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight });
  }, [lines]);

  function go(href: string) {
    hide();
    if (href.startsWith("http") || href.startsWith("mailto:")) window.location.href = href;
    else router.push(href);
  }

  function run(raw: string) {
    const input = raw.trim();
    print("in", input);
    if (!input) return;
    setHistory((current) => [...current, input]);

    const [cmd, ...args] = input.split(/\s+/);
    const arg = args.join(" ");

    switch (cmd.toLowerCase()) {
      case "help":
        print(
          "out",
          <div className="grid grid-cols-[max-content_1fr] gap-x-6">
            {HELP.map(([name, desc]) => (
              <div key={name} className="contents">
                <span>{name}</span>
                <span className="text-muted">{desc}</span>
              </div>
            ))}
          </div>,
        );
        return;
      case "whoami":
        print(
          "out",
          <>
            guest. The person you are looking for is {siteConfig.name}: {siteConfig.role.toLowerCase()} at Kashier,
            detection engineering and incident response, based in {siteConfig.location}.
          </>,
        );
        return;
      case "ls":
        print("out", Object.keys(PAGES).map((name) => `${name}/`).join("  "));
        return;
      case "cd": {
        const target = arg.replace(/^[~./]+/, "").replace(/\/$/, "") || "home";
        if (PAGES[target]) go(PAGES[target]);
        else print("err", `cd: no such page: ${arg}`);
        return;
      }
      case "posts":
        print(
          "out",
          <ol>
            {posts.slice(0, 8).map((post, index) => (
              <li key={post.href}>
                <span className="text-muted">[{index + 1}]</span> {post.title}
              </li>
            ))}
          </ol>,
        );
        return;
      case "open": {
        const post = posts[Number(arg) - 1];
        if (post) go(post.href);
        else print("err", "open: usage: open <n>  (run `posts` first)");
        return;
      }
      case "certs":
        print(
          "out",
          <ul>
            {certifications.map((cert) => (
              <li key={cert.name}>
                {cert.url ? (
                  <a href={cert.url} className="link">
                    {cert.name}
                  </a>
                ) : (
                  cert.name
                )}
                {cert.issuer ? <span className="text-muted"> — {cert.issuer}</span> : null}
              </li>
            ))}
          </ul>,
        );
        return;
      case "contact":
      case "hire":
        print(
          "out",
          <>
            email:{" "}
            <a href={`mailto:${siteConfig.email}`} className="link">
              {siteConfig.email.toLowerCase()}
            </a>
            <br />
            linkedin:{" "}
            <a href="https://www.linkedin.com/in/mahmoudhalim466/" className="link">
              in/mahmoudhalim466
            </a>
          </>,
        );
        return;
      case "theme": {
        const mode = arg === "light" || arg === "dark" ? arg : document.documentElement.classList.contains("dark") ? "light" : "dark";
        setTheme(mode);
        print("out", `theme: ${mode}`);
        return;
      }
      case "uname": {
        const sha = process.env.BUILD_SHA;
        print(
          "out",
          `halim.blog next.js static-export ${sha ? `#${sha}` : ""} built ${(process.env.BUILD_TIME ?? "").slice(0, 10)} (github pages)`,
        );
        return;
      }
      case "date":
        print("out", new Date().toString());
        return;
      case "echo":
        print("out", arg);
        return;
      case "history":
        print(
          "out",
          [...history, input].map((item, index) => `${String(index + 1).padStart(4)}  ${item}`).join("\n"),
        );
        return;
      case "clear":
        setLines([]);
        return;
      case "exit":
      case "quit":
        hide();
        return;
      case "sudo":
        print("err", "guest is not in the sudoers file. This incident will be reported.");
        return;
      case "rm":
        print("err", "rm: permission denied. Also, it's a static site. Nothing here to delete.");
        return;
      default:
        print("err", `command not found: ${cmd}. Try \`help\`.`);
    }
  }

  function onKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Enter") {
      run(value);
      setValue("");
      setCursor(null);
    } else if (event.key === "Escape") {
      hide();
    } else if (event.key === "ArrowUp" && history.length) {
      event.preventDefault();
      const next = cursor === null ? history.length - 1 : Math.max(0, cursor - 1);
      setCursor(next);
      setValue(history[next]);
    } else if (event.key === "ArrowDown" && cursor !== null) {
      event.preventDefault();
      const next = cursor + 1;
      setCursor(next >= history.length ? null : next);
      setValue(next >= history.length ? "" : history[next]);
    } else if (event.key === "Tab") {
      event.preventDefault();
      const [cmd, ...rest] = value.split(" ");
      if (rest.length === 0) {
        const match = COMMANDS.filter((name) => name.startsWith(cmd));
        if (match.length === 1) setValue(`${match[0]} `);
        else if (match.length > 1) print("out", match.join("  "));
      } else if (cmd === "cd") {
        const match = Object.keys(PAGES).filter((name) => name.startsWith(rest.join(" ")));
        if (match.length === 1) setValue(`cd ${match[0]}`);
      }
    } else if (event.key === "l" && event.ctrlKey) {
      event.preventDefault();
      setLines([]);
    }
  }

  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-label="Command console"
      className="console-panel fixed inset-x-0 top-0 z-50 border-b border-border bg-background font-mono text-[13px] shadow-2xl"
      onClick={() => inputRef.current?.focus()}
    >
      <div className="mx-auto w-full max-w-4xl px-5 sm:px-8">
        <div ref={scrollRef} className="max-h-[45vh] overflow-y-auto pt-4" aria-live="polite">
          {lines.map((line) => (
            <div
              key={line.id}
              className={`whitespace-pre-wrap break-words leading-6 ${line.kind === "err" ? "text-muted" : ""}`}
            >
              {line.kind === "in" ? (
                <>
                  <span className="text-muted">{PROMPT}</span> {line.body}
                </>
              ) : (
                line.body
              )}
            </div>
          ))}
        </div>
        <label className="flex items-center gap-2 py-3">
          <span className="shrink-0 text-muted">{PROMPT}</span>
          <span className="sr-only">Command</span>
          <input
            ref={inputRef}
            value={value}
            onChange={(event) => setValue(event.target.value)}
            onKeyDown={onKeyDown}
            autoComplete="off"
            autoCapitalize="off"
            spellCheck={false}
            className="min-w-0 flex-1 bg-transparent caret-foreground outline-none"
          />
        </label>
      </div>
    </div>
  );
}
