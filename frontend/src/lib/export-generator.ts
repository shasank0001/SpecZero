/**
 * Export Generator
 * 
 * Generates a complete Next.js project scaffold as a ZIP file.
 */

import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import { transformFiles } from './path-transformer';
import { validateExport } from './export-validator';
import { loadProductOverview } from './product-loader';
import { loadAllSections } from './section-loader';
import { loadDesignSystem } from './design-system-loader';
import {
  generatePackageJson,
  generateTsConfig,
  generateEnvExample,
  generateNextConfig,
  generateGlobalsCss,
  generatePostcssConfig,
  generateCursorRules,
  generateReadme,
  type TemplateConfig,
} from '@/templates';
import {
  generateKickoffPrompt,
  generateMainInstructions,
  generatePhase1Instructions,
  generatePhase2Instructions,
  generateSectionInstructions,
} from '@/templates/instructions';

// ==========================================
// TYPES
// ==========================================

export interface ExportOptions {
  projectName?: string;
  includePreviewWrappers?: boolean;
}

export interface ExportProgress {
  stage: string;
  percentage: number;
}

export type ProgressCallback = (progress: ExportProgress) => void;

// ==========================================
// FILE COLLECTION FUNCTIONS
// ==========================================

/**
 * Collect all product files
 */
function collectProductFiles(): Map<string, string> {
  const files = new Map<string, string>();
  
  // Load markdown files from product/
  const productMd = import.meta.glob('/product/**/*.md', {
    query: '?raw',
    import: 'default',
    eager: true,
  }) as Record<string, string>;
  
  for (const [path, content] of Object.entries(productMd)) {
    // Convert /product/... to docs/product/...
    const exportPath = path.replace('/product/', 'docs/product/');
    files.set(exportPath, content);
  }
  
  return files;
}

/**
 * Collect Prisma schema files
 */
function collectPrismaFiles(): Map<string, string> {
  const files = new Map<string, string>();
  
  const prismaFiles = import.meta.glob('/prisma/**/*', {
    query: '?raw',
    import: 'default',
    eager: true,
  }) as Record<string, string>;
  
  for (const [path, content] of Object.entries(prismaFiles)) {
    files.set(path.slice(1), content); // Remove leading /
  }
  
  return files;
}

/**
 * Collect component files (shell and sections)
 */
function collectComponentFiles(includePreviewWrappers: boolean): Map<string, string> {
  const files = new Map<string, string>();
  
  // Collect shell components
  const shellFiles = import.meta.glob('/src/shell/components/*.tsx', {
    query: '?raw',
    import: 'default',
    eager: true,
  }) as Record<string, string>;
  
  for (const [path, content] of Object.entries(shellFiles)) {
    const exportPath = path.replace('/src/shell/', 'src/components/shell/');
    files.set(exportPath, content);
  }
  
  // Collect section components (only from components/ subfolder)
  const sectionComponents = import.meta.glob('/src/sections/*/components/**/*.tsx', {
    query: '?raw',
    import: 'default',
    eager: true,
  }) as Record<string, string>;
  
  for (const [path, content] of Object.entries(sectionComponents)) {
    const exportPath = path.replace('/src/sections/', 'src/components/sections/');
    files.set(exportPath, content);
  }
  
  // Optionally collect preview wrappers (not typically exported)
  if (includePreviewWrappers) {
    const previewFiles = import.meta.glob('/src/sections/*/*.tsx', {
      query: '?raw',
      import: 'default',
      eager: true,
    }) as Record<string, string>;
    
    for (const [path, content] of Object.entries(previewFiles)) {
      // Skip if it's in components/ folder
      if (path.includes('/components/')) continue;
      const exportPath = path.replace('/src/sections/', 'previews/sections/');
      files.set(exportPath, content);
    }
  }
  
  return files;
}

/**
 * Collect UI components
 */
function collectUIComponents(): Map<string, string> {
  const files = new Map<string, string>();
  
  const uiFiles = import.meta.glob('/src/components/ui/*.tsx', {
    query: '?raw',
    import: 'default',
    eager: true,
  }) as Record<string, string>;
  
  for (const [path, content] of Object.entries(uiFiles)) {
    files.set(path.slice(1), content); // Remove leading /
  }
  
  return files;
}

