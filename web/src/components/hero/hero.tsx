"use client";

import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);
import { Container } from "@/components/ui/container";
import { LinkButton } from "@/components/ui/link-button";
import { ArrowRight } from "@phosphor-icons/react";
import { SentienceOrb } from "./sentience-orb";

/**
 * CORE by Blackshield: Professional Redesign
 * Philosophy: Apple/iPhone aesthetic - Clean, Sharp, Professional.
 */

interface HeroProps {
  stats: [number, string][];
}

export function Hero({ stats }: HeroProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Clean Entry Animation
      gsap.fromTo(".gsap-reveal", 
        { y: 20, opacity: 0 },
        { 
          y: 0, 
          opacity: 1, 
          duration: 1, 
          ease: "power3.out", 
          stagger: 0.1,
          delay: 0.1
        }
      );

      // Number counting animation triggered once on scroll
      const numElements = gsap.utils.toArray<HTMLElement>(".gsap-stat-num");
      numElements.forEach((el, index) => {
        const targetValue = stats[index]?.[0] || 0;
        gsap.fromTo(
          el,
          { innerText: 0 },
          {
            innerText: targetValue,
            duration: 2.5,
            ease: "power3.out",
            snap: { innerText: 1 },
            delay: 0.2 + index * 0.1,
            scrollTrigger: {
              trigger: el,
              start: "top 90%", // Trigger when the stat hits 90% down the viewport
              once: true, // Never reverse or replay
            },
          }
        );
      });
    }, containerRef);

    return () => ctx.revert();
  }, [stats]);

  return (
    <section ref={containerRef} className="relative isolate overflow-hidden pt-40 pb-24 md:pt-56 md:pb-32">
      {/* BACKGROUND ORB - PERSISTENT */}
      <SentienceOrb />

      <Container className="relative z-10">
        <div className="max-w-[800px]">
          
          {/* Professional Eyebrow */}
          <div className="gsap-reveal mb-8 flex items-center gap-3">
            <span className="font-sans text-[12px] font-semibold uppercase tracking-[0.2em] text-white/40">
              Security Research & Engineering
            </span>
          </div>

          {/* Clean, Single-line Title */}
          <h1 className="gsap-reveal text-[clamp(28px,5vw,52px)] font-bold tracking-[-0.04em] text-white leading-[1.1] whitespace-nowrap">
            CORE by BlackShield
          </h1>

          {/* Professional Narrative */}
          <p className="gsap-reveal mt-8 max-w-[60ch] text-[16px] md:text-[19px] font-medium leading-[1.5] tracking-[-0.01em] text-white/70">
            The professional environment for advanced offensive security. 
            Built for adversarial research, threat intelligence, and high-fidelity technical training.
          </p>

          {/* Clean CTAs */}
          <div className="gsap-reveal mt-12 flex flex-wrap items-center gap-4">
            <LinkButton
              size="lg"
              href="/labs"
              className="group rounded-full bg-white text-black px-8 py-6 text-[15px] font-semibold transition-all hover:bg-white/90 active:scale-[0.98]"
            >
              Explore Labs
              <ArrowRight className="ml-2 size-4 transition-transform group-hover:translate-x-0.5" />
            </LinkButton>
            <LinkButton
              size="lg"
              variant="ghost"
              href="/ai-security"
              className="rounded-full border border-white/10 bg-white/5 px-8 py-6 text-[15px] font-semibold text-white/90 hover:bg-white/10 transition-all"
            >
              Read Research
            </LinkButton>
          </div>
        </div>

        {/* Clean Stats Strip */}
        <dl className="gsap-reveal mt-32 grid grid-cols-2 gap-12 md:grid-cols-4 border-t border-white/5 pt-12">
          {stats.map(([v, l]) => (
            <div key={l} className="space-y-1">
              <dd className="gsap-stat-num font-sans text-[32px] font-bold tracking-tight text-white">
                0
              </dd>
              <dt className="font-sans text-[12px] font-medium text-white/30">
                {l}
              </dt>
            </div>
          ))}
        </dl>
      </Container>
    </section>
  );
}
