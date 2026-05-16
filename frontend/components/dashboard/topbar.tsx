"use client";

import { useSession } from "next-auth/react";
import { Sparkles } from "lucide-react";

export function Topbar({ title, subtitle }: { title: string; subtitle?: string }) {
  const { data: session } = useSession();
  const name = session?.user?.name ?? session?.user?.email?.split("@")[0] ?? "there";

  return (
    <header className="border-b border-border bg-bg/40 backdrop-blur-sm sticky top-0 z-30">
      <div className="px-6 py-5 flex items-center justify-between">
        <div>
          <h1 className="text-xl sm:text-2xl font-semibold tracking-tight text-text">
            {title}
          </h1>
          {subtitle && (
            <p className="text-sm text-text-muted mt-0.5">{subtitle}</p>
          )}
        </div>
        <div className="hidden sm:flex items-center gap-2 text-xs text-text-muted">
          <Sparkles className="h-3.5 w-3.5 text-primary" />
          <span>Hi, {name}</span>
        </div>
      </div>
    </header>
  );
}
