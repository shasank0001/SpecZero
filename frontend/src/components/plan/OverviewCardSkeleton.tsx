/**
 * Overview Card Skeleton
 * 
 * Loading skeleton for the OverviewCard component.
 * Matches the structure of the actual card for smooth transitions.
 */

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/shared/Skeleton";

export function OverviewCardSkeleton() {
  return (
    <Card className="relative overflow-hidden border-border/60">
      {/* Gradient accent placeholder */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-muted" />
      
      <CardHeader className="pb-6 pt-8">
        <div className="space-y-3">
          {/* Icon and title */}
          <div className="flex items-center gap-3">
            <Skeleton className="h-10 w-10 rounded-xl" />
            <Skeleton className="h-8 w-64" />
          </div>
          {/* Tagline */}
          <Skeleton className="h-5 w-96 max-w-full" />
        </div>
      </CardHeader>

      <CardContent className="space-y-8 pb-8">
        {/* Problem Statement Skeleton */}
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <Skeleton className="h-8 w-8 rounded-lg" />
            <Skeleton className="h-4 w-32" />
          </div>
          <div className="pl-11 space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-4/5" />
            <Skeleton className="h-4 w-3/4" />
          </div>
        </div>

        {/* Target Users Skeleton */}
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <Skeleton className="h-8 w-8 rounded-lg" />
            <Skeleton className="h-4 w-24" />
          </div>
          <div className="flex flex-wrap gap-2 pl-11">
            <Skeleton className="h-8 w-24 rounded-full" />
            <Skeleton className="h-8 w-32 rounded-full" />
            <Skeleton className="h-8 w-28 rounded-full" />
          </div>
        </div>

        {/* Success Metrics Skeleton */}
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <Skeleton className="h-8 w-8 rounded-lg" />
            <Skeleton className="h-4 w-28" />
          </div>
          <div className="pl-11 space-y-2">
            <div className="flex items-start gap-3">
              <Skeleton className="mt-2 h-1.5 w-1.5 rounded-full" />
              <Skeleton className="h-4 w-48" />
            </div>
            <div className="flex items-start gap-3">
              <Skeleton className="mt-2 h-1.5 w-1.5 rounded-full" />
              <Skeleton className="h-4 w-56" />
            </div>
            <div className="flex items-start gap-3">
              <Skeleton className="mt-2 h-1.5 w-1.5 rounded-full" />
              <Skeleton className="h-4 w-40" />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
