"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export function CTA() {
  return (
    <section className="relative py-24 border-t border-border/60">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="relative overflow-hidden rounded-2xl border border-border bg-card p-10 sm:p-14 text-center"
        >
          <div className="absolute inset-0 bg-grid-fade pointer-events-none" />
          <div className="relative">
            <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight text-gradient">
              Stop misinformation in its tracks.
            </h2>
            <p className="mt-4 text-text-muted max-w-xl mx-auto">
              Spin up your account in 30 seconds. Analyze your first article in
              under a minute. No credit card needed.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
              <Link href="/register">
                <Button size="lg" className="min-w-[180px] group">
                  Create free account
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </Button>
              </Link>
              <Link href="/login">
                <Button size="lg" variant="secondary" className="min-w-[180px]">
                  Sign in
                </Button>
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
