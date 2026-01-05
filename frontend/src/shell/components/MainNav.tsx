import { cn } from "@/lib/utils";
import type { NavItem } from "./AppShell";

export interface MainNavProps {
  items: NavItem[];
  currentPath?: string;
  onNavigate?: (href: string) => void;
  className?: string;
}

/**
 * MainNav - Sidebar navigation component
 * 
 * This component is props-based and exportable.
 */
export function MainNav({
  items,
  currentPath = "/",
  onNavigate,
  className,
}: MainNavProps) {
  const handleClick = (href: string, e: React.MouseEvent) => {
    if (onNavigate) {
      e.preventDefault();
      onNavigate(href);
    }
  };

  // Group items by category (items without icons go to main, with icons stay)
  return (
    <nav className={cn("px-3 space-y-1", className)}>
      {items.map((item) => {
        const isActive = currentPath === item.href || 
          (item.href !== "/" && currentPath.startsWith(item.href));

        return (
          <a
            key={item.href}
            href={item.href}
            onClick={(e) => handleClick(item.href, e)}
            className={cn(
              "group relative flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200",
              isActive
                ? "bg-primary text-primary-foreground shadow-md shadow-primary/20"
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
            )}
          >
            {/* Active indicator */}
            {isActive && (
              <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-primary-foreground/30 rounded-r-full" />
            )}
            
            {item.icon && (
              <span className={cn(
                "flex items-center justify-center w-5 h-5 transition-transform duration-200",
                isActive ? "" : "group-hover:scale-110"
              )}>
                {item.icon}
              </span>
            )}
            <span className="flex-1 truncate">{item.label}</span>
            {item.badge && (
              <span
                className={cn(
                  "px-2 py-0.5 text-xs font-semibold rounded-full transition-colors",
                  isActive
                    ? "bg-primary-foreground/20 text-primary-foreground"
                    : "bg-primary/10 text-primary"
                )}
              >
                {item.badge}
              </span>
            )}
          </a>
        );
      })}
    </nav>
  );
}
