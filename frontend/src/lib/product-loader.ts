/**
 * Product Loader
 * 
 * Loads and parses product definition files from the product/ directory.
 * Uses Vite's import.meta.glob for build-time file loading.
 */

import type {
  ProductOverview,
  ProductRoadmap,
  TargetUser,
  Feature,
  SuccessMetric,
  RoadmapPhase,
  RoadmapSection,
  ScreenDefinition,
  DataModelDoc,
  EntityDoc,
  EntityFieldDoc,
} from "@/types/product";

// ==========================================
// FILE LOADING WITH VITE GLOB
// ==========================================

// Load all markdown files from product directory
const productFiles = import.meta.glob("/product/*.md", {
  query: "?raw",
  import: "default",
  eager: true,
}) as Record<string, string>;

// Load data model markdown
const dataModelFiles = import.meta.glob("/product/data-model/*.md", {
  query: "?raw",
  import: "default",
  eager: true,
}) as Record<string, string>;

// ==========================================
// PRODUCT OVERVIEW LOADER
// ==========================================

/**
 * Loads and parses the product overview from product-overview.md
 */
export function loadProductOverview(): ProductOverview | null {
  const content = productFiles["/product/product-overview.md"];
  
  if (!content) {
    return null;
  }

  return parseProductOverview(content);
}

/**
 * Parses product overview markdown into structured data
 */
