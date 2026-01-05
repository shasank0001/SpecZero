/**
 * Validators Loader
 *
 * Loads and parses Zod validator definitions from lib/validators.ts
 * so the Data tab can surface available schemas and exported types.
 */

import type { ValidatorFile, ValidatorSchema, ValidatorType } from "@/types/schema";

const validatorFiles = import.meta.glob("/lib/validators.ts", {
  query: "?raw",
  import: "default",
  eager: true,
}) as Record<string, string>;

/**
 * Loads validator file and returns parsed schemas/types
 */
export function loadValidators(): ValidatorFile | null {
  const content = validatorFiles["/lib/validators.ts"];
  if (!content) return null;
  return parseValidators(content);
}

/**
 * Quick existence check
 */
export function hasValidators(): boolean {
  return "/lib/validators.ts" in validatorFiles;
}

function parseValidators(content: string): ValidatorFile {
  return {
    schemas: extractSchemas(content),
    types: extractTypes(content),
    rawContent: content,
  };
}

function extractSchemas(content: string): ValidatorSchema[] {
  const schemas: ValidatorSchema[] = [];
  const exportConstRegex = /export const\s+(\w+)\s*=\s*z\./g;
  let match: RegExpExecArray | null;

  while ((match = exportConstRegex.exec(content)) !== null) {
    const name = match[1];
    const code = sliceExportBlock(content, match.index);
    schemas.push({ name, code, isExported: true });
  }

  return schemas;
}

function extractTypes(content: string): ValidatorType[] {
  const types: ValidatorType[] = [];
  const exportTypeRegex = /export type\s+(\w+)/g;
  let match: RegExpExecArray | null;

  while ((match = exportTypeRegex.exec(content)) !== null) {
    const name = match[1];
    const code = sliceExportBlock(content, match.index);
    types.push({ name, code, isExported: true });
  }

  return types;
}

/**
 * Grabs the export block starting at a given index until the next export or EOF.
 */
function sliceExportBlock(content: string, startIndex: number): string {
  const rest = content.slice(startIndex);
  const nextExport = rest.search(/\nexport\s+(const|type|interface)\s+/);
  if (nextExport === -1) return rest.trim();
  return rest.slice(0, nextExport).trim();
}
