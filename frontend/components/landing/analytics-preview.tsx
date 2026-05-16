"use client";

import { motion } from "framer-motion";
import { TrendingUp, ShieldCheck, Activity } from "lucide-react";

const stats = [
  { label: "Articles analyzed", value: "1.2M+", icon: Activity },
  { label: "Model accuracy", value: "98.4%", icon: ShieldCheck },
  { label: "Avg. response", value: "187ms", icon: TrendingUp },
];

const sparklineData = [12, 18, 15, 24, 22, 30, 28, 35, 32, 40, 38, 46, 50, 55];

export function AnalyticsPreview() {
  return (
    <section id="pricing" className="relative py-24 border-t border-border/60">
      <div className="container">
        <div className="grid gap-12 lg:grid-cols-2 items-center">
          <div>
            <span className="text-xs uppercase tracking-[0.2em] text-warning">
              Analytics
            </span>
            <h2 className="mt-3 text-3xl sm:text-4xl font-semibold tracking-tight text-gradient">
              SaaS-grade dashboard out of the box
            </h2>
            <p className="mt-4 text-text-muted leading-relaxed">
              Track every analysis you've ever run. Watch fake-vs-real ratios
              shift over time. Spot patterns in confidence drift. All your
              detection data, beautifully visualized.
            </p>

            <div className="mt-8 grid grid-cols-3 gap-4">
              {stats.map((s, i) => (
                <motion.div
                  key={s.label}
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.1 }}
                  className="rounded-lg border border-border bg-card p-4"
                >
                  <s.icon className="h-4 w-4 text-text-muted mb-2" />
                  <div className="text-xl font-semibold text-text">
                    {s.value}
                  </div>
                  <div className="text-xs text-text-muted mt-0.5">
                    {s.label}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative rounded-2xl border border-border bg-card overflow-hidden shadow-soft"
          >
            <div className="border-b border-border px-5 py-4 flex items-center justify-between">
              <div>
                <div className="text-sm font-semibold text-text">
                  Detection volume
                </div>
                <div className="text-xs text-text-muted">Last 14 days</div>
              </div>
              <span className="text-success text-sm font-medium">+24.3%</span>
            </div>

            <div className="p-5">
              <Sparkline data={sparklineData} />

              <div className="mt-6 grid grid-cols-2 gap-3 pt-5 border-t border-border">
                <Mini label="Real" value="847" tone="success" />
                <Mini label="Fake" value="312" tone="danger" />
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function Sparkline({ data }: { data: number[] }) {
  const max = Math.max(...data);
  const w = 320;
  const h = 100;
  const step = w / (data.length - 1);
  const path = data
    .map((d, i) => {
      const x = i * step;
      const y = h - (d / max) * h * 0.85 - 8;
      return `${i === 0 ? "M" : "L"} ${x} ${y}`;
    })
    .join(" ");
  const area = `${path} L ${w} ${h} L 0 ${h} Z`;

  return (
    <div className="relative">
      <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-28">
        <defs>
          <linearGradient id="g1" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#2F81F7" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#2F81F7" stopOpacity="0" />
          </linearGradient>
        </defs>
        <motion.path
          d={area}
          fill="url(#g1)"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.4 }}
        />
        <motion.path
          d={path}
          fill="none"
          stroke="#2F81F7"
          strokeWidth="2"
          strokeLinecap="round"
          initial={{ pathLength: 0 }}
          whileInView={{ pathLength: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.2, ease: "easeInOut" }}
        />
      </svg>
    </div>
  );
}

function Mini({
  label,
  value,
  tone,
}: {
  label: string;
  value: string;
  tone: "success" | "danger";
}) {
  const dot = tone === "success" ? "bg-success" : "bg-danger";
  return (
    <div>
      <div className="flex items-center gap-2 text-xs text-text-muted">
        <span className={`h-2 w-2 rounded-full ${dot}`} />
        {label}
      </div>
      <div className="mt-1 text-lg font-semibold text-text">{value}</div>
    </div>
  );
}
