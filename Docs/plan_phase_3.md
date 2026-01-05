# Phase 3: Plan Tab - Detailed Implementation Plan

> **Goal:** Fully functional Plan tab displaying product overview and roadmap  
> **Duration:** 2 days  
> **Outcome:** A complete Plan tab that renders product overview, features list, and roadmap timeline with empty states when no data exists

---

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Step 1: Install Markdown Dependencies](#step-1-install-markdown-dependencies)
3. [Step 2: Create Markdown Renderer Component](#step-2-create-markdown-renderer-component)
4. [Step 3: Create Empty State Component](#step-3-create-empty-state-component)
5. [Step 4: Create Overview Card Component](#step-4-create-overview-card-component)
6. [Step 5: Create Features List Component](#step-5-create-features-list-component)
7. [Step 6: Create Roadmap Timeline Component](#step-6-create-roadmap-timeline-component)
8. [Step 7: Assemble Plan Page](#step-7-assemble-plan-page)
9. [Step 8: Add Loading States](#step-8-add-loading-states)
10. [Verification Checklist](#verification-checklist)
11. [File Structure Summary](#file-structure-summary)

---

## Prerequisites

Before starting Phase 3, ensure you have:

- [ ] Completed Phase 1 successfully (Vite app with routing and layout)
- [ ] Completed Phase 2 successfully (File loaders and data layer)
- [ ] Working file loaders for product overview and roadmap
- [ ] Sample `product/product-overview.md` and `product/product-roadmap.md` files
- [ ] All Phase 2 verification checks passing

**Required from Phase 2:**
- `src/lib/product-loader.ts` - Loads and parses product markdown files
- `src/lib/section-loader.ts` - Loads section data for completion tracking
- `src/types/product.ts` - Type definitions for ProductOverview, ProductRoadmap

---

## Step 1: Install Markdown Dependencies

### 1.1 Install Required Packages

```bash
npm install react-markdown remark-gfm
```

| Package | Purpose |
|---------|---------|
| `react-markdown` | React component for rendering Markdown as React elements |
| `remark-gfm` | Plugin for GitHub Flavored Markdown (tables, strikethrough, task lists) |

### 1.2 Why These Packages?

- **react-markdown** is the most popular and well-maintained Markdown renderer for React
- It integrates seamlessly with Tailwind CSS for styling
- **remark-gfm** adds support for:
  - Tables (used in our product docs)
  - Task lists (checkbox syntax)
  - Strikethrough text
  - Autolinks

### 1.3 Type Definitions

These packages include TypeScript definitions, so no additional `@types` packages are needed.

---

## Step 2: Create Markdown Renderer Component

The Markdown Renderer is a reusable component that converts markdown content into styled React elements.

### 2.1 Create Directory Structure

```bash
mkdir -p src/components/shared
```

### 2.2 Create `src/components/shared/MarkdownRenderer.tsx`

```tsx
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { cn } from "@/lib/utils";

interface MarkdownRendererProps {
  content: string;
  className?: string;
}

export function MarkdownRenderer({ content, className }: MarkdownRendererProps) {
  return (
    <div className={cn("prose prose-zinc dark:prose-invert max-w-none", className)}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          // Headings
          h1: ({ children }) => (
            <h1 className="text-3xl font-bold tracking-tight mb-4">{children}</h1>
          ),
          h2: ({ children }) => (
            <h2 className="text-2xl font-semibold tracking-tight mt-8 mb-4 first:mt-0">
              {children}
            </h2>
          ),
          h3: ({ children }) => (
            <h3 className="text-xl font-semibold tracking-tight mt-6 mb-3">
              {children}
            </h3>
          ),
          h4: ({ children }) => (
            <h4 className="text-lg font-medium mt-4 mb-2">{children}</h4>
          ),

          // Paragraphs and text
          p: ({ children }) => (
            <p className="leading-7 mb-4 text-muted-foreground">{children}</p>
          ),
          strong: ({ children }) => (
            <strong className="font-semibold text-foreground">{children}</strong>
          ),
          em: ({ children }) => <em className="italic">{children}</em>,

          // Lists
          ul: ({ children }) => (
            <ul className="list-disc list-inside mb-4 space-y-2">{children}</ul>
          ),
          ol: ({ children }) => (
            <ol className="list-decimal list-inside mb-4 space-y-2">{children}</ol>
          ),
          li: ({ children }) => (
            <li className="text-muted-foreground">{children}</li>
          ),

          // Blockquote
          blockquote: ({ children }) => (
            <blockquote className="border-l-4 border-primary pl-4 italic my-4 text-muted-foreground">
              {children}
            </blockquote>
          ),

          // Code
          code: ({ className, children, ...props }) => {
            const isInline = !className;
            if (isInline) {
              return (
                <code
                  className="bg-muted px-1.5 py-0.5 rounded text-sm font-mono"
                  {...props}
                >
                  {children}
                </code>
              );
            }
            return (
              <code
                className={cn(
                  "block bg-muted p-4 rounded-lg overflow-x-auto font-mono text-sm",
                  className
                )}
                {...props}
              >
                {children}
              </code>
            );
          },
          pre: ({ children }) => (
            <pre className="bg-muted rounded-lg overflow-x-auto mb-4">
              {children}
            </pre>
          ),

          // Tables
          table: ({ children }) => (
            <div className="overflow-x-auto mb-4">
              <table className="w-full border-collapse border border-border">
                {children}
              </table>
            </div>
          ),
          thead: ({ children }) => (
            <thead className="bg-muted">{children}</thead>
          ),
          tbody: ({ children }) => <tbody>{children}</tbody>,
          tr: ({ children }) => (
            <tr className="border-b border-border">{children}</tr>
          ),
          th: ({ children }) => (
            <th className="px-4 py-2 text-left font-semibold border border-border">
              {children}
            </th>
          ),
          td: ({ children }) => (
            <td className="px-4 py-2 border border-border text-muted-foreground">
              {children}
            </td>
          ),

          // Links
          a: ({ href, children }) => (
            <a
              href={href}
              className="text-primary underline underline-offset-4 hover:text-primary/80"
              target={href?.startsWith("http") ? "_blank" : undefined}
              rel={href?.startsWith("http") ? "noopener noreferrer" : undefined}
            >
              {children}
            </a>
          ),

          // Horizontal rule
          hr: () => <hr className="my-6 border-border" />,
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
```

### 2.3 Component Features

| Feature | Description |
|---------|-------------|
| **GFM Support** | Tables, task lists, strikethrough via remark-gfm |
| **Dark Mode** | Automatic dark mode support with `dark:prose-invert` |
| **Custom Styling** | All elements styled with Tailwind classes |
| **Responsive** | Tables use `overflow-x-auto` for mobile |
| **External Links** | Automatically opens in new tab with security attributes |

### 2.4 Create Component Index Export

```bash
touch src/components/shared/index.ts
```

Add to `src/components/shared/index.ts`:

```typescript
export { MarkdownRenderer } from "./MarkdownRenderer";
```

---

## Step 3: Create Empty State Component

The Empty State component displays when no product files exist, guiding users on how to create them.

### 3.1 Create `src/components/shared/EmptyState.tsx`

```tsx
import { LucideIcon, Copy, Check } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  command?: string;
  className?: string;
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  command,
  className,
}: EmptyStateProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    if (command) {
      await navigator.clipboard.writeText(command);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <Card className={cn("border-dashed", className)}>
      <CardContent className="flex flex-col items-center justify-center py-12 text-center">
        {/* Icon */}
        <div className="rounded-full bg-muted p-4 mb-4">
          <Icon className="h-8 w-8 text-muted-foreground" />
        </div>

        {/* Title */}
        <h3 className="text-lg font-semibold mb-2">{title}</h3>

        {/* Description */}
        <p className="text-muted-foreground mb-6 max-w-md">{description}</p>

        {/* Command (optional) */}
        {command && (
          <div className="flex items-center gap-2 bg-muted rounded-lg px-4 py-2 font-mono text-sm">
            <code className="text-foreground">{command}</code>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 shrink-0"
              onClick={handleCopy}
            >
              {copied ? (
                <Check className="h-4 w-4 text-green-500" />
              ) : (
                <Copy className="h-4 w-4" />
              )}
              <span className="sr-only">Copy command</span>
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
```

### 3.2 Usage Examples

```tsx
// No product overview
<EmptyState
  icon={FileText}
  title="No product overview yet"
  description="Run the product vision command to define your product's purpose, target users, and key features."
  command="/product-vision"
/>

// No roadmap
<EmptyState
  icon={Map}
  title="No roadmap defined"
  description="Create a roadmap to break down your product into phases and sections."
  command="/create-roadmap"
/>

// No features
<EmptyState
  icon={Layers}
  title="No features listed"
  description="Add features to your product overview to see them displayed here."
/>
```

### 3.3 Update Index Export

Update `src/components/shared/index.ts`:

```typescript
export { MarkdownRenderer } from "./MarkdownRenderer";
export { EmptyState } from "./EmptyState";
```

---

## Step 4: Create Overview Card Component

The Overview Card displays the product's core information: name, tagline, problem statement, and target users.

### 4.1 Create Directory Structure

```bash
mkdir -p src/components/plan
```

### 4.2 Create `src/components/plan/OverviewCard.tsx`

```tsx
import { Target, Users, Lightbulb } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { ProductOverview } from "@/types/product";

interface OverviewCardProps {
  overview: ProductOverview;
}

export function OverviewCard({ overview }: OverviewCardProps) {
  return (
    <Card>
      <CardHeader className="pb-4">
        {/* Product Name & Tagline */}
        <div className="space-y-1">
          <CardTitle className="text-3xl font-bold tracking-tight">
            {overview.name}
          </CardTitle>
          {overview.tagline && (
            <CardDescription className="text-lg">
              {overview.tagline}
            </CardDescription>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Problem Statement */}
        {overview.problem && (
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm font-medium">
              <Lightbulb className="h-4 w-4 text-amber-500" />
              <span>Problem Statement</span>
            </div>
            <p className="text-muted-foreground leading-relaxed pl-6">
              {overview.problem}
            </p>
          </div>
        )}

        {/* Target Users */}
        {overview.targetUsers && overview.targetUsers.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm font-medium">
              <Users className="h-4 w-4 text-blue-500" />
              <span>Target Users</span>
            </div>
            <div className="flex flex-wrap gap-2 pl-6">
              {overview.targetUsers.map((user, index) => (
                <Badge key={index} variant="secondary">
                  {user}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Success Metrics (optional) */}
        {overview.successMetrics && overview.successMetrics.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm font-medium">
              <Target className="h-4 w-4 text-green-500" />
              <span>Success Metrics</span>
            </div>
            <ul className="space-y-1 pl-6">
              {overview.successMetrics.map((metric, index) => (
                <li key={index} className="text-muted-foreground text-sm">
                  • {metric}
                </li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
```

### 4.3 Create Badge Component (if not exists from Phase 1)

If you don't have the Badge component yet, create `src/components/ui/badge.tsx`:

```tsx
import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary text-primary-foreground hover:bg-primary/80",
        secondary:
          "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive:
          "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80",
        outline: "text-foreground",
        success:
          "border-transparent bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100",
        warning:
          "border-transparent bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-100",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
```

### 4.4 Type Definition Reference

Ensure `src/types/product.ts` includes (from Phase 2):

```typescript
export interface ProductOverview {
  name: string;
  tagline?: string;
  problem?: string;
  targetUsers?: string[];
  successMetrics?: string[];
  rawContent: string; // Original markdown content
}
```

---

## Step 5: Create Features List Component

The Features List displays all product features as cards with icons and descriptions.

### 5.1 Create `src/components/plan/FeaturesList.tsx`

```tsx
import { 
  Boxes, 
  Calendar, 
  CreditCard, 
  FileText, 
  LayoutDashboard,
  MessageSquare,
  Settings,
  Shield,
  Users,
  Zap,
  LucideIcon 
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { Feature } from "@/types/product";

interface FeaturesListProps {
  features: Feature[];
}

// Map feature names/keywords to icons
const featureIconMap: Record<string, LucideIcon> = {
  patient: Users,
  user: Users,
  appointment: Calendar,
  schedule: Calendar,
  calendar: Calendar,
  billing: CreditCard,
  payment: CreditCard,
  invoice: CreditCard,
  treatment: FileText,
  dashboard: LayoutDashboard,
  analytics: LayoutDashboard,
  message: MessageSquare,
  chat: MessageSquare,
  notification: MessageSquare,
  settings: Settings,
  config: Settings,
  security: Shield,
  auth: Shield,
  integration: Zap,
  api: Zap,
};

function getFeatureIcon(featureName: string): LucideIcon {
  const lowerName = featureName.toLowerCase();
  
  for (const [keyword, icon] of Object.entries(featureIconMap)) {
    if (lowerName.includes(keyword)) {
      return icon;
    }
  }
  
  return Boxes; // Default icon
}

export function FeaturesList({ features }: FeaturesListProps) {
  if (!features || features.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold tracking-tight">Key Features</h2>
      
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {features.map((feature, index) => {
          const Icon = getFeatureIcon(feature.name);
          
          return (
            <Card key={index} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-2">
                <div className="flex items-center gap-3">
                  <div className="rounded-lg bg-primary/10 p-2">
                    <Icon className="h-5 w-5 text-primary" />
                  </div>
                  <CardTitle className="text-base">{feature.name}</CardTitle>
                </div>
              </CardHeader>
              {feature.description && (
                <CardContent>
                  <CardDescription className="text-sm leading-relaxed">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              )}
            </Card>
          );
        })}
      </div>
    </div>
  );
}
```

### 5.2 Add Feature Type Definition

Ensure `src/types/product.ts` includes:

```typescript
export interface Feature {
  name: string;
  description?: string;
  priority?: "high" | "medium" | "low";
  status?: "planned" | "in-progress" | "completed";
}
```

### 5.3 Update ProductOverview Type

Update `src/types/product.ts` to include features:

```typescript
export interface ProductOverview {
  name: string;
  tagline?: string;
  problem?: string;
  targetUsers?: string[];
  successMetrics?: string[];
  features?: Feature[];
  rawContent: string;
}
```

### 5.4 Feature Card Variations

The component supports different feature states. Optional enhancement with status badges:

```tsx
// Optional: Add status badge to feature cards
import { Badge } from "@/components/ui/badge";

// Inside the card, after CardTitle:
{feature.status && (
  <Badge 
    variant={
      feature.status === "completed" ? "success" :
      feature.status === "in-progress" ? "warning" : 
      "secondary"
    }
    className="text-xs"
  >
    {feature.status}
  </Badge>
)}
```

---

## Step 6: Create Roadmap Timeline Component

The Roadmap Timeline visualizes product phases and sections with completion status.

### 6.1 Create `src/components/plan/RoadmapTimeline.tsx`

```tsx
import { CheckCircle2, Circle, Clock, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { RoadmapSection } from "@/types/product";

interface RoadmapTimelineProps {
  sections: RoadmapSection[];
  onSectionClick?: (sectionId: string) => void;
}

type SectionStatus = "completed" | "in-progress" | "pending";

const statusConfig: Record<SectionStatus, {
  icon: typeof CheckCircle2;
  color: string;
  bgColor: string;
  label: string;
}> = {
  completed: {
    icon: CheckCircle2,
    color: "text-green-500",
    bgColor: "bg-green-500",
    label: "Completed",
  },
  "in-progress": {
    icon: Clock,
    color: "text-amber-500",
    bgColor: "bg-amber-500",
    label: "In Progress",
  },
  pending: {
    icon: Circle,
    color: "text-muted-foreground",
    bgColor: "bg-muted-foreground",
    label: "Pending",
  },
};

export function RoadmapTimeline({ sections, onSectionClick }: RoadmapTimelineProps) {
  if (!sections || sections.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold tracking-tight">Product Roadmap</h2>

      <div className="relative">
        {sections.map((section, index) => {
          const status = section.status || "pending";
          const config = statusConfig[status];
          const StatusIcon = config.icon;
          const isLast = index === sections.length - 1;

          return (
            <div key={section.id} className="relative flex gap-4 pb-8 last:pb-0">
              {/* Timeline Line */}
              {!isLast && (
                <div
                  className={cn(
                    "absolute left-[15px] top-[30px] w-0.5 h-[calc(100%-30px)]",
                    status === "completed" ? "bg-green-500" : "bg-border"
                  )}
                />
              )}

              {/* Status Icon */}
              <div
                className={cn(
                  "relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 bg-background",
                  status === "completed" && "border-green-500",
                  status === "in-progress" && "border-amber-500",
                  status === "pending" && "border-muted-foreground"
                )}
              >
                <StatusIcon className={cn("h-4 w-4", config.color)} />
              </div>

              {/* Section Card */}
              <Card
                className={cn(
                  "flex-1 cursor-pointer transition-all hover:shadow-md",
                  status === "in-progress" && "ring-2 ring-amber-500/20"
                )}
                onClick={() => onSectionClick?.(section.id)}
              >
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base">{section.name}</CardTitle>
                    <div className="flex items-center gap-2">
                      <Badge
                        variant={
                          status === "completed" ? "success" :
                          status === "in-progress" ? "warning" :
                          "secondary"
                        }
                      >
                        {config.label}
                      </Badge>
                      {section.priority && (
                        <Badge variant="outline" className="text-xs">
                          {section.priority}
                        </Badge>
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  {section.description && (
                    <CardDescription>{section.description}</CardDescription>
                  )}

                  {/* Screens/Milestones */}
                  {section.screens && section.screens.length > 0 && (
                    <div className="space-y-1">
                      <p className="text-xs font-medium text-muted-foreground">
                        Screens:
                      </p>
                      <div className="flex flex-wrap gap-1">
                        {section.screens.map((screen, idx) => (
                          <Badge key={idx} variant="outline" className="text-xs">
                            {screen}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Link to Designs Tab */}
                  {status !== "pending" && (
                    <Link
                      to={`/designs?section=${section.id}`}
                      className="inline-flex items-center gap-1 text-sm text-primary hover:underline"
                      onClick={(e) => e.stopPropagation()}
                    >
                      View in Designs
                      <ArrowRight className="h-3 w-3" />
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
```

### 6.2 Add RoadmapSection Type Definition

Update `src/types/product.ts`:

```typescript
export interface RoadmapSection {
  id: string;
  name: string;
  description?: string;
  status?: "completed" | "in-progress" | "pending";
  priority?: "high" | "medium" | "low";
  screens?: string[];
  phase?: number;
}

export interface ProductRoadmap {
  phases?: RoadmapPhase[];
  sections: RoadmapSection[];
  rawContent: string;
}

export interface RoadmapPhase {
  name: string;
  description?: string;
  sections: string[]; // Section IDs
}
```

### 6.3 Section Status Detection Logic

Create a utility to detect section completion status based on file existence.

Create `src/lib/section-status.ts`:

```typescript
import { getSectionIds, getSectionData } from "./section-loader";

type SectionStatus = "completed" | "in-progress" | "pending";

/**
 * Determines section status based on file existence:
 * - completed: Has components in src/sections/{id}/
 * - in-progress: Has spec.md in product/sections/{id}/
 * - pending: No files exist
 */
export function getSectionStatus(sectionId: string): SectionStatus {
  const sectionData = getSectionData(sectionId);
  
  // Check if section has implemented components
  const hasComponents = checkSectionComponents(sectionId);
  if (hasComponents) {
    return "completed";
  }
  
  // Check if section has spec file
  const hasSpec = sectionData?.spec !== undefined;
  if (hasSpec) {
    return "in-progress";
  }
  
  return "pending";
}

/**
 * Checks if a section has component implementations
 */
function checkSectionComponents(sectionId: string): boolean {
  // Uses import.meta.glob to check for component files
  const componentFiles = import.meta.glob("/src/sections/*/components/*.tsx", {
    eager: false,
  });
  
  const sectionPattern = `/src/sections/${sectionId}/components/`;
  return Object.keys(componentFiles).some((path) =>
    path.startsWith(sectionPattern)
  );
}

/**
 * Get status summary for all sections
 */
export function getAllSectionStatuses(): Record<string, SectionStatus> {
  const sectionIds = getSectionIds();
  const statuses: Record<string, SectionStatus> = {};
  
  for (const id of sectionIds) {
    statuses[id] = getSectionStatus(id);
  }
  
  return statuses;
}
```

### 6.4 Roadmap Progress Summary Component (Optional)

Add a progress summary above the timeline:

```tsx
// Add to RoadmapTimeline.tsx or create separate component

interface RoadmapProgressProps {
  sections: RoadmapSection[];
}

export function RoadmapProgress({ sections }: RoadmapProgressProps) {
  const completed = sections.filter((s) => s.status === "completed").length;
  const inProgress = sections.filter((s) => s.status === "in-progress").length;
  const pending = sections.filter((s) => s.status === "pending").length;
  const total = sections.length;
  const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;

  return (
    <div className="flex items-center gap-4 mb-4 p-4 bg-muted/50 rounded-lg">
      <div className="flex-1">
        <div className="flex justify-between text-sm mb-1">
          <span className="font-medium">Overall Progress</span>
          <span className="text-muted-foreground">{percentage}%</span>
        </div>
        <div className="h-2 bg-muted rounded-full overflow-hidden">
          <div
            className="h-full bg-primary transition-all duration-500"
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>
      <div className="flex gap-4 text-sm">
        <div className="flex items-center gap-1">
          <div className="h-2 w-2 rounded-full bg-green-500" />
          <span>{completed} Done</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="h-2 w-2 rounded-full bg-amber-500" />
          <span>{inProgress} Active</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="h-2 w-2 rounded-full bg-muted-foreground" />
          <span>{pending} Pending</span>
        </div>
      </div>
    </div>
  );
}
```

---

## Step 7: Assemble Plan Page

Now we combine all components into the main Plan page.

### 7.1 Update `src/pages/PlanPage.tsx`

```tsx
import { FileText, Map } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { loadProductOverview, loadProductRoadmap } from "@/lib/product-loader";
import { getSectionStatus } from "@/lib/section-status";
import { OverviewCard } from "@/components/plan/OverviewCard";
import { FeaturesList } from "@/components/plan/FeaturesList";
import { RoadmapTimeline, RoadmapProgress } from "@/components/plan/RoadmapTimeline";
import { EmptyState } from "@/components/shared/EmptyState";
import { MarkdownRenderer } from "@/components/shared/MarkdownRenderer";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { RoadmapSection } from "@/types/product";

export default function PlanPage() {
  const navigate = useNavigate();

  // Load product data
  const overview = loadProductOverview();
  const roadmap = loadProductRoadmap();

  // Enrich roadmap sections with status
  const sectionsWithStatus: RoadmapSection[] = roadmap?.sections.map((section) => ({
    ...section,
    status: section.status || getSectionStatus(section.id),
  })) || [];

  // Handle section click - navigate to designs tab
  const handleSectionClick = (sectionId: string) => {
    navigate(`/designs?section=${sectionId}`);
  };

  // Check if we have any data
  const hasOverview = overview !== null;
  const hasRoadmap = roadmap !== null && roadmap.sections.length > 0;
  const hasFeatures = overview?.features && overview.features.length > 0;

  return (
    <div className="container mx-auto py-6 px-4 max-w-5xl">
      <div className="space-y-8">
        {/* Page Header */}
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Plan</h1>
          <p className="text-muted-foreground mt-1">
            Product vision, features, and roadmap
          </p>
        </div>

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
          // Has data - show tabs or sections
          <Tabs defaultValue="overview" className="space-y-6">
            <TabsList>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="roadmap">Roadmap</TabsTrigger>
              <TabsTrigger value="raw">Raw Markdown</TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-8">
              {hasOverview ? (
                <>
                  <OverviewCard overview={overview} />
                  
                  {hasFeatures && (
                    <FeaturesList features={overview.features!} />
                  )}
                </>
              ) : (
                <EmptyState
                  icon={FileText}
                  title="No product overview"
                  description="Create a product overview to see it displayed here."
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
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Product Overview</h3>
                  <div className="border rounded-lg p-6 bg-card">
                    <MarkdownRenderer content={overview.rawContent} />
                  </div>
                </div>
              )}
              
              {hasRoadmap && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Product Roadmap</h3>
                  <div className="border rounded-lg p-6 bg-card">
                    <MarkdownRenderer content={roadmap.rawContent} />
                  </div>
                </div>
              )}
            </TabsContent>
          </Tabs>
        )}
      </div>
    </div>
  );
}
```

### 7.2 Create Tabs Component (if not exists)

Create `src/components/ui/tabs.tsx`:

```tsx
import * as React from "react";
import * as TabsPrimitive from "@radix-ui/react-tabs";
import { cn } from "@/lib/utils";

const Tabs = TabsPrimitive.Root;

const TabsList = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.List>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.List>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.List
    ref={ref}
    className={cn(
      "inline-flex h-10 items-center justify-center rounded-md bg-muted p-1 text-muted-foreground",
      className
    )}
    {...props}
  />
));
TabsList.displayName = TabsPrimitive.List.displayName;

const TabsTrigger = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Trigger
    ref={ref}
    className={cn(
      "inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm",
      className
    )}
    {...props}
  />
));
TabsTrigger.displayName = TabsPrimitive.Trigger.displayName;

const TabsContent = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Content>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Content
    ref={ref}
    className={cn(
      "mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
      className
    )}
    {...props}
  />
));
TabsContent.displayName = TabsPrimitive.Content.displayName;

export { Tabs, TabsList, TabsTrigger, TabsContent };
```

### 7.3 Install Radix Tabs (if not installed)

```bash
npm install @radix-ui/react-tabs
```

### 7.4 Create Plan Component Index

Create `src/components/plan/index.ts`:

```typescript
export { OverviewCard } from "./OverviewCard";
export { FeaturesList } from "./FeaturesList";
export { RoadmapTimeline, RoadmapProgress } from "./RoadmapTimeline";
```

### 7.5 Page Layout Structure

The Plan page follows this visual structure:

```
┌─────────────────────────────────────────────────────┐
│  Plan                                               │
│  Product vision, features, and roadmap              │
├─────────────────────────────────────────────────────┤
│  [Overview] [Roadmap] [Raw Markdown]                │
├─────────────────────────────────────────────────────┤
│                                                     │
│  ┌───────────────────────────────────────────────┐  │
│  │  Product Name                                 │  │
│  │  Tagline goes here                            │  │
│  │                                               │  │
│  │  💡 Problem Statement                         │  │
│  │  Description of the problem...                │  │
│  │                                               │  │
│  │  👥 Target Users                              │  │
│  │  [User A] [User B] [User C]                   │  │
│  └───────────────────────────────────────────────┘  │
│                                                     │
│  Key Features                                       │
│  ┌─────────┐ ┌─────────┐ ┌─────────┐               │
│  │ 📅      │ │ 👤      │ │ 💳      │               │
│  │Feature 1│ │Feature 2│ │Feature 3│               │
│  │ desc... │ │ desc... │ │ desc... │               │
│  └─────────┘ └─────────┘ └─────────┘               │
│                                                     │
└─────────────────────────────────────────────────────┘
```

---

## Step 8: Add Loading States

Create skeleton loaders for a better user experience while content loads.

### 8.1 Create `src/components/shared/Skeleton.tsx`

```tsx
import { cn } from "@/lib/utils";

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {}

export function Skeleton({ className, ...props }: SkeletonProps) {
  return (
    <div
      className={cn("animate-pulse rounded-md bg-muted", className)}
      {...props}
    />
  );
}
```

### 8.2 Create `src/components/plan/OverviewCardSkeleton.tsx`

```tsx
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/shared/Skeleton";

export function OverviewCardSkeleton() {
  return (
    <Card>
      <CardHeader className="pb-4">
        <div className="space-y-2">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-5 w-96" />
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Problem Statement Skeleton */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Skeleton className="h-4 w-4 rounded-full" />
            <Skeleton className="h-4 w-32" />
          </div>
          <div className="pl-6 space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </div>
        </div>

        {/* Target Users Skeleton */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Skeleton className="h-4 w-4 rounded-full" />
            <Skeleton className="h-4 w-24" />
          </div>
          <div className="flex gap-2 pl-6">
            <Skeleton className="h-6 w-24 rounded-full" />
            <Skeleton className="h-6 w-20 rounded-full" />
            <Skeleton className="h-6 w-28 rounded-full" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
```

### 8.3 Create `src/components/plan/FeaturesListSkeleton.tsx`

```tsx
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/shared/Skeleton";

export function FeaturesListSkeleton() {
  return (
    <div className="space-y-4">
      <Skeleton className="h-6 w-32" />
      
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <Card key={i}>
            <CardHeader className="pb-2">
              <div className="flex items-center gap-3">
                <Skeleton className="h-9 w-9 rounded-lg" />
                <Skeleton className="h-5 w-32" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-2/3" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
```

### 8.4 Create `src/components/plan/RoadmapTimelineSkeleton.tsx`

```tsx
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/shared/Skeleton";

export function RoadmapTimelineSkeleton() {
  return (
    <div className="space-y-4">
      <Skeleton className="h-6 w-40" />

      <div className="relative">
        {[1, 2, 3].map((i, index) => (
          <div key={i} className="relative flex gap-4 pb-8 last:pb-0">
            {/* Timeline Line */}
            {index < 2 && (
              <div className="absolute left-[15px] top-[30px] w-0.5 h-[calc(100%-30px)] bg-border" />
            )}

            {/* Status Icon Skeleton */}
            <Skeleton className="h-8 w-8 rounded-full shrink-0" />

            {/* Section Card Skeleton */}
            <Card className="flex-1">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <Skeleton className="h-5 w-32" />
                  <Skeleton className="h-5 w-20 rounded-full" />
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
                <div className="flex gap-1">
                  <Skeleton className="h-5 w-16 rounded-full" />
                  <Skeleton className="h-5 w-20 rounded-full" />
                </div>
              </CardContent>
            </Card>
          </div>
        ))}
      </div>
    </div>
  );
}
```

### 8.5 Create PlanPage Loading State

Update `src/pages/PlanPage.tsx` to include loading state:

```tsx
import { useState, useEffect } from "react";
// ... other imports

export default function PlanPage() {
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  // Simulate initial load (in practice, this would be actual async loading)
  useEffect(() => {
    // Short timeout to show loading state
    const timer = setTimeout(() => setIsLoading(false), 100);
    return () => clearTimeout(timer);
  }, []);

  // Load product data
  const overview = loadProductOverview();
  const roadmap = loadProductRoadmap();

  // ... rest of the component

  if (isLoading) {
    return (
      <div className="container mx-auto py-6 px-4 max-w-5xl">
        <div className="space-y-8">
          <div>
            <Skeleton className="h-9 w-24" />
            <Skeleton className="h-5 w-64 mt-2" />
          </div>
          <OverviewCardSkeleton />
          <FeaturesListSkeleton />
        </div>
      </div>
    );
  }

  // ... rest of the render
}
```

### 8.6 Update Shared Index

Update `src/components/shared/index.ts`:

```typescript
export { MarkdownRenderer } from "./MarkdownRenderer";
export { EmptyState } from "./EmptyState";
export { Skeleton } from "./Skeleton";
```

---

## Verification Checklist

After completing Phase 3, verify the following:

### Functional Tests

- [ ] **Navigate to Plan tab** — Tab is accessible from the main navigation
- [ ] **Empty state displays** — When no product files exist, empty state shows with command prompt
- [ ] **Copy command works** — Clicking copy button copies the command to clipboard
- [ ] **Overview card renders** — Product name, tagline, problem, and users display correctly
- [ ] **Features list renders** — All features display as cards with appropriate icons
- [ ] **Roadmap timeline renders** — Sections display with timeline visualization
- [ ] **Section status detection** — Completed/in-progress/pending status shows correctly
- [ ] **Tab switching works** — Overview, Roadmap, and Raw Markdown tabs function
- [ ] **Raw markdown renders** — Original markdown content displays with proper formatting
- [ ] **Section click navigates** — Clicking a section navigates to Designs tab
- [ ] **Progress bar accurate** — Overall progress percentage is calculated correctly
- [ ] **Dark mode works** — All components display correctly in dark mode

### Visual Tests

- [ ] **Responsive on mobile** — Layout adapts to smaller screens
- [ ] **Responsive on tablet** — Grid layouts adjust appropriately
- [ ] **Loading skeletons appear** — Brief loading state shows on initial load
- [ ] **Cards have hover states** — Interactive elements have visual feedback
- [ ] **Typography is consistent** — Font sizes and weights follow design system
- [ ] **Colors are correct** — Status colors (green/amber/gray) display properly

### Error Handling

- [ ] **Missing files handled** — App doesn't crash if product files are missing
- [ ] **Malformed markdown handled** — Invalid markdown doesn't break rendering
- [ ] **Empty arrays handled** — Empty features/sections arrays show appropriate state

### Commands to Run

```bash
# Start development server
npm run dev

# Navigate to http://localhost:5173

# Test with sample files
# 1. Ensure product/product-overview.md exists
# 2. Ensure product/product-roadmap.md exists
# 3. Refresh the page

# Test without files
# 1. Rename or delete product/ folder
# 2. Refresh - should see empty state

# Test dark mode
# 1. Click theme toggle
# 2. Verify all components render correctly
```

---

## File Structure Summary

After completing Phase 3, your project should have these new and modified files:

### New Files Created

```
src/
├── components/
│   ├── shared/
│   │   ├── index.ts                    # Shared component exports
│   │   ├── MarkdownRenderer.tsx        # Markdown to React renderer
│   │   ├── EmptyState.tsx              # Empty state with command prompt
│   │   └── Skeleton.tsx                # Loading skeleton component
│   │
│   ├── plan/
│   │   ├── index.ts                    # Plan component exports
│   │   ├── OverviewCard.tsx            # Product overview display
│   │   ├── OverviewCardSkeleton.tsx    # Loading skeleton for overview
│   │   ├── FeaturesList.tsx            # Features grid display
│   │   ├── FeaturesListSkeleton.tsx    # Loading skeleton for features
│   │   ├── RoadmapTimeline.tsx         # Timeline visualization
│   │   └── RoadmapTimelineSkeleton.tsx # Loading skeleton for timeline
│   │
│   └── ui/
│       ├── badge.tsx                   # Badge component (if new)
│       └── tabs.tsx                    # Tabs component (if new)
│
├── lib/
│   └── section-status.ts               # Section completion detection
│
└── pages/
    └── PlanPage.tsx                    # Updated with all components
```

### Modified Files

```
src/
├── types/
│   └── product.ts                      # Added Feature, RoadmapSection types
│
└── components/
    └── ui/
        └── card.tsx                    # May need CardDescription export
```

### Dependencies Added

```json
{
  "dependencies": {
    "react-markdown": "^9.x",
    "remark-gfm": "^4.x",
    "@radix-ui/react-tabs": "^1.x"
  }
}
```

---

## Type Definitions Summary

Ensure `src/types/product.ts` includes all required types:

```typescript
// Product Overview
export interface ProductOverview {
  name: string;
  tagline?: string;
  problem?: string;
  targetUsers?: string[];
  successMetrics?: string[];
  features?: Feature[];
  rawContent: string;
}

// Feature
export interface Feature {
  name: string;
  description?: string;
  priority?: "high" | "medium" | "low";
  status?: "planned" | "in-progress" | "completed";
}

// Roadmap
export interface ProductRoadmap {
  phases?: RoadmapPhase[];
  sections: RoadmapSection[];
  rawContent: string;
}

export interface RoadmapPhase {
  name: string;
  description?: string;
  sections: string[];
}

export interface RoadmapSection {
  id: string;
  name: string;
  description?: string;
  status?: "completed" | "in-progress" | "pending";
  priority?: "high" | "medium" | "low";
  screens?: string[];
  phase?: number;
}
```

---

## Phase 3 Deliverable Summary

✅ **Working Plan tab with:**

| Feature | Status |
|---------|--------|
| Product overview display | ✅ |
| Tagline and problem statement | ✅ |
| Target users as badges | ✅ |
| Success metrics list | ✅ |
| Features list with icons | ✅ |
| Roadmap timeline visualization | ✅ |
| Section status detection | ✅ |
| Progress bar summary | ✅ |
| Empty states when no data | ✅ |
| Markdown rendering | ✅ |
| Tab navigation (Overview/Roadmap/Raw) | ✅ |
| Loading skeletons | ✅ |
| Dark mode support | ✅ |
| Responsive design | ✅ |

---

## Next Steps

After completing Phase 3:

1. **Test thoroughly** — Verify all functionality with sample data
2. **Test edge cases** — Empty files, malformed markdown, missing fields
3. **Review styling** — Ensure consistency with design system
4. **Move to Phase 4** — Data Tab (Schema Visualization with Mermaid.js)

---

*End of Phase 3 Implementation Plan*
