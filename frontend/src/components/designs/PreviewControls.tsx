import { cn } from "@/lib/utils";
import { DeviceSizeToggle } from "./DeviceSizeToggle";
import type { DeviceSize } from "./ResponsivePreview";

export interface PreviewControlsProps {
  deviceSize: DeviceSize;
  onDeviceSizeChange: (size: DeviceSize) => void;
  className?: string;
}

/**
 * PreviewControls - Combined device size toggle and other preview controls
 */
export function PreviewControls({
  deviceSize,
  onDeviceSizeChange,
  className,
}: PreviewControlsProps) {
  return (
    <div
      className={cn(
        "flex flex-wrap items-center justify-between gap-4",
        className
      )}
    >
      <DeviceSizeToggle value={deviceSize} onChange={onDeviceSizeChange} />
    </div>
  );
}
