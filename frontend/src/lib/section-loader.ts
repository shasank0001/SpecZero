/**
 * Section Loader
 * 
 * Loads section artifacts from the product/sections/ directory.
 * Each section can have: spec.md, data.json, types.ts
 */

import type {
  Section,
  SectionSpec,
  SectionScreenSpec,
  SectionScreen,
  SectionStatus,
  ScreenField,
  ScreenColumn,
} from "@/types/section";

// ==========================================
// FILE LOADING WITH VITE GLOB
// ==========================================

// Load all section spec files
const sectionSpecs = import.meta.glob("/product/sections/*/spec.md", {
  query: "?raw",
  import: "default",
  eager: true,
}) as Record<string, string>;

// Load all section data files
const sectionData = import.meta.glob("/product/sections/*/data.json", {
  import: "default",
  eager: true,
}) as Record<string, Record<string, unknown>>;

// Load all section type files
const sectionTypes = import.meta.glob("/product/sections/*/types.ts", {
  query: "?raw",
  import: "default",
  eager: true,
}) as Record<string, string>;

// Check for component directories (to determine if section has implementations)
const sectionComponents = import.meta.glob("/src/sections/*/components/*.tsx", {
  query: "?raw",
  import: "default",
  eager: true,
}) as Record<string, string>;

// Precompute a map of sectionId -> component base names for quick lookup
const sectionComponentNames: Record<string, Set<string>> = {};
for (const path of Object.keys(sectionComponents)) {
  const match = path.match(/\/src\/sections\/([^/]+)\/components\/([^/]+)\.tsx$/);
  if (!match) continue;
  const [, sectionId, componentName] = match;
  if (!sectionComponentNames[sectionId]) {
    sectionComponentNames[sectionId] = new Set();
  }
  sectionComponentNames[sectionId].add(componentName);
}

// ==========================================
// MAIN LOADER FUNCTIONS
// ==========================================

/**
 * Gets all section IDs from the product/sections/ directory
 */
