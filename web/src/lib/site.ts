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
      label: "Community",
      items: [
        { href: "/talks", name: "Talks", hint: "Conference recordings" },
        { href: "/about", name: "About", hint: "Mission & principles" },
      ],
    },
  ],
  cta: { href: "/platform", label: "Enter Platform" },
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
  Community: [
    { href: "/talks", label: "Talks" },
    { href: "/about", label: "About" },
  ],
} as const;
