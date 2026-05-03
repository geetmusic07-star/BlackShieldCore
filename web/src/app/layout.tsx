import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { SmoothScrollProvider } from "@/components/providers/smooth-scroll";

const geistSans = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
  display: "swap",
});

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
  display: "swap",
});
import { MotionConfigProvider } from "@/components/providers/motion-config";
import { SiteHeader } from "@/components/site/site-header";
import { SiteFooter } from "@/components/site/site-footer";
import { TooltipProvider } from "@/components/ui/tooltip";
import { OperatorProvider } from "@/components/providers/operator-provider";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: {
    default: `${site.name} - ${site.tagline}`,
    template: `%s · ${site.name}`,
  },
  description: site.description,
  metadataBase: new URL(site.url),
  openGraph: {
    type: "website",
    title: site.name,
    description: site.description,
    siteName: site.name,
  },
  twitter: { card: "summary_large_image", title: site.name, description: site.description },
};

export const viewport: Viewport = {
  themeColor: "#0a0f1a",
  colorScheme: "dark",
};

import { HandshakeProvider } from "@/components/ui/system-handshake";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`dark ${geistSans.variable} ${geistMono.variable}`}>
      <body className="relative min-h-screen flex flex-col">
        <div className="bsc-grain" aria-hidden="true" />
        <MotionConfigProvider>
          <HandshakeProvider>
            <OperatorProvider>
              <TooltipProvider delay={120}>
                <SmoothScrollProvider />
                <SiteHeader />
                <main className="relative z-10 flex-1">{children}</main>
                <SiteFooter />
              </TooltipProvider>
            </OperatorProvider>
          </HandshakeProvider>
        </MotionConfigProvider>
      </body>
    </html>
  );
}
