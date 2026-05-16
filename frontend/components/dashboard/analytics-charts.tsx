"use client";

import { motion } from "framer-motion";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  Legend,
} from "recharts";

interface DailyPoint {
  date: string;
  REAL: number;
  FAKE: number;
}

interface ConfidencePoint {
  date: string;
  avg: number;
}

export function AnalyticsCharts({
  daily,
  ratio,
  confidenceTrend,
}: {
  daily: DailyPoint[];
  ratio: { name: string; value: number }[];
  confidenceTrend: ConfidencePoint[];
}) {
  const COLORS = { REAL: "#3FB950", FAKE: "#F85149" };

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      {/* Weekly activity area */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="lg:col-span-2 rounded-xl border border-border bg-card p-5"
      >
        <header className="flex items-center justify-between mb-5">
          <div>
            <h3 className="text-sm font-semibold text-text">Weekly activity</h3>
            <p className="text-xs text-text-muted">
              Real vs fake classifications over time
            </p>
          </div>
        </header>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={daily}>
              <defs>
                <linearGradient id="g-real" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#3FB950" stopOpacity={0.4} />
                  <stop offset="100%" stopColor="#3FB950" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="g-fake" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#F85149" stopOpacity={0.4} />
                  <stop offset="100%" stopColor="#F85149" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="date" tickLine={false} axisLine={false} fontSize={11} />
              <YAxis tickLine={false} axisLine={false} fontSize={11} allowDecimals={false} />
              <Tooltip />
              <Area
                type="monotone"
                dataKey="REAL"
                stroke="#3FB950"
                strokeWidth={2}
                fill="url(#g-real)"
              />
              <Area
                type="monotone"
                dataKey="FAKE"
                stroke="#F85149"
                strokeWidth={2}
                fill="url(#g-fake)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      {/* Real/Fake ratio pie */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.05 }}
        className="rounded-xl border border-border bg-card p-5"
      >
        <header className="mb-5">
          <h3 className="text-sm font-semibold text-text">Distribution</h3>
          <p className="text-xs text-text-muted">Real vs Fake breakdown</p>
        </header>
        <div className="h-56">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={ratio}
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={80}
                paddingAngle={2}
                dataKey="value"
                stroke="#0D1117"
                strokeWidth={2}
              >
                {ratio.map((entry) => (
                  <Cell
                    key={entry.name}
                    fill={COLORS[entry.name as keyof typeof COLORS] ?? "#30363D"}
                  />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-3 grid grid-cols-2 gap-2">
          {ratio.map((r) => (
            <div
              key={r.name}
              className="flex items-center gap-2 px-3 py-2 rounded-lg bg-bg/40 border border-border"
            >
              <span
                className="h-2 w-2 rounded-full"
                style={{ background: COLORS[r.name as keyof typeof COLORS] }}
              />
              <span className="text-xs text-text-muted flex-1">{r.name}</span>
              <span className="text-xs font-mono text-text">{r.value}</span>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Confidence trend */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        className="lg:col-span-3 rounded-xl border border-border bg-card p-5"
      >
        <header className="mb-5">
          <h3 className="text-sm font-semibold text-text">Confidence trend</h3>
          <p className="text-xs text-text-muted">
            Average prediction confidence by day
          </p>
        </header>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={confidenceTrend}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="date" tickLine={false} axisLine={false} fontSize={11} />
              <YAxis
                tickLine={false}
                axisLine={false}
                fontSize={11}
                domain={[0, 100]}
                tickFormatter={(v) => `${v}%`}
              />
              <Tooltip
                formatter={(v: number) => `${v.toFixed(1)}%`}
              />
              <Line
                type="monotone"
                dataKey="avg"
                stroke="#2F81F7"
                strokeWidth={2.5}
                dot={{ r: 3, fill: "#2F81F7" }}
                activeDot={{ r: 5 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </motion.div>
    </div>
  );
}
