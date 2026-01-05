import { cn } from "@/lib/utils";
import { IframePreview } from "./IframePreview";

export type DeviceSize = "mobile" | "tablet" | "desktop" | "full";

export interface DeviceDimensions {
  width: number;
  height: number;
  label: string;
}

export const DEVICE_SIZES: Record<DeviceSize, DeviceDimensions> = {
  mobile: { width: 375, height: 667, label: "Mobile" },
  tablet: { width: 768, height: 1024, label: "Tablet" },
  desktop: { width: 1280, height: 800, label: "Desktop" },
  full: { width: 0, height: 0, label: "Full" }, // 0 means 100%
};

export interface ResponsivePreviewProps {
  src: string;
  title: string;
  deviceSize?: DeviceSize;
  className?: string;
}

/**
 * ResponsivePreview - Iframe preview with device size constraints
 */
export function ResponsivePreview({
  src,
  title,
  deviceSize = "full",
  className,
}: ResponsivePreviewProps) {
  const dimensions = DEVICE_SIZES[deviceSize];
  const isFullWidth = deviceSize === "full";

  return (
    <div
      className={cn(
        "flex items-start justify-center overflow-auto p-4",
        "bg-[repeating-conic-gradient(#f8fafc_0%_25%,#f1f5f9_0%_50%)] dark:bg-[repeating-conic-gradient(#1e293b_0%_25%,#0f172a_0%_50%)] bg-[length:20px_20px]",
        className
      )}
    >
      <div
        className={cn(
          "bg-background overflow-hidden transition-all duration-300",
          isFullWidth 
            ? "w-full h-full" 
            : "shadow-2xl shadow-black/10 dark:shadow-black/30 rounded-xl border border-border"
        )}
        style={
          isFullWidth
            ? undefined
            : {
                width: dimensions.width,
                height: dimensions.height,
              }
        }
      >
        <IframePreview
          src={src}
          title={title}
          width={isFullWidth ? "100%" : dimensions.width}
          height={isFullWidth ? "100%" : dimensions.height}
          showControls={!isFullWidth}
        />
      </div>
    </div>
  );
}
