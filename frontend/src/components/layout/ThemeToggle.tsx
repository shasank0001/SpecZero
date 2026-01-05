import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function ThemeToggle() {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    // Check for saved preference or system preference
    const savedTheme = localStorage.getItem("theme");
    const prefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)"
    ).matches;

    if (savedTheme === "dark" || (!savedTheme && prefersDark)) {
      setIsDark(true);
      document.documentElement.classList.add("dark");
    }
  }, []);

  const toggleTheme = () => {
    const newIsDark = !isDark;
    setIsDark(newIsDark);

    if (newIsDark) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleTheme}
      aria-label="Toggle theme"
      className="relative h-9 w-9 rounded-lg border border-border/60 hover:bg-muted transition-colors"
    >
      {/* Sun icon */}
      <Sun className={cn(
        "absolute h-4 w-4 transition-all duration-300",
        isDark 
          ? "rotate-90 scale-0 opacity-0" 
          : "rotate-0 scale-100 opacity-100"
      )} />
      
      {/* Moon icon */}
      <Moon className={cn(
        "absolute h-4 w-4 transition-all duration-300",
        isDark 
          ? "rotate-0 scale-100 opacity-100" 
          : "-rotate-90 scale-0 opacity-0"
      )} />
    </Button>
  );
}
