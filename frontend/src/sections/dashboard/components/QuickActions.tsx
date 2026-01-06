/**
 * QuickActions Component
 * 
 * Displays a grid of quick action buttons.
 * This is a props-based component for export.
 */
import type { LucideIcon } from "lucide-react";

export interface QuickAction {
  id: string;
  label: string;
  icon: LucideIcon;
  color?: "blue" | "green" | "purple" | "orange" | "red" | "cyan";
  onClick?: () => void;
}

export interface QuickActionsProps {
  actions: QuickAction[];
  title?: string;
}

const colorClasses = {
  blue: "bg-blue-100 text-blue-600 hover:bg-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:hover:bg-blue-900/50",
  green: "bg-green-100 text-green-600 hover:bg-green-200 dark:bg-green-900/30 dark:text-green-400 dark:hover:bg-green-900/50",
  purple: "bg-purple-100 text-purple-600 hover:bg-purple-200 dark:bg-purple-900/30 dark:text-purple-400 dark:hover:bg-purple-900/50",
  orange: "bg-orange-100 text-orange-600 hover:bg-orange-200 dark:bg-orange-900/30 dark:text-orange-400 dark:hover:bg-orange-900/50",
  red: "bg-red-100 text-red-600 hover:bg-red-200 dark:bg-red-900/30 dark:text-red-400 dark:hover:bg-red-900/50",
  cyan: "bg-cyan-100 text-cyan-600 hover:bg-cyan-200 dark:bg-cyan-900/30 dark:text-cyan-400 dark:hover:bg-cyan-900/50",
};

export function QuickActions({ actions, title = "Quick Actions" }: QuickActionsProps) {
  return (
    <div className="bg-card border border-border rounded-xl overflow-hidden">
      <div className="px-5 py-4 border-b border-border">
        <h3 className="font-semibold text-foreground">{title}</h3>
      </div>
      <div className="p-4 grid grid-cols-2 sm:grid-cols-4 gap-3">
        {actions.map((action) => {
          const Icon = action.icon;
          return (
            <button
              key={action.id}
              onClick={action.onClick}
              className={`flex flex-col items-center gap-2 p-4 rounded-xl transition-all duration-200 ${colorClasses[action.color || "blue"]}`}
            >
              <Icon className="w-6 h-6" />
              <span className="text-sm font-medium text-center">{action.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
