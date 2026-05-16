"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Shield } from "lucide-react";
import { ReactNode } from "react";

export function AuthShell({
  title,
  subtitle,
  children,
  footer,
}: {
  title: string;
  subtitle: string;
  children: ReactNode;
  footer: ReactNode;
}) {
  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 grid-bg opacity-20 [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_70%)]" />
      <div className="absolute inset-x-0 top-0 h-[400px] bg-grid-fade pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="relative w-full max-w-md px-6 py-10"
      >
        <Link
          href="/"
          className="flex items-center justify-center gap-2 mb-8 group"
        >
          <div className="h-9 w-9 rounded-lg bg-gradient-to-br from-primary to-success p-[1px]">
            <div className="flex h-full w-full items-center justify-center rounded-[7px] bg-bg">
              <Shield className="h-4 w-4 text-primary" />
            </div>
          </div>
          <span className="font-semibold tracking-tight">Fake News Detector</span>
        </Link>

        <div className="rounded-2xl border border-border bg-card/80 backdrop-blur p-7 shadow-soft">
          <div className="text-center mb-6">
            <h1 className="text-2xl font-semibold text-text">{title}</h1>
            <p className="mt-1.5 text-sm text-text-muted">{subtitle}</p>
          </div>

          {children}
        </div>

        <div className="text-center text-sm text-text-muted mt-6">{footer}</div>
      </motion.div>
    </div>
  );
}
