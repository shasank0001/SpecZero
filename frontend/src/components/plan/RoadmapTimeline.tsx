/**
 * Roadmap Timeline Component
 * 
 * Visualizes product phases and sections with completion status.
 * Features an elegant vertical timeline with animated transitions.
 * 
 * Aesthetic: Clean timeline with status indicators and subtle depth
 */

import { CheckCircle2, Circle, Clock, ArrowRight, Milestone } from "lucide-react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { RoadmapSection, RoadmapSectionStatus, ScreenDefinition } from "@/types/product";

interface RoadmapTimelineProps {
  sections: RoadmapSection[];
  onSectionClick?: (sectionId: string) => void;
  className?: string;
}

// Map status to visual configuration
const statusConfig: Record<RoadmapSectionStatus, {
  icon: typeof CheckCircle2;
  iconColor: string;
  borderColor: string;
  lineColor: string;
  badgeVariant: "success" | "warning" | "secondary" | "muted";
  label: string;
}> = {
  complete: {
    icon: CheckCircle2,
    iconColor: "text-green-500",
    borderColor: "border-green-500",
    lineColor: "bg-green-500",
    badgeVariant: "success",
    label: "Complete",
  },
  "in-progress": {
    icon: Clock,
    iconColor: "text-amber-500",
    borderColor: "border-amber-500",
    lineColor: "bg-amber-500/50",
    badgeVariant: "warning",
    label: "In Progress",
  },
  planned: {
    icon: Circle,
    iconColor: "text-blue-400",
    borderColor: "border-blue-400",
    lineColor: "bg-blue-400/30",
    badgeVariant: "secondary",
    label: "Planned",
  },
  "not-started": {
    icon: Circle,
    iconColor: "text-muted-foreground",
    borderColor: "border-muted-foreground/40",
    lineColor: "bg-border",
    badgeVariant: "muted",
    label: "Not Started",
  },
};

// Helper to get screen name from ScreenDefinition
function getScreenName(screen: string | ScreenDefinition): string {
  if (typeof screen === "string") return screen;
  return screen.name;
}

