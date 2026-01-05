/**
 * File Tree Component
 * 
 * A sleek, interactive file tree for previewing export contents.
 * Aesthetic: Technical precision with subtle depth
 */

import { useState } from 'react';
import { 
  ChevronRight, 
  ChevronDown, 
  Folder, 
  FolderOpen, 
  FileText, 
  FileCode2,
  FileJson,
  FileType,
  Braces
} from 'lucide-react';
import { cn } from '@/lib/utils';
import type { FileNode } from './types';

interface FileTreeProps {
  nodes: FileNode[];
  onSelect?: (node: FileNode) => void;
  selectedPath?: string;
  level?: number;
}

export function FileTree({ nodes, onSelect, selectedPath, level = 0 }: FileTreeProps) {
  // Sort nodes: folders first, then alphabetically
  const sortedNodes = [...nodes].sort((a, b) => {
    if (a.type !== b.type) return a.type === 'folder' ? -1 : 1;
    return a.name.localeCompare(b.name);
  });

  return (
    <div className="font-mono text-sm select-none">
      {sortedNodes.map((node) => (
        <FileTreeNode
          key={node.path}
          node={node}
          onSelect={onSelect}
          selectedPath={selectedPath}
          level={level}
        />
      ))}
    </div>
  );
}

interface FileTreeNodeProps {
  node: FileNode;
  onSelect?: (node: FileNode) => void;
  selectedPath?: string;
  level: number;
}

function FileTreeNode({ node, onSelect, selectedPath, level }: FileTreeNodeProps) {
  const [isExpanded, setIsExpanded] = useState(level < 2);
  const isSelected = selectedPath === node.path;
  
  const handleClick = () => {
    if (node.type === 'folder') {
      setIsExpanded(!isExpanded);
    }
    onSelect?.(node);
  };
  
  const getIcon = () => {
    if (node.type === 'folder') {
      return isExpanded ? (
        <FolderOpen className="w-4 h-4 text-amber-500" />
      ) : (
        <Folder className="w-4 h-4 text-amber-500/70" />
      );
    }
    
    // File type icons
    if (node.name.endsWith('.tsx') || node.name.endsWith('.ts')) {
      return <FileCode2 className="w-4 h-4 text-blue-400" />;
    }
    if (node.name.endsWith('.json')) {
      return <FileJson className="w-4 h-4 text-yellow-500" />;
    }
    if (node.name.endsWith('.md')) {
      return <FileText className="w-4 h-4 text-emerald-500" />;
    }
    if (node.name.endsWith('.prisma')) {
      return <Braces className="w-4 h-4 text-violet-500" />;
    }
    if (node.name.endsWith('.css')) {
      return <FileType className="w-4 h-4 text-pink-500" />;
    }
    return <FileText className="w-4 h-4 text-muted-foreground" />;
  };

  // Sort children if folder
  const sortedChildren = node.children ? [...node.children].sort((a, b) => {
    if (a.type !== b.type) return a.type === 'folder' ? -1 : 1;
    return a.name.localeCompare(b.name);
  }) : [];
  
  return (
    <div>
      <div
        className={cn(
          'flex items-center gap-1.5 py-1 px-2 rounded-md cursor-pointer',
          'transition-all duration-150 ease-out',
          'hover:bg-muted/60',
          isSelected && 'bg-primary/10 text-primary hover:bg-primary/15',
          level === 0 && 'font-medium'
        )}
        style={{ paddingLeft: `${level * 16 + 8}px` }}
        onClick={handleClick}
      >
        {/* Expand/collapse chevron */}
        {node.type === 'folder' ? (
          <span className="w-4 h-4 flex items-center justify-center text-muted-foreground">
            {isExpanded ? (
              <ChevronDown className="w-3.5 h-3.5" />
            ) : (
              <ChevronRight className="w-3.5 h-3.5" />
            )}
          </span>
        ) : (
          <span className="w-4" />
        )}
        
        {/* Icon */}
        {getIcon()}
        
        {/* Name */}
        <span className={cn(
          'ml-1 truncate',
          node.type === 'folder' && 'text-foreground'
        )}>
          {node.name}
        </span>
        
        {/* File size */}
        {node.size !== undefined && node.type === 'file' && (
          <span className="ml-auto text-[10px] text-muted-foreground tabular-nums">
            {formatFileSize(node.size)}
          </span>
        )}
      </div>
      
      {/* Children */}
      {node.type === 'folder' && isExpanded && sortedChildren.length > 0 && (
        <div className="animate-in slide-in-from-top-1 duration-150">
          <FileTree
            nodes={sortedChildren}
            onSelect={onSelect}
            selectedPath={selectedPath}
            level={level + 1}
          />
        </div>
      )}
    </div>
  );
}

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes}B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)}K`;
  return `${(bytes / (1024 * 1024)).toFixed(1)}M`;
}
