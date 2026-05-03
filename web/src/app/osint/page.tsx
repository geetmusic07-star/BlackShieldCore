import type { Metadata } from "next";
import { OsintDirectory } from "@/components/osint/osint-directory";
import { osintTools } from "@/content/osint";

export const metadata: Metadata = {
  title: "OSINT Tool Directory",
  description:
    "Curated collection of open-source intelligence tools used in security investigations, threat research, and infrastructure mapping.",
};

export default function OsintPage() {
  return <OsintDirectory tools={osintTools} />;
}
