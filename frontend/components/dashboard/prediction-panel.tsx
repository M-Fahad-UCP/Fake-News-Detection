"use client";

import { useState, useTransition } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Send,
  Copy,
  RotateCcw,
  ShieldCheck,
  ShieldAlert,
  Sparkles,
} from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Spinner } from "@/components/ui/spinner";

interface Result {
  prediction: "REAL" | "FAKE";
  confidence: number;
  probabilities: { real: number; fake: number };
  insights?: string[];
}

const SAMPLE =
  "BREAKING: NASA confirms the discovery of liquid water plumes on Jupiter's moon Europa, opening new possibilities for understanding the icy moon's subsurface ocean and the potential for microbial life beyond Earth.";

export function PredictionPanel() {
  const router = useRouter();
  const [text, setText] = useState("");
  const [result, setResult] = useState<Result | null>(null);
  const [isPending, startTransition] = useTransition();
  const [loading, setLoading] = useState(false);

  async function analyze() {
    const trimmed = text.trim();
    if (trimmed.length < 20) {
      toast.error("Please enter at least 20 characters for accurate analysis.");
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      const res = await fetch("/api/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: trimmed }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error ?? "Analysis failed");
      }

      const data = (await res.json()) as Result;
      setResult(data);
      toast.success("Analysis complete");
      startTransition(() => router.refresh());
    } catch (err: any) {
      toast.error(err.message ?? "Could not reach ML service");
    } finally {
      setLoading(false);
    }
  }

  function reset() {
    setText("");
    setResult(null);
  }

  function copyResult() {
    if (!result) return;
    const summary = `Prediction: ${result.prediction}\nConfidence: ${result.confidence.toFixed(1)}%\nReal: ${(result.probabilities.real * 100).toFixed(1)}% | Fake: ${(result.probabilities.fake * 100).toFixed(1)}%`;
    navigator.clipboard.writeText(summary);
    toast.success("Copied to clipboard");
  }

  return (
    <div className="grid gap-6 lg:grid-cols-5">
      {/* Input */}
      <div className="lg:col-span-3 rounded-xl border border-border bg-card overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-border">
          <div>
            <h2 className="text-sm font-semibold text-text">Article input</h2>
            <p className="text-xs text-text-muted">
              Paste a headline or full article for classification
            </p>
          </div>
          <Badge variant="primary">
            <Sparkles className="h-3 w-3" />
            AI-powered
          </Badge>
        </div>

        <div className="p-5 space-y-4">
          <Textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Paste a news article, headline, or paragraph here…"
            rows={10}
            disabled={loading}
            className="min-h-[220px] font-mono text-[13px] leading-relaxed"
          />

          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2 text-xs text-text-muted">
              <span>{text.length} chars</span>
              <span>·</span>
              <span>{text.trim().split(/\s+/).filter(Boolean).length} words</span>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setText(SAMPLE)}
                disabled={loading}
              >
                Try sample
              </Button>
              <Button
                size="sm"
                variant="secondary"
                onClick={reset}
                disabled={loading || !text}
              >
                <RotateCcw className="h-3.5 w-3.5" />
                Clear
              </Button>
              <Button size="sm" onClick={analyze} disabled={loading}>
                {loading ? (
                  <>
                    <Spinner /> Analyzing…
                  </>
                ) : (
                  <>
                    <Send className="h-3.5 w-3.5" />
                    Analyze
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Result */}
      <div className="lg:col-span-2">
        <AnimatePresence mode="wait">
          {loading ? (
            <LoadingResult key="loading" />
          ) : result ? (
            <ResultCard
              key="result"
              result={result}
              onCopy={copyResult}
            />
          ) : (
            <EmptyResult key="empty" />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

function EmptyResult() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="rounded-xl border border-dashed border-border bg-card/40 p-8 text-center h-full flex flex-col justify-center"
    >
      <div className="mx-auto h-12 w-12 rounded-full bg-card border border-border flex items-center justify-center mb-4">
        <Sparkles className="h-5 w-5 text-text-muted" />
      </div>
      <h3 className="text-sm font-semibold text-text">No analysis yet</h3>
      <p className="mt-1 text-xs text-text-muted max-w-xs mx-auto">
        Paste an article and click Analyze to see the prediction, confidence
        score, and probability breakdown.
      </p>
    </motion.div>
  );
}

function LoadingResult() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="rounded-xl border border-border bg-card p-6 space-y-4"
    >
      <div className="flex items-center gap-3">
        <div className="h-12 w-12 rounded-xl bg-bg/60 relative overflow-hidden">
          <div className="absolute inset-0 shimmer" />
        </div>
        <div className="flex-1 space-y-2">
          <div className="h-4 rounded relative overflow-hidden bg-bg/60">
            <div className="absolute inset-0 shimmer" />
          </div>
          <div className="h-3 w-2/3 rounded relative overflow-hidden bg-bg/60">
            <div className="absolute inset-0 shimmer" />
          </div>
        </div>
      </div>
      <div className="space-y-3 pt-2">
        <div className="space-y-1.5">
          <div className="h-3 rounded relative overflow-hidden bg-bg/60">
            <div className="absolute inset-0 shimmer" />
          </div>
          <div className="h-2 rounded-full relative overflow-hidden bg-bg/60">
            <div className="absolute inset-0 shimmer" />
          </div>
        </div>
        <div className="space-y-1.5">
          <div className="h-3 rounded relative overflow-hidden bg-bg/60">
            <div className="absolute inset-0 shimmer" />
          </div>
          <div className="h-2 rounded-full relative overflow-hidden bg-bg/60">
            <div className="absolute inset-0 shimmer" />
          </div>
        </div>
      </div>
      <p className="text-xs text-text-muted text-center pt-2 animate-pulse-soft">
        Vectorizing and classifying…
      </p>
    </motion.div>
  );
}

