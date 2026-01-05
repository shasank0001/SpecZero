/**
 * Mermaid Generator
 * 
 * Converts parsed Prisma schema models to Mermaid ERD diagram syntax.
 * Handles models, fields, relationships, and proper formatting.
 */

import type { PrismaModel, PrismaField, PrismaRelation, RelationType } from "@/types/schema";

/**
 * Converts Prisma schema models to Mermaid ERD diagram syntax
 */
export function generateMermaidERD(models: PrismaModel[]): string {
  if (!models || models.length === 0) {
    return "";
  }

  const lines: string[] = ["erDiagram"];

  // Generate entity definitions for each model
  for (const model of models) {
    lines.push(`    ${model.name} {`);

    // Add fields (excluding relation fields)
    for (const field of model.fields) {
      if (field.isRelation) continue;

      const fieldLine = formatFieldLine(field);
      lines.push(`        ${fieldLine}`);
    }

    lines.push("    }");
    lines.push(""); // Empty line between models for readability
  }

  // Generate relationship lines
  const relationships = extractRelationships(models);
  for (const rel of relationships) {
    lines.push(`    ${rel}`);
  }

  return lines.join("\n");
}

/**
 * Formats a single field line for Mermaid ERD
 * Format: Type name "PK/FK"
 */
function formatFieldLine(field: PrismaField): string {
  const parts: string[] = [];

  // Map Prisma types to display types
  const displayType = mapPrismaType(field.type);
  parts.push(displayType);

  // Field name
  parts.push(field.name);

  // Key indicators as comment
  const modifiers: string[] = [];
  if (field.isPrimaryKey) modifiers.push("PK");
  if (field.isForeignKey) modifiers.push("FK");
  if (field.isUnique && !field.isPrimaryKey) modifiers.push("UK");

  if (modifiers.length > 0) {
    parts.push(`"${modifiers.join(",")}"`);
  }

  return parts.join(" ");
}

/**
 * Maps Prisma types to simplified display types for Mermaid
 */
function mapPrismaType(prismaType: string): string {
  const typeMap: Record<string, string> = {
    String: "string",
    Int: "int",
    Float: "float",
    Boolean: "boolean",
    DateTime: "datetime",
    Json: "json",
    BigInt: "bigint",
    Decimal: "decimal",
    Bytes: "bytes",
  };

  // Handle optional types (String?) and arrays (String[])
  const baseType = prismaType.replace("?", "").replace("[]", "");

  return typeMap[baseType] || baseType.toLowerCase();
}

/**
 * Extracts unique relationships from models and formats them for Mermaid
 */
function extractRelationships(models: PrismaModel[]): string[] {
  const relationships: string[] = [];
  const processedRelations = new Set<string>();

  for (const model of models) {
    if (!model.relations || model.relations.length === 0) continue;

    for (const relation of model.relations) {
      // Create unique key using sorted model names to avoid duplicates
      const sortedModels = [relation.fromModel, relation.toModel].sort();
      const relKey = `${sortedModels[0]}-${sortedModels[1]}-${relation.name}`;

      if (processedRelations.has(relKey)) continue;
      processedRelations.add(relKey);

      const mermaidRel = formatRelationship(relation);
      relationships.push(mermaidRel);
    }
  }

  return relationships;
}

/**
 * Formats a relationship for Mermaid ERD
 */
function formatRelationship(relation: PrismaRelation): string {
  const connector = getRelationshipConnector(relation.type);
  const label = relation.name ? `"${relation.name}"` : '""';
  
  return `${relation.fromModel} ${connector} ${relation.toModel} : ${label}`;
}

/**
 * Gets the Mermaid connector string based on relationship type
 * 
 * Relationship mapping:
 * | Prisma          | Mermaid  | Description          |
 * |-----------------|----------|---------------------|
 * | one-to-one      | ||--||   | Exactly one each     |
 * | one-to-many     | ||--o{   | One to zero or more  |
 * | many-to-many    | }o--o{   | Zero+ to zero+       |
 */
function getRelationshipConnector(relationType: RelationType): string {
  switch (relationType) {
    case "one-to-one":
      return "||--||";
    case "one-to-many":
      return "||--o{";
    case "many-to-many":
      return "}o--o{";
    default:
      return "||--o{"; // Default to one-to-many
  }
}

/**
 * Infers the relationship type from Prisma field definitions
 */
export function inferRelationType(
  field: PrismaField,
  relatedField?: PrismaField
): RelationType {
  const isArray = field.isArray;
  const relatedIsArray = relatedField?.isArray ?? false;

  if (isArray && relatedIsArray) {
    return "many-to-many";
  } else if (isArray || relatedIsArray) {
    return "one-to-many";
  } else {
    return "one-to-one";
  }
}

/**
 * Generates a simple model summary for display
 */
export function generateModelSummary(model: PrismaModel): {
  fieldCount: number;
  relationCount: number;
  hasPrimaryKey: boolean;
  foreignKeyCount: number;
} {
  const fields = model.fields.filter((f) => !f.isRelation);
  
  return {
    fieldCount: fields.length,
    relationCount: model.relations?.length ?? 0,
    hasPrimaryKey: fields.some((f) => f.isPrimaryKey),
    foreignKeyCount: fields.filter((f) => f.isForeignKey).length,
  };
}
