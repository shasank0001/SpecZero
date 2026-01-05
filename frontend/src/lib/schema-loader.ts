/**
 * Schema Loader
 * 
 * Loads and parses Prisma schema files from the prisma/ directory.
 * Extracts models, fields, relations, and enums.
 */

import type {
  PrismaSchema,
  PrismaModel,
  PrismaField,
  PrismaRelation,
  PrismaEnum,
  PrismaAttribute,
  PrismaIndex,
  RelationType,
  PrismaDatasource,
  PrismaGenerator,
} from "@/types/schema";

// ==========================================
// FILE LOADING WITH VITE GLOB
// ==========================================

const schemaFiles = import.meta.glob("/prisma/*.prisma", {
  query: "?raw",
  import: "default",
  eager: true,
}) as Record<string, string>;

// ==========================================
// MAIN LOADER FUNCTION
// ==========================================

/**
 * Loads and parses the Prisma schema
 */
export function loadPrismaSchema(): PrismaSchema | null {
  const content = schemaFiles["/prisma/schema.prisma"];
  
  if (!content) {
    return null;
  }

  return parsePrismaSchema(content);
}

/**
 * Parses Prisma schema content into structured data
 */
function parsePrismaSchema(content: string): PrismaSchema {
  const models = parseModels(content);
  const enums = parseEnums(content);
  const datasource = parseDatasource(content);
  const generator = parseGenerator(content);
  
  // Build relations from model fields
  const relations = buildRelations(models);
  
  // Attach relations to models
  for (const model of models) {
    model.relations = relations.filter(
      (r) => r.fromModel === model.name || r.toModel === model.name
    );
  }
  
  return {
    models,
    enums,
    datasource,
    generator,
  };
}

// ==========================================
// MODEL PARSING
// ==========================================

/**
 * Parses all model definitions from schema
 */
function parseModels(content: string): PrismaModel[] {
  const models: PrismaModel[] = [];
  
  // Match model blocks
  const modelRegex = /model\s+(\w+)\s*\{([^}]+)\}/g;
  let match;
  
  while ((match = modelRegex.exec(content)) !== null) {
    const modelName = match[1];
    const modelBody = match[2];
    
    const fields = parseFields(modelBody);
    const indexes = parseIndexes(modelBody);
    
    models.push({
      name: modelName,
      fields,
      relations: [], // Populated later
      indexes,
    });
  }
  
  return models;
}

/**
 * Parses fields from a model body
 */
function parseFields(modelBody: string): PrismaField[] {
  const fields: PrismaField[] = [];
  const lines = modelBody.split("\n");
  
  for (const line of lines) {
    const trimmed = line.trim();
    
    // Skip empty lines, comments, and special directives
    if (!trimmed || trimmed.startsWith("//") || trimmed.startsWith("@@")) {
      continue;
    }
    
    const field = parseFieldLine(trimmed);
    if (field) {
      fields.push(field);
    }
  }
  
  return fields;
}

/**
 * Parses a single field line
 */
function parseFieldLine(line: string): PrismaField | null {
  // Field pattern: fieldName Type? @attributes
  const fieldRegex = /^(\w+)\s+(\w+)(\[\])?(\?)?\s*(.*)?$/;
  const match = line.match(fieldRegex);
  
  if (!match) return null;
  
  const [, name, type, isArray, isOptional, attributesStr] = match;
  
  // Parse attributes
  const attributes = parseAttributes(attributesStr || "");
  
  // Determine field properties from attributes
  const isPrimaryKey = attributes.some((a) => a.name === "id");
  const isUnique = attributes.some((a) => a.name === "unique");
  const isForeignKey = attributes.some((a) => a.name === "relation");
  const isRelation = isRelationType(type);
  
  // Extract default value
  const defaultAttr = attributes.find((a) => a.name === "default");
  const defaultValue = defaultAttr ? defaultAttr.args[0] : undefined;
  
  return {
    name,
    type,
    isOptional: !!isOptional,
    isArray: !!isArray,
    isUnique,
    isPrimaryKey,
    isForeignKey,
    isRelation,
    default: defaultValue,
    attributes,
  };
}

