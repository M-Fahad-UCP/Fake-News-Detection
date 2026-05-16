"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles, ShieldCheck, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export function Hero() {
  return (
    <section className="relative overflow-hidden pt-32 pb-24">
      {/* Background gradients */}
      <div className="absolute inset-0 grid-bg opacity-30 [mask-image:radial-gradient(ellipse_at_top,black_30%,transparent_70%)]" />
      <div className="absolute inset-x-0 top-0 h-[600px] bg-grid-fade pointer-events-none" />

      <div className="container relative">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex justify-center"
        >
          <Badge variant="primary" className="px-3 py-1">
            <Sparkles className="h-3 w-3" />
            AI-powered misinformation detection
          </Badge>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.05 }}
          className="mx-auto mt-6 max-w-4xl text-center text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-semibold tracking-tight leading-[1.05]"
        >
          <span className="text-gradient">Detect fake news using</span>
          <br />
          <span className="text-gradient-primary">AI in seconds.</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="mx-auto mt-6 max-w-2xl text-center text-base sm:text-lg text-text-muted leading-relaxed"
        >
          A production-grade machine learning system that classifies news
          articles as real or fake with calibrated confidence — built on
          TF-IDF vectorization and logistic regression.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.25 }}
          className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-3"
        >
          <Link href="/register">
            <Button size="lg" className="min-w-[180px] group">
              Start analyzing free
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </Button>
          </Link>
          <Link href="#workflow">
            <Button size="lg" variant="secondary" className="min-w-[180px]">
              How it works
            </Button>
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.35 }}
          className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs text-text-dim"
        >
          <div className="inline-flex items-center gap-1.5">
            <ShieldCheck className="h-3.5 w-3.5 text-success" />
            No credit card required
          </div>
          <div className="inline-flex items-center gap-1.5">
            <Zap className="h-3.5 w-3.5 text-primary" />
            Sub-200ms predictions
          </div>
          <div className="inline-flex items-center gap-1.5">
            <Sparkles className="h-3.5 w-3.5 text-warning" />
            Open-source ML pipeline
          </div>
        </motion.div>

        <HeroPreview />
      </div>
    </section>
  );
}

function HeroPreview() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.4 }}
      className="relative mx-auto mt-16 max-w-5xl"
    >
      <div className="absolute -inset-x-12 -top-12 -bottom-12 bg-gradient-to-r from-primary/20 via-success/10 to-primary/20 blur-3xl opacity-40 pointer-events-none" />

      <div className="relative rounded-2xl border border-border bg-card/80 backdrop-blur shadow-soft overflow-hidden">
        {/* Window chrome */}
        <div className="flex items-center gap-2 border-b border-border px-4 py-3">
          <div className="flex gap-1.5">
            <div className="h-2.5 w-2.5 rounded-full bg-danger/70" />
            <div className="h-2.5 w-2.5 rounded-full bg-warning/70" />
            <div className="h-2.5 w-2.5 rounded-full bg-success/70" />
          </div>
          <div className="ml-3 text-xs text-text-dim font-mono">
            fake-news-detector-dashboard
          </div>
        </div>

        <div className="grid md:grid-cols-5 divide-y md:divide-y-0 md:divide-x divide-border">
          {/* Input panel */}
          <div className="md:col-span-3 p-6 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs text-text-muted uppercase tracking-wider">
                Article Input
              </span>
              <Badge variant="primary">Analyzing</Badge>
            </div>
            <div className="rounded-lg border border-border bg-bg/60 p-4 text-sm text-text-muted leading-relaxed">
              <span className="text-text">BREAKING:</span> Scientists discover
              new species of bioluminescent fish in Mariana Trench, expanding
              our understanding of deep-sea ecosystems...
            </div>
            <div className="flex items-center gap-2 text-xs text-text-dim">
              <span className="inline-flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-success animate-pulse" />
                Model online
              </span>
              <span>·</span>
              <span>187ms</span>
            </div>
          </div>

          {/* Result panel */}
          <div className="md:col-span-2 p-6 bg-bg/40">
            <span className="text-xs text-text-muted uppercase tracking-wider">
              Prediction
            </span>
            <div className="mt-3 flex items-center gap-3">
              <div className="h-12 w-12 rounded-xl bg-success/15 border border-success/30 flex items-center justify-center">
                <ShieldCheck className="h-6 w-6 text-success" />
              </div>
              <div>
                <div className="text-2xl font-semibold text-success">REAL</div>
                <div className="text-xs text-text-muted">High confidence</div>
              </div>
            </div>
            <div className="mt-5 space-y-2.5">
              <Bar label="Real" value={94.2} tone="success" />
              <Bar label="Fake" value={5.8} tone="danger" />
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function Bar({
  label,
  value,
  tone,
}: {
  label: string;
  value: number;
  tone: "success" | "danger";
}) {
  return (
    <div>
      <div className="flex items-center justify-between text-xs mb-1">
        <span className="text-text-muted">{label}</span>
        <span className="font-mono text-text">{value.toFixed(1)}%</span>
      </div>
      <div className="h-1.5 rounded-full bg-border/50 overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${value}%` }}
          transition={{ duration: 1, delay: 0.8, ease: "easeOut" }}
          className={tone === "success" ? "h-full bg-success" : "h-full bg-danger"}
        />
      </div>
    </div>
  );
}
