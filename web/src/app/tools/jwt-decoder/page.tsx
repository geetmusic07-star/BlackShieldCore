import type { Metadata } from "next";
import { JwtDecoderClient } from "./jwt-decoder-client";
import { Container } from "@/components/ui/container";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export const metadata: Metadata = {
  title: "JWT Decoder",
  description:
    "Paste a JSON Web Token to decode its header and payload, see signature warnings (alg:none, weak HMAC), and read flagged risks.",
};

export default function JwtDecoderPage() {
  return (
    <section className="relative pt-40 pb-32 md:pt-48 md:pb-40">
      <Container className="max-w-[920px]">
        <Link
          href="/tools"
          className="inline-flex items-center gap-2 text-[12px] font-mono text-[color:var(--bsc-text-3)] transition-colors hover:text-[color:var(--bsc-text-1)]"
        >
          <ArrowLeft className="size-3.5" />
          All Tools
        </Link>

        <div className="mt-10 mb-12 max-w-2xl">
          <div className="mb-4 text-[10px] font-mono uppercase tracking-[0.18em] text-[color:var(--bsc-text-3)]">
            Tool · Token analysis
          </div>
          <h1 className="text-[clamp(34px,4.4vw,52px)] font-semibold leading-[1.06] tracking-[-0.022em] text-[color:var(--bsc-text-1)]">
            JWT Decoder
          </h1>
          <p className="mt-5 text-[15px] leading-relaxed text-[color:var(--bsc-text-2)]">
            Decode the header and payload of a JSON Web Token in your browser. Surfaces
            common-class warnings - <code className="font-mono text-[color:var(--bsc-text-1)]">alg:none</code>,
            unsigned tokens, and short HMAC secrets - without sending the token anywhere.
          </p>
          <p className="mt-3 text-[12px] text-[color:var(--bsc-text-3)]">
            All processing runs locally in the browser. No network request is made with the token.
          </p>
        </div>

        <JwtDecoderClient />
      </Container>
    </section>
  );
}