/**
 * Collect lib files (utils, validators)
 */
function collectLibFiles(): Map<string, string> {
  const files = new Map<string, string>();
  
  const libFiles = import.meta.glob('/lib/**/*.ts', {
    query: '?raw',
    import: 'default',
    eager: true,
  }) as Record<string, string>;
  
  for (const [path, content] of Object.entries(libFiles)) {
    // Move to src/lib/
    const exportPath = `src${path}`;
    files.set(exportPath, content);
  }
  
  return files;
}

/**
 * Collect design system files
 */
function collectDesignSystemFiles(): Map<string, string> {
  const files = new Map<string, string>();
  
  const designFiles = import.meta.glob('/product/design-system/**/*.json', {
    query: '?raw',
    import: 'default',
    eager: true,
  }) as Record<string, string>;
  
  for (const [path, content] of Object.entries(designFiles)) {
    const exportPath = path.replace('/product/', '');
    files.set(exportPath, content);
  }
  
  return files;
}

/**
 * Collect sample data files
 */
function collectSampleDataFiles(): Map<string, string> {
  const files = new Map<string, string>();
  
  const dataFiles = import.meta.glob('/product/sections/**/data.json', {
    query: '?raw',
    import: 'default',
    eager: true,
  }) as Record<string, string>;
  
  for (const [path, content] of Object.entries(dataFiles)) {
    const exportPath = path.replace('/product/sections/', 'sample-data/');
    files.set(exportPath, content);
  }
  
  const typeFiles = import.meta.glob('/product/sections/**/types.ts', {
    query: '?raw',
    import: 'default',
    eager: true,
  }) as Record<string, string>;
  
  for (const [path, content] of Object.entries(typeFiles)) {
    const exportPath = path.replace('/product/sections/', 'sample-data/');
    files.set(exportPath, content);
  }
  
  return files;
}

// ==========================================
// SEED FILE GENERATOR
// ==========================================

/**
 * Generate Prisma seed file from sample data
 */
function generateSeedFile(sections: string[]): string {
  return `import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');
  
  // Clear existing data (optional - remove in production)
  // await prisma.$executeRaw\`TRUNCATE TABLE ... CASCADE\`;
  
${sections.map(section => `  // Seed ${section} data
  // const ${section.toLowerCase()}Data = await import('../sample-data/${section}/data.json');
  // await prisma.${section.toLowerCase()}.createMany({ data: ${section.toLowerCase()}Data.default });
  // console.log('✓ ${section} seeded');
`).join('\n')}
  
  console.log('✅ Database seeded successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
`;
}

// ==========================================
// UTILS GENERATOR
// ==========================================

function generateUtilsFile(): string {
  return `import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
`;
}

// ==========================================
// MAIN EXPORT FUNCTION
// ==========================================

/**
 * Collect all files that will be exported
 * (useful for preview before download)
 */
