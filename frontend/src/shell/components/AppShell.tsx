import { cn } from "@/lib/utils";
import { MainNav } from "./MainNav";
import { UserMenu } from "./UserMenu";
import type { NavItem, User } from "../types";

export type { NavItem, User };

export interface AppShellProps {
  children: React.ReactNode;
  navItems: NavItem[];
  user?: User;
  currentPath?: string;
  appName?: string;
  appLogo?: React.ReactNode;
  onNavigate?: (href: string) => void;
  onLogout?: () => void;
  className?: string;
}

/**
 * AppShell - Main application layout wrapper
 * 
 * This component is props-based and exportable.
 * It provides the main layout structure with sidebar navigation.
 */
export function AppShell({
  children,
  navItems,
  user,
  currentPath = "/",
  appName = "App",
  appLogo,
  onNavigate,
  onLogout,
  className,
}: AppShellProps) {
  return (
    <div className={cn("min-h-screen bg-background", className)}>
      {/* Sidebar */}
      <aside className="fixed inset-y-0 left-0 z-50 w-[260px] bg-card border-r border-border flex flex-col">
        {/* Logo/Brand */}
        <div className="h-16 flex items-center gap-3 px-5 border-b border-border">
          {appLogo ? (
            appLogo
          ) : (
            <div className="relative">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center shadow-lg shadow-primary/20">
                <span className="text-primary-foreground font-bold text-sm">
                  {appName.charAt(0)}
                </span>
              </div>
              <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-green-500 ring-2 ring-card" />
            </div>
          )}
          <div className="flex flex-col">
            <span className="font-semibold text-foreground tracking-tight">{appName}</span>
            <span className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider">Dashboard</span>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex-1 overflow-y-auto py-4">
          <MainNav
            items={navItems}
            currentPath={currentPath}
            onNavigate={onNavigate}
          />
        </div>

        {/* User Menu */}
        {user && (
          <div className="border-t border-border">
            <UserMenu user={user} onLogout={onLogout} />
          </div>
        )}
      </aside>

      {/* Main Content */}
      <main className="pl-[260px]">
        <div className="min-h-screen">{children}</div>
      </main>
    </div>
  );
}
