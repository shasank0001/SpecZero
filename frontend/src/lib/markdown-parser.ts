/**
 * Markdown Parser Utility
 * 
 * Provides utility functions for parsing markdown content
 * into structured data. Used by product, section, and shell loaders.
 */

// ==========================================
// TYPES
// ==========================================

export interface ParsedHeading {
  level: number;
  text: string;
  line: number;
}

export interface ParsedSection {
  heading: string;
  level: number;
  content: string;
  startLine: number;
  endLine: number;
}

export interface ParsedTable {
  headers: string[];
  rows: string[][];
}

export interface ParsedListItem {
  text: string;
  indent: number;
  isOrdered: boolean;
  children: ParsedListItem[];
}

// ==========================================
// HEADING PARSING
// ==========================================

/**
 * Extracts all headings from markdown content
 */
export function parseHeadings(content: string): ParsedHeading[] {
  const headings: ParsedHeading[] = [];
  const lines = content.split("\n");
  
  for (let i = 0; i < lines.length; i++) {
    const match = lines[i].match(/^(#{1,6})\s+(.+)$/);
    if (match) {
      headings.push({
        level: match[1].length,
        text: match[2].trim(),
        line: i + 1,
      });
    }
  }
  
  return headings;
}

/**
 * Gets the main title (first H1) from markdown
 */
export function getTitle(content: string): string | null {
  const match = content.match(/^#\s+(.+)$/m);
  return match ? match[1].trim() : null;
}

// ==========================================
// SECTION PARSING
// ==========================================

/**
 * Splits content into sections by heading level
 */
export function parseSections(
  content: string,
  level: number = 2
): ParsedSection[] {
  const sections: ParsedSection[] = [];
  const lines = content.split("\n");
  const headingPattern = new RegExp(`^${"#".repeat(level)}\\s+(.+)$`);
  
  let currentSection: ParsedSection | null = null;
  let contentLines: string[] = [];
  
  for (let i = 0; i < lines.length; i++) {
    const match = lines[i].match(headingPattern);
    
    if (match) {
      // Save previous section
      if (currentSection) {
        currentSection.content = contentLines.join("\n").trim();
        currentSection.endLine = i;
        sections.push(currentSection);
      }
      
      // Start new section
      currentSection = {
        heading: match[1].trim(),
        level,
        content: "",
        startLine: i + 1,
        endLine: -1,
      };
      contentLines = [];
    } else if (currentSection) {
      contentLines.push(lines[i]);
    }
  }
  
  // Save last section
  if (currentSection) {
    currentSection.content = contentLines.join("\n").trim();
    currentSection.endLine = lines.length;
    sections.push(currentSection);
  }
  
  return sections;
}

/**
 * Extracts a specific section by heading name
 */
export function getSection(
  content: string,
  sectionName: string,
  level: number = 2
): string | null {
  const escapedName = sectionName.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const pattern = new RegExp(
    `^${"#".repeat(level)}\\s+${escapedName}\\s*\\n([\\s\\S]*?)(?=\\n${"#".repeat(level)}\\s|$)`,
    "im"
  );
  
  const match = content.match(pattern);
  return match ? match[1].trim() : null;
}

// ==========================================
// TABLE PARSING
// ==========================================

/**
 * Parses a markdown table into headers and rows
 */
export function parseTable(content: string): ParsedTable | null {
  const lines = content.split("\n").filter((l) => l.trim().startsWith("|"));
  
  if (lines.length < 2) return null;
  
  // Parse header row
  const headers = parseTableRow(lines[0]);
  
  // Skip separator row (index 1)
  // Parse data rows
  const rows: string[][] = [];
  for (let i = 2; i < lines.length; i++) {
    const row = parseTableRow(lines[i]);
    if (row.length > 0) {
      rows.push(row);
    }
  }
  
  return { headers, rows };
}

/**
 * Parses a single table row
 */
function parseTableRow(line: string): string[] {
  return line
    .split("|")
    .map((cell) => cell.trim())
    .filter((cell) => cell && !cell.match(/^[-:]+$/));
}

/**
 * Finds and parses a table after a specific heading
 */
export function getTableAfterHeading(
  content: string,
  headingName: string
): ParsedTable | null {
  const section = getSection(content, headingName);
  if (!section) return null;
  return parseTable(section);
}

// ==========================================
// LIST PARSING
// ==========================================

/**
 * Parses a markdown list into structured items
 */
export function parseList(content: string): ParsedListItem[] {
  const items: ParsedListItem[] = [];
  const lines = content.split("\n");
  
  for (const line of lines) {
    // Match unordered list: - or *
    const unorderedMatch = line.match(/^(\s*)[-*]\s+(.+)$/);
    // Match ordered list: 1. or 1)
    const orderedMatch = line.match(/^(\s*)\d+[.)]\s+(.+)$/);
    
    const match = unorderedMatch || orderedMatch;
    if (match) {
      items.push({
        text: match[2].trim(),
        indent: match[1].length,
        isOrdered: !!orderedMatch,
        children: [],
      });
    }
  }
  
  return items;
}

/**
 * Builds a nested list structure from flat items
 */
export function buildNestedList(items: ParsedListItem[]): ParsedListItem[] {
  if (items.length === 0) return [];
  
  const result: ParsedListItem[] = [];
  const stack: ParsedListItem[] = [];
  
  for (const item of items) {
    // Find parent based on indent
    while (stack.length > 0 && stack[stack.length - 1].indent >= item.indent) {
      stack.pop();
    }
    
    if (stack.length === 0) {
      result.push(item);
    } else {
      stack[stack.length - 1].children.push(item);
    }
    
    stack.push(item);
  }
  
  return result;
}

// ==========================================
// TEXT EXTRACTION
// ==========================================

/**
 * Extracts bold text (**text**)
 */
export function extractBoldText(content: string): string[] {
  const matches = content.match(/\*\*([^*]+)\*\*/g) || [];
  return matches.map((m) => m.replace(/\*\*/g, ""));
}

/**
 * Extracts inline code (`code`)
 */
export function extractInlineCode(content: string): string[] {
  const matches = content.match(/`([^`]+)`/g) || [];
  return matches.map((m) => m.replace(/`/g, ""));
}

