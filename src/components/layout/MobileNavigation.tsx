"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { PythonLogoMark } from "@/components/common/PythonLogoMark";
import { ThemeToggle } from "@/components/common/ThemeToggle";
import { cn } from "@/lib/utils";

export interface NavItem {
  label: string;
  href: string;
  matchPrefix?: string;
}

interface MobileNavigationProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  navItems: NavItem[];
  completedCount: number;
  totalChapters: number;
}

export function MobileNavigation({
  open,
  onOpenChange,
  navItems,
  completedCount,
  totalChapters,
}: MobileNavigationProps) {
  const pathname = usePathname();

  return (
    <DialogPrimitive.Root open={open} onOpenChange={onOpenChange}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-[#0B1220]/40 backdrop-blur-[1px]" />
        <DialogPrimitive.Content
          aria-label="Mobile navigation menu"
          className="fixed inset-y-0 right-0 z-50 flex w-[280px] max-w-[85vw] flex-col border-l border-border bg-surface shadow-xl focus:outline-none"
        >
          <div className="flex h-[60px] items-center justify-between border-b border-border px-4">
            <div className="flex items-center gap-2">
              <PythonLogoMark className="h-6 w-6" />
              <DialogPrimitive.Title className="text-sm font-semibold text-ink">
                Python Learning
              </DialogPrimitive.Title>
            </div>
            <DialogPrimitive.Close
              aria-label="Close navigation menu"
              className="inline-flex h-9 w-9 items-center justify-center rounded-[8px] text-ink-secondary hover:bg-surface-secondary hover:text-ink cursor-pointer"
            >
              <X className="h-4 w-4" />
            </DialogPrimitive.Close>
          </div>

          <DialogPrimitive.Description className="sr-only">
            Navigate between lessons, playground, practice quizzes, AI assistant, and learning tools.
          </DialogPrimitive.Description>

          <nav className="flex-1 overflow-y-auto px-3 py-4" aria-label="Mobile Navigation">
            <ul className="space-y-1">
              {navItems.map((item) => {
                const isActive =
                  item.href === "/"
                    ? pathname === "/"
                    : pathname === item.href ||
                      (item.matchPrefix ? pathname.startsWith(item.matchPrefix) : false);

                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      onClick={() => onOpenChange(false)}
                      className={cn(
                        "flex items-center justify-between rounded-[8px] px-3 py-2.5 text-sm font-medium transition-colors",
                        isActive
                          ? "bg-brand-light text-brand-accent"
                          : "text-ink hover:bg-surface-secondary"
                      )}
                    >
                      <span>{item.label}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          <div className="space-y-2.5 border-t border-border bg-surface-muted p-4">
            <ThemeToggle showLabel />
            <Link
              href="/dashboard"
              onClick={() => onOpenChange(false)}
              className="flex items-center justify-between rounded-[8px] border border-border bg-surface px-3 py-2.5 text-xs font-medium text-ink hover:border-brand"
            >
              <span>Learning Progress</span>
              <span className="font-semibold text-brand-accent">
                {completedCount}/{totalChapters} chapters
              </span>
            </Link>
          </div>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}
