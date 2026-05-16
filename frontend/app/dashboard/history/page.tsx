import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Topbar } from "@/components/dashboard/topbar";
import { HistoryTable } from "@/components/dashboard/history-table";

export const dynamic = "force-dynamic";

export default async function HistoryPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user) redirect("/login?callbackUrl=/dashboard/history");
  const userId = (session.user as any).id as string;

  const rows = await prisma.analysisHistory.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    take: 200,
  });

  const data = rows.map((r) => ({
    id: r.id,
    text: r.text,
    prediction: r.prediction,
    confidence: r.confidence,
    createdAt: r.createdAt.toISOString(),
  }));

  return (
    <>
      <Topbar
        title="History"
        subtitle={`${rows.length} analyses · most recent first`}
      />
      <div className="p-6 max-w-7xl">
        <HistoryTable rows={data} />
      </div>
    </>
  );
}
