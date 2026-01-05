/**
 * Model Card Component
 * 
 * A refined card displaying detailed information about a Prisma model,
 * including fields, types, and relationships with elegant visual indicators.
 * 
 * Aesthetic: Clean data visualization with clear hierarchy
 */

import { Key, Hash, Link2, Calendar, Type, ToggleLeft, Text, Database } from "lucide-react";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { PrismaModel, PrismaField } from "@/types/schema";

interface ModelCardProps {
  model: PrismaModel;
  isSelected?: boolean;
  onClick?: () => void;
  className?: string;
  compact?: boolean;
}

export function ModelCard({
  model,
  isSelected = false,
  onClick,
  className,
  compact = false,
}: ModelCardProps) {
  const dataFields = model.fields.filter((f) => !f.isRelation);
  const relationCount = model.relations?.length ?? 0;

  return (
    <Card
      className={cn(
        "cursor-pointer transition-all duration-200",
        "hover:border-primary/40 hover:shadow-md hover:shadow-primary/5",
        isSelected && "border-primary ring-2 ring-primary/20 shadow-lg shadow-primary/10",
        className
      )}
      onClick={onClick}
    >
      <CardHeader className={cn("pb-3", compact && "pb-2 pt-3")}>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {/* Model indicator */}
            <div
              className={cn(
                "h-2.5 w-2.5 rounded-full transition-colors",
                isSelected ? "bg-primary" : "bg-primary/50"
              )}
            />
            <span className="text-base font-semibold">{model.name}</span>
          </div>

          {/* Field count badge */}
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Database className="h-3 w-3" />
            <span>{dataFields.length}</span>
          </div>
        </CardTitle>
      </CardHeader>

      <CardContent className={cn(compact && "pt-0")}>
        {/* Fields list */}
        <div className="space-y-1.5">
          {dataFields
            .slice(0, compact ? 4 : undefined)
            .map((field) => (
              <FieldRow key={field.name} field={field} compact={compact} />
            ))}

          {/* Show more indicator */}
          {compact && dataFields.length > 4 && (
            <div className="pt-1 text-xs text-muted-foreground text-center">
              +{dataFields.length - 4} more fields
            </div>
          )}
        </div>

        {/* Relations summary */}
        {relationCount > 0 && (
          <div className={cn("mt-4 pt-3 border-t border-dashed", compact && "mt-3 pt-2")}>
            <p className="text-xs text-muted-foreground mb-2 font-medium uppercase tracking-wide">
              Relations
            </p>
            <div className="flex flex-wrap gap-1.5">
              {model.relations?.map((rel) => (
                <span
                  key={rel.name || `${rel.fromModel}-${rel.toModel}`}
                  className={cn(
                    "inline-flex items-center gap-1 px-2 py-1 text-xs rounded-md",
                    "bg-gradient-to-r from-blue-500/10 to-indigo-500/10",
                    "border border-blue-500/20 text-blue-700 dark:text-blue-400",
                    "hover:from-blue-500/15 hover:to-indigo-500/15 transition-colors"
                  )}
                >
                  <Link2 className="h-3 w-3" />
                  {rel.toModel === model.name ? rel.fromModel : rel.toModel}
                </span>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

interface FieldRowProps {
  field: PrismaField;
  compact?: boolean;
}

function FieldRow({ field, compact }: FieldRowProps) {
  return (
    <div
      className={cn(
        "flex items-center justify-between py-1 px-2 -mx-2 rounded-md",
        "hover:bg-muted/50 transition-colors",
        compact && "py-0.5"
      )}
    >
      <div className="flex items-center gap-2 min-w-0">
        <FieldIcon field={field} />
        <span
          className={cn(
            "text-sm truncate",
            field.isOptional && "text-muted-foreground"
          )}
        >
          {field.name}
          {field.isOptional && (
            <span className="text-muted-foreground/60">?</span>
          )}
        </span>
      </div>

      <div className="flex items-center gap-2 flex-shrink-0">
        <span className="text-muted-foreground font-mono text-xs">
          {formatFieldType(field)}
        </span>
        <FieldBadges field={field} />
      </div>
    </div>
  );
}

function FieldIcon({ field }: { field: PrismaField }) {
  const iconClass = "h-3.5 w-3.5";

  if (field.isPrimaryKey) {
    return <Key className={cn(iconClass, "text-amber-500")} />;
  }
  if (field.isForeignKey) {
    return <Link2 className={cn(iconClass, "text-blue-500")} />;
  }

  // Type-based icons
  const baseType = field.type.replace("?", "").replace("[]", "");
  switch (baseType) {
    case "DateTime":
      return <Calendar className={cn(iconClass, "text-orange-500")} />;
    case "Boolean":
      return <ToggleLeft className={cn(iconClass, "text-green-500")} />;
    case "Int":
    case "Float":
    case "Decimal":
    case "BigInt":
      return <Hash className={cn(iconClass, "text-purple-500")} />;
    case "String":
      return <Text className={cn(iconClass, "text-muted-foreground")} />;
    default:
      return <Type className={cn(iconClass, "text-muted-foreground")} />;
  }
}

function formatFieldType(field: PrismaField): string {
  let type = field.type;
  if (field.isArray) type += "[]";
  return type;
}

function FieldBadges({ field }: { field: PrismaField }) {
  const badges: { label: string; className: string }[] = [];

  if (field.isPrimaryKey) {
    badges.push({
      label: "PK",
      className: "bg-amber-500/15 text-amber-700 dark:text-amber-400 border-amber-500/30",
    });
  }
  if (field.isForeignKey) {
    badges.push({
      label: "FK",
      className: "bg-blue-500/15 text-blue-700 dark:text-blue-400 border-blue-500/30",
    });
  }
  if (field.isUnique && !field.isPrimaryKey) {
    badges.push({
      label: "UQ",
      className: "bg-violet-500/15 text-violet-700 dark:text-violet-400 border-violet-500/30",
    });
  }

  if (badges.length === 0) return null;

  return (
    <div className="flex gap-1">
      {badges.map((badge) => (
        <span
          key={badge.label}
          className={cn(
            "px-1.5 py-0.5 text-[10px] font-semibold rounded border",
            badge.className
          )}
        >
          {badge.label}
        </span>
      ))}
    </div>
  );
}

/**
 * Compact model card for sidebar lists
 */
export function ModelCardCompact({
  model,
  isSelected,
  onClick,
  className,
}: Omit<ModelCardProps, "compact">) {
  return (
    <ModelCard
      model={model}
      isSelected={isSelected}
      onClick={onClick}
      className={className}
      compact
    />
  );
}