export function collectExportFiles(options: ExportOptions = {}): Map<string, string> {
  const allFiles = new Map<string, string>();
  
  // Load project data for templates
  const overview = loadProductOverview();
  const sections = loadAllSections();
  const designSystem = loadDesignSystem();
  
  const projectName = options.projectName || overview?.name || 'my-project';
  const projectDescription = overview?.tagline || 'A Vibe Architect project';
  const sectionNames = sections.map(s => s.name);
  
  const templateConfig: TemplateConfig = {
    projectName,
    projectDescription,
    sections: sectionNames,
    hasShell: true,
    hasDesignTokens: !!designSystem.colors,
  };
  
  // 1. Add root config files
  allFiles.set('package.json', generatePackageJson(templateConfig));
  allFiles.set('tsconfig.json', generateTsConfig());
  allFiles.set('.env.example', generateEnvExample(templateConfig));
  allFiles.set('next.config.ts', generateNextConfig());
  allFiles.set('postcss.config.js', generatePostcssConfig());
  allFiles.set('src/app/globals.css', generateGlobalsCss(templateConfig));
  allFiles.set('.cursorrules', generateCursorRules(templateConfig));
  allFiles.set('README.md', generateReadme(templateConfig));
  
  // 2. Add docs/prompts/
  allFiles.set('docs/prompts/kickoff.md', generateKickoffPrompt(templateConfig));
  
  // 3. Add docs/instructions/
  allFiles.set('docs/instructions/main.md', generateMainInstructions(templateConfig));
  allFiles.set('docs/instructions/phase_1_foundation.md', generatePhase1Instructions(templateConfig));
  allFiles.set('docs/instructions/phase_2_shell.md', generatePhase2Instructions(templateConfig));
  
  // Generate section-specific instructions
  sectionNames.forEach((section, index) => {
    const sectionInstructions = generateSectionInstructions({
      name: section,
      phaseNumber: index + 3,
      models: [],
      features: [],
    });
    allFiles.set(`docs/instructions/phase_${index + 3}_${section.toLowerCase()}.md`, sectionInstructions);
  });
  
  // 4. Collect all source files
  const productFiles = collectProductFiles();
  const prismaFiles = collectPrismaFiles();
  const componentFiles = collectComponentFiles(options.includePreviewWrappers ?? false);
  const uiFiles = collectUIComponents();
  const libFiles = collectLibFiles();
  const designFiles = collectDesignSystemFiles();
  const sampleDataFiles = collectSampleDataFiles();
  
  for (const [path, content] of productFiles) allFiles.set(path, content);
  for (const [path, content] of prismaFiles) allFiles.set(path, content);
  for (const [path, content] of componentFiles) allFiles.set(path, content);
  for (const [path, content] of uiFiles) allFiles.set(path, content);
  for (const [path, content] of libFiles) allFiles.set(path, content);
  for (const [path, content] of designFiles) allFiles.set(path, content);
  for (const [path, content] of sampleDataFiles) allFiles.set(path, content);
  
  // 5. Add utils and seed files
  allFiles.set('src/lib/utils.ts', generateUtilsFile());
  allFiles.set('prisma/seed.ts', generateSeedFile(sectionNames));
  
  return allFiles;
}

/**
 * Generate export ZIP file
 */
export async function generateExport(
  options: ExportOptions = {},
  onProgress?: ProgressCallback
): Promise<Blob> {
  const zip = new JSZip();
  
  // Report progress
  const report = (stage: string, percentage: number) => {
    onProgress?.({ stage, percentage });
  };
  
  report('Validating project...', 5);
  
  // Validate before export
  const validation = validateExport();
  if (!validation.isValid) {
    throw new Error(
      `Cannot export: ${validation.errors.map(e => e.message).join(', ')}`
    );
  }
  
  report('Collecting files...', 20);
  
  // Collect all files
  const allFiles = collectExportFiles(options);
  
  report('Transforming import paths...', 50);
  
  // Transform import paths
  const transformedFiles = transformFiles(allFiles);
  
  report('Creating archive...', 70);
  
  // Add all files to ZIP
  for (const [path, content] of transformedFiles) {
    zip.file(path, content);
  }
  
  report('Compressing...', 90);
  
  // Generate ZIP blob
  const blob = await zip.generateAsync({
    type: 'blob',
    compression: 'DEFLATE',
    compressionOptions: { level: 6 },
  });
  
  report('Export complete!', 100);
  
  return blob;
}

/**
 * Download export as ZIP file
 */
export async function downloadExport(
  options: ExportOptions = {},
  onProgress?: ProgressCallback
): Promise<void> {
  const blob = await generateExport(options, onProgress);
  
  const overview = loadProductOverview();
  const projectName = options.projectName || overview?.name || 'my-project';
  const filename = `${projectName.toLowerCase().replace(/\s+/g, '-')}.zip`;
  
  saveAs(blob, filename);
}

/**
 * Get export statistics
 */
export function getExportStats(files: Map<string, string>): {
  fileCount: number;
  totalSize: number;
  formattedSize: string;
} {
  let totalSize = 0;
  
  for (const content of files.values()) {
    totalSize += new Blob([content]).size;
  }
  
  return {
    fileCount: files.size,
    totalSize,
    formattedSize: formatFileSize(totalSize),
  };
}

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}
