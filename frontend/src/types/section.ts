/**
 * Section Types
 * 
 * Types for representing section data, specs, and component information
 * from the product/sections/ directory.
 */

// ==========================================
// SECTION TYPES
// ==========================================

export interface Section {
  id: string;
  name: string;
  spec: SectionSpec | null;
  data: Record<string, unknown> | null;
  types: string | null;
  hasComponents: boolean;
  screens: SectionScreen[];
  status: SectionStatus;
}

export type SectionStatus = "complete" | "in-progress" | "planned";

export interface SectionSpec {
  overview: string;
  screens: SectionScreenSpec[];
  rawContent: string;
}

export interface SectionScreenSpec {
  name: string;
  path: string;
  description: string;
  features: string[];
  fields?: ScreenField[];
  columns?: ScreenColumn[];
}

export interface ScreenField {
  name: string;
  type: string;
  required: boolean;
  validation?: string;
}

export interface ScreenColumn {
  name: string;
  sortable: boolean;
  description: string;
}

export interface SectionScreen {
  name: string;
  path: string;
  component: string;
  hasPreview: boolean;
}

// ==========================================
// SECTION DATA TYPES
// ==========================================

export interface SectionData {
  sectionId: string;
  data: Record<string, unknown>;
  types: SectionTypeDefinition[];
}

export interface SectionTypeDefinition {
  name: string;
  properties: TypeProperty[];
  code: string;
}

export interface TypeProperty {
  name: string;
  type: string;
  optional: boolean;
}
