/**
 * Product Types
 * 
 * Types for representing the product overview and roadmap
 * parsed from markdown files in the product/ directory.
 */

// ==========================================
// PRODUCT OVERVIEW TYPES
// ==========================================

export interface ProductOverview {
  name: string;
  tagline: string;
  problem: string;
  targetUsers: TargetUser[];
  features: Feature[];
  successMetrics: SuccessMetric[];
  rawContent: string;
}

export interface TargetUser {
  name: string;
  description: string;
}

export interface Feature {
  name: string;
  description: string;
  priority?: "high" | "medium" | "low";
}

export interface SuccessMetric {
  metric: string;
  target: string;
}

// ==========================================
// PRODUCT ROADMAP TYPES
// ==========================================

export interface ProductRoadmap {
  phases: RoadmapPhase[];
  rawContent: string;
}

export interface RoadmapPhase {
  name: string;
  sections: RoadmapSection[];
}

export interface RoadmapSection {
  id: string;
  name: string;
  status: RoadmapSectionStatus;
  priority: "high" | "medium" | "low";
  description: string;
  screens: ScreenDefinition[];
}

export type RoadmapSectionStatus = "complete" | "in-progress" | "planned" | "not-started";

export interface ScreenDefinition {
  name: string;
  description?: string;
}

// ==========================================
// DATA MODEL DOCUMENTATION TYPES
// ==========================================

export interface DataModelDoc {
  overview: string;
  entities: EntityDoc[];
  rawContent: string;
}

export interface EntityDoc {
  name: string;
  description: string;
  fields: EntityFieldDoc[];
}

export interface EntityFieldDoc {
  name: string;
  type: string;
  description: string;
}