export function getSectionIds(): string[] {
  const ids = new Set<string>();
  
  // Extract section IDs from all file paths
  const allPaths = [
    ...Object.keys(sectionSpecs),
    ...Object.keys(sectionData),
    ...Object.keys(sectionTypes),
  ];
  
  for (const path of allPaths) {
    const match = path.match(/\/product\/sections\/([^/]+)\//);
    if (match) {
      ids.add(match[1]);
    }
  }
  
  return Array.from(ids).sort();
}

/**
 * Loads all sections with their data
 */
export function loadAllSections(): Section[] {
  const sectionIds = getSectionIds();
  return sectionIds.map((id) => loadSection(id)).filter(Boolean) as Section[];
}

/**
 * Loads a single section by ID
 */
export function loadSection(sectionId: string): Section | null {
  const specPath = `/product/sections/${sectionId}/spec.md`;
  const dataPath = `/product/sections/${sectionId}/data.json`;
  const typesPath = `/product/sections/${sectionId}/types.ts`;
  
  // Check if section exists (at least spec should exist)
  const specContent = sectionSpecs[specPath];
  const dataContent = sectionData[dataPath];
  const typesContent = sectionTypes[typesPath];
  
  // Determine if section has component implementations
  const hasComponents = sectionComponentNames[sectionId]?.size > 0;
  
  // Parse spec if exists
  const spec = specContent ? parseSectionSpec(specContent) : null;
  
  // Determine section status
  const status = determineSectionStatus(hasComponents, spec);
  
  // Get screen list
  const screens = getScreenList(sectionId, spec);
  
  // Format section name from ID
  const name = formatSectionName(sectionId);
  
  return {
    id: sectionId,
    name,
    spec,
    data: dataContent ?? null,
    types: typesContent ?? null,
    hasComponents,
    screens,
    status,
  };
}

// ==========================================
// SPEC PARSING
// ==========================================

/**
 * Parses a section spec.md file
 */
function parseSectionSpec(content: string): SectionSpec {
  const screens = parseScreenSpecs(content);
  
  // Extract overview section
  const overviewMatch = content.match(
    /##\s+Overview\s+([\s\S]*?)(?=\n##\s|$)/i
  );
  const overview = overviewMatch ? overviewMatch[1].trim() : "";
  
  return {
    overview,
    screens,
    rawContent: content,
  };
}

/**
 * Parses screen specifications from spec content
 */
function parseScreenSpecs(content: string): SectionScreenSpec[] {
  const screens: SectionScreenSpec[] = [];
  
  // Split by screen headings (### Screen Name)
  const screenBlocks = content.split(/(?=^###\s+(?!#))/m);
  
  for (const block of screenBlocks) {
    // Extract screen name
    const nameMatch = block.match(/^###\s+(.+)$/m);
    if (!nameMatch) continue;
    
    const name = nameMatch[1].trim();
    
    // Skip non-screen headings
    if (name.toLowerCase() === "overview" || name.toLowerCase() === "screens") {
      continue;
    }
    
    // Extract path
    const pathMatch = block.match(/\*\*Path:\*\*\s*`?([^`\n]+)`?/i);
    const path = pathMatch ? pathMatch[1].trim() : `/${name.toLowerCase().replace(/\s+/g, "-")}`;
    
    // Extract description (text after heading, before features)
    const descMatch = block.match(/^###\s+.+\n\n([\s\S]*?)(?=\n\*\*|$)/m);
    const description = descMatch ? descMatch[1].trim() : "";
    
    // Extract features
    const features = parseFeatures(block);
    
    // Extract fields (for form screens)
    const fields = parseFields(block);
    
    // Extract columns (for table screens)
    const columns = parseColumns(block);
    
    screens.push({
      name,
      path,
      description,
      features,
      fields: fields.length > 0 ? fields : undefined,
      columns: columns.length > 0 ? columns : undefined,
    });
  }
  
  return screens;
}

/**
 * Parses features list from a screen block
 */
function parseFeatures(block: string): string[] {
  const features: string[] = [];
  
  // Find **Features:** section
  const match = block.match(/\*\*Features:\*\*([\s\S]*?)(?=\n\*\*|\n###|$)/i);
  if (!match) return features;
  
  const lines = match[1].split("\n");
  for (const line of lines) {
    const featureMatch = line.match(/^-\s+(.+)$/);
    if (featureMatch) {
      features.push(featureMatch[1].trim());
    }
  }
  
  return features;
}

/**
 * Parses field definitions from a screen block (for forms)
 */
function parseFields(block: string): ScreenField[] {
  const fields: ScreenField[] = [];
  
  // Find **Fields:** section with table
  const match = block.match(/\*\*Fields:\*\*([\s\S]*?)(?=\n\*\*|\n###|$)/i);
  if (!match) return fields;
  
  // Parse markdown table
  const lines = match[1].split("\n").filter((l) => l.includes("|"));
  
  // Skip header and separator rows
  const dataRows = lines.slice(2);
  
  for (const row of dataRows) {
    const cells = row.split("|").map((c) => c.trim()).filter(Boolean);
    if (cells.length >= 3) {
      fields.push({
        name: cells[0],
        type: cells[1],
        required: cells[2].toLowerCase() === "yes",
        validation: cells[3],
      });
    }
  }
  
  return fields;
}

/**
 * Parses column definitions from a screen block (for tables)
 */
function parseColumns(block: string): ScreenColumn[] {
  const columns: ScreenColumn[] = [];
  
  // Find **Columns:** section with table
  const match = block.match(/\*\*Columns:\*\*([\s\S]*?)(?=\n\*\*|\n###|$)/i);
  if (!match) return columns;
  
  // Parse markdown table
  const lines = match[1].split("\n").filter((l) => l.includes("|"));
  
  // Skip header and separator rows
  const dataRows = lines.slice(2);
  
  for (const row of dataRows) {
    const cells = row.split("|").map((c) => c.trim()).filter(Boolean);
    if (cells.length >= 3) {
      columns.push({
        name: cells[0],
        sortable: cells[1].toLowerCase() === "yes",
        description: cells[2],
      });
    }
  }
  
  return columns;
}

// ==========================================
// UTILITY FUNCTIONS
// ==========================================

/**
 * Determines section status based on artifacts
 */
function determineSectionStatus(
  hasComponents: boolean,
  spec: SectionSpec | null
): SectionStatus {
  if (hasComponents) return "complete";
  if (spec) return "in-progress";
  return "planned";
}

/**
 * Gets list of screens for a section
 */
function getScreenList(
  sectionId: string,
  spec: SectionSpec | null
): SectionScreen[] {
  const screens: SectionScreen[] = [];
  
  if (spec) {
    for (const screenSpec of spec.screens) {
      const componentName = screenSpec.name.replace(/\s+/g, "");
      const hasPreview = sectionComponentNames[sectionId]?.has(componentName) ?? false;
      
      screens.push({
        name: screenSpec.name,
        path: screenSpec.path,
        component: componentName,
        hasPreview,
      });
    }
  }
  
  // Also check for components without specs
  const componentPaths = Object.keys(sectionComponents).filter(
    (path) => path.includes(`/src/sections/${sectionId}/`)
  );
  
  for (const path of componentPaths) {
    const match = path.match(/\/([^/]+)\.tsx$/);
    if (match) {
      const componentName = match[1];
      // Check if already added from spec
      if (!screens.find((s) => s.component === componentName)) {
        screens.push({
          name: formatComponentName(componentName),
          path: `/${sectionId}/${componentName.toLowerCase()}`,
          component: componentName,
          hasPreview: true,
        });
      }
    }
  }
  
  return screens;
}

/**
 * Formats section ID to display name
 */
function formatSectionName(id: string): string {
  return id
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

/**
 * Formats component name for display
 */
function formatComponentName(name: string): string {
  // Convert PascalCase to Title Case with spaces
  return name.replace(/([A-Z])/g, " $1").trim();
}

// ==========================================
// EXPORT UTILITIES
// ==========================================

/**
 * Checks if any sections exist
 */
export function hasSections(): boolean {
  return getSectionIds().length > 0;
}

/**
 * Gets section data by ID
 */
export function getSectionData(sectionId: string): Record<string, unknown> | null {
  const path = `/product/sections/${sectionId}/data.json`;
  return sectionData[path] ?? null;
}

/**
 * Gets section types by ID
 */
export function getSectionTypes(sectionId: string): string | null {
  const path = `/product/sections/${sectionId}/types.ts`;
  return sectionTypes[path] ?? null;
}

/**
 * Gets section spec by ID
 */
export function getSectionSpec(sectionId: string): SectionSpec | null {
  const path = `/product/sections/${sectionId}/spec.md`;
  const content = sectionSpecs[path];
  return content ? parseSectionSpec(content) : null;
}
