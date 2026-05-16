"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Minus } from "lucide-react";

const faqs = [
  {
    q: "How does the fake news detection actually work?",
    a: "We use a classic NLP pipeline: text cleaning, stopword removal, TF-IDF vectorization (uni- and bi-grams), then a logistic regression classifier. It's fast, interpretable, and surprisingly competitive with much larger models on this task.",
  },
  {
    q: "What dataset is the model trained on?",
    a: "The reference repository uses the Kaggle Fake/True news dataset (~45k labeled articles). You can retrain on your own data using the included train.py script.",
  },
  {
    q: "Can I deploy this to production?",
    a: "Yes. The frontend deploys to Vercel as a standard Next.js app, and the FastAPI ML service runs on Render, Fly.io, or any container host. Configs for both are included.",
  },
  {
    q: "Is my data stored?",
    a: "Analyses are stored only in your account, in a SQLite database (Postgres-ready via Prisma). You can delete any entry at any time. Nothing is shared with third parties.",
  },
  {
    q: "What's the model accuracy?",
    a: "On the Kaggle benchmark, the TF-IDF + LogReg baseline achieves ~98% accuracy and F1. Real-world accuracy varies with topic distribution — that's why we always return calibrated confidence.",
  },
  {
    q: "Can I swap the model?",
    a: "Absolutely. The ML service exposes a single /predict endpoint. Drop in a transformer, gradient boosted trees, or any classifier — the frontend doesn't care.",
  },
];

export function FAQ() {
  return (
    <section id="faq" className="relative py-24 border-t border-border/60">
      <div className="container max-w-3xl">
        <div className="text-center">
          <span className="text-xs uppercase tracking-[0.2em] text-primary">
            FAQ
          </span>
          <h2 className="mt-3 text-3xl sm:text-4xl font-semibold tracking-tight text-gradient">
            Frequently asked questions
          </h2>
        </div>

        <div className="mt-12 space-y-2">
          {faqs.map((f, i) => (
            <FAQItem key={f.q} q={f.q} a={f.a} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

function FAQItem({ q, a, index }: { q: string; a: string; index: number }) {
  const [open, setOpen] = useState(index === 0);
  return (
    <div className="rounded-xl border border-border bg-card overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left hover:bg-cardHover transition-colors"
      >
        <span className="text-sm font-medium text-text">{q}</span>
        <span className="flex-none flex h-6 w-6 items-center justify-center rounded-md bg-bg border border-border text-text-muted">
          {open ? <Minus className="h-3 w-3" /> : <Plus className="h-3 w-3" />}
        </span>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <p className="px-5 pb-5 text-sm text-text-muted leading-relaxed">
              {a}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
