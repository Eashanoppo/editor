"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, Search } from "lucide-react";
import { PythonLogoMark } from "@/components/common/PythonLogoMark";
import { ThemeToggle } from "@/components/common/ThemeToggle";
import { MobileNavigation, type NavItem } from "@/components/layout/MobileNavigation";
import { SearchDialog } from "@/components/navigation/SearchDialog";
import { useProgress } from "@/hooks/useProgress";
import { cn } from "@/lib/utils";
import type { SearchDocument } from "@/types/search";

const PRIMARY_NAV_ITEMS: NavItem[] = [
  { label: "Home", href: "/" },
  { label: "Learn", href: "/learn", matchPrefix: "/learn" },
  { label: "Playground", href: "/playground" },
  { label: "Practice", href: "/practice" },
  { label: "Examples", href: "/examples" },
  { label: "AI Assistant", href: "/assistant" },
  { label: "Cheat Sheet", href: "/cheat-sheet" },
  { label: "Glossary", href: "/glossary" },
  { label: "About", href: "/about" },
];

const ALL_MOBILE_NAV_ITEMS: NavItem[] = [
  ...PRIMARY_NAV_ITEMS.filter((item) => item.href !== "/about"),
  { label: "Dashboard", href: "/dashboard" },
  { label: "About & FAQ", href: "/about" },
];

export function AppHeader({
  searchDocuments = [],
}: {
  searchDocuments?: SearchDocument[];
}) {
  const pathname = usePathname();
  const { metrics, hydrated } = useProgress();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setSearchOpen((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const completedCount = hydrated ? metrics.completedChaptersCount : 0;

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-border bg-surface/95 backdrop-blur-[2px]">
        <div className="mx-auto flex h-[60px] md:h-[68px] w-full max-w-[1280px] items-center justify-between gap-3 px-[18px] sm:px-6 lg:px-8">
          {/* Left: Brand */}
          <Link
            href="/"
            className="flex shrink-0 items-center gap-2.5 rounded-[8px] py-1 focus-visible:outline-2"
          >
            <PythonLogoMark className="h-7 w-7" />
            <span className="text-[15px] font-semibold tracking-tight text-ink">
              Python Learning
            </span>
          </Link>

          {/* Center: Desktop Navigation */}
          <nav
            aria-label="Main navigation"
            className="hidden xl:flex items-center gap-0.5 2xl:gap-1"
          >
            {PRIMARY_NAV_ITEMS.map((item) => {
              const isActive =
                item.href === "/"
                  ? pathname === "/"
                  : pathname === item.href ||
                    (item.matchPrefix ? pathname.startsWith(item.matchPrefix) : false);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={isActive ? "page" : undefined}
                  className={cn(
                    "rounded-[8px] px-2 2xl:px-2.5 py-1.5 text-[13px] 2xl:text-[13.5px] font-medium transition-colors duration-150 whitespace-nowrap",
                    isActive
                      ? "bg-brand-light text-brand-accent"
                      : "text-ink-secondary hover:bg-surface-secondary hover:text-ink"
                  )}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {/* Right: Search, Theme Toggle, Dashboard progress shortcut, Mobile trigger */}
          <div className="flex shrink-0 items-center gap-2">
            <button
              type="button"
              onClick={() => setSearchOpen(true)}
              aria-label="Search Python topics (Ctrl+K)"
              className="inline-flex h-9 items-center gap-2 rounded-[8px] border border-border bg-surface-muted px-2.5 sm:px-3 text-xs font-medium text-ink-secondary transition-colors hover:border-border-strong hover:bg-surface-secondary hover:text-ink cursor-pointer"
            >
              <Search className="h-3.5 w-3.5" aria-hidden="true" />
              <span className="hidden sm:inline">Search</span>
              <kbd className="hidden md:inline-flex items-center rounded border border-border bg-surface px-1.5 py-0.5 text-[10px] font-medium text-ink-muted">
                Ctrl K
              </kbd>
            </button>

            <ThemeToggle />

            <Link
              href="/dashboard"
              aria-label={`Dashboard: ${completedCount} of ${metrics.totalChapters} chapters completed`}
              className={cn(
                "hidden sm:inline-flex h-9 items-center gap-2 rounded-[8px] border px-3 text-xs font-medium transition-colors",
                pathname === "/dashboard"
                  ? "border-brand bg-brand-light text-brand-accent"
                  : "border-border bg-surface text-ink hover:bg-surface-muted"
              )}
            >
              <span
                className="h-2 w-2 rounded-full bg-brand-accent"
                aria-hidden="true"
              />
              <span>Dashboard</span>
              <span className="rounded-full bg-surface-secondary px-1.5 py-0.5 text-[11px] font-semibold text-brand-accent">
                {completedCount}/{metrics.totalChapters}
              </span>
            </Link>

            <button
              type="button"
              onClick={() => setMobileOpen(true)}
              aria-label="Open navigation menu"
              aria-expanded={mobileOpen}
              className="inline-flex h-9 w-9 items-center justify-center rounded-[8px] border border-border bg-surface text-ink hover:bg-surface-secondary xl:hidden cursor-pointer"
            >
              <Menu className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>
        </div>
      </header>

      <MobileNavigation
        open={mobileOpen}
        onOpenChange={setMobileOpen}
        navItems={ALL_MOBILE_NAV_ITEMS}
        completedCount={completedCount}
        totalChapters={metrics.totalChapters}
      />

      <SearchDialog
        open={searchOpen}
        onOpenChange={setSearchOpen}
        extraDocuments={searchDocuments}
      />
    </>
  );
}