export function RoadmapTimeline({ sections, onSectionClick, className }: RoadmapTimelineProps) {
  if (!sections || sections.length === 0) {
    return null;
  }

  return (
    <div className={cn("space-y-6", className)}>
      {/* Section Header */}
      <div className="flex items-center gap-3">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
          <Milestone className="h-4 w-4" />
        </div>
        <h2 className="font-display text-xl font-semibold tracking-tight text-foreground">
          Product Roadmap
        </h2>
      </div>

      {/* Timeline */}
      <div className="relative pl-4">
        {sections.map((section, index) => {
          const status = section.status || "not-started";
          const config = statusConfig[status];
          const StatusIcon = config.icon;
          const isLast = index === sections.length - 1;
          const isActive = status === "in-progress";

          return (
            <div 
              key={section.id} 
              className={cn(
                "relative flex gap-5 pb-8 last:pb-0",
                "animate-fade-up"
              )}
              style={{ animationDelay: `${index * 80}ms` }}
            >
              {/* Timeline Line */}
              {!isLast && (
                <div
                  className={cn(
                    "absolute left-[15px] top-[36px] w-0.5 h-[calc(100%-20px)]",
                    "transition-colors duration-500",
                    config.lineColor
                  )}
                />
              )}

              {/* Status Icon Node */}
              <div
                className={cn(
                  "relative z-10 flex h-8 w-8 shrink-0 items-center justify-center",
                  "rounded-full border-2 bg-background transition-all duration-300",
                  config.borderColor,
                  isActive && "ring-4 ring-amber-500/20"
                )}
              >
                <StatusIcon className={cn("h-4 w-4 transition-colors", config.iconColor)} />
                
                {/* Pulse animation for in-progress */}
                {isActive && (
                  <span className="absolute inset-0 rounded-full bg-amber-500/20 animate-ping" />
                )}
              </div>

              {/* Section Card */}
              <Card
                className={cn(
                  "flex-1 cursor-pointer overflow-hidden",
                  "transition-all duration-300",
                  "hover:shadow-lg hover:border-primary/30",
                  isActive && "ring-2 ring-amber-500/20 border-amber-500/40"
                )}
                onClick={() => onSectionClick?.(section.id)}
              >
                <CardHeader className="pb-3">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <CardTitle className="text-lg font-semibold">
                      {section.name}
                    </CardTitle>
                    <div className="flex items-center gap-2">
                      <Badge variant={config.badgeVariant}>
                        {config.label}
                      </Badge>
                      {section.priority && (
                        <Badge 
                          variant="outline" 
                          size="sm"
                          className={cn(
                            section.priority === "high" && "border-red-300 text-red-600 dark:border-red-800 dark:text-red-400"
                          )}
                        >
                          {section.priority}
                        </Badge>
                      )}
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  {section.description && (
                    <CardDescription className="leading-relaxed">
                      {section.description}
                    </CardDescription>
                  )}

                  {/* Screens/Components */}
                  {section.screens && section.screens.length > 0 && (
                    <div className="space-y-2">
                      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                        Screens
                      </p>
                      <div className="flex flex-wrap gap-1.5">
                        {section.screens.map((screen, idx) => (
                          <Badge 
                            key={idx} 
                            variant="outline" 
                            size="sm"
                            className="font-mono"
                          >
                            {getScreenName(screen)}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Link to Designs Tab */}
                  {(status === "complete" || status === "in-progress") && (
                    <Link
                      to={`/designs?section=${section.id}`}
                      className={cn(
                        "inline-flex items-center gap-1.5 text-sm font-medium",
                        "text-primary hover:text-primary/80 transition-colors",
                        "group"
                      )}
                      onClick={(e) => e.stopPropagation()}
                    >
                      View in Designs
                      <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                    </Link>
                  )}
                </CardContent>
              </Card>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/**
 * Roadmap Progress Summary Component
 * 
 * Displays overall progress across all roadmap sections.
 */
interface RoadmapProgressProps {
  sections: RoadmapSection[];
  className?: string;
}

export function RoadmapProgress({ sections, className }: RoadmapProgressProps) {
  const completed = sections.filter((s) => s.status === "complete").length;
  const inProgress = sections.filter((s) => s.status === "in-progress").length;
  const planned = sections.filter((s) => s.status === "planned" || s.status === "not-started").length;
  const total = sections.length;
  const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;

  return (
    <Card className={cn("border-border/60", className)}>
      <CardContent className="py-5">
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          {/* Progress Bar */}
          <div className="flex-1 space-y-2">
            <div className="flex justify-between items-baseline">
              <span className="text-sm font-medium text-foreground">Overall Progress</span>
              <span className="text-2xl font-bold text-foreground tabular-nums">
                {percentage}
                <span className="text-sm font-normal text-muted-foreground">%</span>
              </span>
            </div>
            <div className="h-2.5 bg-muted rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-primary to-primary/80 rounded-full transition-all duration-700 ease-out"
                style={{ width: `${percentage}%` }}
              />
            </div>
          </div>

          {/* Divider */}
          <div className="hidden sm:block w-px h-12 bg-border" />

          {/* Stats */}
          <div className="flex gap-6 sm:gap-4">
            <div className="flex items-center gap-2">
              <div className="h-2.5 w-2.5 rounded-full bg-green-500" />
              <span className="text-sm">
                <span className="font-semibold text-foreground">{completed}</span>
                <span className="text-muted-foreground ml-1">Done</span>
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-2.5 w-2.5 rounded-full bg-amber-500" />
              <span className="text-sm">
                <span className="font-semibold text-foreground">{inProgress}</span>
                <span className="text-muted-foreground ml-1">Active</span>
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-2.5 w-2.5 rounded-full bg-muted-foreground/50" />
              <span className="text-sm">
                <span className="font-semibold text-foreground">{planned}</span>
                <span className="text-muted-foreground ml-1">Planned</span>
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
