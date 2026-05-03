"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, useMotionValueEvent, useScroll } from "motion/react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { nav, site } from "@/lib/site";
import { LinkButton } from "@/components/ui/link-button";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";

export function SiteHeader() {
  const [scrolled, setScrolled] = useState(false);
  const { scrollY } = useScroll();
  const pathname = usePathname();

  useMotionValueEvent(scrollY, "change", (v) => {
    setScrolled(v > 12);
  });

  const isItemActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(`${href}/`);
  const isGroupActive = (items: ReadonlyArray<{ href: string }>) =>
    items.some((it) => isItemActive(it.href));

  return (
    <motion.header
      initial={{ y: -24, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
      className="fixed inset-x-0 top-0 z-50"
    >
      <div
        className={cn(
          "mx-auto mt-3 flex h-14 w-[min(1200px,calc(100%-24px))] items-center justify-between gap-6 rounded-full px-4 md:px-5 transition-[background,backdrop-filter,border-color,box-shadow] duration-300",
          scrolled
            ? "border border-white/[0.08] bg-[color-mix(in_oklch,var(--bsc-void)_72%,transparent)] shadow-[0_10px_40px_-12px_rgba(0,0,0,0.5)] backdrop-blur-xl"
            : "border border-transparent bg-transparent",
        )}
      >
        <Link
          href="/"
          className="flex items-center gap-2.5 text-sm font-semibold tracking-[-0.01em]"
        >
          <LogoMark />
          <span className="hidden sm:inline">{site.name}</span>
        </Link>

        <NavigationMenu className="hidden md:flex">
          <NavigationMenuList className="gap-1">
            {nav.primary.map((group) => {
              const groupActive = isGroupActive(group.items);
              return (
                <NavigationMenuItem key={group.label}>
                  <NavigationMenuTrigger
                    className={cn(
                      "relative bg-transparent text-[13px] font-medium hover:bg-white/[0.03] data-popup-open:bg-white/[0.05] data-popup-open:text-[color:var(--bsc-text-1)]",
                      groupActive
                        ? "text-[color:var(--bsc-text-1)] after:absolute after:left-3 after:right-3 after:-bottom-0.5 after:h-px after:bg-[color:var(--bsc-accent)]"
                        : "text-[color:var(--bsc-text-2)] hover:text-[color:var(--bsc-text-1)]",
                    )}
                  >
                    {group.label}
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className="grid w-[320px] gap-1 p-2">
                      {group.items.map((item) => {
                        const active = isItemActive(item.href);
                        return (
                          <li key={item.href}>
                            <Link
                              href={item.href}
                              aria-current={active ? "page" : undefined}
                              className={cn(
                                "group block rounded-md px-3 py-2.5 transition-colors",
                                active ? "bg-white/[0.06]" : "hover:bg-white/[0.04]",
                              )}
                            >
                              <div className="flex items-center gap-2 text-[13px] font-medium text-[color:var(--bsc-text-1)]">
                                {item.name}
                                {active && (
                                  <span className="size-1 rounded-full bg-[color:var(--bsc-accent)]" />
                                )}
                              </div>
                              <div className="text-[11px] text-[color:var(--bsc-text-3)] font-mono tracking-wide">
                                {item.hint}
                              </div>
                            </Link>
                          </li>
                        );
                      })}
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>
              );
            })}
          </NavigationMenuList>
        </NavigationMenu>

        <div className="flex items-center gap-2">
          <LinkButton
            size="sm"
            href={nav.cta.href}
            className="rounded-full bg-[color:var(--bsc-text-1)] text-[color:var(--bsc-void)] hover:bg-white"
          >
            {nav.cta.label}
          </LinkButton>
        </div>
      </div>
    </motion.header>
  );
}

function LogoMark() {
  return (
    <span
      aria-hidden="true"
      className="relative inline-flex size-6 items-center justify-center"
    >
      <span
        className="absolute inset-0 rounded-[7px] bg-gradient-to-br from-[color:var(--bsc-accent)] to-[color:var(--bsc-accent-soft)] opacity-90"
      />
      <span className="absolute inset-[3px] rounded-[5px] bg-[color:var(--bsc-void)]" />
      <span className="relative size-[6px] rounded-full bg-[color:var(--bsc-accent)]" />
    </span>
  );
}
