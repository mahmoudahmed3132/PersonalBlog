import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
import { Footer, Header } from "@/components/layout";
import { ScreenDog } from "@/components/screen-dog";
import { siteConfig } from "@/lib/site-config";
import "./globals.css";

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist",
  display: "swap",
});

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: `${siteConfig.name} — ${siteConfig.role}`,
    template: `%s — ${siteConfig.name}`,
  },
  description: siteConfig.description,
  keywords: siteConfig.keywords,
  authors: [{ name: siteConfig.name, url: siteConfig.url }],
  creator: siteConfig.name,
  openGraph: {
    title: `${siteConfig.name} — ${siteConfig.role}`,
    description: siteConfig.description,
    url: siteConfig.url,
    siteName: siteConfig.name,
    type: "profile",
    locale: "en_US",
    images: [
      {
        url: "/avatar-pixel.png",
        width: 512,
        height: 512,
        alt: `${siteConfig.name} avatar`,
      },
    ],
  },
  twitter: {
    card: "summary",
    title: `${siteConfig.name} — ${siteConfig.role}`,
    description: siteConfig.description,
    images: ["/avatar-pixel.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: siteConfig.url,
    types: {
      "application/rss+xml": `${siteConfig.url}/rss.xml`,
    },
  },
};

const personJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: siteConfig.name,
  jobTitle: siteConfig.role,
  description: siteConfig.description,
  email: `mailto:${siteConfig.email}`,
  url: siteConfig.url,
  image: `${siteConfig.url}/avatar-pixel.png`,
  address: {
    "@type": "PostalAddress",
    addressLocality: "Cairo",
    addressCountry: "EG",
  },
  alumniOf: {
    "@type": "CollegeOrUniversity",
    name: "Cairo University — Faculty of Computers and Artificial Intelligence",
  },
  knowsAbout: [
    "Detection Engineering",
    "Incident Response",
    "SIEM",
    "SOAR",
    "EDR",
    "MITRE ATT&CK",
    "Cloud Security",
    "Digital Forensics",
  ],
  sameAs: [
    "https://github.com/mahmoudahmed3132",
    "https://www.linkedin.com/in/mahmoudhalim466/",
    "https://medium.com/@mahmoudhalim466",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geist.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        <Script id="theme-init" strategy="beforeInteractive">
          {"try{var t=localStorage.getItem('theme');var d=t?t==='dark':matchMedia('(prefers-color-scheme: dark)').matches;document.documentElement.classList.toggle('dark',d)}catch(e){}"}
        </Script>
        <Script
          id="person-jsonld"
          type="application/ld+json"
          strategy="afterInteractive"
        >
          {JSON.stringify(personJsonLd)}
        </Script>
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-foreground focus:px-4 focus:py-2 focus:text-background"
        >
          Skip to content
        </a>
        <Header />
        <ScreenDog />
        <main id="main-content" className="mx-auto w-full max-w-4xl flex-1 px-5 py-16 sm:px-8 sm:py-20">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
