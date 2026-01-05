import { cn } from "@/lib/utils";
import type { DesignSystemTypography } from "@/types/design-system";
import { Type } from "lucide-react";

export interface TypographyPreviewProps {
  typography: DesignSystemTypography | null;
  className?: string;
}

/**
 * TypographyPreview - Displays typography scale with samples
 */
export function TypographyPreview({
  typography,
  className,
}: TypographyPreviewProps) {
  if (!typography) {
    return (
      <div className={cn("flex flex-col items-center justify-center p-8 text-center", className)}>
        <div className="w-12 h-12 rounded-xl bg-muted/50 flex items-center justify-center mb-3">
          <Type className="w-6 h-6 text-muted-foreground/50" />
        </div>
        <p className="text-sm font-medium text-muted-foreground mb-1">No typography defined</p>
        <p className="text-xs text-muted-foreground/70">
          Create <code className="px-1 py-0.5 bg-muted rounded text-[10px]">typography.json</code> in design-system/
        </p>
      </div>
    );
  }

  return (
    <div className={cn("space-y-8", className)}>
      {/* Font Families */}
      <div className="space-y-4">
        <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
          Font Families
        </h3>
        <div className="grid gap-4">
          <div className="p-4 rounded-xl bg-muted/30 border border-border">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Sans Serif</span>
              <code className="text-xs text-muted-foreground font-mono bg-muted px-2 py-0.5 rounded">
                {typography.fonts.sans.family}
              </code>
            </div>
            <p
              className="text-2xl"
              style={{ fontFamily: `"${typography.fonts.sans.family}", ${typography.fonts.sans.fallback}` }}
            >
              The quick brown fox jumps over the lazy dog
            </p>
            <div className="flex gap-2 mt-3">
              {typography.fonts.sans.weights.map((weight) => (
                <span
                  key={weight}
                  className="px-2 py-1 text-xs rounded bg-muted"
                  style={{ fontWeight: weight }}
                >
                  {weight}
                </span>
              ))}
            </div>
          </div>

          <div className="p-4 rounded-xl bg-muted/30 border border-border">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Monospace</span>
              <code className="text-xs text-muted-foreground font-mono bg-muted px-2 py-0.5 rounded">
                {typography.fonts.mono.family}
              </code>
            </div>
            <p
              className="text-lg font-mono"
              style={{ fontFamily: `"${typography.fonts.mono.family}", ${typography.fonts.mono.fallback}` }}
            >
              const greeting = "Hello, World!";
            </p>
            <div className="flex gap-2 mt-3">
              {typography.fonts.mono.weights.map((weight) => (
                <span
                  key={weight}
                  className="px-2 py-1 text-xs rounded bg-muted font-mono"
                  style={{ fontWeight: weight }}
                >
                  {weight}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Heading Styles */}
      <div className="space-y-4">
        <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
          Headings
        </h3>
        <div className="space-y-4">
          {Object.entries(typography.headings).map(([key, style]) => (
            <div
              key={key}
              className="flex items-baseline justify-between py-3 border-b border-border last:border-0"
            >
              <div className="flex-1">
                <span
                  className="block"
                  style={{
                    fontSize: style.size,
                    fontWeight: style.weight,
                    lineHeight: style.lineHeight,
                  }}
                >
                  Heading {key.replace("h", "")}
                </span>
              </div>
              <div className="flex items-center gap-3 text-xs text-muted-foreground">
                <span className="font-mono">{style.size}</span>
                <span className="font-mono">{style.weight}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Font Sizes */}
      <div className="space-y-4">
        <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
          Text Sizes
        </h3>
        <div className="space-y-3">
          {Object.entries(typography.sizes).map(([key, style]) => (
            <div
              key={key}
              className="flex items-center justify-between p-3 rounded-xl bg-muted/30 border border-border"
            >
              <div className="flex items-center gap-3">
                <code className="text-xs font-mono bg-muted px-2 py-0.5 rounded min-w-[50px] text-center">
                  {key}
                </code>
                <span
                  style={{
                    fontSize: style.size,
                    lineHeight: style.lineHeight,
                  }}
                >
                  Sample text
                </span>
              </div>
              <span className="text-xs text-muted-foreground font-mono">
                {style.size} / {style.lineHeight}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
