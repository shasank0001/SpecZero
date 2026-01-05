import { useEffect } from "react";
import { Outlet } from "react-router-dom";

/**
 * PreviewLayout - Wrapper for preview routes
 * 
 * Handles theme synchronization with parent window
 * and provides a clean preview environment.
 */
export function PreviewLayout() {
  // Sync theme with parent window
  useEffect(() => {
    const syncTheme = () => {
      // Try to get theme from parent window
      try {
        const parentTheme = window.parent?.document?.documentElement?.classList?.contains("dark");
        if (parentTheme !== undefined) {
          if (parentTheme) {
            document.documentElement.classList.add("dark");
          } else {
            document.documentElement.classList.remove("dark");
          }
        }
      } catch {
        // Cross-origin access not allowed, use local storage
        const localTheme = localStorage.getItem("theme");
        if (localTheme === "dark") {
          document.documentElement.classList.add("dark");
        }
      }
    };

    syncTheme();

    // Listen for theme changes via postMessage
    const handleMessage = (event: MessageEvent) => {
      if (event.data?.type === "theme-change") {
        if (event.data.theme === "dark") {
          document.documentElement.classList.add("dark");
        } else {
          document.documentElement.classList.remove("dark");
        }
      }
    };

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Outlet />
    </div>
  );
}
