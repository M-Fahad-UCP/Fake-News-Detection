"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import {
  LayoutDashboard,
  History,
  BarChart3,
  Shield,
  LogOut,
  Settings,
} from "lucide-react";
import { cn } from "@/lib/utils";

const nav = [
  { href: "/dashboard", label: "Analyze", icon: LayoutDashboard },
  { href: "/dashboard/history", label: "History", icon: History },
  { href: "/dashboard/analytics", label: "Analytics", icon: BarChart3 },
];

export function Sidebar() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const user = session?.user;
  const initial = (user?.name?.[0] ?? user?.email?.[0] ?? "U").toUpperCase();

  return (
    <aside className="hidden lg:flex w-64 flex-col border-r border-border bg-bg/60 sticky top-0 h-screen">
      <div className="px-5 py-5 border-b border-border">
        <Link href="/" className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-primary to-success p-[1px]">
            <div className="flex h-full w-full items-center justify-center rounded-[7px] bg-bg">
              <Shield className="h-4 w-4 text-primary" />
            </div>
          </div>
          <span className="font-semibold tracking-tight text-sm">
            Fake News Detector
          </span>
        </Link>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-0.5">
        <p className="px-2 text-[11px] uppercase tracking-wider text-text-dim mb-2">
          Workspace
        </p>
        {nav.map((item) => {
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-2.5 px-2.5 py-2 rounded-md text-sm transition-colors",
                active
                  ? "bg-primary/10 text-primary border border-primary/20"
                  : "text-text-muted hover:text-text hover:bg-card border border-transparent"
              )}
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-border p-3">
        <div className="flex items-center gap-3 px-2 py-2 mb-2">
          <div className="h-8 w-8 rounded-full bg-gradient-to-br from-primary to-success flex items-center justify-center text-xs font-semibold text-white">
            {initial}
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-sm text-text truncate">
              {user?.name ?? "Guest"}
            </div>
            <div className="text-xs text-text-dim truncate">{user?.email}</div>
          </div>
        </div>
        <button
          onClick={() => signOut({ callbackUrl: "/" })}
          className="flex w-full items-center gap-2 px-2.5 py-2 rounded-md text-sm text-text-muted hover:text-text hover:bg-card transition-colors"
        >
          <LogOut className="h-4 w-4" />
          Sign out
        </button>
      </div>
    </aside>
  );
}
