"use client";

import React from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useTheme } from "@/hooks/useTheme";
import type { QuizAttemptRecord } from "@/types/quiz";

export function ProgressChart({
  quizAttempts,
}: {
  quizAttempts: QuizAttemptRecord[];
}) {
  const { isDark } = useTheme();

  if (quizAttempts.length === 0) {
    return null;
  }

  // Show chronological order (oldest -> newest, up to last 8 attempts)
  const data = quizAttempts
    .slice(0, 8)
    .reverse()
    .map((attempt, idx) => ({
      name: `#${idx + 1}`,
      score: attempt.scorePercentage,
      title: attempt.quizTitle,
    }));

  const gridStroke = isDark ? "#26354B" : "#E2E8F0";
  const tickColor = isDark ? "#94A3B8" : "#64748B";
  const tooltipBg = isDark ? "#131D2E" : "#FFFFFF";
  const tooltipBorder = isDark ? "#26354B" : "#E2E8F0";
  const tooltipText = isDark ? "#E2E8F0" : "#243247";
  const cursorFill = isDark ? "#1C293D" : "#F8FAFC";

  return (
    <div className="rounded-[12px] border border-border bg-surface p-5">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h2 className="text-base font-semibold text-ink">
            Recent Quiz Score Trend
          </h2>
          <p className="text-xs text-ink-secondary">
            Your latest {data.length} completed practice attempt
            {data.length === 1 ? "" : "s"}
          </p>
        </div>
        <span className="text-xs font-medium text-brand-accent">% Score</span>
      </div>

      <div className="h-[220px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{ top: 8, right: 12, left: -16, bottom: 0 }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              stroke={gridStroke}
            />
            <XAxis
              dataKey="name"
              tick={{ fill: tickColor, fontSize: 12 }}
              axisLine={{ stroke: gridStroke }}
              tickLine={false}
            />
            <YAxis
              domain={[0, 100]}
              tick={{ fill: tickColor, fontSize: 12 }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip
              cursor={{ fill: cursorFill }}
              contentStyle={{
                backgroundColor: tooltipBg,
                border: `1px solid ${tooltipBorder}`,
                borderRadius: "8px",
                fontSize: "12px",
                color: tooltipText,
              }}
              formatter={(value) => [`${value}%`, "Score"]}
              labelFormatter={(_label, payload) =>
                payload?.[0]?.payload?.title ?? ""
              }
            />
            <Bar dataKey="score" radius={[6, 6, 0, 0]} maxBarSize={42}>
              {data.map((entry, idx) => (
                <Cell
                  key={`cell-${idx}`}
                  fill={entry.score >= 70 ? "#3776AB" : "#FFD343"}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
