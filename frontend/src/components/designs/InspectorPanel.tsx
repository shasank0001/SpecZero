import { cn } from "@/lib/utils";
import { DataInspector } from "./DataInspector";
import { 
  CheckCircle2, 
  Info,
  Box,
  FileCode2,
  Eye,
} from "lucide-react";

export interface InspectorPanelProps {
  screenName?: string;
  sectionId?: string;
  sampleData?: unknown;
  className?: string;
}

/**
 * InspectorPanel - Bottom panel showing component info and sample data
 */
export function InspectorPanel({
  screenName,
  sectionId,
  sampleData,
  className,
}: InspectorPanelProps) {
  return (
    <div className={cn("flex bg-background", className)}>
      {/* Header */}
      <div className="px-6 py-4 border-r border-border flex items-center gap-3 min-w-[200px] bg-muted/30">
        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
          <Eye className="w-5 h-5 text-primary" />
        </div>
        <div className="min-w-0">
          <h3 className="text-base font-bold text-foreground">Inspector</h3>
          {screenName ? (
            <p className="text-sm text-primary font-medium truncate">
              {sectionId ? `${sectionId}/` : ''}{screenName}
            </p>
          ) : (
            <p className="text-sm text-muted-foreground">No selection</p>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-x-auto bg-muted/10">
        {screenName ? (
          <div className="flex gap-6 p-5 items-start">
            {/* Component Info */}
            <div className="rounded-xl border-2 border-border bg-background shadow-sm p-5 min-w-[280px]">
              <div className="flex items-center gap-3 mb-4 pb-3 border-b border-border">
                <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center">
                  <Box className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                </div>
                <h4 className="text-base font-semibold text-foreground">Component</h4>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide block mb-1.5">Name</label>
                  <div className="font-mono text-sm bg-muted px-3 py-2 rounded-lg text-foreground font-medium">
                    {screenName}
                  </div>
                </div>
                {sectionId ? (
                  <div>
                    <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide block mb-1.5">Section</label>
                    <div className="font-mono text-sm bg-muted px-3 py-2 rounded-lg text-foreground font-medium">
                      {sectionId}
                    </div>
                  </div>
                ) : null}
                <div>
                  <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide block mb-1.5">Path</label>
                  <div className="font-mono text-xs bg-muted px-3 py-2 rounded-lg text-muted-foreground truncate" title={`src/sections/${sectionId ?? ''}/${screenName}.tsx`}>
                    src/{sectionId ?? ''}/{screenName}.tsx
                  </div>
                </div>
              </div>
            </div>

            {/* Status Badge */}
            <div className="rounded-xl border-2 border-emerald-300 dark:border-emerald-700 bg-emerald-50 dark:bg-emerald-950/50 shadow-sm p-5 min-w-[180px]">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-full bg-emerald-500 flex items-center justify-center shadow-lg shadow-emerald-500/30">
                  <CheckCircle2 className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h4 className="text-base font-bold text-emerald-700 dark:text-emerald-300">
                    Props-Based
                  </h4>
                  <p className="text-sm text-emerald-600 dark:text-emerald-400">
                    Ready for export
                  </p>
                </div>
              </div>
              <p className="text-xs text-emerald-600/80 dark:text-emerald-400/80 leading-relaxed">
                This component receives all data via props, making it safe to export.
              </p>
            </div>

            {/* Sample Data */}
            {sampleData ? (
              <div className="min-w-[300px] flex-1 max-w-[450px]">
                <DataInspector data={sampleData} title="Sample Data" />
              </div>
            ) : null}

            {/* File Info */}
            <div className="rounded-xl border-2 border-border bg-background shadow-sm p-5 min-w-[200px]">
              <div className="flex items-center gap-3 mb-4 pb-3 border-b border-border">
                <div className="w-8 h-8 rounded-lg bg-violet-500/10 flex items-center justify-center">
                  <FileCode2 className="w-4 h-4 text-violet-600 dark:text-violet-400" />
                </div>
                <h4 className="text-base font-semibold text-foreground">Files</h4>
              </div>
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50 border border-border/50">
                  <div className="w-3 h-3 rounded-full bg-emerald-500 shadow-sm shadow-emerald-500/50" />
                  <span className="font-mono text-sm text-foreground">
                    {screenName}.tsx
                  </span>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50 border border-border/50">
                  <div className="w-3 h-3 rounded-full bg-blue-500 shadow-sm shadow-blue-500/50" />
                  <span className="font-mono text-sm text-foreground">
                    index.ts
                  </span>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* Empty State */
          <div className="flex items-center justify-center h-full text-center p-6 gap-5">
            <div className="w-14 h-14 rounded-2xl bg-muted flex items-center justify-center">
              <Info className="w-7 h-7 text-muted-foreground" />
            </div>
            <div className="text-left">
              <p className="text-base font-semibold text-foreground">
                No screen selected
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                Select a screen from the sidebar to inspect its details
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
