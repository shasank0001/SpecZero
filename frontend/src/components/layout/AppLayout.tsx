import { Outlet } from "react-router-dom";
import { TabNav } from "./TabNav";
import { ThemeToggle } from "./ThemeToggle";
import { Sparkles } from "lucide-react";

export function AppLayout() {
  return (
    <div className="relative min-h-screen bg-mesh-gradient">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border/60 bg-background/90 backdrop-blur-md">
        <div className="container mx-auto flex h-16 items-center justify-between px-6">
          <div className="flex items-center gap-3 animate-fade-in">
            {/* Logo mark */}
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
              <Sparkles className="h-5 w-5 text-primary-foreground" />
            </div>
            
            {/* Logo text */}
            <div className="flex flex-col">
              <span className="font-display text-lg font-semibold tracking-tight">
                SpecZero
              </span>
              <span className="text-[10px] font-medium uppercase tracking-widest text-muted-foreground">
                Spec → Code
              </span>
            </div>
            
            {/* Version badge */}
            <span className="ml-2 rounded-md border border-border bg-muted/50 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
              v1.0
            </span>
          </div>
          
          <ThemeToggle />
        </div>
        
        {/* Tab Navigation */}
        <div className="container mx-auto px-6">
          <TabNav />
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="border-t border-border/60 py-6">
        <div className="container mx-auto px-6">
          <div className="flex flex-col items-center justify-center gap-1 text-center">
            <p className="text-sm text-muted-foreground">
              <span className="font-medium text-foreground">SpecZero</span>
              {" "}— From specification to production code
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
