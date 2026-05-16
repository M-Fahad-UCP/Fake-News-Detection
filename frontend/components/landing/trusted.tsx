"use client";

import { motion } from "framer-motion";

const items = [
  "scikit-learn",
  "Next.js",
  "FastAPI",
  "Vercel",
  "Render",
  "Prisma",
  "Tailwind",
];

export function Trusted() {
  return (
    <section className="relative py-12 border-y border-border/60">
      <div className="container">
        <p className="text-center text-xs uppercase tracking-[0.2em] text-text-dim">
          Built with the open-source stack developers trust
        </p>
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mt-6 flex flex-wrap justify-center items-center gap-x-10 gap-y-3 text-text-muted"
        >
          {items.map((item) => (
            <span
              key={item}
              className="text-sm font-medium tracking-wide hover:text-text transition-colors"
            >
              {item}
            </span>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