function ResultCard({
  result,
  onCopy,
}: {
  result: Result;
  onCopy: () => void;
}) {
  const isFake = result.prediction === "FAKE";
  const Icon = isFake ? ShieldAlert : ShieldCheck;
  const tone = isFake ? "danger" : "success";
  const accentBg = isFake ? "bg-danger/10 border-danger/30" : "bg-success/10 border-success/30";
  const accentText = isFake ? "text-danger" : "text-success";

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="rounded-xl border border-border bg-card overflow-hidden"
    >
      <div className="p-5 border-b border-border">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <div className={`h-12 w-12 rounded-xl flex items-center justify-center border ${accentBg}`}>
              <Icon className={`h-6 w-6 ${accentText}`} />
            </div>
            <div className="min-w-0">
              <div className={`text-2xl font-semibold ${accentText}`}>
                {result.prediction}
              </div>
              <p className="text-xs text-text-muted">
                {isFake ? "Likely misinformation" : "Likely legitimate"}
              </p>
            </div>
          </div>
          <button
            onClick={onCopy}
            className="p-1.5 rounded-md text-text-muted hover:text-text hover:bg-bg transition-colors"
            aria-label="Copy result"
          >
            <Copy className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="p-5 space-y-4">
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs text-text-muted">Confidence</span>
            <span className="text-xs font-mono text-text">
              {result.confidence.toFixed(1)}%
            </span>
          </div>
          <Progress
            value={result.confidence}
            tone={isFake ? "danger" : "success"}
          />
        </div>

        <div className="pt-2 border-t border-border space-y-3">
          <div>
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs text-text-muted flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-success" />
                Real probability
              </span>
              <span className="text-xs font-mono text-text">
                {(result.probabilities.real * 100).toFixed(1)}%
              </span>
            </div>
            <Progress value={result.probabilities.real * 100} tone="success" />
          </div>
          <div>
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs text-text-muted flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-danger" />
                Fake probability
              </span>
              <span className="text-xs font-mono text-text">
                {(result.probabilities.fake * 100).toFixed(1)}%
              </span>
            </div>
            <Progress value={result.probabilities.fake * 100} tone="danger" />
          </div>
        </div>

        {result.insights && result.insights.length > 0 && (
          <div className="pt-3 border-t border-border">
            <p className="text-xs uppercase tracking-wider text-text-dim mb-2">
              AI Insights
            </p>
            <ul className="space-y-1.5">
              {result.insights.map((insight, i) => (
                <li
                  key={i}
                  className="text-xs text-text-muted leading-relaxed flex gap-2"
                >
                  <Sparkles className="h-3 w-3 text-primary flex-none mt-0.5" />
                  {insight}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </motion.div>
  );
}
