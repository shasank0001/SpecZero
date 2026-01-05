export interface FileNode {
  name: string;
  path: string;
  type: 'file' | 'folder';
  children?: FileNode[];
  size?: number;
  content?: string;
}

export interface ExportPreviewProps {
  onFileSelect?: (file: FileNode) => void;
  selectedFile?: FileNode | null;
}
