/**
 * SettingsSection Component
 * 
 * A collapsible settings section with title and description.
 * This is a props-based component for export.
 */
import { useState } from "react";
import { ChevronDown, ChevronRight } from "lucide-react";
import type { LucideIcon } from "lucide-react";

export interface SettingsSectionProps {
  title: string;
  description?: string;
  icon?: LucideIcon;
  children: React.ReactNode;
  defaultExpanded?: boolean;
}

export function SettingsSection({ 
  title, 
  description, 
  icon: Icon, 
  children, 
  defaultExpanded = true 
}: SettingsSectionProps) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  return (
    <div className="bg-card border border-border rounded-xl overflow-hidden">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center gap-4 px-5 py-4 hover:bg-muted/30 transition-colors"
      >
        {Icon && (
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
            <Icon className="w-5 h-5 text-primary" />
          </div>
        )}
        <div className="flex-1 text-left">
          <h3 className="font-semibold text-foreground">{title}</h3>
          {description && (
            <p className="text-sm text-muted-foreground mt-0.5">{description}</p>
          )}
        </div>
        {isExpanded ? (
          <ChevronDown className="w-5 h-5 text-muted-foreground" />
        ) : (
          <ChevronRight className="w-5 h-5 text-muted-foreground" />
        )}
      </button>
      {isExpanded && (
        <div className="px-5 pb-5 pt-2 border-t border-border">
          {children}
        </div>
      )}
    </div>
  );
}
