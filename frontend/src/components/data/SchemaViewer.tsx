/**
 * Schema Viewer Component
 * 
 * A comprehensive schema visualization combining ERD diagram with
 * an interactive model list sidebar. Features zoom controls,
 * model selection, and detailed field inspection.
 * 
 * Aesthetic: Technical precision with clear visual hierarchy
 */

import { useState } from "react";
import {
  Database,
  Table2,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Layers,
  Key,
  Link2,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent } from "@/components/ui/card";
import { MermaidDiagram } from "@/components/shared/MermaidDiagram";
import { ModelCardCompact } from "./ModelCard";
import { generateMermaidERD, generateModelSummary } from "@/lib/mermaid-generator";
import type { PrismaModel } from "@/types/schema";

interface SchemaViewerProps {
  models: PrismaModel[];
  className?: string;
}

export function SchemaViewer({ models, className }: SchemaViewerProps) {
  const [selectedModel, setSelectedModel] = useState<string | null>(null);
  const [zoom, setZoom] = useState(100);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // Generate Mermaid ERD from models
  const mermaidChart = generateMermaidERD(models);

  const handleZoomIn = () => setZoom((prev) => Math.min(prev + 20, 200));
  const handleZoomOut = () => setZoom((prev) => Math.max(prev - 20, 40));
  const handleZoomReset = () => setZoom(100);

  const selectedModelData = models.find((m) => m.name === selectedModel);
  const modelSummary = selectedModelData
    ? generateModelSummary(selectedModelData)
    : null;

  // Calculate overall stats
  const totalFields = models.reduce(
    (acc, m) => acc + m.fields.filter((f) => !f.isRelation).length,
    0
  );
  const totalRelations = models.reduce(
    (acc, m) => acc + (m.relations?.length ?? 0),
    0
  );

  return (
    <div className={cn("flex h-full overflow-hidden", className)}>
      {/* Main ERD Diagram Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Toolbar */}
        <div className="flex items-center justify-between px-4 py-3 border-b bg-gradient-to-r from-muted/30 to-muted/10">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-primary/10">
              <Database className="h-4 w-4 text-primary" />
              <span className="text-sm font-semibold text-primary">
                ERD Diagram
              </span>
            </div>

            {/* Stats pills */}
            <div className="hidden md:flex items-center gap-2 text-xs text-muted-foreground">
              <div className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-muted/50">
                <Layers className="h-3 w-3" />
                <span>{models.length} models</span>
              </div>
              <div className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-muted/50">
                <Table2 className="h-3 w-3" />
                <span>{totalFields} fields</span>
              </div>
              <div className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-muted/50">
                <Link2 className="h-3 w-3" />
                <span>{Math.floor(totalRelations / 2)} relations</span>
              </div>
            </div>
          </div>

          {/* Zoom Controls */}
          <div className="flex items-center gap-1 bg-muted/50 rounded-lg p-1">
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7"
              onClick={handleZoomOut}
              disabled={zoom <= 40}
            >
              <ZoomOut className="h-3.5 w-3.5" />
            </Button>
            
            <button
              onClick={handleZoomReset}
              className="px-2 min-w-[3.5rem] text-xs font-mono text-muted-foreground hover:text-foreground transition-colors"
            >
              {zoom}%
            </button>
            
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7"
              onClick={handleZoomIn}
              disabled={zoom >= 200}
            >
              <ZoomIn className="h-3.5 w-3.5" />
            </Button>
            
            <div className="w-px h-4 bg-border mx-1" />
            
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7"
              onClick={handleZoomReset}
              title="Reset zoom"
            >
              <Maximize2 className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>

        {/* Diagram Container */}
        <div className="flex-1 overflow-auto p-6 bg-gradient-to-br from-background via-muted/5 to-muted/10">
          <div
            className="min-w-fit transition-transform duration-200 ease-out"
            style={{
              transform: `scale(${zoom / 100})`,
              transformOrigin: "top left",
            }}
          >
            <MermaidDiagram chart={mermaidChart} />
          </div>
        </div>
      </div>

      {/* Model List Sidebar */}
      <div
        className={cn(
          "border-l flex flex-col bg-gradient-to-b from-background to-muted/5 transition-all duration-300",
          sidebarCollapsed ? "w-12" : "w-80"
        )}
      >
        {/* Sidebar Header */}
        <div className="flex items-center justify-between p-3 border-b bg-muted/20">
          {!sidebarCollapsed && (
            <div className="flex items-center gap-2">
              <Table2 className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-semibold">Models</span>
            </div>
          )}
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7"
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
          >
            <ChevronRight
              className={cn(
                "h-4 w-4 transition-transform",
                !sidebarCollapsed && "rotate-180"
              )}
            />
          </Button>
        </div>

        {!sidebarCollapsed && (
          <>
            {/* Model List */}
            <ScrollArea className="flex-1">
              <div className="p-3 space-y-2">
                {models.map((model) => (
                  <ModelCardCompact
                    key={model.name}
                    model={model}
                    isSelected={selectedModel === model.name}
                    onClick={() =>
                      setSelectedModel(
                        selectedModel === model.name ? null : model.name
                      )
                    }
                  />
                ))}
              </div>
            </ScrollArea>

            {/* Selected Model Details */}
            {selectedModelData && modelSummary && (
              <div className="border-t bg-gradient-to-t from-muted/30 to-muted/10 p-4">
                <div className="flex items-center gap-2 mb-3">
                  <div className="h-2 w-2 rounded-full bg-primary animate-pulse" />
                  <h4 className="text-sm font-semibold">
                    {selectedModelData.name}
                  </h4>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <StatCard
                    icon={Table2}
                    label="Fields"
                    value={modelSummary.fieldCount}
                  />
                  <StatCard
                    icon={Link2}
                    label="Relations"
                    value={modelSummary.relationCount}
                  />
                  <StatCard
                    icon={Key}
                    label="Primary Key"
                    value={modelSummary.hasPrimaryKey ? "Yes" : "No"}
                    valueColor={modelSummary.hasPrimaryKey ? "text-green-500" : "text-muted-foreground"}
                  />
                  <StatCard
                    icon={Link2}
                    label="Foreign Keys"
                    value={modelSummary.foreignKeyCount}
                  />
                </div>
              </div>
            )}
          </>
        )}

        {/* Collapsed state - just icons */}
        {sidebarCollapsed && (
          <div className="flex-1 flex flex-col items-center pt-3 gap-2">
            {models.slice(0, 8).map((model) => (
              <button
                key={model.name}
                className={cn(
                  "w-8 h-8 rounded-lg flex items-center justify-center text-xs font-semibold",
                  "hover:bg-muted transition-colors",
                  selectedModel === model.name && "bg-primary/10 text-primary"
                )}
                onClick={() => setSelectedModel(model.name)}
                title={model.name}
              >
                {model.name.charAt(0)}
              </button>
            ))}
            {models.length > 8 && (
              <span className="text-xs text-muted-foreground">
                +{models.length - 8}
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

interface StatCardProps {
  icon: typeof Database;
  label: string;
  value: string | number;
  valueColor?: string;
}

function StatCard({ icon: Icon, label, value, valueColor }: StatCardProps) {
  return (
    <Card className="bg-card/50">
      <CardContent className="p-2">
        <div className="flex items-center gap-2">
          <Icon className="h-3 w-3 text-muted-foreground" />
          <span className="text-xs text-muted-foreground">{label}</span>
        </div>
        <p className={cn("text-sm font-semibold mt-1", valueColor)}>
          {value}
        </p>
      </CardContent>
    </Card>
  );
}

/**
 * Schema Viewer Skeleton for loading states
 */
export function SchemaViewerSkeleton({ className }: { className?: string }) {
  return (
    <div className={cn("flex h-full", className)}>
      {/* Diagram skeleton */}
      <div className="flex-1 flex flex-col">
        <div className="p-3 border-b bg-muted/30">
          <div className="h-6 w-48 bg-muted rounded-lg animate-pulse" />
        </div>
        <div className="flex-1 p-6">
          <div className="h-full bg-gradient-to-br from-muted/30 to-muted/10 rounded-xl animate-pulse" />
        </div>
      </div>

      {/* Sidebar skeleton */}
      <div className="w-80 border-l bg-muted/5">
        <div className="p-3 border-b">
          <div className="h-5 w-20 bg-muted rounded animate-pulse" />
        </div>
        <div className="p-3 space-y-3">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="h-28 bg-muted/50 rounded-lg animate-pulse"
              style={{ animationDelay: `${i * 100}ms` }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
