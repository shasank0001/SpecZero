/**
 * Template configuration types for export generation
 */

export interface TemplateConfig {
  projectName: string;
  projectDescription: string;
  sections: string[];
  hasShell: boolean;
  hasDesignTokens: boolean;
}

export interface GeneratedFile {
  path: string;
  content: string;
}

export interface SectionTemplateConfig {
  name: string;
  phaseNumber: number;
  models: string[];
  features: string[];
}
