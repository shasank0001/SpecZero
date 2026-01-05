import { useState } from "react";
import { cn } from "@/lib/utils";
import { Copy, Check } from "lucide-react";

export interface ColorSwatchProps {
  name: string;
  value: string;
  description?: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}

/**
 * ColorSwatch - Single color swatch with copy functionality
 */
export function ColorSwatch({
  name,
  value,
  description,
  size = "md",
  className,
}: ColorSwatchProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const sizeClasses = {
    sm: "w-10 h-10",
    md: "w-14 h-14",
    lg: "w-20 h-20",
  };

  // Determine if text should be light or dark based on color brightness
  const isLightColor = (hex: string) => {
    const c = hex.replace("#", "");
    const rgb = parseInt(c, 16);
    const r = (rgb >> 16) & 0xff;
    const g = (rgb >> 8) & 0xff;
    const b = (rgb >> 0) & 0xff;
    const brightness = (r * 299 + g * 587 + b * 114) / 1000;
    return brightness > 155;
  };

  const textColor = isLightColor(value) ? "text-black/70" : "text-white/90";

  return (
    <button
      onClick={handleCopy}
      className={cn(
        "group relative rounded-xl overflow-hidden transition-all duration-200 hover:scale-105 hover:shadow-lg",
        "ring-1 ring-black/5 dark:ring-white/10",
        sizeClasses[size],
        className
      )}
      title={`${name}: ${value}\n${description || "Click to copy"}`}
    >
      {/* Color Fill */}
      <div
        className="absolute inset-0"
        style={{ backgroundColor: value }}
      />

      {/* Copy Overlay */}
      <div className={cn(
        "absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200",
        textColor
      )}>
        {copied ? (
          <Check className="w-4 h-4" />
        ) : (
          <Copy className="w-4 h-4" />
        )}
      </div>
    </button>
  );
}
