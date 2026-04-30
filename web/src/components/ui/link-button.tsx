import Link from "next/link";
import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import type { VariantProps } from "class-variance-authority";

type Props = ComponentProps<typeof Link> &
  VariantProps<typeof buttonVariants> & { className?: string };

export function LinkButton({ className, variant, size, ...props }: Props) {
  return (
    <Link
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}
