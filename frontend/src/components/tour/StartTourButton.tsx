/**
 * Start Tour Button
 * 
 * A polished button to trigger the interactive demo tour.
 * Placed in the header for easy access.
 */

import { Play, Sparkles } from "lucide-react";
import { useTour } from "./TourContext";
import { cn } from "@/lib/utils";

interface StartTourButtonProps {
  className?: string;
  variant?: "default" | "compact";
}

export function StartTourButton({ className, variant = "default" }: StartTourButtonProps) {
  const { startTour, isActive } = useTour();

  if (isActive) return null;

  if (variant === "compact") {
    return (
      <button
        onClick={startTour}
        className={cn(
          "flex items-center gap-1.5 px-3 py-1.5 rounded-lg",
          "text-sm font-medium",
          "bg-primary/10 text-primary",
          "hover:bg-primary/20 transition-colors",
          "border border-primary/20",
          className
        )}
        title="Start interactive tour"
      >
        <Play className="h-3.5 w-3.5" />
        <span>Tour</span>
      </button>
    );
  }

  return (
    <button
      onClick={startTour}
      className={cn(
        "group relative flex items-center gap-2 px-4 py-2 rounded-xl",
        "bg-gradient-to-r from-primary/10 via-indigo-500/10 to-purple-500/10",
        "hover:from-primary/20 hover:via-indigo-500/20 hover:to-purple-500/20",
        "border border-primary/20 hover:border-primary/40",
        "transition-all duration-300",
        "text-sm font-medium text-foreground",
        className
      )}
      title="Start interactive tour"
    >
      {/* Animated sparkle */}
      <div className="relative">
        <Sparkles className="h-4 w-4 text-primary" />
        <Sparkles className="absolute inset-0 h-4 w-4 text-primary animate-ping opacity-50" />
      </div>
      
      <span>Take a Tour</span>
      
      <Play className="h-3.5 w-3.5 text-muted-foreground group-hover:text-primary transition-colors" />
      
      {/* Subtle glow effect */}
      <div className="absolute inset-0 rounded-xl bg-primary/5 blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
    </button>
  );
}
