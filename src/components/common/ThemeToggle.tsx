"use client";

import React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/hooks/useTheme";
import { cn } from "@/lib/utils";

export function ThemeToggle({
  className,
  showLabel = false,
}: {
  className?: string;
  showLabel?: boolean;
}) {
  const { isDark, toggleTheme } = useTheme();

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      title={isDark ? "Switch to light mode" : "Switch to dark mode"}
      className={cn(
        "inline-flex h-9 items-center justify-center gap-2 rounded-[8px] border border-border bg-surface text-xs font-medium text-ink transition-colors hover:bg-surface-secondary cursor-pointer",
        showLabel ? "w-full px-3" : "w-9",
        className
      )}
    >
      {isDark ? (
        <Sun className="h-4 w-4 text-yellow-accent" aria-hidden="true" />
      ) : (
        <Moon className="h-4 w-4 text-brand-accent" aria-hidden="true" />
      )}
      {showLabel ? (
        <span>{isDark ? "Light Mode" : "Dark Mode"}</span>
      ) : null}
    </button>
  );
}

