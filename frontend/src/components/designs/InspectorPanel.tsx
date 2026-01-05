import { cn } from "@/lib/utils";
import { DataInspector } from "./DataInspector";
import { 
  CheckCircle2, 
  Info,
  Box,
  FileCode2,
} from "lucide-react";

export interface InspectorPanelProps {
  screenName?: string;
  sectionId?: string;
  sampleData?: unknown;
  className?: string;
}

/**
 * InspectorPanel - Right sidebar showing component info and sample data
 */
export function InspectorPanel({
  screenName,
  sectionId,
  sampleData,
  className,
}: InspectorPanelProps) {
  return (
    <div className={cn("flex flex-col h-full", className)}>
      {/* Header */}
      <div className="px-4 py-4 border-b border-border">
        <h3 className="font-semibold text-foreground">Inspector</h3>
        {screenName && (
          <p className="text-sm text-muted-foreground mt-0.5">
            {sectionId && <span className="text-muted-foreground/60">{sectionId}/</span>}
            {screenName}
          </p>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto p-4 space-y-4">
        {screenName ? (
          <>
            {/* Component Info */}
            <div className="rounded-xl border border-border p-4">
              <div className="flex items-center gap-2 mb-3">
                <Box className="w-4 h-4 text-primary" />
                <h4 className="text-sm font-medium">Component</h4>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Name</span>
                  <code className="font-mono text-xs bg-muted px-2 py-0.5 rounded">
                    {screenName}
                  </code>
                </div>
                {sectionId && (
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Section</span>
                    <code className="font-mono text-xs bg-muted px-2 py-0.5 rounded">
                      {sectionId}
                    </code>
                  </div>
                )}
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Path</span>
                  <code className="font-mono text-[10px] text-muted-foreground truncate max-w-[150px]">
                    src/sections/{sectionId}/{screenName}.tsx
                  </code>
                </div>
              </div>
            </div>

            {/* Props-Based Check */}
            <div className="rounded-xl border border-green-200 dark:border-green-900 bg-green-50 dark:bg-green-950/30 p-4">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-medium text-green-700 dark:text-green-300">
                    Props-Based Component
                  </h4>
                  <p className="text-xs text-green-600/80 dark:text-green-400/80 mt-1">
                    This component receives data via props and is safe for export.
                  </p>
                </div>
              </div>
            </div>

            {/* Sample Data */}
            {sampleData && (
              <DataInspector data={sampleData} title="Sample Data" />
            )}

            {/* File Info */}
            <div className="rounded-xl border border-border p-4">
              <div className="flex items-center gap-2 mb-3">
                <FileCode2 className="w-4 h-4 text-primary" />
                <h4 className="text-sm font-medium">Files</h4>
              </div>
              <div className="space-y-2 text-xs">
                <div className="flex items-center gap-2 p-2 rounded-lg bg-muted/50">
                  <div className="w-2 h-2 rounded-full bg-green-500" />
                  <span className="font-mono text-muted-foreground">
                    {screenName}.tsx
                  </span>
                </div>
                <div className="flex items-center gap-2 p-2 rounded-lg bg-muted/50">
                  <div className="w-2 h-2 rounded-full bg-blue-500" />
                  <span className="font-mono text-muted-foreground">
                    components/index.ts
                  </span>
                </div>
              </div>
            </div>
          </>
        ) : (
          /* Empty State */
          <div className="flex flex-col items-center justify-center h-full text-center p-6">
            <div className="w-12 h-12 rounded-xl bg-muted/50 flex items-center justify-center mb-3">
              <Info className="w-6 h-6 text-muted-foreground/50" />
            </div>
            <p className="text-sm font-medium text-muted-foreground mb-1">
              No screen selected
            </p>
            <p className="text-xs text-muted-foreground/70">
              Select a screen from the sidebar to see details
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
