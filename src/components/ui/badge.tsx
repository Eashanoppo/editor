import * as React from "react";
import { cn } from "@/lib/utils";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "neutral" | "primary" | "yellow" | "success" | "warning" | "error";
}

const badgeVariants: Record<NonNullable<BadgeProps["variant"]>, string> = {
  neutral: "bg-surface-secondary text-ink-secondary border-border",
  primary: "bg-brand-light text-brand-accent border-brand-border",
  yellow:
    "bg-yellow-light text-[#8A6100] dark:text-[#FDE047] border-warning-border",
  success: "bg-success-bg text-success border-success-border",
  warning: "bg-warning-bg text-warning border-warning-border",
  error: "bg-error-bg text-error border-error-border",
};

export function Badge({
  className,
  variant = "neutral",
  ...props
}: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-medium leading-tight",
        badgeVariants[variant],
        className
      )}
      {...props}
    />
  );
}
