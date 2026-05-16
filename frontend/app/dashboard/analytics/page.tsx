import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { Activity, ShieldCheck, ShieldAlert, BarChart3 } from "lucide-react";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Topbar } from "@/components/dashboard/topbar";
import { StatCard } from "@/components/dashboard/stat-card";
import { AnalyticsCharts } from "@/components/dashboard/analytics-charts";

export const dynamic = "force-dynamic";

function fmtDay(d: Date) {
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

export default async function AnalyticsPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user) redirect("/login?callbackUrl=/dashboard/analytics");
  const userId = (session.user as any).id as string;

  const since = new Date(Date.now() - 14 * 24 * 60 * 60 * 1000);
  const records = await prisma.analysisHistory.findMany({
    where: { userId, createdAt: { gte: since } },
    orderBy: { createdAt: "asc" },
  });

  const total = await prisma.analysisHistory.count({ where: { userId } });
  const real = await prisma.analysisHistory.count({
    where: { userId, prediction: "REAL" },
  });
  const fake = await prisma.analysisHistory.count({
    where: { userId, prediction: "FAKE" },
  });
  const avg = await prisma.analysisHistory.aggregate({
    where: { userId },
    _avg: { confidence: true },
  });

  // Build 14-day buckets
  const buckets = new Map<
    string,
    { date: string; REAL: number; FAKE: number; conf: number[] }
  >();
  for (let i = 13; i >= 0; i--) {
    const d = new Date(Date.now() - i * 24 * 60 * 60 * 1000);
    const key = fmtDay(d);
    buckets.set(key, { date: key, REAL: 0, FAKE: 0, conf: [] });
  }
  for (const r of records) {
    const key = fmtDay(r.createdAt);
    const bucket = buckets.get(key);
    if (!bucket) continue;
    if (r.prediction === "REAL") bucket.REAL += 1;
    else bucket.FAKE += 1;
    bucket.conf.push(r.confidence);
  }

  const daily = Array.from(buckets.values()).map((b) => ({
    date: b.date,
    REAL: b.REAL,
    FAKE: b.FAKE,
  }));

  const confidenceTrend = Array.from(buckets.values()).map((b) => ({
    date: b.date,
    avg: b.conf.length ? b.conf.reduce((a, c) => a + c, 0) / b.conf.length : 0,
  }));

  const ratio = [
    { name: "REAL", value: real },
    { name: "FAKE", value: fake },
  ];

  return (
    <>
      <Topbar
        title="Analytics"
        subtitle="Trends and aggregates across your detection history"
      />
      <div className="p-6 space-y-6 max-w-7xl">
        <div className="grid gap-3 grid-cols-2 lg:grid-cols-4">
          <StatCard label="Total" value={total} icon={<Activity className="h-4 w-4" />} tone="primary" />
          <StatCard label="Real" value={real} icon={<ShieldCheck className="h-4 w-4" />} tone="success" />
          <StatCard label="Fake" value={fake} icon={<ShieldAlert className="h-4 w-4" />} tone="danger" />
          <StatCard
            label="Avg confidence"
            value={`${(avg._avg.confidence ?? 0).toFixed(1)}%`}
            icon={<BarChart3 className="h-4 w-4" />}
            tone="warning"
          />
        </div>

        {total === 0 ? (
          <div className="rounded-xl border border-dashed border-border bg-card/40 p-12 text-center">
            <p className="text-sm text-text-muted">
              No data yet. Run analyses on the Analyze tab to populate charts.
            </p>
          </div>
        ) : (
          <AnalyticsCharts
            daily={daily}
            ratio={ratio}
            confidenceTrend={confidenceTrend}
          />
        )}
      </div>
    </>
  );
}
