"use client";

import { motion } from "framer-motion";

const quotes = [
  {
    body: "We integrated this in an afternoon. The confidence scores let us route uncertain cases to human reviewers — exactly what our editorial workflow needed.",
    name: "Maya Lin",
    role: "Editor-in-chief, NewsFront",
  },
  {
    body: "Honestly the cleanest fake-news classifier I've shipped. The TF-IDF + LR baseline outperforms our previous BERT setup at 1/40th the cost.",
    name: "Jordan Park",
    role: "ML Engineer, Mediascope",
  },
  {
    body: "Dashboard analytics are gorgeous. My non-technical team can finally interpret model outputs without me translating.",
    name: "Sofia Reyes",
    role: "Head of Trust, Verifio",
  },
];

export function Testimonials() {
  return (
    <section className="relative py-24 border-t border-border/60">
      <div className="container">
        <div className="mx-auto max-w-2xl text-center">
          <span className="text-xs uppercase tracking-[0.2em] text-primary">
            What teams say
          </span>
          <h2 className="mt-3 text-3xl sm:text-4xl font-semibold tracking-tight text-gradient">
            Trusted by editorial &amp; trust teams
          </h2>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {quotes.map((q, i) => (
            <motion.figure
              key={q.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className="rounded-xl border border-border bg-card p-6"
            >
              <blockquote className="text-sm leading-relaxed text-text">
                "{q.body}"
              </blockquote>
              <figcaption className="mt-5 flex items-center gap-3 pt-4 border-t border-border/60">
                <div className="h-9 w-9 rounded-full bg-gradient-to-br from-primary to-success flex items-center justify-center text-xs font-semibold text-white">
                  {q.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </div>
                <div>
                  <div className="text-sm font-medium text-text">{q.name}</div>
                  <div className="text-xs text-text-muted">{q.role}</div>
                </div>
              </figcaption>
            </motion.figure>
          ))}
        </div>
      </div>
    </section>
  );
}
