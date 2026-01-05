/**
 * Validator Viewer Component
 * 
 * A refined viewer for Zod validation schemas with syntax highlighting,
 * collapsible sections, and split/raw view modes.
 * 
 * Aesthetic: Technical documentation with clear code presentation
 */

import { useState } from "react";
import {
  Shield,
  ChevronRight,
  FileCode2,
  Layers,
  Code2,
  List,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { CodeBlock } from "@/components/shared/CodeBlock";

export interface ValidatorSchema {
  name: string;
  code: string;
  description?: string;
}

interface ValidatorViewerProps {
  schemas: ValidatorSchema[];
  rawContent?: string;
  className?: string;
}

type ViewMode = "split" | "raw";

export function ValidatorViewer({
  schemas,
  rawContent,
  className,
}: ValidatorViewerProps) {
  const [expandedSchemas, setExpandedSchemas] = useState<Set<string>>(
    new Set(schemas.slice(0, 3).map((s) => s.name))
  );
  const [viewMode, setViewMode] = useState<ViewMode>("split");

  const toggleSchema = (name: string) => {
    setExpandedSchemas((prev) => {
      const next = new Set(prev);
      if (next.has(name)) {
        next.delete(name);
      } else {
        next.add(name);
      }
      return next;
    });
  };

  const expandAll = () => {
    setExpandedSchemas(new Set(schemas.map((s) => s.name)));
  };

  const collapseAll = () => {
    setExpandedSchemas(new Set());
  };

  // Categorize schemas
  const baseSchemas = schemas.filter(
    (s) => !s.name.startsWith("Create") && !s.name.startsWith("Update")
  );
  const createSchemas = schemas.filter((s) => s.name.startsWith("Create"));
  const updateSchemas = schemas.filter((s) => s.name.startsWith("Update"));

  return (
    <div className={cn("flex flex-col h-full overflow-hidden", className)}>
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b bg-gradient-to-r from-muted/30 to-muted/10">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-green-500/10">
            <Shield className="h-4 w-4 text-green-600 dark:text-green-400" />
            <span className="text-sm font-semibold text-green-700 dark:text-green-400">
              Validators
            </span>
          </div>

          {/* Stats */}
          <div className="hidden md:flex items-center gap-2 text-xs text-muted-foreground">
            <div className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-muted/50">
              <Layers className="h-3 w-3" />
              <span>{schemas.length} schemas</span>
            </div>
            {baseSchemas.length > 0 && (
              <div className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400">
                <span>{baseSchemas.length} base</span>
              </div>
            )}
            {createSchemas.length > 0 && (
              <div className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-green-500/10 text-green-600 dark:text-green-400">
                <span>{createSchemas.length} create</span>
              </div>
            )}
            {updateSchemas.length > 0 && (
              <div className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400">
                <span>{updateSchemas.length} update</span>
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* View Mode Toggle */}
          <div className="flex items-center rounded-lg border bg-muted/30 p-0.5">
            <Button
              variant={viewMode === "split" ? "secondary" : "ghost"}
              size="sm"
              className="h-7 px-2.5 gap-1.5 text-xs"
              onClick={() => setViewMode("split")}
            >
              <List className="h-3.5 w-3.5" />
              Split
            </Button>
            <Button
              variant={viewMode === "raw" ? "secondary" : "ghost"}
              size="sm"
              className="h-7 px-2.5 gap-1.5 text-xs"
              onClick={() => setViewMode("raw")}
            >
              <Code2 className="h-3.5 w-3.5" />
              Raw
            </Button>
          </div>

          {/* Expand/Collapse */}
          {viewMode === "split" && (
            <div className="flex items-center gap-1 border-l pl-2 ml-1">
              <Button
                variant="ghost"
                size="sm"
                className="h-7 text-xs px-2"
                onClick={expandAll}
              >
                Expand All
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="h-7 text-xs px-2"
                onClick={collapseAll}
              >
                Collapse
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Content */}
      <ScrollArea className="flex-1">
        {viewMode === "raw" && rawContent ? (
          <div className="p-4">
            <CodeBlock
              code={rawContent}
              language="typescript"
              maxHeight="none"
              title="validators.ts"
            />
          </div>
        ) : (
          <div className="p-4 space-y-4">
            {/* Base Schemas Section */}
            {baseSchemas.length > 0 && (
              <SchemaSection
                title="Base Schemas"
                description="Core validation schemas for each entity"
                schemas={baseSchemas}
                expandedSchemas={expandedSchemas}
                onToggle={toggleSchema}
                accentColor="blue"
              />
            )}

            {/* Create Schemas Section */}
            {createSchemas.length > 0 && (
              <SchemaSection
                title="Create Schemas"
                description="Validation for creating new records"
                schemas={createSchemas}
                expandedSchemas={expandedSchemas}
                onToggle={toggleSchema}
                accentColor="green"
              />
            )}

            {/* Update Schemas Section */}
            {updateSchemas.length > 0 && (
              <SchemaSection
                title="Update Schemas"
                description="Validation for updating existing records"
                schemas={updateSchemas}
                expandedSchemas={expandedSchemas}
                onToggle={toggleSchema}
                accentColor="amber"
              />
            )}

            {/* Enum Schemas (if categorized separately) */}
            {schemas.filter((s) => s.name.includes("Enum")).length > 0 && (
              <SchemaSection
                title="Enums"
                description="Enumerated value types"
                schemas={schemas.filter((s) => s.name.includes("Enum"))}
                expandedSchemas={expandedSchemas}
                onToggle={toggleSchema}
                accentColor="purple"
              />
            )}
          </div>
        )}
      </ScrollArea>
    </div>
  );
}

interface SchemaSectionProps {
  title: string;
  description: string;
  schemas: ValidatorSchema[];
  expandedSchemas: Set<string>;
  onToggle: (name: string) => void;
  accentColor: "blue" | "green" | "amber" | "purple";
}

function SchemaSection({
  title,
  description,
  schemas,
  expandedSchemas,
  onToggle,
  accentColor,
}: SchemaSectionProps) {
  const colorClasses = {
    blue: {
      bg: "bg-blue-500/10",
      text: "text-blue-600 dark:text-blue-400",
      border: "border-blue-500/20",
    },
    green: {
      bg: "bg-green-500/10",
      text: "text-green-600 dark:text-green-400",
      border: "border-green-500/20",
    },
    amber: {
      bg: "bg-amber-500/10",
      text: "text-amber-600 dark:text-amber-400",
      border: "border-amber-500/20",
    },
    purple: {
      bg: "bg-purple-500/10",
      text: "text-purple-600 dark:text-purple-400",
      border: "border-purple-500/20",
    },
  };

  const colors = colorClasses[accentColor];

  return (
    <div className="space-y-3">
      {/* Section Header */}
      <div className="flex items-center gap-3">
        <div
          className={cn(
            "flex items-center gap-2 px-2.5 py-1 rounded-md",
            colors.bg,
            colors.border,
            "border"
          )}
        >
          <FileCode2 className={cn("h-3.5 w-3.5", colors.text)} />
          <span className={cn("text-sm font-medium", colors.text)}>
            {title}
          </span>
        </div>
        <span className="text-xs text-muted-foreground">{description}</span>
      </div>

      {/* Schema Cards */}
      <div className="space-y-2">
        {schemas.map((schema) => (
          <SchemaCard
            key={schema.name}
            schema={schema}
            isExpanded={expandedSchemas.has(schema.name)}
            onToggle={() => onToggle(schema.name)}
            accentColor={accentColor}
          />
        ))}
      </div>
    </div>
  );
}

interface SchemaCardProps {
  schema: ValidatorSchema;
  isExpanded: boolean;
  onToggle: () => void;
  accentColor: "blue" | "green" | "amber" | "purple";
}

function SchemaCard({ schema, isExpanded, onToggle, accentColor }: SchemaCardProps) {
  const iconColorClasses = {
    blue: "text-blue-500",
    green: "text-green-500",
    amber: "text-amber-500",
    purple: "text-purple-500",
  };

  return (
    <Card
      className={cn(
        "overflow-hidden transition-all duration-200",
        isExpanded && "ring-1 ring-primary/20"
      )}
    >
      <CardHeader
        className={cn(
          "py-3 cursor-pointer transition-colors",
          "hover:bg-muted/50",
          isExpanded && "bg-muted/30"
        )}
        onClick={onToggle}
      >
        <CardTitle className="flex items-center justify-between text-base">
          <div className="flex items-center gap-2">
            <div
              className={cn(
                "transition-transform duration-200",
                isExpanded && "rotate-90"
              )}
            >
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
            </div>
            <FileCode2 className={cn("h-4 w-4", iconColorClasses[accentColor])} />
            <span className="font-mono text-sm">{schema.name}</span>
          </div>

          {schema.description && (
            <span className="text-xs font-normal text-muted-foreground truncate max-w-[200px]">
              {schema.description}
            </span>
          )}
        </CardTitle>
      </CardHeader>

      <div
        className={cn(
          "grid transition-all duration-200",
          isExpanded ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
        )}
      >
        <div className="overflow-hidden">
          <CardContent className="pt-0 pb-4">
            <CodeBlock
              code={schema.code}
              language="typescript"
              showLineNumbers={false}
              maxHeight="280px"
              className="mt-2"
            />
          </CardContent>
        </div>
      </div>
    </Card>
  );
}

/**
 * Validator Viewer Skeleton for loading states
 */
export function ValidatorViewerSkeleton({ className }: { className?: string }) {
  return (
    <div className={cn("flex flex-col h-full", className)}>
      <div className="p-4 border-b bg-muted/30">
        <div className="h-6 w-32 bg-muted rounded animate-pulse" />
      </div>
      <div className="flex-1 p-4 space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="space-y-2">
            <div
              className="h-5 w-24 bg-muted rounded animate-pulse"
              style={{ animationDelay: `${i * 100}ms` }}
            />
            <div
              className="h-20 bg-muted/50 rounded-lg animate-pulse"
              style={{ animationDelay: `${i * 150}ms` }}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
