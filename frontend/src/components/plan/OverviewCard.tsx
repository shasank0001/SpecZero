/**
 * Overview Card Component
 * 
 * Displays the product's core information with refined visual hierarchy.
 * Features elegant iconography and subtle depth effects.
 * 
 * Aesthetic: Editorial card with clear sections and refined typography
 */

import { Target, Users, Lightbulb, Sparkles } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { ProductOverview, TargetUser, SuccessMetric } from "@/types/product";

interface OverviewCardProps {
  overview: ProductOverview;
}

export function OverviewCard({ overview }: OverviewCardProps) {
  // Handle both string[] and TargetUser[] formats
  const getTargetUserName = (user: string | TargetUser): string => {
    if (typeof user === "string") return user;
    return user.name;
  };

  const getTargetUserDescription = (user: string | TargetUser): string | undefined => {
    if (typeof user === "string") return undefined;
    return user.description;
  };

  // Handle both string[] and SuccessMetric[] formats
  const getMetricText = (metric: string | SuccessMetric): string => {
    if (typeof metric === "string") return metric;
    return `${metric.metric}: ${metric.target}`;
  };

  return (
    <Card className="relative overflow-hidden border-border/60">
      {/* Subtle gradient accent at top */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary/60 via-primary to-primary/60" />
      
      <CardHeader className="pb-6 pt-8">
        {/* Product Name & Tagline */}
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <Sparkles className="h-5 w-5" />
            </div>
            <CardTitle className="font-display text-3xl font-bold tracking-tight bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text">
              {overview.name}
            </CardTitle>
          </div>
          {overview.tagline && (
            <CardDescription className="text-lg text-muted-foreground leading-relaxed max-w-2xl">
              {overview.tagline}
            </CardDescription>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-8 pb-8">
        {/* Problem Statement */}
        {overview.problem && (
          <section className="group">
            <div className="flex items-center gap-3 mb-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-500/10 text-amber-500 transition-colors group-hover:bg-amber-500/15">
                <Lightbulb className="h-4 w-4" />
              </div>
              <h3 className="text-sm font-semibold text-foreground uppercase tracking-wide">
                Problem Statement
              </h3>
            </div>
            <p className="text-muted-foreground leading-relaxed pl-11">
              {overview.problem}
            </p>
          </section>
        )}

        {/* Target Users */}
        {overview.targetUsers && overview.targetUsers.length > 0 && (
          <section className="group">
            <div className="flex items-center gap-3 mb-4">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-500/10 text-blue-500 transition-colors group-hover:bg-blue-500/15">
                <Users className="h-4 w-4" />
              </div>
              <h3 className="text-sm font-semibold text-foreground uppercase tracking-wide">
                Target Users
              </h3>
            </div>
            <div className="flex flex-wrap gap-2 pl-11">
              {overview.targetUsers.map((user, index) => (
                <Badge 
                  key={index} 
                  variant="secondary"
                  className="px-3 py-1.5 text-sm font-medium"
                  title={getTargetUserDescription(user)}
                >
                  {getTargetUserName(user)}
                </Badge>
              ))}
            </div>
          </section>
        )}

        {/* Success Metrics */}
        {overview.successMetrics && overview.successMetrics.length > 0 && (
          <section className="group">
            <div className="flex items-center gap-3 mb-4">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-green-500/10 text-green-500 transition-colors group-hover:bg-green-500/15">
                <Target className="h-4 w-4" />
              </div>
              <h3 className="text-sm font-semibold text-foreground uppercase tracking-wide">
                Success Metrics
              </h3>
            </div>
            <ul className="space-y-2 pl-11">
              {overview.successMetrics.map((metric, index) => (
                <li 
                  key={index} 
                  className="flex items-start gap-3 text-muted-foreground"
                >
                  <span className="mt-2 h-1.5 w-1.5 rounded-full bg-green-500/60 shrink-0" />
                  <span className="leading-relaxed">{getMetricText(metric)}</span>
                </li>
              ))}
            </ul>
          </section>
        )}
      </CardContent>
    </Card>
  );
}
