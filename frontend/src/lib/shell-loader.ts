/**
 * Shell Loader
 * 
 * Loads shell specifications and component information from
 * the product/shell/ and src/shell/ directories.
 */

import type {
  ShellSpec,
  ShellLayout,
  NavigationItem,
  ShellComponent,
  ResponsiveBehavior,
  ShellComponents,
} from "@/types/shell";

// ==========================================
// FILE LOADING WITH VITE GLOB
// ==========================================

// Load shell spec
const shellSpecs = import.meta.glob("/product/shell/*.md", {
  query: "?raw",
  import: "default",
  eager: true,
}) as Record<string, string>;

// Check for shell component implementations
const shellComponents = import.meta.glob("/src/shell/components/*.tsx", {
  query: "?raw",
  import: "default",
  eager: true,
}) as Record<string, string>;

// Load shell preview wrapper
const shellPreview = import.meta.glob("/src/shell/ShellPreview.tsx", {
  query: "?raw",
  import: "default",
  eager: true,
}) as Record<string, string>;

// ==========================================
// MAIN LOADER FUNCTIONS
// ==========================================

/**
 * Loads and parses the shell specification
 */
export function loadShellSpec(): ShellSpec | null {
  const content = shellSpecs["/product/shell/spec.md"];
  
  if (!content) {
    return null;
  }

  return parseShellSpec(content);
}

/**
 * Checks what shell components are implemented
 */
export function loadShellComponents(): ShellComponents {
  const componentPaths = Object.keys(shellComponents);
  
  const components = componentPaths.map((path) => {
    const match = path.match(/\/([^/]+)\.tsx$/);
    return match ? match[1] : null;
  }).filter(Boolean) as string[];
  
  return {
    hasAppShell: components.includes("AppShell"),
    hasMainNav: components.includes("MainNav"),
    hasUserMenu: components.includes("UserMenu"),
    hasHeader: components.includes("Header"),
    hasSidebar: components.includes("Sidebar"),
    components,
  };
}

// ==========================================
// SPEC PARSING
// ==========================================

/**
 * Parses the shell spec markdown
 */
function parseShellSpec(content: string): ShellSpec {
  return {
    overview: extractOverview(content),
    layout: extractLayout(content),
    navigation: extractNavigation(content),
    components: extractComponents(content),
    responsiveBehavior: extractResponsiveBehavior(content),
    rawContent: content,
  };
}

/**
 * Extracts overview section
 */
function extractOverview(content: string): string {
  const match = content.match(/##\s+Overview\s+([\s\S]*?)(?=\n##\s|$)/i);
  return match ? match[1].trim() : "";
}

/**
 * Extracts layout structure
 */
function extractLayout(content: string): ShellLayout {
  const match = content.match(/##\s+Layout\s+Structure\s+([\s\S]*?)(?=\n##\s|$)/i);
  
  if (!match) {
    return { description: "", structure: "" };
  }
  
  const section = match[1];
  
  // Extract code block (ASCII diagram)
  const codeMatch = section.match(/```[\s\S]*?\n([\s\S]*?)```/);
  const structure = codeMatch ? codeMatch[1].trim() : "";
  
  // Description is text before the code block
  const description = section.split("```")[0].trim();
  
  return { description, structure };
}

/**
 * Extracts navigation items from table
 */
function extractNavigation(content: string): NavigationItem[] {
  const items: NavigationItem[] = [];
  
  // Find Navigation Items section
  const match = content.match(/##\s+Navigation\s+Items\s+([\s\S]*?)(?=\n##\s|$)/i);
  if (!match) return items;
  
  // Parse markdown table
  const lines = match[1].split("\n").filter((l) => l.includes("|"));
  
  // Skip header and separator rows
  const dataRows = lines.slice(2);
  
  for (const row of dataRows) {
    const cells = row.split("|").map((c) => c.trim()).filter(Boolean);
    if (cells.length >= 4) {
      items.push({
        label: cells[0],
        icon: cells[1],
        path: cells[2],
        description: cells[3],
      });
    }
  }
  
  return items;
}

/**
 * Extracts component descriptions
 */
function extractComponents(content: string): ShellComponent[] {
  const components: ShellComponent[] = [];
  
  // Find Components section
  const match = content.match(/##\s+Components\s+([\s\S]*?)(?=\n##\s|$)/i);
  if (!match) return components;
  
  const section = match[1];
  
  // Match ### ComponentName patterns
  const componentBlocks = section.split(/(?=^###\s+)/m);
  
  for (const block of componentBlocks) {
    const nameMatch = block.match(/^###\s+(\w+)/);
    if (!nameMatch) continue;
    
    const name = nameMatch[1];
    
    // Get description (text after heading)
    const descMatch = block.match(/^###\s+\w+\s*\n([\s\S]*?)(?=\n###|$)/m);
    const description = descMatch ? descMatch[1].trim() : "";
    
    components.push({ name, description });
  }
  
  return components;
}

/**
 * Extracts responsive behavior
 */
function extractResponsiveBehavior(content: string): ResponsiveBehavior[] {
  const behaviors: ResponsiveBehavior[] = [];
  
  // Find Responsive Behavior section
  const match = content.match(/##\s+Responsive\s+Behavior\s+([\s\S]*?)(?=\n##\s|$)/i);
  if (!match) return behaviors;
  
  const section = match[1];
  
  // Match bullet points with breakpoint info
  const lines = section.split("\n");
  
  for (const line of lines) {
    // Pattern: - **Breakpoint (range):** behavior
    const behaviorMatch = line.match(
      /^-\s+\*\*(\w+)\s*\(([^)]+)\):\*\*\s*(.+)$/
    );
    
    if (behaviorMatch) {
      behaviors.push({
        breakpoint: behaviorMatch[1],
        range: behaviorMatch[2],
        behavior: behaviorMatch[3],
      });
    }
  }
  
  return behaviors;
}

// ==========================================
// UTILITY EXPORTS
// ==========================================

/**
 * Checks if shell spec exists
 */
export function hasShellSpec(): boolean {
  return "/product/shell/spec.md" in shellSpecs;
}

/**
 * Checks if shell components are implemented
 */
export function hasShellComponents(): boolean {
  return Object.keys(shellComponents).length > 0;
}

/**
 * Checks if shell preview is available
 */
export function hasShellPreview(): boolean {
  return "/src/shell/ShellPreview.tsx" in shellPreview;
}

/**
 * Gets shell component source code
 */
export function getShellComponentSource(
  componentName: string
): string | null {
  const path = `/src/shell/components/${componentName}.tsx`;
  return shellComponents[path] ?? null;
}

/**
 * Gets all shell component names
 */
export function getShellComponentNames(): string[] {
  const components = loadShellComponents();
  return components.components;
}

/**
 * Gets navigation items for the shell
 */
export function getNavigationItems(): NavigationItem[] {
  const spec = loadShellSpec();
  return spec?.navigation ?? [];
}
