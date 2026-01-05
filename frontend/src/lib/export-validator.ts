/**
 * Export Validator
 * 
 * Validates project completeness and component patterns before export.
 */

import { loadProductOverview, loadProductRoadmap } from './product-loader';
import { loadPrismaSchema } from './schema-loader';
import { loadAllSections } from './section-loader';
import { loadDesignSystem } from './design-system-loader';

// ==========================================
// TYPES
// ==========================================

export interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
  warnings: ValidationWarning[];
  summary: ValidationSummary;
}

export interface ValidationError {
  code: string;
  message: string;
  file?: string;
  suggestion?: string;
}

export interface ValidationWarning {
  code: string;
  message: string;
  file?: string;
  suggestion?: string;
}

export interface ValidationSummary {
  totalChecks: number;
  passedChecks: number;
  failedChecks: number;
  warningCount: number;
  completionPercentage: number;
}

// Validation rule codes
export const ValidationCodes = {
  // Critical errors
  MISSING_PRODUCT_OVERVIEW: 'E001',
  MISSING_PRISMA_SCHEMA: 'E002',
  MISSING_VALIDATORS: 'E003',
  INVALID_PRISMA_SYNTAX: 'E005',
  DATA_IMPORTING_COMPONENT: 'E006',
  
  // Warnings
  MISSING_DESIGN_TOKENS: 'W001',
  MISSING_SECTIONS: 'W002',
  MISSING_SHELL: 'W003',
  MISSING_SAMPLE_DATA: 'W004',
  MISSING_ROADMAP: 'W006',
} as const;

// ==========================================
// VALIDATION CHECKS
// ==========================================

/**
 * Check if product overview exists
 */
function checkProductOverview(): ValidationError | null {
  const overview = loadProductOverview();
  if (!overview) {
    return {
      code: ValidationCodes.MISSING_PRODUCT_OVERVIEW,
      message: 'Missing product-overview.md file',
      file: 'product/product-overview.md',
      suggestion: 'Create product-overview.md with project name, description, and features',
    };
  }
  return null;
}

/**
 * Check if product roadmap exists
 */
function checkProductRoadmap(): ValidationWarning | null {
  const roadmap = loadProductRoadmap();
  if (!roadmap) {
    return {
      code: ValidationCodes.MISSING_ROADMAP,
      message: 'Missing product-roadmap.md file',
      file: 'product/product-roadmap.md',
      suggestion: 'Create product-roadmap.md to define implementation phases',
    };
  }
  return null;
}

/**
 * Check if Prisma schema exists and is valid
 */
function checkPrismaSchema(): ValidationError | null {
  try {
    const schema = loadPrismaSchema();
    if (!schema || schema.models.length === 0) {
      return {
        code: ValidationCodes.MISSING_PRISMA_SCHEMA,
        message: 'Missing or empty schema.prisma file',
        file: 'prisma/schema.prisma',
        suggestion: 'Create schema.prisma with at least one model',
      };
    }
    return null;
  } catch (error) {
    return {
      code: ValidationCodes.INVALID_PRISMA_SYNTAX,
      message: `Invalid Prisma schema syntax: ${error instanceof Error ? error.message : 'Unknown error'}`,
      file: 'prisma/schema.prisma',
      suggestion: 'Fix syntax errors in schema.prisma',
    };
  }
}

/**
 * Check if validators file exists
 */
function checkValidators(): ValidationError | null {
  // Load validators using Vite's glob
  const validatorFiles = import.meta.glob('/lib/validators.ts', {
    query: '?raw',
    import: 'default',
    eager: true,
  }) as Record<string, string>;
  
  const validatorsContent = validatorFiles['/lib/validators.ts'];
  if (!validatorsContent) {
    return {
      code: ValidationCodes.MISSING_VALIDATORS,
      message: 'Missing validators.ts file',
      file: 'lib/validators.ts',
      suggestion: 'Create validators.ts with Zod schemas matching your Prisma models',
    };
  }
  return null;
}

/**
 * Check if design tokens exist
 */
function checkDesignTokens(): ValidationWarning | null {
  const designSystem = loadDesignSystem();
  if (!designSystem.colors || !designSystem.typography) {
    return {
      code: ValidationCodes.MISSING_DESIGN_TOKENS,
      message: 'Missing design tokens (colors.json and/or typography.json)',
      file: 'product/design-system/',
      suggestion: 'Create colors.json and typography.json for consistent styling',
    };
  }
  return null;
}

/**
 * Check if sections are defined
 */
function checkSections(): ValidationWarning | null {
  const sections = loadAllSections();
  if (!sections || sections.length === 0) {
    return {
      code: ValidationCodes.MISSING_SECTIONS,
      message: 'No sections defined',
      file: 'product/sections/',
      suggestion: 'Create at least one section in product/sections/',
    };
  }
  return null;
}

/**
 * Check if shell components exist
 */
function checkShell(): ValidationWarning | null {
  const shellFiles = import.meta.glob('/src/shell/components/*.tsx', {
    query: '?raw',
    import: 'default',
    eager: true,
  }) as Record<string, string>;
  
  const hasAppShell = Object.keys(shellFiles).some(path => 
    path.includes('AppShell')
  );
  
  if (!hasAppShell) {
    return {
      code: ValidationCodes.MISSING_SHELL,
      message: 'Missing shell components',
      file: 'src/shell/components/',
      suggestion: 'Create AppShell.tsx, MainNav.tsx, and UserMenu.tsx',
    };
  }
  return null;
}

