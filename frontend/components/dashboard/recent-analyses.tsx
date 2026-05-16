import Link from "next/link";
import { ShieldCheck, ShieldAlert, ChevronRight } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { relativeTime, truncate } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

export async function RecentAnalyses({ userId }: { userId: string }) {
  const items = await prisma.analysisHistory.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    take: 5,
  });

  return (
    <div className="rounded-xl border border-border bg-card overflow-hidden">
      <div className="flex items-center justify-between px-5 py-4 border-b border-border">
        <div>
          <h2 className="text-sm font-semibold text-text">Recent analyses</h2>
          <p className="text-xs text-text-muted">Your last 5 classifications</p>
        </div>
        <Link
          href="/dashboard/history"
          className="text-xs text-text-muted hover:text-text inline-flex items-center gap-1"
        >
          View all <ChevronRight className="h-3 w-3" />
        </Link>
      </div>

      {items.length === 0 ? (
        <div className="p-8 text-center text-sm text-text-muted">
          No analyses yet. Run your first classification above.
        </div>
      ) : (
        <ul className="divide-y divide-border">
          {items.map((item) => {
            const isFake = item.prediction === "FAKE";
            const Icon = isFake ? ShieldAlert : ShieldCheck;
            return (
              <li key={item.id} className="px-5 py-3.5 flex items-center gap-3">
                <div
                  className={`h-8 w-8 rounded-lg flex items-center justify-center border flex-none ${
                    isFake
                      ? "bg-danger/10 border-danger/20"
                      : "bg-success/10 border-success/20"
                  }`}
                >
                  <Icon
                    className={`h-4 w-4 ${isFake ? "text-danger" : "text-success"}`}
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm text-text truncate">
                    {truncate(item.text, 90)}
                  </p>
                  <p className="text-xs text-text-muted mt-0.5">
                    {relativeTime(item.createdAt)} · {item.confidence.toFixed(1)}%
                    confidence
                  </p>
                </div>
                <Badge variant={isFake ? "danger" : "success"} className="flex-none">
                  {item.prediction}
                </Badge>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
