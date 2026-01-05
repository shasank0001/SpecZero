/**
 * Export Preview Component
 * 
 * A two-pane preview showing file tree and content.
 * Aesthetic: IDE-like with polished edges
 */

import { useState, useMemo } from 'react';
import { FolderTree, Files, Package } from 'lucide-react';
import { FileTree } from './FileTree';
import { FilePreview } from './FilePreview';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import type { FileNode, ExportPreviewProps } from './types';

// Build file tree from flat file map
function buildFileTree(files: Map<string, string>): FileNode[] {
  const root: Map<string, FileNode> = new Map();
  
  for (const [path, content] of files) {
    const parts = path.split('/');
    let currentLevel = root;
    let currentPath = '';
    
    parts.forEach((part, index) => {
      currentPath = currentPath ? `${currentPath}/${part}` : part;
      const isFile = index === parts.length - 1;
      
      if (!currentLevel.has(part)) {
        const node: FileNode = {
          name: part,
          path: currentPath,
          type: isFile ? 'file' : 'folder',
          children: isFile ? undefined : [],
          content: isFile ? content : undefined,
          size: isFile ? new Blob([content]).size : undefined,
        };
        currentLevel.set(part, node);
      }
      
      const node = currentLevel.get(part)!;
      if (!isFile) {
        // Create a map for child lookup
        const childMap = new Map<string, FileNode>();
        (node.children || []).forEach(child => childMap.set(child.name, child));
        currentLevel = childMap;
        // Update children from the map
        node.children = Array.from(childMap.values());
      }
    });
  }
  
  return Array.from(root.values());
}

interface ExportPreviewComponentProps extends ExportPreviewProps {
  files: Map<string, string>;
  projectName?: string;
}

export function ExportPreview({ files, onFileSelect, projectName = 'Project' }: ExportPreviewComponentProps) {
  const [selectedFile, setSelectedFile] = useState<FileNode | null>(null);
  
  const fileTree = useMemo(() => buildFileTree(files), [files]);
  
  const stats = useMemo(() => {
    let totalSize = 0;
    let fileCount = 0;
    let folderCount = 0;
    
    const countItems = (nodes: FileNode[]) => {
      for (const node of nodes) {
        if (node.type === 'file') {
          fileCount++;
          totalSize += node.size || 0;
        } else {
          folderCount++;
          if (node.children) countItems(node.children);
        }
      }
    };
    
    countItems(fileTree);
    
    return { totalSize, fileCount, folderCount };
  }, [fileTree]);
  
  const handleSelect = (node: FileNode) => {
    setSelectedFile(node);
    onFileSelect?.(node);
  };
  
  const formatSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };
  
  return (
    <Card className="h-full overflow-hidden border-2 border-border/50 shadow-lg">
      <CardHeader className="pb-3 border-b bg-gradient-to-r from-muted/30 to-transparent">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 text-primary ring-1 ring-primary/10">
              <FolderTree className="h-5 w-5" />
            </div>
            <div>
              <CardTitle className="text-base font-semibold">Export Preview</CardTitle>
              <CardDescription className="text-xs">
                {projectName.toLowerCase().replace(/\s+/g, '-')}.zip
              </CardDescription>
            </div>
          </div>
          
          {/* Stats */}
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <div className="flex items-center gap-1.5">
              <Files className="h-3.5 w-3.5" />
              <span className="tabular-nums font-medium">{stats.fileCount}</span>
              <span>files</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Package className="h-3.5 w-3.5" />
              <span className="tabular-nums font-medium">{formatSize(stats.totalSize)}</span>
            </div>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="p-0">
        <div className="grid grid-cols-[280px_1fr] h-[450px] divide-x">
          {/* File tree */}
          <div className="overflow-auto bg-muted/20 py-2">
            <FileTree
              nodes={fileTree}
              onSelect={handleSelect}
              selectedPath={selectedFile?.path}
            />
          </div>
          
          {/* File preview */}
          <div className="overflow-hidden bg-background">
            <FilePreview file={selectedFile} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
