"use client";

import { ReactNode } from "react";
import { motion } from "framer-motion";

type Tone = "primary" | "success" | "danger" | "warning";

export function StatCard({
  label,
  value,
  delta,
  icon,
  tone = "primary",
  delay = 0,
}: {
  label: string;
  value: string | number;
  delta?: string;
  icon: ReactNode;
  tone?: Tone;
  delay?: number;
}) {
  const tones: Record<Tone, string> = {
    primary: "bg-primary/10 text-primary border-primary/20",
    success: "bg-success/10 text-success border-success/20",
    danger: "bg-danger/10 text-danger border-danger/20",
    warning: "bg-warning/10 text-warning border-warning/20",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
      className="rounded-xl border border-border bg-card p-5"
    >
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <p className="text-xs uppercase tracking-wider text-text-dim">
            {label}
          </p>
          <p className="text-2xl font-semibold text-text">{value}</p>
        </div>
        <div
          className={`flex h-9 w-9 items-center justify-center rounded-lg border ${tones[tone]}`}
        >
          {icon}
        </div>
      </div>
      {delta && (
        <p className="mt-3 text-xs text-text-muted">{delta}</p>
      )}
    </motion.div>
  );
}
