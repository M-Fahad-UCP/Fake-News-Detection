"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Trash2, ShieldCheck, ShieldAlert, Download } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatDate, truncate } from "@/lib/utils";

export interface HistoryRow {
  id: string;
  text: string;
  prediction: string;
  confidence: number;
  createdAt: string;
}

export function HistoryTable({ rows }: { rows: HistoryRow[] }) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<"all" | "REAL" | "FAKE">("all");
  const [deleting, setDeleting] = useState<string | null>(null);

  const filtered = useMemo(() => {
    return rows.filter((r) => {
      if (filter !== "all" && r.prediction !== filter) return false;
      if (query && !r.text.toLowerCase().includes(query.toLowerCase()))
        return false;
      return true;
    });
  }, [rows, query, filter]);

  async function onDelete(id: string) {
    setDeleting(id);
    try {
      const res = await fetch(`/api/history/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
      toast.success("Deleted");
      router.refresh();
    } catch {
      toast.error("Could not delete");
    } finally {
      setDeleting(null);
    }
  }

  function exportCSV() {
    const header = "id,prediction,confidence,createdAt,text\n";
    const body = filtered
      .map(
        (r) =>
          `${r.id},${r.prediction},${r.confidence.toFixed(2)},${r.createdAt},"${r.text.replace(/"/g, '""')}"`
      )
      .join("\n");
    const blob = new Blob([header + body], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `analyses-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Exported CSV");
  }

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-muted" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search analyses…"
            className="pl-9"
          />
        </div>
        <div className="flex gap-2">
          <div className="flex rounded-md border border-border bg-card overflow-hidden">
            {(["all", "REAL", "FAKE"] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-3 py-1.5 text-xs font-medium transition-colors ${
                  filter === f
                    ? "bg-bg text-text"
                    : "text-text-muted hover:text-text"
                }`}
              >
                {f === "all" ? "All" : f}
              </button>
            ))}
          </div>
          <Button
            size="sm"
            variant="secondary"
            onClick={exportCSV}
            disabled={filtered.length === 0}
          >
            <Download className="h-3.5 w-3.5" />
            Export
          </Button>
        </div>
      </div>

      {/* Table */}
      {filtered.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border bg-card/40 p-12 text-center">
          <p className="text-sm text-text-muted">
            {rows.length === 0
              ? "No analyses yet — run your first one from the Analyze tab."
              : "No matching results."}
          </p>
        </div>
      ) : (
        <div className="rounded-xl border border-border bg-card overflow-hidden">
          <div className="hidden md:grid grid-cols-[1fr_120px_120px_180px_60px] gap-4 px-5 py-3 border-b border-border text-xs uppercase tracking-wider text-text-dim">
            <div>Article</div>
            <div>Prediction</div>
            <div>Confidence</div>
            <div>Date</div>
            <div></div>
          </div>
          <ul className="divide-y divide-border">
            <AnimatePresence>
              {filtered.map((row) => {
                const isFake = row.prediction === "FAKE";
                const Icon = isFake ? ShieldAlert : ShieldCheck;
                return (
                  <motion.li
                    key={row.id}
                    layout
                    initial={{ opacity: 1 }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.2 }}
                    className="md:grid md:grid-cols-[1fr_120px_120px_180px_60px] gap-4 px-5 py-3.5 items-center text-sm"
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <Icon
                        className={`h-4 w-4 flex-none ${
                          isFake ? "text-danger" : "text-success"
                        }`}
                      />
                      <span className="text-text truncate">
                        {truncate(row.text, 120)}
                      </span>
                    </div>
                    <div className="mt-2 md:mt-0">
                      <Badge variant={isFake ? "danger" : "success"}>
                        {row.prediction}
                      </Badge>
                    </div>
                    <div className="mt-1 md:mt-0 font-mono text-xs text-text-muted">
                      {row.confidence.toFixed(1)}%
                    </div>
                    <div className="mt-1 md:mt-0 text-xs text-text-muted">
                      {formatDate(row.createdAt)}
                    </div>
                    <div className="mt-2 md:mt-0 md:text-right">
                      <button
                        onClick={() => onDelete(row.id)}
                        disabled={deleting === row.id}
                        className="p-1.5 rounded-md text-text-muted hover:text-danger hover:bg-danger/10 transition-colors disabled:opacity-50"
                        aria-label="Delete"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </motion.li>
                );
              })}
            </AnimatePresence>
          </ul>
        </div>
      )}
    </div>
  );
}
