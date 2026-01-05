import { useState } from "react";
import { cn } from "@/lib/utils";
import { LogOut, Settings, ChevronUp, User as UserIcon } from "lucide-react";
import type { User } from "../types";

export interface UserMenuProps {
  user: User;
  onLogout?: () => void;
  onSettings?: () => void;
  className?: string;
}

/**
 * UserMenu - User profile and logout component
 * 
 * This component is props-based and exportable.
 */
export function UserMenu({
  user,
  onLogout,
  onSettings,
  className,
}: UserMenuProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className={cn("p-3", className)}>
      {/* User Button */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className={cn(
          "w-full flex items-center gap-3 p-3 rounded-xl transition-colors",
          isExpanded ? "bg-muted" : "hover:bg-muted/50"
        )}
      >
        {/* Avatar */}
        <div className="relative shrink-0">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center overflow-hidden ring-2 ring-background">
            {user.avatar ? (
              <img
                src={user.avatar}
                alt={user.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <UserIcon className="w-5 h-5 text-primary" />
            )}
          </div>
          <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-green-500 ring-2 ring-card" />
        </div>

        {/* User Info */}
        <div className="flex-1 min-w-0 text-left">
          <p className="text-sm font-medium text-foreground truncate">{user.name}</p>
          <p className="text-xs text-muted-foreground truncate">
            {user.role || user.email}
          </p>
        </div>

        {/* Expand Icon */}
        <ChevronUp
          className={cn(
            "w-4 h-4 text-muted-foreground transition-transform duration-200",
            isExpanded ? "rotate-180" : ""
          )}
        />
      </button>

      {/* Expanded Actions */}
      {isExpanded && (
        <div className="mt-2 space-y-1 animate-in fade-in slide-in-from-bottom-2 duration-200">
          {onSettings && (
            <button
              onClick={() => {
                onSettings();
                setIsExpanded(false);
              }}
              className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-colors"
            >
              <Settings className="w-4 h-4" />
              <span>Settings</span>
            </button>
          )}
          {onLogout && (
            <button
              onClick={() => {
                onLogout();
                setIsExpanded(false);
              }}
              className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span>Sign out</span>
            </button>
          )}
        </div>
      )}
    </div>
  );
}
