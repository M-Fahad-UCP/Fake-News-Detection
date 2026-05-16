import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { Activity, ShieldCheck, ShieldAlert, BarChart3 } from "lucide-react";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Topbar } from "@/components/dashboard/topbar";
import { StatCard } from "@/components/dashboard/stat-card";
import { PredictionPanel } from "@/components/dashboard/prediction-panel";
import { RecentAnalyses } from "@/components/dashboard/recent-analyses";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user) redirect("/login?callbackUrl=/dashboard");
  const userId = (session.user as any).id as string;

  const [total, fake, real, lastWeek] = await Promise.all([
    prisma.analysisHistory.count({ where: { userId } }),
    prisma.analysisHistory.count({ where: { userId, prediction: "FAKE" } }),
    prisma.analysisHistory.count({ where: { userId, prediction: "REAL" } }),
    prisma.analysisHistory.count({
      where: {
        userId,
        createdAt: { gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) },
      },
    }),
  ]);

  const avg = await prisma.analysisHistory.aggregate({
    where: { userId },
    _avg: { confidence: true },
  });

  return (
    <>
      <Topbar
        title="Analyze news"
        subtitle="Paste an article to get a real-time fake-news classification"
      />

      <div className="p-6 space-y-6 max-w-7xl">
        <div className="grid gap-3 grid-cols-2 lg:grid-cols-4">
          <StatCard
            label="Total"
            value={total}
            icon={<Activity className="h-4 w-4" />}
            tone="primary"
            delta="All-time analyses"
            delay={0}
          />
          <StatCard
            label="Real"
            value={real}
            icon={<ShieldCheck className="h-4 w-4" />}
            tone="success"
            delta={total ? `${((real / total) * 100).toFixed(0)}% of total` : "—"}
            delay={0.05}
          />
          <StatCard
            label="Fake"
            value={fake}
            icon={<ShieldAlert className="h-4 w-4" />}
            tone="danger"
            delta={total ? `${((fake / total) * 100).toFixed(0)}% of total` : "—"}
            delay={0.1}
          />
          <StatCard
            label="Avg confidence"
            value={`${(avg._avg.confidence ?? 0).toFixed(1)}%`}
            icon={<BarChart3 className="h-4 w-4" />}
            tone="warning"
            delta={`${lastWeek} this week`}
            delay={0.15}
          />
        </div>

        <PredictionPanel />

        <RecentAnalyses userId={userId} />
      </div>
    </>
  );
}
