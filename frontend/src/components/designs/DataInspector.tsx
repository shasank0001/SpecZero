import { useState } from "react";
import { cn } from "@/lib/utils";
import { ChevronRight, Database, Copy, Check, Braces } from "lucide-react";

export interface DataInspectorProps {
  data: unknown;
  title?: string;
  className?: string;
}

/**
 * DataInspector - Displays sample data in a collapsible JSON viewer
 */
export function DataInspector({
  data,
  title = "Sample Data",
  className,
}: DataInspectorProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [copied, setCopied] = useState(false);

  const jsonString = JSON.stringify(data, null, 2);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(jsonString);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getDataSummary = () => {
    if (data === null) return "null";
    if (data === undefined) return "undefined";
    if (Array.isArray(data)) return `Array[${data.length}]`;
    if (typeof data === "object") return `Object{${Object.keys(data).length}}`;
    return typeof data;
  };

  return (
    <div className={cn("rounded-xl border border-border overflow-hidden", className)}>
      {/* Header */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center gap-3 px-4 py-3 hover:bg-muted/50 transition-colors"
      >
        <ChevronRight
          className={cn(
            "w-4 h-4 text-muted-foreground transition-transform duration-200",
            isExpanded && "rotate-90"
          )}
        />
        <Database className="w-4 h-4 text-primary" />
        <span className="font-medium flex-1 text-left text-sm">{title}</span>
        <code className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-md font-mono">
          {getDataSummary()}
        </code>
      </button>

      {/* Content */}
      {isExpanded && (
        <div className="border-t border-border animate-in fade-in slide-in-from-top-1 duration-200">
          <div className="flex items-center justify-between px-4 py-2 bg-muted/30 border-b border-border">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Braces className="w-3.5 h-3.5" />
              <span>JSON</span>
            </div>
            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 px-2 py-1 text-xs text-muted-foreground hover:text-foreground transition-colors rounded-md hover:bg-muted"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-green-500" />
                  <span className="text-green-500">Copied</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy</span>
                </>
              )}
            </button>
          </div>
          <pre className="p-4 text-xs font-mono overflow-auto max-h-64 bg-muted/10">
            <code className="text-foreground">{jsonString}</code>
          </pre>
        </div>
      )}
    </div>
  );
}
