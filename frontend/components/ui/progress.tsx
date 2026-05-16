"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export function Progress({
  value,
  className,
  tone = "primary",
}: {
  value: number;
  className?: string;
  tone?: "primary" | "success" | "danger";
}) {
  const safe = Math.max(0, Math.min(100, value));
  const colors: Record<typeof tone, string> = {
    primary: "bg-primary",
    success: "bg-success",
    danger: "bg-danger",
  };
  return (
    <div
      className={cn(
        "h-2 w-full rounded-full bg-border/50 overflow-hidden",
        className
      )}
    >
      <motion.div
        className={cn("h-full rounded-full", colors[tone])}
        initial={{ width: 0 }}
        animate={{ width: `${safe}%` }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      />
    </div>
  );
}
