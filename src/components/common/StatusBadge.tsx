import React from "react";
import { CheckCircle2, Circle, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export type ChapterStatus = "not_started" | "in_progress" | "completed";

export function StatusBadge({ status }: { status: ChapterStatus }) {
  if (status === "completed") {
    return (
      <Badge variant="success">
        <CheckCircle2 className="h-3 w-3" aria-hidden="true" />
        <span>Completed</span>
      </Badge>
    );
  }
  if (status === "in_progress") {
    return (
      <Badge variant="primary">
        <Clock className="h-3 w-3" aria-hidden="true" />
        <span>In progress</span>
      </Badge>
    );
  }
  return (
    <Badge variant="neutral">
      <Circle className="h-3 w-3" aria-hidden="true" />
      <span>Not started</span>
    </Badge>
  );
}

