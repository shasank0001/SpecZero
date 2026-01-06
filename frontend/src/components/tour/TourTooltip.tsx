/**
 * Tour Tooltip Component
 * 
 * Professional tooltip card with step counter, progress bar,
 * and navigation controls.
 */

import { useTour } from "./TourContext";
import { cn } from "@/lib/utils";
import {
  ChevronLeft,
  ChevronRight,
  X,
  Sparkles,
} from "lucide-react";

interface SpotlightRect {
  top: number;
  left: number;
  width: number;
  height: number;
}

interface TourTooltipProps {
  targetRect: SpotlightRect;
}

export function TourTooltip({ targetRect }: TourTooltipProps) {
  const {
    currentStep,
    totalSteps,
    currentStepData,
    nextStep,
    prevStep,
    endTour,
    progress,
  } = useTour();

  if (!currentStepData) return null;

  const placement = currentStepData.placement || "bottom";
  const isFirstStep = currentStep === 0;
  const isLastStep = currentStep === totalSteps - 1;

  // Calculate tooltip position based on placement
  const getTooltipStyle = (): React.CSSProperties => {
    const tooltipWidth = 360;
    const tooltipHeight = 200; // Approximate
    const gap = 16;

    let top = 0;
    let left = 0;

    switch (placement) {
      case "top":
        top = targetRect.top - tooltipHeight - gap;
        left = targetRect.left + targetRect.width / 2 - tooltipWidth / 2;
        break;
      case "bottom":
        top = targetRect.top + targetRect.height + gap;
        left = targetRect.left + targetRect.width / 2 - tooltipWidth / 2;
        break;
      case "left":
        top = targetRect.top + targetRect.height / 2 - tooltipHeight / 2;
        left = targetRect.left - tooltipWidth - gap;
        break;
      case "right":
        top = targetRect.top + targetRect.height / 2 - tooltipHeight / 2;
        left = targetRect.left + targetRect.width + gap;
        break;
    }

    // Keep tooltip in viewport
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    const scrollY = window.scrollY;

    // Horizontal bounds
    if (left < 16) left = 16;
    if (left + tooltipWidth > viewportWidth - 16) {
      left = viewportWidth - tooltipWidth - 16;
    }

    // Vertical bounds
    if (top - scrollY < 16) top = scrollY + 16;
    if (top - scrollY + tooltipHeight > viewportHeight - 16) {
      top = scrollY + viewportHeight - tooltipHeight - 16;
    }

    return {
      position: "fixed",
      top: top - window.scrollY,
      left,
      width: tooltipWidth,
      zIndex: 10000,
    };
  };

  // Get arrow position
  const getArrowStyle = (): React.CSSProperties => {
    const arrowSize = 12;
    const base: React.CSSProperties = {
      position: "absolute",
      width: 0,
      height: 0,
      borderStyle: "solid",
    };

    switch (placement) {
      case "top":
        return {
          ...base,
          bottom: -arrowSize,
          left: "50%",
          transform: "translateX(-50%)",
          borderWidth: `${arrowSize}px ${arrowSize}px 0 ${arrowSize}px`,
          borderColor: "rgb(var(--card)) transparent transparent transparent",
        };
      case "bottom":
        return {
          ...base,
          top: -arrowSize,
          left: "50%",
          transform: "translateX(-50%)",
          borderWidth: `0 ${arrowSize}px ${arrowSize}px ${arrowSize}px`,
          borderColor: "transparent transparent rgb(var(--card)) transparent",
        };
      case "left":
        return {
          ...base,
          right: -arrowSize,
          top: "50%",
          transform: "translateY(-50%)",
          borderWidth: `${arrowSize}px 0 ${arrowSize}px ${arrowSize}px`,
          borderColor: "transparent transparent transparent rgb(var(--card))",
        };
      case "right":
        return {
          ...base,
          left: -arrowSize,
          top: "50%",
          transform: "translateY(-50%)",
          borderWidth: `${arrowSize}px ${arrowSize}px ${arrowSize}px 0`,
          borderColor: "transparent rgb(var(--card)) transparent transparent",
        };
    }
  };

  return (
    <div
      className="tour-tooltip animate-in fade-in-0 zoom-in-95 duration-200"
      style={getTooltipStyle()}
    >
      {/* Card container */}
      <div className="relative bg-card border border-border rounded-xl shadow-2xl overflow-hidden">
        {/* Progress bar at top */}
        <div className="h-1 bg-muted">
          <div
            className="h-full bg-gradient-to-r from-primary to-indigo-500 transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between px-4 pt-3 pb-2">
          <div className="flex items-center gap-2">
            <div className="flex h-6 w-6 items-center justify-center rounded-md bg-primary/10">
              <Sparkles className="h-3.5 w-3.5 text-primary" />
            </div>
            <span className="text-xs font-medium text-muted-foreground">
              Step {currentStep + 1} of {totalSteps}
            </span>
          </div>
          <button
            onClick={endTour}
            className="p-1 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
            aria-label="Close tour"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Content */}
        <div className="px-4 pb-3">
          <h3 className="font-semibold text-foreground mb-1">
            {currentStepData.title}
          </h3>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {currentStepData.content}
          </p>
        </div>

        {/* Step indicators */}
        <div className="flex justify-center gap-1.5 px-4 pb-3">
          {Array.from({ length: totalSteps }).map((_, index) => (
            <div
              key={index}
              className={cn(
                "h-1.5 rounded-full transition-all duration-300",
                index === currentStep
                  ? "w-6 bg-primary"
                  : index < currentStep
                  ? "w-1.5 bg-primary/50"
                  : "w-1.5 bg-muted-foreground/30"
              )}
            />
          ))}
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between px-4 py-3 bg-muted/30 border-t border-border">
          <button
            onClick={prevStep}
            disabled={isFirstStep}
            className={cn(
              "flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors",
              isFirstStep
                ? "text-muted-foreground/50 cursor-not-allowed"
                : "text-muted-foreground hover:text-foreground hover:bg-muted"
            )}
          >
            <ChevronLeft className="h-4 w-4" />
            Back
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={endTour}
              className="px-3 py-1.5 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
            >
              Skip tour
            </button>
            <button
              onClick={nextStep}
              className="flex items-center gap-1 px-4 py-1.5 rounded-lg text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
            >
              {isLastStep ? "Finish" : "Next"}
              {!isLastStep && <ChevronRight className="h-4 w-4" />}
            </button>
          </div>
        </div>

        {/* Arrow */}
        <div style={getArrowStyle()} />
      </div>

      {/* Keyboard hint */}
      <div className="flex justify-center mt-2">
        <span className="text-[10px] text-white/60 font-mono">
          Press <kbd className="px-1 py-0.5 bg-white/10 rounded text-white/80">→</kbd> or <kbd className="px-1 py-0.5 bg-white/10 rounded text-white/80">Enter</kbd> for next
        </span>
      </div>
    </div>
  );
}
