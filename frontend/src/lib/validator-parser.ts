/**
 * Validator Parser
 * 
 * Parses validators.ts file content to extract individual Zod schemas.
 * Handles various schema patterns and JSDoc comments.
 */

export interface ParsedValidator {
  name: string;
  code: string;
  description?: string;
}

/**
 * Parses a validators.ts file and extracts individual Zod schemas
 */
export function parseValidators(content: string): ParsedValidator[] {
  const validators: ParsedValidator[] = [];
  
  // Split content into logical blocks
  const lines = content.split("\n");
  let currentBlock: string[] = [];
  let currentComment = "";
  let isInBlock = false;
  let braceCount = 0;
  let schemaName = "";

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmedLine = line.trim();

    // Capture JSDoc comments
    if (trimmedLine.startsWith("/**")) {
      currentComment = "";
      let j = i;
      while (j < lines.length && !lines[j].includes("*/")) {
        currentComment += lines[j] + "\n";
        j++;
      }
      if (j < lines.length) {
        currentComment += lines[j];
      }
      continue;
    }

    // Skip single-line comments and empty lines when not in a block
    if (!isInBlock && (trimmedLine.startsWith("//") || trimmedLine === "")) {
      continue;
    }

    // Detect start of export statement
    if (
      !isInBlock &&
      (trimmedLine.startsWith("export const ") || trimmedLine.startsWith("export let "))
    ) {
      isInBlock = true;
      currentBlock = [line];
      braceCount = (line.match(/\(/g) || []).length - (line.match(/\)/g) || []).length;
      braceCount += (line.match(/\{/g) || []).length - (line.match(/\}/g) || []).length;

      // Extract schema name
      const nameMatch = trimmedLine.match(/export\s+(?:const|let)\s+(\w+)/);
      schemaName = nameMatch ? nameMatch[1] : "";

      // Check if it's a single-line declaration
      if (braceCount === 0 && trimmedLine.endsWith(";")) {
        const description = extractDescription(currentComment);
        validators.push({
          name: schemaName,
          code: currentBlock.join("\n"),
          description,
        });
        isInBlock = false;
        currentBlock = [];
        currentComment = "";
        schemaName = "";
      }
      continue;
    }

    // Continue building the block
    if (isInBlock) {
      currentBlock.push(line);
      braceCount += (line.match(/\(/g) || []).length - (line.match(/\)/g) || []).length;
      braceCount += (line.match(/\{/g) || []).length - (line.match(/\}/g) || []).length;

      // Check if block is complete
      if (braceCount <= 0 && (trimmedLine.endsWith(";") || trimmedLine.endsWith(")"))) {
        const description = extractDescription(currentComment);
        validators.push({
          name: schemaName,
          code: currentBlock.join("\n"),
          description,
        });
        isInBlock = false;
        currentBlock = [];
        currentComment = "";
        schemaName = "";
      }
    }
  }

  // Handle any remaining block
  if (isInBlock && currentBlock.length > 0 && schemaName) {
    validators.push({
      name: schemaName,
      code: currentBlock.join("\n"),
      description: extractDescription(currentComment),
    });
  }

  return validators;
}

/**
 * Extracts a clean description from a JSDoc comment
 */
function extractDescription(comment: string): string | undefined {
  if (!comment) return undefined;

  // Remove JSDoc markers and clean up
  const cleaned = comment
    .replace(/\/\*\*|\*\/|\*/g, "")
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line && !line.startsWith("@"))
    .join(" ")
    .trim();

  return cleaned || undefined;
}

/**
 * Categorizes validators by type
 */
export function categorizeValidators(validators: ParsedValidator[]): {
  base: ParsedValidator[];
  create: ParsedValidator[];
  update: ParsedValidator[];
  enums: ParsedValidator[];
  other: ParsedValidator[];
} {
  return {
    base: validators.filter(
      (v) =>
        v.name.endsWith("Schema") &&
        !v.name.startsWith("Create") &&
        !v.name.startsWith("Update") &&
        !v.name.includes("Enum")
    ),
    create: validators.filter((v) => v.name.startsWith("Create")),
    update: validators.filter((v) => v.name.startsWith("Update")),
    enums: validators.filter((v) => v.name.includes("Enum")),
    other: validators.filter(
      (v) =>
        !v.name.endsWith("Schema") &&
        !v.name.startsWith("Create") &&
        !v.name.startsWith("Update") &&
        !v.name.includes("Enum")
    ),
  };
}

/**
 * Gets the schema count summary
 */
export function getValidatorSummary(validators: ParsedValidator[]): {
  total: number;
  byType: Record<string, number>;
} {
  const categorized = categorizeValidators(validators);

  return {
    total: validators.length,
    byType: {
      base: categorized.base.length,
      create: categorized.create.length,
      update: categorized.update.length,
      enums: categorized.enums.length,
      other: categorized.other.length,
    },
  };
}
