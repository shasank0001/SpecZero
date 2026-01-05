import { useRef, useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { RefreshCw, Maximize2, Minimize2, ExternalLink } from "lucide-react";

export interface IframePreviewProps {
  src: string;
  title: string;
  width?: string | number;
  height?: string | number;
  className?: string;
  showControls?: boolean;
}

/**
 * IframePreview - Embeds preview routes in an isolated iframe
 * 
 * Features:
 * - Theme synchronization with parent
 * - Refresh functionality
 * - Fullscreen toggle
 * - Loading state
 */
export function IframePreview({
  src,
  title,
  width = "100%",
  height = "100%",
  className,
  showControls = true,
}: IframePreviewProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [key, setKey] = useState(0);

  // Sync theme with iframe
  useEffect(() => {
    const syncTheme = () => {
      const isDark = document.documentElement.classList.contains("dark");
      try {
        iframeRef.current?.contentWindow?.postMessage(
          { type: "theme-change", theme: isDark ? "dark" : "light" },
          "*"
        );
      } catch {
        // Cross-origin access not allowed
      }
    };

    // Watch for theme changes on the document
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (
          mutation.type === "attributes" &&
          mutation.attributeName === "class"
        ) {
          syncTheme();
        }
      });
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    // Initial sync after iframe loads
    const iframe = iframeRef.current;
    if (iframe) {
      iframe.addEventListener("load", syncTheme);
    }

    return () => {
      observer.disconnect();
      iframe?.removeEventListener("load", syncTheme);
    };
  }, [key]);

  const handleRefresh = () => {
    setIsLoading(true);
    setKey((prev) => prev + 1);
  };

  const handleFullscreen = async () => {
    if (!containerRef.current) return;
    
    if (!document.fullscreenElement) {
      await containerRef.current.requestFullscreen();
      setIsFullscreen(true);
    } else {
      await document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  const handleOpenExternal = () => {
    window.open(src, "_blank");
  };

  // Listen for fullscreen changes
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () =>
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
  }, []);

  return (
    <div ref={containerRef} className={cn("relative flex flex-col bg-background", className)}>
      {/* Controls */}
      {showControls && (
        <div className="flex items-center justify-between px-4 py-2.5 border-b border-border bg-muted/30 backdrop-blur-sm">
          <div className="flex items-center gap-2">
            {/* Traffic lights decoration */}
            <div className="flex items-center gap-1.5 mr-3">
              <div className="w-3 h-3 rounded-full bg-red-400" />
              <div className="w-3 h-3 rounded-full bg-yellow-400" />
              <div className="w-3 h-3 rounded-full bg-green-400" />
            </div>
            <span className="text-sm font-medium text-muted-foreground truncate max-w-[300px]">
              {title}
            </span>
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={handleRefresh}
              className="p-2 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
              title="Refresh preview"
            >
              <RefreshCw
                className={cn("w-4 h-4", isLoading && "animate-spin")}
              />
            </button>
            <button
              onClick={handleOpenExternal}
              className="p-2 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
              title="Open in new tab"
            >
              <ExternalLink className="w-4 h-4" />
            </button>
            <button
              onClick={handleFullscreen}
              className="p-2 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
              title={isFullscreen ? "Exit fullscreen" : "Fullscreen"}
            >
              {isFullscreen ? (
                <Minimize2 className="w-4 h-4" />
              ) : (
                <Maximize2 className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>
      )}

      {/* Iframe Container */}
      <div 
        className="relative flex-1 overflow-hidden"
        style={{ 
          width: typeof width === 'number' ? `${width}px` : width,
          height: typeof height === 'number' ? `${height}px` : height,
        }}
      >
        {/* Loading Overlay */}
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm z-10">
            <div className="flex flex-col items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <RefreshCw className="w-5 h-5 text-primary animate-spin" />
              </div>
              <p className="text-sm text-muted-foreground">Loading preview...</p>
            </div>
          </div>
        )}

        {/* Iframe */}
        <iframe
          key={key}
          ref={iframeRef}
          src={src}
          title={title}
          className="absolute inset-0 w-full h-full border-0 bg-background"
          onLoad={() => setIsLoading(false)}
        />
      </div>
    </div>
  );
}
