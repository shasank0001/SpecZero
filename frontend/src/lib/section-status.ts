/**
 * Section Status Utility
 * 
 * Determines section completion status based on file existence.
 */

import { getSectionIds, loadSection } from "./section-loader";
import type { RoadmapSectionStatus } from "@/types/product";

/**
 * Determines section status based on file existence:
 * - complete: Has components in src/sections/{id}/
 * - in-progress: Has spec.md in product/sections/{id}/
 * - not-started: No files exist
 */
export function getSectionStatus(sectionId: string): RoadmapSectionStatus {
  const section = loadSection(sectionId);
  
  if (!section) {
    return "not-started";
  }
  
  // Check if section has implemented components
  if (section.hasComponents) {
    return "complete";
  }
  
  // Check if section has spec file
  if (section.spec) {
    return "in-progress";
  }
  
  // Has some data but no spec or components
  if (section.data) {
    return "planned";
  }
  
  return "not-started";
}

/**
 * Get status summary for all sections
 */
export function getAllSectionStatuses(): Record<string, RoadmapSectionStatus> {
  const sectionIds = getSectionIds();
  const statuses: Record<string, RoadmapSectionStatus> = {};
  
  for (const id of sectionIds) {
    statuses[id] = getSectionStatus(id);
  }
  
  return statuses;
}

/**
 * Get section completion percentage
 */
export function getSectionCompletionPercentage(): number {
  const sectionIds = getSectionIds();
  if (sectionIds.length === 0) return 0;
  
  const completed = sectionIds.filter((id) => getSectionStatus(id) === "complete").length;
  return Math.round((completed / sectionIds.length) * 100);
}
