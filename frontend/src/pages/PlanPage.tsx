/**
 * Plan Page
 * 
 * The main Plan tab displaying product overview and roadmap.
 * Features elegant tab navigation and refined layout.
 * 
 * Aesthetic: Editorial layout with clear visual hierarchy
 */

import { useState, useEffect } from "react";
import { FileText, Map, Code, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { loadProductOverview, loadProductRoadmap } from "@/lib/product-loader";
import { getSectionStatus } from "@/lib/section-status";
import { OverviewCard } from "@/components/plan/OverviewCard";
import { OverviewCardSkeleton } from "@/components/plan/OverviewCardSkeleton";
import { FeaturesList } from "@/components/plan/FeaturesList";
import { FeaturesListSkeleton } from "@/components/plan/FeaturesListSkeleton";
import { RoadmapTimeline, RoadmapProgress } from "@/components/plan/RoadmapTimeline";
import { EmptyState } from "@/components/shared/EmptyState";
import { MarkdownRenderer } from "@/components/shared/MarkdownRenderer";
import { Skeleton } from "@/components/shared/Skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import type { RoadmapSection, RoadmapSectionStatus } from "@/types/product";

export default function PlanPage() {
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  // Simulate initial load for smooth transition
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 150);
    return () => clearTimeout(timer);
  }, []);

  // Load product data
  const overview = loadProductOverview();
  const roadmap = loadProductRoadmap();

  // Enrich roadmap sections with status from file system
  const sectionsWithStatus: RoadmapSection[] = roadmap?.phases?.flatMap((phase) =>
    phase.sections.map((section) => ({
      ...section,
      status: section.status || getSectionStatus(section.id) as RoadmapSectionStatus,
    }))
  ) || [];

  // Handle section click - navigate to designs tab
  const handleSectionClick = (sectionId: string) => {
    navigate(`/designs?section=${sectionId}`);
  };

  // Check if we have any data
  const hasOverview = overview !== null;
  const hasRoadmap = sectionsWithStatus.length > 0;
  const hasFeatures = overview?.features && overview.features.length > 0;

  // Loading state
  if (isLoading) {
    return (
      <div className="space-y-8 animate-fade-in">
        {/* Page Header Skeleton */}
        <header className="space-y-1">
          <div className="flex items-center gap-3">
            <Skeleton className="h-10 w-10 rounded-xl" />
            <div className="space-y-1">
              <Skeleton className="h-7 w-20" />
              <Skeleton className="h-4 w-48" />
            </div>
          </div>
        </header>

        {/* Tab List Skeleton */}
        <Skeleton className="h-11 w-80 rounded-xl" />

        {/* Content Skeletons */}
        <OverviewCardSkeleton />
        <FeaturesListSkeleton />
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Page Header */}
      <header className="space-y-1">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <Map className="h-5 w-5" />
          </div>
          <div>
            <h1 className="font-display text-2xl font-bold tracking-tight text-foreground">
              Plan
            </h1>
            <p className="text-sm text-muted-foreground">
              Product vision, features, and roadmap
            </p>
          </div>
        </div>
      </header>

      {/* Main Content */}
      {!hasOverview && !hasRoadmap ? (
        // No data - show empty state
        <EmptyState
          icon={FileText}
          title="No product plan yet"
          description="Start by defining your product vision. Run the product-vision command in your AI agent to generate the product overview and roadmap."
          command="/product-vision"
        />
      ) : (
        // Has data - show tabs
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList>
            <TabsTrigger value="overview" className="gap-2">
              <Sparkles className="h-4 w-4" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="roadmap" className="gap-2">
              <Map className="h-4 w-4" />
              Roadmap
            </TabsTrigger>
            <TabsTrigger value="raw" className="gap-2">
              <Code className="h-4 w-4" />
              Raw Markdown
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-8" data-tour="plan-overview">
            {hasOverview ? (
              <>
                <OverviewCard overview={overview} />
                
                {hasFeatures && (
                  <FeaturesList features={overview.features} />
                )}
              </>
            ) : (
              <EmptyState
                icon={FileText}
                title="No product overview"
                description="Create a product overview to see your vision, problem statement, and target users displayed here."
                command="/product-vision"
              />
            )}
          </TabsContent>

          {/* Roadmap Tab */}
          <TabsContent value="roadmap" className="space-y-6">
            {hasRoadmap ? (
              <>
                <RoadmapProgress sections={sectionsWithStatus} />
                <RoadmapTimeline
                  sections={sectionsWithStatus}
                  onSectionClick={handleSectionClick}
                />
              </>
            ) : (
              <EmptyState
                icon={Map}
                title="No roadmap defined"
                description="Create a roadmap to break down your product into phases and sections."
                command="/create-roadmap"
              />
            )}
          </TabsContent>

          {/* Raw Markdown Tab */}
          <TabsContent value="raw" className="space-y-6">
            {hasOverview && (
              <section className="space-y-4">
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-muted-foreground" />
                  <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                    Product Overview
                  </h3>
                  <code className="ml-auto text-xs text-muted-foreground font-mono bg-muted px-2 py-0.5 rounded">
                    product/product-overview.md
                  </code>
                </div>
                <Card className="border-border/60">
                  <CardContent className="p-6">
                    <MarkdownRenderer content={overview.rawContent} />
                  </CardContent>
                </Card>
              </section>
            )}
            
            {roadmap && (
              <section className="space-y-4">
                <div className="flex items-center gap-2">
                  <Map className="h-4 w-4 text-muted-foreground" />
                  <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                    Product Roadmap
                  </h3>
                  <code className="ml-auto text-xs text-muted-foreground font-mono bg-muted px-2 py-0.5 rounded">
                    product/product-roadmap.md
                  </code>
                </div>
                <Card className="border-border/60">
                  <CardContent className="p-6">
                    <MarkdownRenderer content={roadmap.rawContent} />
                  </CardContent>
                </Card>
              </section>
            )}

            {!hasOverview && !roadmap && (
              <EmptyState
                icon={Code}
                title="No markdown files"
                description="Create product markdown files to view their raw content here."
                command="/product-vision"
              />
            )}
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
}
