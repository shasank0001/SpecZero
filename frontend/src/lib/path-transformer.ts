/**
 * Path Transformer
 * 
 * Converts @ alias imports to relative paths for export portability.
 * Handles TypeScript/TSX files with various import patterns.
 */

interface TransformOptions {
  /** Current file path relative to src/ */
  currentFilePath: string;
  /** Content to transform */
  content: string;
}

interface TransformResult {
  content: string;
  transformedImports: number;
}

/**
 * Calculate relative path from one file to another
 */
function getRelativePath(from: string, to: string): string {
  const fromParts = from.split('/').slice(0, -1); // Remove filename
  const toParts = to.split('/');
  
  // Find common prefix
  let commonLength = 0;
  while (
    commonLength < fromParts.length &&
    commonLength < toParts.length &&
    fromParts[commonLength] === toParts[commonLength]
  ) {
    commonLength++;
  }
  
  // Calculate relative path
  const upCount = fromParts.length - commonLength;
  const upPath = upCount > 0 ? '../'.repeat(upCount) : './';
  const downPath = toParts.slice(commonLength).join('/');
  
  return upPath + downPath;
}

/**
 * Transform @ alias imports to relative paths
 */
export function transformImports(options: TransformOptions): TransformResult {
  const { currentFilePath, content } = options;
  let transformedContent = content;
  let transformedImports = 0;
  
  // Match various import patterns with @ alias
  // Handles: import X from '@/...'
  //          import { X } from '@/...'
  //          import type { X } from '@/...'
  //          import '@/...'
  const importRegex = /(import\s+(?:type\s+)?(?:\{[^}]*\}|\*\s+as\s+\w+|\w+)\s+from\s+['"])@\/([^'"]+)(['"])/g;
  const sideEffectImportRegex = /(import\s+['"])@\/([^'"]+)(['"])/g;
  const exportFromRegex = /(export\s+(?:\{[^}]*\}|\*)\s+from\s+['"])@\/([^'"]+)(['"])/g;
  
  // Transform standard imports
  transformedContent = transformedContent.replace(
    importRegex,
    (_match, prefix, importPath, suffix) => {
      transformedImports++;
      const relativePath = getRelativePath(currentFilePath, importPath);
      return `${prefix}${relativePath}${suffix}`;
    }
  );
  
  // Transform side-effect imports
  transformedContent = transformedContent.replace(
    sideEffectImportRegex,
    (_match, prefix, importPath, suffix) => {
      // Skip if already transformed
      if (!_match.includes('@/')) return _match;
      transformedImports++;
      const relativePath = getRelativePath(currentFilePath, importPath);
      return `${prefix}${relativePath}${suffix}`;
    }
  );
  
  // Transform re-exports
  transformedContent = transformedContent.replace(
    exportFromRegex,
    (_match, prefix, importPath, suffix) => {
      transformedImports++;
      const relativePath = getRelativePath(currentFilePath, importPath);
      return `${prefix}${relativePath}${suffix}`;
    }
  );
  
  return {
    content: transformedContent,
    transformedImports,
  };
}

/**
 * Batch transform multiple files
 */
export function transformFiles(
  files: Map<string, string>
): Map<string, string> {
  const transformedFiles = new Map<string, string>();
  
  for (const [filePath, content] of files) {
    // Only transform TypeScript/TSX files
    if (filePath.endsWith('.ts') || filePath.endsWith('.tsx')) {
      const result = transformImports({
        currentFilePath: filePath,
        content,
      });
      transformedFiles.set(filePath, result.content);
    } else {
      transformedFiles.set(filePath, content);
    }
  }
  
  return transformedFiles;
}

/**
 * Check if a file contains @ alias imports
 */
export function hasAliasImports(content: string): boolean {
  return /@\//.test(content);
}
