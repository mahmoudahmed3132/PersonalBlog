import {
  Award,
  BookOpen,
  BriefcaseBusiness,
  Clapperboard,
  Code2,
  ExternalLink,
  FileText,
  Globe,
  Home,
  Laptop,
  Mail,
  MapPin,
  Mic,
  Music,
  MonitorCog,
  PenLine,
  Radio,
  Rss,
  Terminal,
} from "lucide-react";

export const siteConfig = {
  name: "Mahmoud Halim",
  title: "Senior Security Engineer — Detection, Incident Response & Cloud Security",
  description:
    "Senior Security Engineer with 3+ years across fintech and managed security: detection engineering, incident response, SIEM/SOAR/EDR, and compliance (PCI DSS, SOC 2, ISO 27001).",
  role: "Senior Security Engineer",
  url: (process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000").replace(/\/$/, ""),
  location: "Cairo, Egypt",
  email: "Mahmoudhalim466@gmail.com",
  quote: `"I haven't even begun to peak. And when I do peak, you'll know. Because I'm gonna peak so hard that everybody in Philadelphia's gonna feel it." -Dennis.`,
  medium: "https://medium.com/@mahmoudhalim466",
  spotify: "https://open.spotify.com/user/gh8gsbm6crju54a60p7uhf2rz",
  appleMusic: "https://music.apple.com/profile/mahmoudhalim466",
  author: {
    name: "Mahmoud Halim",
    initials: "MH",
  },
  keywords: [
    "Mahmoud Halim",
    "Security Engineer",
    "Detection Engineering",
    "Incident Response",
    "SIEM",
    "SOAR",
    "EDR",
    "MITRE ATT&CK",
    "CrowdStrike",
    "Splunk",
    "Cloud Security",
    "DFIR",
    "Egypt",
  ],
  socials: [
    { label: "GitHub", href: "https://github.com/mahmoudahmed3132", icon: Code2 },
    { label: "LinkedIn", href: "https://www.linkedin.com/in/mahmoudhalim466/", icon: ExternalLink },
    { label: "Medium", href: "https://medium.com/@mahmoudhalim466", icon: PenLine },
    { label: "Spotify", href: "https://open.spotify.com/user/gh8gsbm6crju54a60p7uhf2rz", icon: Music },
    { label: "Apple Music", href: "https://music.apple.com/profile/mahmoudhalim466", icon: Radio },
    { label: "Email", href: "mailto:Mahmoudhalim466@gmail.com", icon: Mail },
  ],
  nav: [
    { label: "Home", href: "/", icon: Home },
    { label: "Work", href: "/work", icon: BriefcaseBusiness },
    { label: "Speaking", href: "/speaking", icon: Mic },
    { label: "Projects", href: "/projects", icon: Code2 },
    { label: "Blog", href: "/blog", icon: BookOpen },
  ],
  commandLinks: [
    { label: "Home", href: "/", icon: Home },
    { label: "Resume (print-friendly)", href: "/resume", icon: FileText },
    { label: "Work", href: "/work", icon: BriefcaseBusiness },
    { label: "Speaking", href: "/speaking", icon: Mic },
    { label: "Projects", href: "/projects", icon: Code2 },
    { label: "Blog", href: "/blog", icon: BookOpen },
    { label: "Gears", href: "/gears", icon: Laptop },
    { label: "Setup", href: "/setup", icon: MonitorCog },
    { label: "Terminal", href: "/terminal", icon: Terminal },
    { label: "Certifications", href: "/resume#certifications", icon: Award },
    { label: "Books", href: "/books", icon: BookOpen },
    { label: "Movies", href: "/movies", icon: Clapperboard },
  ],
  footer: [
    { label: "RSS", href: "/rss.xml", icon: Rss },
    { label: "GitHub", href: "https://github.com/mahmoudahmed3132", icon: Globe },
    { label: "LinkedIn", href: "https://www.linkedin.com/in/mahmoudhalim466/", icon: ExternalLink },
    { label: "Email", href: "mailto:Mahmoudhalim466@gmail.com", icon: Mail },
  ],
};

export const profileFacts = [
  { label: "Location", value: siteConfig.location, icon: MapPin },
  { label: "Email", value: siteConfig.email, icon: Mail },
];

export const experience = [
  {
    company: "Kashier",
    role: "Senior Security Engineer",
    period: "Mar 2026 - Present",
    location: "Egypt",
    description:
      "Security controls, incident response, vulnerability assessment, SIEM/SOAR/EDR engineering, and compliance readiness across private cloud and on-prem environments.",
  },
  {
    company: "BARQ Systems",
    role: "Mid-Sr Cyber Defense Engineer",
    period: "Nov 2024 - Mar 2026",
    location: "Egypt",
    description:
      "Led Elastic, FortiSIEM, FortiSOAR, and CrowdStrike implementation work while supporting SOC-as-a-Service engineering and customer enablement.",
  },
  {
    company: "Limatrix INC.",
    role: "Security Engineer I",
    period: "May 2023 - Nov 2024",
    location: "Egypt",
    description:
      "Provided SOC monitoring and incident response, coordinated investigations, and tuned MITRE ATT&CK-aligned detections.",
  },
];

export const developmentLinks = [
  { title: "Gears", href: "/gears", description: "Devices, tools, and software I use." },
  { title: "Setup", href: "/setup", description: "Editor, extensions, and daily workflow." },
  { title: "Terminal", href: "/terminal", description: "Shell, prompt, aliases, and CLI tools." },
];

export const personalLinks = [
  { title: "Books", href: "/books" },
  { title: "Movies", href: "/movies" },
];
