import {
  BookOpen,
  BriefcaseBusiness,
  Clapperboard,
  Code2,
  ExternalLink,
  Globe,
  Home,
  Laptop,
  Mail,
  MapPin,
  Music,
  MonitorCog,
  PenLine,
  Radio,
  Rss,
  Terminal,
} from "lucide-react";

export const siteConfig = {
  name: "Mahmoud Halim",
  title: "Full-time music-nerd thalassophile turned security engineer.",
  description: "Full-time music-nerd thalassophile turned security engineer.",
  url: (process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000").replace(/\/$/, ""),
  location: "",
  email: "Mahmoudhalim466@gmail.com",
  quote: `"I haven't even begun to peak. And when I do peak, you'll know. Because I'm gonna peak so hard that everybody in Philadelphia's gonna feel it." -Dennis.`,
  medium: "https://medium.com/@mahmoudhalim466",
  spotify: "https://open.spotify.com/user/gh8gsbm6crju54a60p7uhf2rz",
  appleMusic: "https://music.apple.com/profile/mahmoudhalim466",
  author: {
    name: "Mahmoud Halim",
    initials: "MH",
  },
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
    { label: "Blog", href: "/blog", icon: BookOpen },
  ],
  commandLinks: [
    { label: "Home", href: "/", icon: Home },
    { label: "Blog", href: "/blog", icon: BookOpen },
    { label: "Work", href: "/work", icon: BriefcaseBusiness },
    { label: "Projects", href: "/projects", icon: Code2 },
    { label: "Gears", href: "/gears", icon: Laptop },
    { label: "Setup", href: "/setup", icon: MonitorCog },
    { label: "Terminal", href: "/terminal", icon: Terminal },
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