/**
 * Parses attributes from a string like @id @default(cuid())
 */
function parseAttributes(str: string): PrismaAttribute[] {
  const attributes: PrismaAttribute[] = [];
  
  // Match @attribute or @attribute(args)
  const attrRegex = /@(\w+)(?:\(([^)]*)\))?/g;
  let match;
  
  while ((match = attrRegex.exec(str)) !== null) {
    const name = match[1];
    const argsStr = match[2] || "";
    
    // Parse arguments
    const args = argsStr
      .split(",")
      .map((a) => a.trim())
      .filter((a) => a);
    
    attributes.push({ name, args });
  }
  
  return attributes;
}

/**
 * Checks if a type is a relation (model reference)
 */
function isRelationType(type: string): boolean {
  // Prisma scalar types
  const scalarTypes = [
    "String",
    "Int",
    "Float",
    "Boolean",
    "DateTime",
    "Json",
    "Bytes",
    "BigInt",
    "Decimal",
  ];
  
  return !scalarTypes.includes(type);
}

/**
 * Parses @@index and @@unique directives
 */
function parseIndexes(modelBody: string): PrismaIndex[] {
  const indexes: PrismaIndex[] = [];
  const lines = modelBody.split("\n");
  
  for (const line of lines) {
    const trimmed = line.trim();
    
    // Match @@index([field1, field2])
    const indexMatch = trimmed.match(/@@index\(\[([^\]]+)\]\)/);
    if (indexMatch) {
      const fields = indexMatch[1].split(",").map((f) => f.trim());
      indexes.push({ fields, isUnique: false });
    }
    
    // Match @@unique([field1, field2])
    const uniqueMatch = trimmed.match(/@@unique\(\[([^\]]+)\]\)/);
    if (uniqueMatch) {
      const fields = uniqueMatch[1].split(",").map((f) => f.trim());
      indexes.push({ fields, isUnique: true });
    }
  }
  
  return indexes;
}

// ==========================================
// ENUM PARSING
// ==========================================

/**
 * Parses all enum definitions from schema
 */
function parseEnums(content: string): PrismaEnum[] {
  const enums: PrismaEnum[] = [];
  
  // Match enum blocks
  const enumRegex = /enum\s+(\w+)\s*\{([^}]+)\}/g;
  let match;
  
  while ((match = enumRegex.exec(content)) !== null) {
    const enumName = match[1];
    const enumBody = match[2];
    
    // Extract values (each line is a value)
    const values = enumBody
      .split("\n")
      .map((line) => line.trim())
      .filter((line) => line && !line.startsWith("//"));
    
    enums.push({
      name: enumName,
      values,
    });
  }
  
  return enums;
}

// ==========================================
// RELATION BUILDING
// ==========================================

/**
 * Builds relations from model fields
 */
