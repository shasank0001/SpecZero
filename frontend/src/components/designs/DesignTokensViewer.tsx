import { useState, useMemo } from "react";
import { cn } from "@/lib/utils";
import { ColorPalette } from "./ColorPalette";
import { TypographyPreview } from "./TypographyPreview";
import { loadDesignSystem } from "@/lib/design-system-loader";
import { Palette, Type, Sparkles } from "lucide-react";

export interface DesignTokensViewerProps {
  className?: string;
}

type TabType = "colors" | "typography";

/**
 * DesignTokensViewer - Tabbed view of design tokens
 */
export function DesignTokensViewer({ className }: DesignTokensViewerProps) {
  const [activeTab, setActiveTab] = useState<TabType>("colors");
  const designSystem = useMemo(() => loadDesignSystem(), []);

  const tabs: { id: TabType; label: string; icon: React.ReactNode }[] = [
    { id: "colors", label: "Colors", icon: <Palette className="w-4 h-4" /> },
    { id: "typography", label: "Typography", icon: <Type className="w-4 h-4" /> },
  ];

  return (
    <div className={cn("flex flex-col h-full", className)}>
      {/* Header */}
      <div className="px-6 py-4 border-b border-border">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h2 className="font-semibold text-foreground">Design Tokens</h2>
            <p className="text-sm text-muted-foreground">Colors, typography, and spacing</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 p-1 bg-muted/50 rounded-xl">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200",
                activeTab === tab.id
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto p-6">
        {activeTab === "colors" && (
          <ColorPalette colors={designSystem.colors} />
        )}
        {activeTab === "typography" && (
          <TypographyPreview typography={designSystem.typography} />
        )}
      </div>
    </div>
  );
}
