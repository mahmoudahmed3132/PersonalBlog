"use client";

import { Moon, Sun } from "lucide-react";

export function ThemeToggle() {
  function toggle() {
    const next = !document.documentElement.classList.contains("dark");
    document.documentElement.classList.toggle("dark", next);
    window.localStorage.setItem("theme", next ? "dark" : "light");
  }

  return (
    <button
      type="button"
      onClick={toggle}
      className="inline-flex size-9 items-center justify-center rounded-md text-muted transition-colors hover:text-foreground"
      aria-label="Toggle theme"
    >
      <Moon className="theme-icon-moon size-4" aria-hidden />
      <Sun className="theme-icon-sun size-4" aria-hidden />
    </button>
  );
}
