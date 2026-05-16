"use client";

import { motion } from "framer-motion";
import { FileText, Cpu, BarChart3, ArrowRight } from "lucide-react";

const steps = [
  {
    icon: FileText,
    title: "Paste an article",
    body: "Drop in a headline, a paragraph, or a full article. The cleaner the input, the more accurate the prediction.",
  },
  {
    icon: Cpu,
    title: "AI analyzes the text",
    body: "Stopword removal, TF-IDF vectorization, and a logistic regression classifier work together to score the input.",
  },
  {
    icon: BarChart3,
    title: "See real-time results",
    body: "Get a labeled prediction, calibrated confidence, probability bars, and automated insights — all in one card.",
  },
];

export function Workflow() {
  return (
    <section id="workflow" className="relative py-24 border-t border-border/60">
      <div className="container">
        <div className="mx-auto max-w-2xl text-center">
          <span className="text-xs uppercase tracking-[0.2em] text-success">
            Workflow
          </span>
          <h2 className="mt-3 text-3xl sm:text-4xl font-semibold tracking-tight text-gradient">
            Three steps from raw text to verdict
          </h2>
        </div>

        <div className="mt-14 grid gap-6 md:grid-cols-3 relative">
          {steps.map((s, i) => (
            <motion.div
              key={s.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="relative rounded-xl border border-border bg-card p-6"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-bg border border-border">
                  <s.icon className="h-5 w-5 text-primary" />
                </div>
                <span className="font-mono text-xs text-text-dim">
                  STEP 0{i + 1}
                </span>
              </div>
              <h3 className="text-lg font-semibold text-text">{s.title}</h3>
              <p className="mt-2 text-sm text-text-muted leading-relaxed">
                {s.body}
              </p>

              {i < steps.length - 1 && (
                <div className="hidden md:block absolute -right-3 top-1/2 -translate-y-1/2 z-10">
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-bg border border-border">
                    <ArrowRight className="h-3 w-3 text-text-muted" />
                  </div>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
