export const site = {
  name: "BlackShield Core",
  tagline: "Cybersecurity & AI Research Platform",
  description:
    "BlackShield Core is a cybersecurity and AI experimentation platform. Cyber range, LLM red-teaming, threat intelligence, offensive tools, and in-depth technical research.",
  url: "https://blackshieldcore.dev",
} as const;

export const nav = {
  primary: [
    {
      label: "Platform",
      items: [
        { href: "/labs", name: "Labs", hint: "Offensive & CTF scenarios" },
        { href: "/ai-security", name: "AI Security", hint: "LLM attack surface" },
        { href: "/dashboard", name: "Dashboard", hint: "Threat signals" },
        { href: "/tools", name: "Tools", hint: "Utilities & analysis" },
      ],
    },
    {
      label: "Knowledge",
      items: [
        { href: "/blog", name: "Technical Blog", hint: "Deep-dive research" },
        { href: "/research", name: "Research Notes", hint: "Structured analyses" },
        { href: "/case-studies", name: "Case Studies", hint: "Incident reconstructions" },
      ],
    },
    {
      label: "Investigate",
      items: [
        { href: "/osint", name: "OSINT", hint: "Field investigations" },
        { href: "/home-lab", name: "Home Lab", hint: "Self-hosted topology" },
        { href: "/talks", name: "Talks", hint: "Conference recordings" },
      ],
    },
    {
      label: "About",
      items: [
        { href: "/about", name: "About BSC", hint: "Mission & principles" },
        { href: "/platform", name: "Platform overview", hint: "All modules" },
      ],
    },
  ],
  cta: { href: "/labs", label: "Browse Labs" },
} as const;

export const footerLinks = {
  Platform: [
    { href: "/labs", label: "Labs" },
    { href: "/ai-security", label: "AI Security" },
    { href: "/dashboard", label: "Dashboard" },
    { href: "/tools", label: "Tools" },
  ],
  Knowledge: [
    { href: "/blog", label: "Technical Blog" },
    { href: "/research", label: "Research" },
    { href: "/case-studies", label: "Case Studies" },
  ],
  Investigate: [
    { href: "/osint", label: "OSINT" },
    { href: "/home-lab", label: "Home Lab" },
    { href: "/talks", label: "Talks" },
  ],
  About: [
    { href: "/about", label: "About BSC" },
    { href: "/platform", label: "Platform overview" },
  ],
} as const;
