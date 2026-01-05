/**
 * File Preview Component
 * 
 * Displays file content with syntax highlighting for the export preview.
 * Aesthetic: Clean, focused code display with subtle chrome
 */

import { CodeBlock } from '@/components/shared/CodeBlock';
import { FileCode2, FileText, Eye } from 'lucide-react';
import type { FileNode } from './types';

interface FilePreviewProps {
  file: FileNode | null;
}

export function FilePreview({ file }: FilePreviewProps) {
  if (!file) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-muted-foreground p-8">
        <div className="w-16 h-16 rounded-2xl bg-muted/50 flex items-center justify-center mb-4">
          <Eye className="w-8 h-8 opacity-40" />
        </div>
        <p className="text-sm font-medium">Select a file to preview</p>
        <p className="text-xs mt-1 opacity-60">Click on any file in the tree</p>
      </div>
    );
  }
  
  if (file.type === 'folder') {
    return (
      <div className="flex flex-col items-center justify-center h-full text-muted-foreground p-8">
        <div className="w-16 h-16 rounded-2xl bg-amber-500/10 flex items-center justify-center mb-4">
          <FileText className="w-8 h-8 text-amber-500 opacity-60" />
        </div>
        <p className="text-sm font-medium">Folder: {file.name}</p>
        <p className="text-xs mt-1 opacity-60">
          {file.children?.length || 0} items inside
        </p>
      </div>
    );
  }
  
  const getLanguage = (filename: string): string => {
    if (filename.endsWith('.tsx')) return 'tsx';
    if (filename.endsWith('.ts')) return 'typescript';
    if (filename.endsWith('.json')) return 'json';
    if (filename.endsWith('.md')) return 'markdown';
    if (filename.endsWith('.prisma')) return 'prisma';
    if (filename.endsWith('.css')) return 'css';
    if (filename.endsWith('.js')) return 'javascript';
    return 'text';
  };
  
  return (
    <div className="h-full flex flex-col overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-2 px-4 py-3 border-b bg-muted/30">
        <FileCode2 className="w-4 h-4 text-muted-foreground" />
        <span className="font-mono text-sm text-foreground truncate">
          {file.path}
        </span>
        {file.size !== undefined && (
          <span className="ml-auto text-xs text-muted-foreground tabular-nums">
            {formatFileSize(file.size)}
          </span>
        )}
      </div>
      
      {/* Content */}
      <div className="flex-1 overflow-auto p-4">
        <CodeBlock
          code={file.content || '// No content available'}
          language={getLanguage(file.name)}
          showLineNumbers={true}
          showCopyButton={true}
          showLanguageBadge={false}
          maxHeight="100%"
        />
      </div>
    </div>
  );
}

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}
