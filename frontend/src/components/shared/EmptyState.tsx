/**
 * Empty State Component
 * 
 * A refined empty state display with copy-to-clipboard functionality.
 * Features subtle animations and clear visual hierarchy.
 * Shows both command (for Cursor/Windsurf) and file reference (for VS Code).
 * 
 * Aesthetic: Minimal with purposeful emptiness
 */

import type { LucideIcon } from "lucide-react";
import { Copy, Check, Sparkles, FileText } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  command?: string;
  className?: string;
}

// Map command names to prompt file paths
function getPromptFilePath(command: string): string | null {
  const commandName = command.replace(/^\//, '').split(' ')[0];
  const promptMap: Record<string, string> = {
    'product-vision': 'prompts/product-vision.md',
    'architect-database': 'prompts/architect-database.md',
    'design-tokens': 'prompts/design-tokens.md',
    'design-shell': 'prompts/design-shell.md',
    'design-screen': 'prompts/design-screen.md',
    'sample-data': 'prompts/sample-data.md',
    'create-roadmap': 'prompts/product-vision.md', // Alias to product-vision
  };
  return promptMap[commandName] || null;
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  command,
  className,
}: EmptyStateProps) {
  const [copiedCommand, setCopiedCommand] = useState(false);
  const [copiedFile, setCopiedFile] = useState(false);

  const promptFilePath = command ? getPromptFilePath(command) : null;

  const handleCopyCommand = async () => {
    if (command) {
      await navigator.clipboard.writeText(command);
      setCopiedCommand(true);
      setTimeout(() => setCopiedCommand(false), 2000);
    }
  };

  const handleCopyFilePath = async () => {
    if (promptFilePath) {
      // Copy the VS Code file reference format
      const fileRef = `#file:${promptFilePath}`;
      await navigator.clipboard.writeText(fileRef);
      setCopiedFile(true);
      setTimeout(() => setCopiedFile(false), 2000);
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
        <p className="text-muted-foreground max-w-sm leading-relaxed mb-6">
          {description}
        </p>

        {/* Command with IDE tabs */}
        {command && promptFilePath && (
          <div className="w-full max-w-md">
            <Tabs defaultValue="vscode" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-3">
                <TabsTrigger value="vscode" className="text-xs">
                  VS Code / Copilot
                </TabsTrigger>
                <TabsTrigger value="cursor" className="text-xs">
                  Cursor / Windsurf
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="vscode" className="mt-0">
                <div className="group relative">
                  <div className="absolute inset-0 rounded-xl bg-primary/10 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <div className="relative flex flex-col gap-2 bg-card border border-border/80 rounded-xl px-5 py-4 shadow-sm">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <FileText className="h-3 w-3" />
                      <span>Reference this file in Copilot Chat:</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <code className="font-mono text-sm text-foreground font-medium flex-1 text-left">
                        #file:{promptFilePath}
                      </code>
                      <Button
                        variant="ghost"
                        size="icon"
                        className={cn(
                          "h-8 w-8 shrink-0 rounded-lg",
                          "hover:bg-primary/10 hover:text-primary",
                          "transition-all duration-200"
                        )}
                        onClick={handleCopyFilePath}
                      >
                        {copiedFile ? (
                          <Check className="h-4 w-4 text-green-500" />
                        ) : (
                          <Copy className="h-4 w-4" />
                        )}
                        <span className="sr-only">Copy file reference</span>
                      </Button>
                    </div>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="cursor" className="mt-0">
                <div className="group relative">
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
                        "h-8 w-8 shrink-0 ml-auto rounded-lg",
                        "hover:bg-primary/10 hover:text-primary",
                        "transition-all duration-200"
                      )}
                      onClick={handleCopyCommand}
                    >
                      {copiedCommand ? (
                        <Check className="h-4 w-4 text-green-500" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                      <span className="sr-only">Copy command</span>
                    </Button>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        )}

        {/* Fallback: Command only (no prompt file mapping) */}
        {command && !promptFilePath && (
          <div className="group relative">
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
                onClick={handleCopyCommand}
              >
                {copiedCommand ? (
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
