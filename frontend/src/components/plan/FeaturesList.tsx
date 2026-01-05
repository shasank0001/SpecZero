/**
 * Features List Component
 * 
 * Displays product features as refined cards with contextual icons.
 * Features staggered animations and hover states.
 * 
 * Aesthetic: Grid of elegant feature cards with icon accents
 */

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
  Database,
  Search,
  Bell,
  ChartBar,
  Layers,
  Workflow,
  type LucideIcon 
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { Feature } from "@/types/product";
import { cn } from "@/lib/utils";

interface FeaturesListProps {
  features: Feature[];
  className?: string;
}

// Map feature names/keywords to icons with colors
const featureIconMap: Record<string, { icon: LucideIcon; color: string; bgColor: string }> = {
  patient: { icon: Users, color: "text-blue-500", bgColor: "bg-blue-500/10" },
  user: { icon: Users, color: "text-blue-500", bgColor: "bg-blue-500/10" },
  appointment: { icon: Calendar, color: "text-violet-500", bgColor: "bg-violet-500/10" },
  schedule: { icon: Calendar, color: "text-violet-500", bgColor: "bg-violet-500/10" },
  calendar: { icon: Calendar, color: "text-violet-500", bgColor: "bg-violet-500/10" },
  billing: { icon: CreditCard, color: "text-emerald-500", bgColor: "bg-emerald-500/10" },
  payment: { icon: CreditCard, color: "text-emerald-500", bgColor: "bg-emerald-500/10" },
  invoice: { icon: CreditCard, color: "text-emerald-500", bgColor: "bg-emerald-500/10" },
  treatment: { icon: FileText, color: "text-rose-500", bgColor: "bg-rose-500/10" },
  record: { icon: FileText, color: "text-rose-500", bgColor: "bg-rose-500/10" },
  dashboard: { icon: LayoutDashboard, color: "text-amber-500", bgColor: "bg-amber-500/10" },
  analytics: { icon: ChartBar, color: "text-cyan-500", bgColor: "bg-cyan-500/10" },
  report: { icon: ChartBar, color: "text-cyan-500", bgColor: "bg-cyan-500/10" },
  message: { icon: MessageSquare, color: "text-pink-500", bgColor: "bg-pink-500/10" },
  chat: { icon: MessageSquare, color: "text-pink-500", bgColor: "bg-pink-500/10" },
  notification: { icon: Bell, color: "text-orange-500", bgColor: "bg-orange-500/10" },
  alert: { icon: Bell, color: "text-orange-500", bgColor: "bg-orange-500/10" },
  settings: { icon: Settings, color: "text-slate-500", bgColor: "bg-slate-500/10" },
  config: { icon: Settings, color: "text-slate-500", bgColor: "bg-slate-500/10" },
  security: { icon: Shield, color: "text-red-500", bgColor: "bg-red-500/10" },
  auth: { icon: Shield, color: "text-red-500", bgColor: "bg-red-500/10" },
  integration: { icon: Zap, color: "text-yellow-500", bgColor: "bg-yellow-500/10" },
  api: { icon: Zap, color: "text-yellow-500", bgColor: "bg-yellow-500/10" },
  data: { icon: Database, color: "text-indigo-500", bgColor: "bg-indigo-500/10" },
  database: { icon: Database, color: "text-indigo-500", bgColor: "bg-indigo-500/10" },
  search: { icon: Search, color: "text-teal-500", bgColor: "bg-teal-500/10" },
  workflow: { icon: Workflow, color: "text-purple-500", bgColor: "bg-purple-500/10" },
  automation: { icon: Workflow, color: "text-purple-500", bgColor: "bg-purple-500/10" },
};

const defaultIconConfig = { icon: Boxes, color: "text-primary", bgColor: "bg-primary/10" };

function getFeatureIconConfig(featureName: string): { icon: LucideIcon; color: string; bgColor: string } {
  const lowerName = featureName.toLowerCase();
  
  for (const [keyword, config] of Object.entries(featureIconMap)) {
    if (lowerName.includes(keyword)) {
      return config;
    }
  }
  
  return defaultIconConfig;
}

export function FeaturesList({ features, className }: FeaturesListProps) {
  if (!features || features.length === 0) {
    return null;
  }

  return (
    <div className={cn("space-y-6", className)}>
      {/* Section Header */}
      <div className="flex items-center gap-3">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
          <Layers className="h-4 w-4" />
        </div>
        <h2 className="font-display text-xl font-semibold tracking-tight text-foreground">
          Key Features
        </h2>
        <Badge variant="muted" size="sm" className="ml-auto">
          {features.length} {features.length === 1 ? "feature" : "features"}
        </Badge>
      </div>
      
      {/* Features Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {features.map((feature, index) => {
          const iconConfig = getFeatureIconConfig(feature.name);
          const Icon = iconConfig.icon;
          
          return (
            <Card 
              key={index} 
              className={cn(
                "group relative overflow-hidden",
                "hover:shadow-lg hover:border-border transition-all duration-300",
                "animate-fade-up"
              )}
              style={{ animationDelay: `${index * 50}ms` }}
            >
              {/* Subtle gradient overlay on hover */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              
              <CardHeader className="pb-3 relative">
                <div className="flex items-start gap-3">
                  <div className={cn(
                    "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl transition-colors",
                    iconConfig.bgColor,
                    "group-hover:scale-110 transition-transform duration-300"
                  )}>
                    <Icon className={cn("h-5 w-5", iconConfig.color)} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <CardTitle className="text-base font-semibold leading-tight">
                      {feature.name}
                    </CardTitle>
                    {feature.priority && (
                      <Badge 
                        variant={
                          feature.priority === "high" ? "info" :
                          feature.priority === "medium" ? "warning" : 
                          "muted"
                        }
                        size="sm"
                        className="mt-1.5"
                      >
                        {feature.priority} priority
                      </Badge>
                    )}
                  </div>
                </div>
              </CardHeader>
              
              {feature.description && (
                <CardContent className="relative">
                  <CardDescription className="text-sm leading-relaxed line-clamp-3">
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
