import { NavLink } from "react-router-dom";
import { FileText, Database, Palette, Download } from "lucide-react";
import { cn } from "@/lib/utils";

const tabs = [
  { path: "/", label: "Plan", icon: FileText, tourId: "tab-plan" },
  { path: "/data", label: "Data", icon: Database, tourId: "tab-data" },
  { path: "/designs", label: "Designs", icon: Palette, tourId: "tab-designs" },
  { path: "/export", label: "Export", icon: Download, tourId: "tab-export" },
];

export function TabNav() {
  return (
    <nav className="flex items-center gap-1">
      {tabs.map((tab, index) => {
        const Icon = tab.icon;
        return (
          <NavLink
            key={tab.path}
            to={tab.path}
            end={tab.path === "/"}
            data-tour={tab.tourId}
            className={({ isActive }) =>
              cn(
                "group relative flex items-center gap-2 px-4 py-3 text-sm font-medium transition-all duration-200",
                "opacity-0 animate-fade-up",
                isActive
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground"
              )
            }
            style={{ animationDelay: `${index * 0.05}s`, animationFillMode: 'forwards' }}
          >
            {({ isActive }) => (
              <>
                {/* Icon */}
                <div className={cn(
                  "flex items-center justify-center rounded-md p-1 transition-colors duration-200",
                  isActive 
                    ? "bg-primary/10 text-primary" 
                    : "text-muted-foreground group-hover:text-foreground"
                )}>
                  <Icon className="h-4 w-4" />
                </div>
                
                {/* Label */}
                <span>{tab.label}</span>
                
                {/* Active indicator - simple underline */}
                <div className={cn(
                  "absolute bottom-0 left-4 right-4 h-0.5 rounded-full transition-all duration-200",
                  "bg-primary",
                  isActive 
                    ? "opacity-100 scale-x-100" 
                    : "opacity-0 scale-x-0"
                )} />
              </>
            )}
          </NavLink>
        );
      })}
    </nav>
  );
}
