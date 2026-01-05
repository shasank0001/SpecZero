/**
 * Skeleton Component
 * 
 * A refined loading skeleton with smooth animation.
 */

import { cn } from "@/lib/utils";

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {}

export function Skeleton({ className, ...props }: SkeletonProps) {
  return (
    <div
      className={cn(
        "animate-pulse rounded-lg bg-muted/60",
        "bg-gradient-to-r from-muted/40 via-muted/60 to-muted/40",
        "bg-[length:200%_100%] animate-shimmer",
        className
      )}
      {...props}
    />
  );
}
