import { cn } from "@/lib/utils";

export function Skeleton({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "rounded-md bg-card overflow-hidden relative",
        className
      )}
    >
      <div className="absolute inset-0 shimmer" />
    </div>
  );
}
