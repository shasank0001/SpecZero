/**
 * StatCard Component
 * 
 * Displays a single statistic with icon and trend indicator.
 * This is a props-based component for export.
 */
import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import type { LucideIcon } from "lucide-react";

export interface StatCardProps {
  title: string;
  value: string | number;
  change?: number;
  changeLabel?: string;
  icon: LucideIcon;
  color?: "blue" | "green" | "purple" | "orange" | "red" | "cyan";
}

const colorClasses = {
  blue: "from-blue-500/20 to-blue-500/5 text-blue-600 dark:text-blue-400",
  green: "from-green-500/20 to-green-500/5 text-green-600 dark:text-green-400",
  purple: "from-purple-500/20 to-purple-500/5 text-purple-600 dark:text-purple-400",
  orange: "from-orange-500/20 to-orange-500/5 text-orange-600 dark:text-orange-400",
  red: "from-red-500/20 to-red-500/5 text-red-600 dark:text-red-400",
  cyan: "from-cyan-500/20 to-cyan-500/5 text-cyan-600 dark:text-cyan-400",
};

export function StatCard({ title, value, change, changeLabel, icon: Icon, color = "blue" }: StatCardProps) {
  const TrendIcon = change && change > 0 ? TrendingUp : change && change < 0 ? TrendingDown : Minus;
  const trendColor = change && change > 0 ? "text-green-600" : change && change < 0 ? "text-red-600" : "text-muted-foreground";

  return (
    <div className="bg-card border border-border rounded-xl p-5 hover:shadow-md transition-all duration-200 hover:border-primary/20">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm text-muted-foreground font-medium">{title}</p>
          <p className="text-3xl font-bold text-foreground mt-2">{value}</p>
          {(change !== undefined || changeLabel) && (
            <div className={`flex items-center gap-1 mt-2 text-sm ${trendColor}`}>
              <TrendIcon className="w-4 h-4" />
              <span>{change !== undefined ? `${change > 0 ? "+" : ""}${change}%` : ""}</span>
              {changeLabel && <span className="text-muted-foreground">{changeLabel}</span>}
            </div>
          )}
        </div>
        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br flex items-center justify-center ${colorClasses[color]}`}>
          <Icon className="w-6 h-6" />
        </div>
      </div>
    </div>
  );
}
