import { cn } from "@/lib/utils";
import { Smartphone, Tablet, Monitor, Maximize } from "lucide-react";
import type { DeviceSize } from "./ResponsivePreview";

export interface DeviceSizeToggleProps {
  value: DeviceSize;
  onChange: (size: DeviceSize) => void;
  className?: string;
}

const DEVICE_OPTIONS: {
  value: DeviceSize;
  icon: React.ReactNode;
  label: string;
  dimensions: string;
}[] = [
  {
    value: "mobile",
    icon: <Smartphone className="w-4 h-4" />,
    label: "Mobile",
    dimensions: "375 × 667",
  },
  {
    value: "tablet",
    icon: <Tablet className="w-4 h-4" />,
    label: "Tablet",
    dimensions: "768 × 1024",
  },
  {
    value: "desktop",
    icon: <Monitor className="w-4 h-4" />,
    label: "Desktop",
    dimensions: "1280 × 800",
  },
  {
    value: "full",
    icon: <Maximize className="w-4 h-4" />,
    label: "Full",
    dimensions: "100%",
  },
];

/**
 * DeviceSizeToggle - Toggle between device preview sizes
 */
export function DeviceSizeToggle({
  value,
  onChange,
  className,
}: DeviceSizeToggleProps) {
  return (
    <div
      className={cn(
        "inline-flex items-center gap-1 p-1 rounded-xl bg-muted/50 border border-border",
        className
      )}
    >
      {DEVICE_OPTIONS.map((option) => (
        <button
          key={option.value}
          onClick={() => onChange(option.value)}
          className={cn(
            "relative flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200",
            value === option.value
              ? "bg-background text-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
          )}
          title={`${option.label} (${option.dimensions})`}
        >
          {value === option.value && (
            <div className="absolute inset-0 rounded-lg ring-1 ring-border" />
          )}
          {option.icon}
          <span className="hidden md:inline">{option.label}</span>
        </button>
      ))}
    </div>
  );
}
