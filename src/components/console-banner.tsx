"use client";

import { useEffect } from "react";
import { siteConfig } from "@/lib/site-config";

const BANNER = String.raw`
  __  __ _   _
 |  \/  | | | |   ${siteConfig.name}
 | |\/| | |_| |   ${siteConfig.role}
 | |  | |  _  |   detection · dfir · soar
 |_|  |_|_| |_|
`;

export function ConsoleBanner() {
  useEffect(() => {
    const w = window as Window & { __mhBanner?: boolean };
    if (w.__mhBanner) return;
    w.__mhBanner = true;

    console.log(`%c${BANNER}`, "color:#3ee6a1;font-family:monospace;font-weight:bold");
    console.log(
      `%c[+] Poking around the DevTools? Good instinct.\n[+] Let's talk: ${siteConfig.email}`,
      "color:#8b949e;font-family:monospace",
    );
  }, []);

  return null;
}
