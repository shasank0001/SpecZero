/**
 * Section Navigator Loader
 * 
 * Discovers sections and screens from the file system
 * using Vite's import.meta.glob
 */

export interface SectionInfo {
  id: string;
  name: string;
  description?: string;
  screens: ScreenInfo[];
  hasSpec: boolean;
  hasData: boolean;
  hasComponents: boolean;
}

export interface ScreenInfo {
  name: string;
  path: string;
  previewPath: string;
}

export type SectionStatusType = "complete" | "in-progress" | "pending";

// Import all section specs
const sectionSpecs = import.meta.glob("/product/sections/*/spec.md", {
  query: "?raw",
  import: "default",
  eager: true,
}) as Record<string, string>;

// Import all section data
const sectionData = import.meta.glob("/product/sections/*/data.json", {
  import: "default",
  eager: true,
});

// Import all section preview files (capitalized .tsx files in sections folder)
const sectionPreviews = import.meta.glob("/src/sections/*/[A-Z]*.tsx");

/**
 * Extract section ID from a file path
 */
function extractSectionId(path: string): string {
  const match = path.match(/\/sections\/([^/]+)\//);
  return match ? match[1] : "";
}

/**
 * Extract screen name from a file path
 */
function extractScreenName(path: string): string {
  const match = path.match(/\/([A-Z][^/]+)\.tsx$/);
  return match ? match[1] : "";
}

/**
 * Convert kebab-case or snake_case to Title Case
 */
function toTitleCase(str: string): string {
  return str
    .replace(/[-_]/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

/**
 * Get all available sections with their screens
 */
export function loadSections(): SectionInfo[] {
  const sectionsMap = new Map<string, SectionInfo>();

  // Process specs to get section IDs and names
  Object.keys(sectionSpecs).forEach((path) => {
    const sectionId = extractSectionId(path);
    if (!sectionId) return;

    const spec = sectionSpecs[path];
    // Try to extract name from first heading
    const nameMatch = spec.match(/^#\s+(.+)$/m);
    const name = nameMatch ? nameMatch[1].replace(" Section", "") : toTitleCase(sectionId);

    sectionsMap.set(sectionId, {
      id: sectionId,
      name,
      screens: [],
      hasSpec: true,
      hasData: false,
      hasComponents: false,
    });
  });

  // Process data files
  Object.keys(sectionData).forEach((path) => {
    const sectionId = extractSectionId(path);
    if (!sectionId) return;

    const existing = sectionsMap.get(sectionId);
    if (existing) {
      existing.hasData = true;
    } else {
      sectionsMap.set(sectionId, {
        id: sectionId,
        name: toTitleCase(sectionId),
        screens: [],
        hasSpec: false,
        hasData: true,
        hasComponents: false,
      });
    }
  });

  // Process preview files to get screens
  Object.keys(sectionPreviews).forEach((path) => {
    const sectionId = extractSectionId(path);
    const screenName = extractScreenName(path);
    if (!sectionId || !screenName) return;

    const existing = sectionsMap.get(sectionId);
    if (existing) {
      existing.hasComponents = true;
      existing.screens.push({
        name: screenName,
        path: `/src/sections/${sectionId}/${screenName}.tsx`,
        previewPath: `/preview/sections/${sectionId}/${screenName}`,
      });
    } else {
      sectionsMap.set(sectionId, {
        id: sectionId,
        name: toTitleCase(sectionId),
        screens: [
          {
            name: screenName,
            path: `/src/sections/${sectionId}/${screenName}.tsx`,
            previewPath: `/preview/sections/${sectionId}/${screenName}`,
          },
        ],
        hasSpec: false,
        hasData: false,
        hasComponents: true,
      });
    }
  });

  return Array.from(sectionsMap.values()).sort((a, b) =>
    a.name.localeCompare(b.name)
  );
}

/**
 * Get section status based on completeness
 */
export function getSectionStatus(section: SectionInfo): SectionStatusType {
  if (section.hasComponents && section.hasSpec && section.hasData) {
    return "complete";
  }
  if (section.hasSpec || section.hasComponents) {
    return "in-progress";
  }
  return "pending";
}

/**
 * Check if any sections exist
 */
export function hasSections(): boolean {
  return loadSections().length > 0;
}

/**
 * Check if shell components exist
 */
export function hasShellComponents(): boolean {
  const shellComponents = import.meta.glob("/src/shell/components/*.tsx", {
    eager: true,
  });
  return Object.keys(shellComponents).length > 0;
}
