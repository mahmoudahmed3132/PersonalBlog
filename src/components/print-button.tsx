"use client";

import { Printer } from "lucide-react";

export function PrintButton({ className = "" }: { className?: string }) {
  return (
    <button
      type="button"
      onClick={() => window.print()}
      className={`btn-outline inline-flex items-center gap-2 rounded-md px-4 py-2 text-sm no-print ${className}`}
    >
      <Printer className="size-4" aria-hidden />
      Print / Save as PDF
    </button>
  );
}
