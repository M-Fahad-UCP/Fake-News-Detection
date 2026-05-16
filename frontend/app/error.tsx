"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="min-h-screen flex items-center justify-center px-6">
      <div className="text-center max-w-md">
        <p className="text-xs uppercase tracking-[0.2em] text-danger">Error</p>
        <h1 className="mt-3 text-3xl font-semibold text-text">
          Something went wrong
        </h1>
        <p className="mt-3 text-text-muted">
          {error.message || "An unexpected error occurred."}
        </p>
        <div className="mt-6 flex gap-2 justify-center">
          <Button onClick={reset}>Try again</Button>
          <Link href="/">
            <Button variant="secondary">Go home</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
