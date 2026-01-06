import { cn } from "@/lib/utils";
import { ColorSwatch } from "./ColorSwatch";
import type { DesignSystemColors, ColorScale } from "@/types/design-system";
import { Palette } from "lucide-react";
import { EmptyState } from "@/components/shared/EmptyState";

export interface ColorPaletteProps {
  colors: DesignSystemColors | null;
  className?: string;
}

/**
 * ColorPalette - Displays all color groups with swatches
 */
export function ColorPalette({ colors, className }: ColorPaletteProps) {
  if (!colors) {
    return (
      <EmptyState
        icon={Palette}
        title="No colors defined"
        description="Generate your color palette by running the design-tokens command in your AI agent."
        command="/design-tokens"
        className={className}
      />
    );
  }

  const renderColorScale = (name: string, scale: ColorScale) => {
    const shades = ["50", "100", "200", "300", "400", "500", "600", "700", "800", "900"] as const;
    
    return (
      <div key={name} className="space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-medium capitalize">{name}</h4>
          <span className="text-xs text-muted-foreground">10 shades</span>
        </div>
        <div className="flex gap-1">
          {shades.map((shade) => (
            <div key={shade} className="flex flex-col items-center gap-1.5">
              <ColorSwatch
                name={`${name}-${shade}`}
                value={scale[shade]}
                size="sm"
              />
              <span className="text-[10px] text-muted-foreground font-mono">{shade}</span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderSemanticColor = (name: string, value: string) => (
    <div key={name} className="flex items-center gap-3 p-3 rounded-xl bg-muted/30 border border-border">
      <ColorSwatch name={name} value={value} size="md" />
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium capitalize">{name}</p>
        <p className="text-xs text-muted-foreground font-mono">{value}</p>
      </div>
    </div>
  );

  return (
    <div className={cn("space-y-8", className)}>
      {/* Color Scales */}
      <div className="space-y-6">
        <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
          Color Scales
        </h3>
        <div className="space-y-6">
          {renderColorScale("primary", colors.colors.primary)}
          {renderColorScale("secondary", colors.colors.secondary)}
          {renderColorScale("neutral", colors.colors.neutral)}
        </div>
      </div>

      {/* Semantic Colors */}
      <div className="space-y-4">
        <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
          Semantic Colors
        </h3>
        <div className="grid grid-cols-2 gap-3">
          {renderSemanticColor("success", colors.colors.success)}
          {renderSemanticColor("warning", colors.colors.warning)}
          {renderSemanticColor("error", colors.colors.error)}
          {renderSemanticColor("info", colors.colors.info)}
        </div>
      </div>
    </div>
  );
}
