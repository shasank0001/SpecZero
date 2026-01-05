/**
 * Empty State Component
 * 
 * A refined empty state display with copy-to-clipboard functionality.
 * Features subtle animations and clear visual hierarchy.
 * 
 * Aesthetic: Minimal with purposeful emptiness
 */

import type { LucideIcon } from "lucide-react";
import { Copy, Check, Sparkles } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  command?: string;
  className?: string;
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  command,
  className,
}: EmptyStateProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    if (command) {
      await navigator.clipboard.writeText(command);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <Card className={cn(
      "border-dashed border-2 bg-gradient-to-br from-muted/20 to-muted/40",
      "hover:border-primary/30 transition-all duration-300",
      className
    )}>
      <CardContent className="flex flex-col items-center justify-center py-16 px-8 text-center">
        {/* Decorative circles */}
        <div className="relative mb-6">
          <div className="absolute inset-0 rounded-full bg-primary/5 scale-150 animate-pulse" />
          <div className="absolute inset-0 rounded-full bg-primary/10 scale-125" />
          <div className="relative rounded-2xl bg-gradient-to-br from-muted to-muted/80 p-5 shadow-inner border border-border/50">
            <Icon className="h-8 w-8 text-muted-foreground" strokeWidth={1.5} />
          </div>
        </div>

        {/* Title with sparkle */}
        <div className="flex items-center gap-2 mb-3">
          <h3 className="font-display text-xl font-semibold text-foreground">
            {title}
          </h3>
        </div>

        {/* Description */}
        <p className="text-muted-foreground max-w-sm leading-relaxed mb-8">
          {description}
        </p>

        {/* Command (optional) */}
        {command && (
          <div className="group relative">
            {/* Glow effect on hover */}
            <div className="absolute inset-0 rounded-xl bg-primary/10 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            
            <div className="relative flex items-center gap-3 bg-card border border-border/80 rounded-xl px-5 py-3 shadow-sm">
              <Sparkles className="h-4 w-4 text-primary/60" />
              <code className="font-mono text-sm text-foreground font-medium">
                {command}
              </code>
              <Button
                variant="ghost"
                size="icon"
                className={cn(
                  "h-8 w-8 shrink-0 ml-2 rounded-lg",
                  "hover:bg-primary/10 hover:text-primary",
                  "transition-all duration-200"
                )}
                onClick={handleCopy}
              >
                {copied ? (
                  <Check className="h-4 w-4 text-green-500" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
                <span className="sr-only">Copy command</span>
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