/**
 * Check if exportable components import data directly
 * 
 * Components in src/sections/{name}/components/ should NOT import:
 * - data.json files
 * - /product/ paths
 * - Local fixture data
 */
function checkPropsOnlyComponents(): ValidationError[] {
  const errors: ValidationError[] = [];
  
  // Get all component files in sections
  const sectionComponents = import.meta.glob(
    '/src/sections/*/components/*.tsx',
    { query: '?raw', import: 'default', eager: true }
  ) as Record<string, string>;
  
  for (const [filePath, content] of Object.entries(sectionComponents)) {
    // Check for data imports
    const dataImportPatterns = [
      /import\s+.*\s+from\s+['"].*data\.json['"]/,
      /import\s+.*\s+from\s+['"].*\/product\//,
      /import\s+data\s+from/,
    ];
    
    for (const pattern of dataImportPatterns) {
      if (pattern.test(content)) {
        errors.push({
          code: ValidationCodes.DATA_IMPORTING_COMPONENT,
          message: `Component imports data directly instead of receiving via props`,
          file: filePath,
          suggestion: 'Refactor to receive data via props. Use preview wrapper for sample data.',
        });
        break;
      }
    }
  }
  
  return errors;
}

// ==========================================
// MAIN VALIDATION FUNCTION
// ==========================================

/**
 * Run all validation checks
 */
export function validateExport(): ValidationResult {
  const errors: ValidationError[] = [];
  const warnings: ValidationWarning[] = [];
  
  // Critical checks (must pass)
  const productOverviewError = checkProductOverview();
  if (productOverviewError) errors.push(productOverviewError);
  
  const prismaSchemaError = checkPrismaSchema();
  if (prismaSchemaError) errors.push(prismaSchemaError);
  
  const validatorsError = checkValidators();
  if (validatorsError) errors.push(validatorsError);
  
  const propsOnlyErrors = checkPropsOnlyComponents();
  errors.push(...propsOnlyErrors);
  
  // Warning checks (recommended but not required)
  const roadmapWarning = checkProductRoadmap();
  if (roadmapWarning) warnings.push(roadmapWarning);
  
  const designTokensWarning = checkDesignTokens();
  if (designTokensWarning) warnings.push(designTokensWarning);
  
  const sectionsWarning = checkSections();
  if (sectionsWarning) warnings.push(sectionsWarning);
  
  const shellWarning = checkShell();
  if (shellWarning) warnings.push(shellWarning);
  
  // Calculate summary
  const totalChecks = 8; // Total number of checks
  const failedChecks = errors.length;
  const warningChecks = warnings.length;
  const passedChecks = totalChecks - failedChecks - warningChecks;
  
  const summary: ValidationSummary = {
    totalChecks,
    passedChecks,
    failedChecks,
    warningCount: warningChecks,
    completionPercentage: Math.round((passedChecks / totalChecks) * 100),
  };
  
  return {
    isValid: errors.length === 0,
    errors,
    warnings,
    summary,
  };
}

/**
 * Get human-readable validation status
 */
export function getValidationStatus(result: ValidationResult): string {
  if (result.isValid && result.warnings.length === 0) {
    return 'Ready to export';
  }
  if (result.isValid) {
    return `Ready with ${result.warnings.length} warning(s)`;
  }
  return `${result.errors.length} error(s) must be fixed`;
}

/**
 * Get individual check results for display
 */
export interface CheckResult {
  name: string;
  status: 'pass' | 'warning' | 'error';
  message?: string;
}

export function getCheckResults(): CheckResult[] {
  const results: CheckResult[] = [];
  
  // Product Overview
  const overviewError = checkProductOverview();
  results.push({
    name: 'Product Overview',
    status: overviewError ? 'error' : 'pass',
    message: overviewError?.suggestion,
  });
  
  // Prisma Schema
  const schemaError = checkPrismaSchema();
  results.push({
    name: 'Database Schema',
    status: schemaError ? 'error' : 'pass',
    message: schemaError?.suggestion,
  });
  
  // Validators
  const validatorsError = checkValidators();
  results.push({
    name: 'Validators',
    status: validatorsError ? 'error' : 'pass',
    message: validatorsError?.suggestion,
  });
  
  // Design Tokens
  const designWarning = checkDesignTokens();
  results.push({
    name: 'Design Tokens',
    status: designWarning ? 'warning' : 'pass',
    message: designWarning?.suggestion,
  });
  
  // Sections
  const sectionsWarning = checkSections();
  results.push({
    name: 'Feature Sections',
    status: sectionsWarning ? 'warning' : 'pass',
    message: sectionsWarning?.suggestion,
  });
  
  // Shell
  const shellWarning = checkShell();
  results.push({
    name: 'App Shell',
    status: shellWarning ? 'warning' : 'pass',
    message: shellWarning?.suggestion,
  });
  
  // Roadmap
  const roadmapWarning = checkProductRoadmap();
  results.push({
    name: 'Product Roadmap',
    status: roadmapWarning ? 'warning' : 'pass',
    message: roadmapWarning?.suggestion,
  });
  
  return results;
}
