/**
 * Roadmap Timeline Skeleton
 * 
 * Loading skeleton for the RoadmapTimeline component.
 * Displays placeholder timeline items with status indicators.
 */

import { Milestone } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/shared/Skeleton";

export function RoadmapProgressSkeleton() {
  return (
    <Card className="border-border/60">
      <CardContent className="py-5">
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          {/* Progress Bar Skeleton */}
          <div className="flex-1 space-y-2">
            <div className="flex justify-between items-baseline">
              <Skeleton className="h-4 w-28" />
              <Skeleton className="h-8 w-12" />
            </div>
            <Skeleton className="h-2.5 w-full rounded-full" />
          </div>

          {/* Divider */}
          <div className="hidden sm:block w-px h-12 bg-border" />

          {/* Stats Skeleton */}
          <div className="flex gap-6 sm:gap-4">
            <div className="flex items-center gap-2">
              <Skeleton className="h-2.5 w-2.5 rounded-full" />
              <Skeleton className="h-4 w-16" />
            </div>
            <div className="flex items-center gap-2">
              <Skeleton className="h-2.5 w-2.5 rounded-full" />
              <Skeleton className="h-4 w-16" />
            </div>
            <div className="flex items-center gap-2">
              <Skeleton className="h-2.5 w-2.5 rounded-full" />
              <Skeleton className="h-4 w-16" />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function RoadmapTimelineSkeleton() {
  return (
    <div className="space-y-6">
      {/* Section Header */}
      <div className="flex items-center gap-3">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
          <Milestone className="h-4 w-4" />
        </div>
        <Skeleton className="h-6 w-40" />
      </div>

      {/* Timeline */}
      <div className="relative pl-4">
        {[1, 2, 3, 4].map((i, index) => (
          <div key={i} className="relative flex gap-5 pb-8 last:pb-0">
            {/* Timeline Line */}
            {index < 3 && (
              <div className="absolute left-[15px] top-[36px] w-0.5 h-[calc(100%-20px)] bg-border" />
            )}

            {/* Status Icon Skeleton */}
            <Skeleton className="h-8 w-8 rounded-full shrink-0" />

            {/* Section Card Skeleton */}
            <Card className="flex-1 overflow-hidden">
              <CardHeader className="pb-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <Skeleton className="h-6 w-40" />
                  <div className="flex items-center gap-2">
                    <Skeleton className="h-5 w-20 rounded-full" />
                    <Skeleton className="h-5 w-16 rounded-full" />
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                </div>
                
                {/* Screens */}
                <div className="space-y-2">
                  <Skeleton className="h-3 w-16" />
                  <div className="flex flex-wrap gap-1.5">
                    <Skeleton className="h-5 w-20 rounded-full" />
                    <Skeleton className="h-5 w-24 rounded-full" />
                    <Skeleton className="h-5 w-16 rounded-full" />
                  </div>
                </div>

                {/* Link */}
                <Skeleton className="h-4 w-28" />
              </CardContent>
            </Card>
          </div>
        ))}
      </div>
    </div>
  );
}
