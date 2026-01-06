/**
 * RecentActivity Component
 * 
 * Displays a list of recent activity items.
 * This is a props-based component for export.
 */
import { Clock, User, Calendar, FileText, CheckCircle, AlertCircle } from "lucide-react";
import type { LucideIcon } from "lucide-react";

export interface ActivityItem {
  id: string;
  type: "appointment" | "patient" | "document" | "alert" | "completed";
  title: string;
  description: string;
  timestamp: string;
  user?: string;
}

export interface RecentActivityProps {
  activities: ActivityItem[];
  onViewAll?: () => void;
}

const typeIcons: Record<ActivityItem["type"], LucideIcon> = {
  appointment: Calendar,
  patient: User,
  document: FileText,
  alert: AlertCircle,
  completed: CheckCircle,
};

const typeColors: Record<ActivityItem["type"], string> = {
  appointment: "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400",
  patient: "bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400",
  document: "bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400",
  alert: "bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400",
  completed: "bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400",
};

export function RecentActivity({ activities, onViewAll }: RecentActivityProps) {
  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return "Just now";
    if (diffInHours < 24) return `${diffInHours}h ago`;
    if (diffInHours < 48) return "Yesterday";
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };

  return (
    <div className="bg-card border border-border rounded-xl overflow-hidden">
      <div className="flex items-center justify-between px-5 py-4 border-b border-border">
        <h3 className="font-semibold text-foreground">Recent Activity</h3>
        {onViewAll && (
          <button 
            onClick={onViewAll}
            className="text-sm text-primary hover:underline"
          >
            View all
          </button>
        )}
      </div>
      <div className="divide-y divide-border">
        {activities.map((activity) => {
          const Icon = typeIcons[activity.type];
          return (
            <div key={activity.id} className="px-5 py-4 hover:bg-muted/30 transition-colors">
              <div className="flex items-start gap-3">
                <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${typeColors[activity.type]}`}>
                  <Icon className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-foreground text-sm">{activity.title}</p>
                  <p className="text-sm text-muted-foreground mt-0.5 truncate">{activity.description}</p>
                  <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {formatTimestamp(activity.timestamp)}
                    </span>
                    {activity.user && (
                      <span className="flex items-center gap-1">
                        <User className="w-3 h-3" />
                        {activity.user}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      {activities.length === 0 && (
        <div className="px-5 py-12 text-center">
          <Clock className="w-10 h-10 mx-auto text-muted-foreground/50" />
          <p className="mt-3 text-sm text-muted-foreground">No recent activity</p>
        </div>
      )}
    </div>
  );
}
