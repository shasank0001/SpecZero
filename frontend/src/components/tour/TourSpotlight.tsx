/**
 * Tour Spotlight Component
 * 
 * Creates a spotlight effect that highlights the current tour target
 * while dimming the rest of the page.
 */

import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { useTour } from "./TourContext";
import { TourTooltip } from "./TourTooltip";

interface SpotlightRect {
  top: number;
  left: number;
  width: number;
  height: number;
}

export function TourSpotlight() {
  const { isActive, currentStepData } = useTour();
  const [targetRect, setTargetRect] = useState<SpotlightRect | null>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const observerRef = useRef<ResizeObserver | null>(null);

  // Find and track the target element
  useEffect(() => {
    if (!isActive || !currentStepData?.target) {
      setTargetRect(null);
      return;
    }

    const updateRect = () => {
      const element = document.querySelector(currentStepData.target);
      if (element) {
        const rect = element.getBoundingClientRect();
        const padding = currentStepData.spotlightPadding ?? 8;
        
        setTargetRect({
          top: rect.top - padding + window.scrollY,
          left: rect.left - padding,
          width: rect.width + padding * 2,
          height: rect.height + padding * 2,
        });
      } else {
        // Element not found yet, retry
        setTargetRect(null);
      }
    };

    // Initial update with delay for navigation
    setIsTransitioning(true);
    const timer = setTimeout(() => {
      updateRect();
      setIsTransitioning(false);
    }, 150);

    // Watch for element changes
    const element = document.querySelector(currentStepData.target);
    if (element) {
      observerRef.current = new ResizeObserver(updateRect);
      observerRef.current.observe(element);
    }

    // Update on scroll/resize
    window.addEventListener("scroll", updateRect, true);
    window.addEventListener("resize", updateRect);

    return () => {
      clearTimeout(timer);
      window.removeEventListener("scroll", updateRect, true);
      window.removeEventListener("resize", updateRect);
      observerRef.current?.disconnect();
    };
  }, [isActive, currentStepData]);

  if (!isActive) return null;

  const spotlightContent = (
    <div className="tour-spotlight-container">
      {/* Overlay with cutout */}
      <svg
        className="tour-spotlight-overlay"
        width="100%"
        height="100%"
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100vw",
          height: "100vh",
          pointerEvents: "none",
          zIndex: 9998,
        }}
      >
        <defs>
          <mask id="spotlight-mask">
            {/* White background (visible) */}
            <rect x="0" y="0" width="100%" height="100%" fill="white" />
            {/* Black cutout (transparent) */}
            {targetRect && (
              <rect
                x={targetRect.left}
                y={targetRect.top}
                width={targetRect.width}
                height={targetRect.height}
                rx="12"
                ry="12"
                fill="black"
                className="tour-spotlight-cutout"
              />
            )}
          </mask>
        </defs>
        {/* Dark overlay with mask */}
        <rect
          x="0"
          y="0"
          width="100%"
          height="100%"
          fill="rgba(0, 0, 0, 0.75)"
          mask="url(#spotlight-mask)"
          style={{ pointerEvents: "auto" }}
        />
      </svg>

      {/* Spotlight ring/glow effect */}
      {targetRect && (
        <div
          className="tour-spotlight-ring"
          style={{
            position: "fixed",
            top: targetRect.top,
            left: targetRect.left,
            width: targetRect.width,
            height: targetRect.height,
            borderRadius: "12px",
            boxShadow: "0 0 0 4px rgba(99, 102, 241, 0.5), 0 0 30px rgba(99, 102, 241, 0.3)",
            pointerEvents: "none",
            zIndex: 9999,
            transition: "all 0.3s ease-out",
          }}
        />
      )}

      {/* Tooltip */}
      {targetRect && !isTransitioning && (
        <TourTooltip targetRect={targetRect} />
      )}

      {/* Click blocker with pass-through for target */}
      <div
        className="tour-click-blocker"
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100vw",
          height: "100vh",
          zIndex: 9997,
          cursor: "not-allowed",
        }}
        onClick={(e) => {
          // Allow clicks on the target element
          if (targetRect) {
            const x = e.clientX;
            const y = e.clientY;
            const inTarget =
              x >= targetRect.left &&
              x <= targetRect.left + targetRect.width &&
              y >= targetRect.top - window.scrollY &&
              y <= targetRect.top - window.scrollY + targetRect.height;
            
            if (inTarget) {
              return; // Allow the click through
            }
          }
          e.stopPropagation();
          e.preventDefault();
        }}
      />
    </div>
  );

  return createPortal(spotlightContent, document.body);
}