function buildRelations(models: PrismaModel[]): PrismaRelation[] {
  const relations: PrismaRelation[] = [];
  const seen = new Set<string>();

  const addRelation = (
    fromModel: string,
    toModel: string,
    type: RelationType,
    fromField: string,
    toField: string,
    onDelete?: string
  ) => {
    const key = `${fromModel}:${fromField}->${toModel}:${toField || ""}`;
    if (seen.has(key)) return;
    seen.add(key);
    relations.push({
      name: `${fromModel}_${fromField || toField || toModel}`,
      fromModel,
      toModel,
      fromField,
      toField,
      type,
      onDelete,
    });
  };
  
  for (const model of models) {
    for (const field of model.fields) {
      if (!field.isRelation) continue;
      
      // Find the relation attribute
      const relationAttr = field.attributes.find((a) => a.name === "relation");
      
      if (!relationAttr) {
        // This is the "many" side of a relation (e.g., appointments Appointment[])
        continue;
      }
      
      // Parse relation attribute: @relation(fields: [patientId], references: [id])
      const fieldsMatch = relationAttr.args.find((a) => a.startsWith("fields:"));
      const refsMatch = relationAttr.args.find((a) => a.startsWith("references:"));
      const onDeleteMatch = relationAttr.args.find((a) => a.startsWith("onDelete:"));
      
      if (!fieldsMatch || !refsMatch) continue;
      
      // Extract field names
      const fromField = fieldsMatch.match(/\[(\w+)\]/)?.[1] || "";
      const toField = refsMatch.match(/\[(\w+)\]/)?.[1] || "";
      const onDelete = onDeleteMatch?.split(":")[1]?.trim();
      
      // Determine relation type
      const toModel = field.type;
      const type = determineRelationType(model, field, models);
      
      addRelation(model.name, toModel, type, fromField, toField, onDelete);
    }
  }

  // Pass 2: infer relations missing @relation (e.g., many-to-many shorthand)
  for (const model of models) {
    for (const field of model.fields) {
      if (!field.isRelation) continue;

      const hasExplicitRelation = field.attributes.some((a) => a.name === "relation");
      if (hasExplicitRelation) continue;

      const targetModel = models.find((m) => m.name === field.type);
      if (!targetModel) continue;

      const reverseField = targetModel.fields.find((f) => f.type === model.name);

      // Determine inferred relation type
      if (field.isArray && reverseField?.isArray) {
        addRelation(model.name, targetModel.name, "many-to-many", field.name, reverseField.name);
      } else if (field.isArray) {
        addRelation(model.name, targetModel.name, "one-to-many", field.name, reverseField?.name || "");
      } else if (reverseField?.isArray) {
        addRelation(model.name, targetModel.name, "one-to-many", field.name, reverseField.name);
      } else {
        addRelation(model.name, targetModel.name, "one-to-one", field.name, reverseField?.name || "");
      }
    }
  }
  
  return relations;
}

/**
 * Determines the type of relation (one-to-one, one-to-many, many-to-many)
 */
function determineRelationType(
  fromModel: PrismaModel,
  field: PrismaField,
  models: PrismaModel[]
): RelationType {
  const toModel = models.find((m) => m.name === field.type);
  if (!toModel) return "one-to-many";
  
  // Check if the reverse relation is an array
  const reverseField = toModel.fields.find(
    (f) => f.type === fromModel.name
  );
  
  if (!reverseField) return "one-to-many";
  
  if (reverseField.isArray) {
    return "one-to-many"; // From perspective of this field
  }
  
  return "one-to-one";
}

// ==========================================
// DATASOURCE & GENERATOR PARSING
// ==========================================

/**
 * Parses datasource configuration
 */
function parseDatasource(content: string): PrismaDatasource | null {
  const match = content.match(/datasource\s+(\w+)\s*\{([^}]+)\}/);
  if (!match) return null;
  
  const name = match[1];
  const body = match[2];
  
  const providerMatch = body.match(/provider\s*=\s*"([^"]+)"/);
  const urlMatch = body.match(/url\s*=\s*(?:env\("([^"]+)"\)|"([^"]+)")/);
  
  return {
    name,
    provider: providerMatch?.[1] || "",
    url: urlMatch?.[1] || urlMatch?.[2] || "",
  };
}

/**
 * Parses generator configuration
 */
function parseGenerator(content: string): PrismaGenerator | null {
  const match = content.match(/generator\s+(\w+)\s*\{([^}]+)\}/);
  if (!match) return null;
  
  const name = match[1];
  const body = match[2];
  
  const providerMatch = body.match(/provider\s*=\s*"([^"]+)"/);
  
  return {
    name,
    provider: providerMatch?.[1] || "",
  };
}

// ==========================================
// UTILITY EXPORTS
// ==========================================

/**
 * Checks if Prisma schema exists
 */
export function hasPrismaSchema(): boolean {
  return "/prisma/schema.prisma" in schemaFiles;
}

/**
 * Gets raw schema content
 */
export function getRawSchema(): string | null {
  return schemaFiles["/prisma/schema.prisma"] ?? null;
}

/**
 * Gets all model names
 */
export function getModelNames(): string[] {
  const schema = loadPrismaSchema();
  if (!schema) return [];
  return schema.models.map((m) => m.name);
}

/**
 * Gets a specific model by name
 */
export function getModel(name: string): PrismaModel | null {
  const schema = loadPrismaSchema();
  if (!schema) return null;
  return schema.models.find((m) => m.name === name) ?? null;
}
