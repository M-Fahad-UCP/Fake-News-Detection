"use client";

import { motion } from "framer-motion";
import {
  Brain,
  Zap,
  LineChart,
  Lock,
  History,
  GitBranch,
} from "lucide-react";

const features = [
  {
    icon: Brain,
    title: "TF-IDF + Logistic Regression",
    body: "Battle-tested NLP pipeline. Stopword removal, stemming, n-gram vectorization, and a calibrated linear classifier.",
  },
  {
    icon: Zap,
    title: "Sub-200ms predictions",
    body: "FastAPI backend keeps the model warm in memory. Predictions return in well under a quarter second.",
  },
  {
    icon: LineChart,
    title: "Confidence intelligence",
    body: "Every prediction ships with class probabilities, not just a label. Know how sure the model is.",
  },
  {
    icon: History,
    title: "Full analysis history",
    body: "Every classification is stored to your account. Search, sort, export, or delete on demand.",
  },
  {
    icon: Lock,
    title: "Auth & rate-limited",
    body: "Email + password with JWT sessions. Per-user rate limits, input validation, and secure secret handling.",
  },
  {
    icon: GitBranch,
    title: "Open architecture",
    body: "Frontend on Vercel, ML service on Render or Docker anywhere. Swap the model without touching the UI.",
  },
];

export function Features() {
  return (
    <section id="features" className="relative py-24">
      <div className="container">
        <div className="mx-auto max-w-2xl text-center">
          <span className="text-xs uppercase tracking-[0.2em] text-primary">
            Capabilities
          </span>
          <h2 className="mt-3 text-3xl sm:text-4xl font-semibold tracking-tight text-gradient">
            Everything you need to ship fake-news detection
          </h2>
          <p className="mt-4 text-text-muted">
            A complete, production-grade pipeline — from raw text input to a
            polished analytics dashboard.
          </p>
        </div>

        <div className="mt-14 grid gap-px bg-border rounded-2xl overflow-hidden border border-border md:grid-cols-2 lg:grid-cols-3">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.4, delay: i * 0.05 }}
              className="group bg-card p-7 hover:bg-cardHover transition-colors"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 border border-primary/20 mb-5">
                <f.icon className="h-5 w-5 text-primary" />
              </div>
              <h3 className="text-base font-semibold text-text mb-2">
                {f.title}
              </h3>
              <p className="text-sm text-text-muted leading-relaxed">{f.body}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