function parseProductOverview(content: string): ProductOverview {
  // Extract product name (first H1)
  const nameMatch = content.match(/^#\s+(.+)$/m);
  const name = nameMatch ? nameMatch[1].trim() : "Untitled Product";
  
  // Extract tagline (blockquote after H1)
  const taglineMatch = content.match(/^>\s*(.+)$/m);
  const tagline = taglineMatch ? taglineMatch[1].trim() : "";
  
  // Extract problem statement
  const problem = extractSection(content, "Problem Statement");
  
  // Extract target users
  const targetUsers = extractTargetUsers(content);
  
  // Extract features
  const features = extractFeatures(content);
  
  // Extract success metrics
  const successMetrics = extractSuccessMetrics(content);
  
  return {
    name,
    tagline,
    problem,
    targetUsers,
    features,
    successMetrics,
    rawContent: content,
  };
}

/**
 * Extracts a section's content by heading
 */
function extractSection(content: string, sectionName: string): string {
  const regex = new RegExp(
    `##\\s+${sectionName}[\\s\\S]*?(?=\\n##\\s|$)`,
    "i"
  );
  const match = content.match(regex);
  
  if (!match) return "";
  
  // Remove the heading and return the content
  return match[0]
    .replace(/^##\s+.+\n/, "")
    .trim();
}

/**
 * Extracts target users from the markdown
 */
function extractTargetUsers(content: string): TargetUser[] {
  const section = extractSection(content, "Target Users");
  if (!section) return [];
  
  const users: TargetUser[] = [];
  const lines = section.split("\n");
  
  for (const line of lines) {
    // Match pattern: - **Name** - Description
    const match = line.match(/^-\s+\*\*(.+?)\*\*\s*[-–]\s*(.+)$/);
    if (match) {
      users.push({
        name: match[1].trim(),
        description: match[2].trim(),
      });
    }
  }
  
  return users;
}

/**
 * Extracts features from the markdown
 */
function extractFeatures(content: string): Feature[] {
  const section = extractSection(content, "Key Features");
  if (!section) return [];
  
  const features: Feature[] = [];
  const lines = section.split("\n");
  
  let currentFeature: Partial<Feature> | null = null;
  
  for (const line of lines) {
    // Match H3 heading (feature name)
    const h3Match = line.match(/^###\s+(.+)$/);
    if (h3Match) {
      if (currentFeature && currentFeature.name) {
        features.push(currentFeature as Feature);
      }
      currentFeature = { name: h3Match[1].trim(), description: "" };
      continue;
    }
    
    // Add description lines
    if (currentFeature && line.trim()) {
      currentFeature.description = (currentFeature.description || "") + line.trim() + " ";
    }
  }
  
  // Add last feature
  if (currentFeature && currentFeature.name) {
    currentFeature.description = currentFeature.description?.trim() || "";
    features.push(currentFeature as Feature);
  }
  
  return features;
}

/**
 * Extracts success metrics from the markdown
 */
function extractSuccessMetrics(content: string): SuccessMetric[] {
  const section = extractSection(content, "Success Metrics");
  if (!section) return [];
  
  const metrics: SuccessMetric[] = [];
  const lines = section.split("\n");
  
  for (const line of lines) {
    // Match pattern: - Metric description by/to XX%
    const match = line.match(/^-\s+(.+)$/);
    if (match) {
      const text = match[1].trim();
      // Try to extract target value
      const targetMatch = text.match(/(\d+[%+]?|\d+\.?\d*\/\d+)/);
      metrics.push({
        metric: text,
        target: targetMatch ? targetMatch[1] : "",
      });
    }
  }
  
  return metrics;
}

// ==========================================
// PRODUCT ROADMAP LOADER
// ==========================================

/**
 * Loads and parses the product roadmap from product-roadmap.md
 */
export function loadProductRoadmap(): ProductRoadmap | null {
  const content = productFiles["/product/product-roadmap.md"];
  
  if (!content) {
    return null;
  }

  return parseProductRoadmap(content);
}

/**
 * Parses product roadmap markdown into structured data
 */
function parseProductRoadmap(content: string): ProductRoadmap {
  const phases: RoadmapPhase[] = [];
  
  // Split by Phase headings (## Phase X:)
  const phaseSections = content.split(/(?=^##\s+Phase\s+\d+)/m);
  
  for (const phaseContent of phaseSections) {
    if (!phaseContent.trim()) continue;
    
    // Extract phase name
    const phaseMatch = phaseContent.match(/^##\s+(.+)$/m);
    if (!phaseMatch) continue;
    
    const phaseName = phaseMatch[1].trim();
    const sections = extractRoadmapSections(phaseContent);
    
    phases.push({
      name: phaseName,
      sections,
    });
  }
  
  return {
    phases,
    rawContent: content,
  };
}

/**
 * Extracts roadmap sections from a phase
 */
function extractRoadmapSections(phaseContent: string): RoadmapSection[] {
  const sections: RoadmapSection[] = [];
  
  // Split by Section headings (### Section:)
  const sectionBlocks = phaseContent.split(/(?=^###\s+Section:)/m);
  
  for (const block of sectionBlocks) {
    if (!block.includes("### Section:")) continue;
    
    // Extract section name
    const nameMatch = block.match(/^###\s+Section:\s+(.+)$/m);
    if (!nameMatch) continue;
    
    const name = nameMatch[1].trim();
    const id = name.toLowerCase().replace(/\s+/g, "-");
    
    // Extract status
    const statusMatch = block.match(/\*\*Status:\*\*\s*(.+)/i);
    const statusText = statusMatch ? statusMatch[1].trim().toLowerCase() : "planned";
    const status = parseStatus(statusText);
    
    // Extract priority
    const priorityMatch = block.match(/\*\*Priority:\*\*\s*(.+)/i);
    const priorityText = priorityMatch ? priorityMatch[1].trim().toLowerCase() : "medium";
    const priority = parsePriority(priorityText);
    
    // Extract description
    const descMatch = block.match(/\*\*Description:\*\*\s*(.+)/i);
    const description = descMatch ? descMatch[1].trim() : "";
    
    // Extract screens
    const screens = extractScreens(block);
    
    sections.push({
      id,
      name,
      status,
      priority,
      description,
      screens,
    });
  }
  
  return sections;
}

/**
 * Parses status text to enum value
 */
function parseStatus(text: string): RoadmapSection["status"] {
  if (text.includes("complete")) return "complete";
  if (text.includes("progress")) return "in-progress";
  if (text.includes("planned")) return "planned";
  return "not-started";
}

/**
 * Parses priority text to enum value
 */
function parsePriority(text: string): RoadmapSection["priority"] {
  if (text.includes("high")) return "high";
  if (text.includes("low")) return "low";
  return "medium";
}

/**
 * Extracts screen definitions from a section block
 */
function extractScreens(block: string): ScreenDefinition[] {
  const screens: ScreenDefinition[] = [];
  
  // Find **Screens:** section
  const screensMatch = block.match(/\*\*Screens:\*\*([\s\S]*?)(?=\n###|\n\*\*|$)/i);
  if (!screensMatch) return screens;
  
  const screensContent = screensMatch[1];
  const lines = screensContent.split("\n");
  
  for (const line of lines) {
    // Match pattern: - Screen Name (description)
    const match = line.match(/^-\s+(.+?)(?:\s*\((.+)\))?$/);
    if (match) {
      screens.push({
        name: match[1].trim(),
        description: match[2]?.trim(),
      });
    }
  }
  
  return screens;
}

// ==========================================
// DATA MODEL DOC LOADER
// ==========================================

/**
 * Loads and parses the data model documentation
 */
export function loadDataModelDoc(): DataModelDoc | null {
  const content = dataModelFiles["/product/data-model/data-model.md"];
  
  if (!content) {
    return null;
  }

  // Extract overview section
  const overviewMatch = content.match(/##\s+Overview\s+([\s\S]*?)(?=\n##\s|$)/i);
  const overview = overviewMatch ? overviewMatch[1].trim() : "";
  const entities = parseDataModelEntities(content);
  
  return {
    overview,
    entities,
    rawContent: content,
  };
}

/**
 * Parses entity tables from data-model.md into structured docs
 */
function parseDataModelEntities(content: string): EntityDoc[] {
  const entities: EntityDoc[] = [];

  // Split on level-3 headings (### Entity)
  const blocks = content.split(/(?=^###\s+)/m);

  for (const block of blocks) {
    const nameMatch = block.match(/^###\s+(.+)$/m);
    if (!nameMatch) continue;

    const name = nameMatch[1].trim();

    // Description is text between heading and first table or next heading
    const descMatch = block.match(/^###\s+.+\n([\s\S]*?)(?=\n\|[^\n]+\||^###|$)/m);
    const description = descMatch ? descMatch[1].trim() : "";

    // Find first markdown table in the block
    const tableMatch = block.match(/\n\|(.+\n)+/m);
    const fields = tableMatch ? parseEntityFields(tableMatch[0]) : [];

    entities.push({ name, description, fields });
  }

  return entities;
}

/**
 * Parses a markdown table of fields into EntityFieldDoc entries
 */
function parseEntityFields(table: string): EntityFieldDoc[] {
  const lines = table
    .split("\n")
    .map((l) => l.trim())
    .filter((l) => l.startsWith("|"));

  // Remove header and separator rows
  const dataRows = lines.slice(2);
  const fields: EntityFieldDoc[] = [];

  for (const row of dataRows) {
    const cells = row
      .split("|")
      .map((c) => c.trim())
      .filter(Boolean);

    if (cells.length >= 3) {
      fields.push({
        name: cells[0],
        type: cells[1],
        description: cells[2],
      });
    }
  }

  return fields;
}

// ==========================================
// UTILITY EXPORTS
// ==========================================

/**
 * Checks if product overview exists
 */
export function hasProductOverview(): boolean {
  return "/product/product-overview.md" in productFiles;
}

/**
 * Checks if product roadmap exists
 */
export function hasProductRoadmap(): boolean {
  return "/product/product-roadmap.md" in productFiles;
}

/**
 * Gets raw product file content
 */
export function getProductFile(filename: string): string | null {
  const path = `/product/${filename}`;
  return productFiles[path] ?? null;
}
