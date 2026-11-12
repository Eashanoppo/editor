"use client";

import React from "react";
import { MotionConfig } from "motion/react";
import { ProgressProvider } from "@/hooks/useProgress";

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <MotionConfig reducedMotion="user">
      <ProgressProvider>{children}</ProgressProvider>
    </MotionConfig>
  );
}

