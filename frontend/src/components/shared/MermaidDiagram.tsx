/**
 * Mermaid Diagram Component
 * 
 * A refined wrapper for Mermaid.js diagrams with theme support,
 * loading states, and elegant error handling.
 * 
 * Aesthetic: Clean, technical, precise
 */

import { useEffect, useRef, useState, useCallback } from "react";
import mermaid from "mermaid";
import { cn } from "@/lib/utils";
import { AlertTriangle, Loader2, Database } from "lucide-react";

interface MermaidDiagramProps {
  chart: string;
  className?: string;
}

// Generate unique IDs for each diagram instance
let diagramIdCounter = 0;
const generateDiagramId = () => `mermaid-${++diagramIdCounter}-${Date.now()}`;

export function MermaidDiagram({ chart, className }: MermaidDiagramProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [svg, setSvg] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const renderDiagram = useCallback(async () => {
    if (!chart || !containerRef.current) {
      setIsLoading(false);
      return;
    }

    // Check for empty or minimal chart
    if (chart.trim() === "" || chart.trim() === "erDiagram") {
      setSvg("");
      setError(null);
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      // Detect theme
      const isDark = document.documentElement.classList.contains("dark");

      // Initialize mermaid with refined configuration
      mermaid.initialize({
        startOnLoad: false,
        theme: isDark ? "dark" : "neutral",
        securityLevel: "loose",
        fontFamily: "var(--font-sans)",
        er: {
          diagramPadding: 24,
          layoutDirection: "TB",
          minEntityWidth: 120,
          minEntityHeight: 60,
          entityPadding: 16,
          useMaxWidth: false,
          stroke: isDark ? "#4b5563" : "#d1d5db",
          fill: isDark ? "#1f2937" : "#f9fafb",
        },
        themeVariables: isDark
          ? {
              // Dark theme variables
              primaryColor: "#6366f1",
              primaryTextColor: "#f9fafb",
              primaryBorderColor: "#4f46e5",
              lineColor: "#6b7280",
              secondaryColor: "#1f2937",
              tertiaryColor: "#374151",
              background: "#111827",
              mainBkg: "#1f2937",
              nodeBorder: "#4b5563",
              clusterBkg: "#1f2937",
              titleColor: "#f9fafb",
              edgeLabelBackground: "#1f2937",
              attributeBackgroundColorOdd: "#1f2937",
              attributeBackgroundColorEven: "#111827",
            }
          : {
              // Light theme variables
              primaryColor: "#6366f1",
              primaryTextColor: "#1f2937",
              primaryBorderColor: "#4f46e5",
              lineColor: "#9ca3af",
              secondaryColor: "#f3f4f6",
              tertiaryColor: "#e5e7eb",
              background: "#ffffff",
              mainBkg: "#f9fafb",
              nodeBorder: "#d1d5db",
              clusterBkg: "#f3f4f6",
              titleColor: "#1f2937",
              edgeLabelBackground: "#ffffff",
              attributeBackgroundColorOdd: "#f9fafb",
              attributeBackgroundColorEven: "#f3f4f6",
            },
      });

      const id = generateDiagramId();
      const { svg: renderedSvg } = await mermaid.render(id, chart);
      
      // Inject custom styles into SVG for better integration
      const styledSvg = renderedSvg.replace(
        "<svg ",
        `<svg style="max-width: 100%; height: auto;" `
      );
      
      setSvg(styledSvg);
      setError(null);
    } catch (err) {
      console.error("Mermaid rendering error:", err);
      const errorMessage = err instanceof Error ? err.message : "Failed to render diagram";
      setError(errorMessage);
      setSvg("");
    } finally {
      setIsLoading(false);
    }
  }, [chart]);

  // Initial render
  useEffect(() => {
    renderDiagram();
  }, [renderDiagram]);

  // Re-render on theme change
  useEffect(() => {
    const observer = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        if (mutation.type === "attributes" && mutation.attributeName === "class") {
          // Small delay to ensure theme CSS has applied
          setTimeout(renderDiagram, 50);
          break;
        }
      }
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => observer.disconnect();
  }, [renderDiagram]);

  // Loading state
  if (isLoading) {
    return (
      <div
        className={cn(
          "flex flex-col items-center justify-center min-h-[200px] p-8",
          "bg-gradient-to-br from-muted/30 via-muted/20 to-muted/30",
          "rounded-xl border border-border/50",
          className
        )}
      >
        <div className="relative">
          <div className="absolute inset-0 rounded-full bg-primary/10 animate-ping" />
          <div className="relative rounded-full bg-muted p-3">
            <Loader2 className="h-6 w-6 text-primary animate-spin" />
          </div>
        </div>
        <p className="mt-4 text-sm text-muted-foreground font-medium">
          Rendering diagram...
        </p>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div
        className={cn(
          "flex flex-col items-center justify-center min-h-[200px] p-8",
          "bg-gradient-to-br from-destructive/5 via-destructive/3 to-destructive/5",
          "rounded-xl border border-destructive/20",
          className
        )}
      >
        <div className="rounded-full bg-destructive/10 p-3 mb-4">
          <AlertTriangle className="h-6 w-6 text-destructive" />
        </div>
        <h4 className="text-sm font-semibold text-destructive mb-2">
          Diagram Error
        </h4>
        <p className="text-xs text-muted-foreground text-center max-w-md">
          {error}
        </p>
      </div>
    );
  }

  // Empty state
  if (!svg) {
    return (
      <div
        className={cn(
          "flex flex-col items-center justify-center min-h-[200px] p-8",
          "bg-gradient-to-br from-muted/30 via-muted/20 to-muted/30",
          "rounded-xl border-2 border-dashed border-border/50",
          className
        )}
      >
        <div className="rounded-2xl bg-muted p-4 mb-4">
          <Database className="h-8 w-8 text-muted-foreground" />
        </div>
        <p className="text-sm text-muted-foreground">
          No diagram to display
        </p>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className={cn(
        "mermaid-diagram-container",
        "overflow-auto rounded-xl",
        "bg-gradient-to-br from-card via-card to-muted/20",
        "border border-border/50",
        "p-6",
        className
      )}
    >
      <div 
        className="mermaid-content min-w-fit"
        dangerouslySetInnerHTML={{ __html: svg }} 
      />
    </div>
  );
}