/**
 * Extracts code blocks
 */
export function extractCodeBlocks(
  content: string
): Array<{ language: string; code: string }> {
  const blocks: Array<{ language: string; code: string }> = [];
  const regex = /```(\w*)\n([\s\S]*?)```/g;
  
  let match;
  while ((match = regex.exec(content)) !== null) {
    blocks.push({
      language: match[1] || "text",
      code: match[2].trim(),
    });
  }
  
  return blocks;
}

/**
 * Extracts blockquotes (> text)
 */
export function extractBlockquotes(content: string): string[] {
  const matches = content.match(/^>\s*(.+)$/gm) || [];
  return matches.map((m) => m.replace(/^>\s*/, "").trim());
}

// ==========================================
// FRONT MATTER PARSING
// ==========================================

/**
 * Parses YAML front matter from markdown
 */
export function parseFrontMatter(
  content: string
): Record<string, string> | null {
  const match = content.match(/^---\n([\s\S]*?)\n---/);
  if (!match) return null;
  
  const frontMatter: Record<string, string> = {};
  const lines = match[1].split("\n");
  
  for (const line of lines) {
    const [key, ...valueParts] = line.split(":");
    if (key && valueParts.length > 0) {
      frontMatter[key.trim()] = valueParts.join(":").trim();
    }
  }
  
  return frontMatter;
}

/**
 * Removes front matter from content
 */
export function stripFrontMatter(content: string): string {
  return content.replace(/^---\n[\s\S]*?\n---\n/, "").trim();
}

// ==========================================
// UTILITY FUNCTIONS
// ==========================================

/**
 * Converts markdown to plain text (strips formatting)
 */
export function toPlainText(content: string): string {
  return content
    .replace(/\*\*([^*]+)\*\*/g, "$1") // Bold
    .replace(/\*([^*]+)\*/g, "$1") // Italic
    .replace(/`([^`]+)`/g, "$1") // Inline code
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1") // Links
    .replace(/^#+\s+/gm, "") // Headings
    .replace(/^[-*]\s+/gm, "") // List items
    .replace(/^\d+\.\s+/gm, "") // Ordered list items
    .replace(/^>\s+/gm, "") // Blockquotes
    .trim();
}

/**
 * Counts words in markdown content
 */
export function countWords(content: string): number {
  const plainText = toPlainText(content);
  const words = plainText.split(/\s+/).filter((w) => w.length > 0);
  return words.length;
}

/**
 * Estimates reading time in minutes
 */
export function estimateReadingTime(content: string): number {
  const words = countWords(content);
  const wordsPerMinute = 200;
  return Math.ceil(words / wordsPerMinute);
}
