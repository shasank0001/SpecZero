/**
 * Design System Loader
 * 
 * Loads design tokens (colors, typography) from the
 * product/design-system/ directory.
 */

import type {
  DesignSystem,
  DesignSystemColors,
  DesignSystemTypography,
  ColorScale,
} from "@/types/design-system";

// ==========================================
// FILE LOADING WITH VITE GLOB
// ==========================================

const designSystemFiles = import.meta.glob("/product/design-system/*.json", {
  import: "default",
  eager: true,
}) as Record<string, unknown>;

// ==========================================
// DEFAULT VALUES
// ==========================================

const defaultColors: DesignSystemColors = {
  name: "Default Design System",
  colors: {
    primary: {
      50: "#eff6ff",
      100: "#dbeafe",
      200: "#bfdbfe",
      300: "#93c5fd",
      400: "#60a5fa",
      500: "#3b82f6",
      600: "#2563eb",
      700: "#1d4ed8",
      800: "#1e40af",
      900: "#1e3a8a",
    },
    secondary: {
      50: "#f8fafc",
      100: "#f1f5f9",
      200: "#e2e8f0",
      300: "#cbd5e1",
      400: "#94a3b8",
      500: "#64748b",
      600: "#475569",
      700: "#334155",
      800: "#1e293b",
      900: "#0f172a",
    },
    neutral: {
      50: "#fafafa",
      100: "#f4f4f5",
      200: "#e4e4e7",
      300: "#d4d4d8",
      400: "#a1a1aa",
      500: "#71717a",
      600: "#52525b",
      700: "#3f3f46",
      800: "#27272a",
      900: "#18181b",
    },
    success: "#22c55e",
    warning: "#f59e0b",
    error: "#ef4444",
    info: "#3b82f6",
  },
};

const defaultTypography: DesignSystemTypography = {
  name: "Default Typography",
  fonts: {
    sans: {
      family: "DM Sans",
      weights: [400, 500, 600, 700],
      fallback: "system-ui, sans-serif",
    },
    mono: {
      family: "IBM Plex Mono",
      weights: [400, 500],
      fallback: "ui-monospace, monospace",
    },
  },
  sizes: {
    xs: { size: "0.75rem", lineHeight: "1rem" },
    sm: { size: "0.875rem", lineHeight: "1.25rem" },
    base: { size: "1rem", lineHeight: "1.5rem" },
    lg: { size: "1.125rem", lineHeight: "1.75rem" },
    xl: { size: "1.25rem", lineHeight: "1.75rem" },
    "2xl": { size: "1.5rem", lineHeight: "2rem" },
    "3xl": { size: "1.875rem", lineHeight: "2.25rem" },
    "4xl": { size: "2.25rem", lineHeight: "2.5rem" },
  },
  headings: {
    h1: { size: "2.25rem", weight: 700, lineHeight: "2.5rem" },
    h2: { size: "1.875rem", weight: 600, lineHeight: "2.25rem" },
    h3: { size: "1.5rem", weight: 600, lineHeight: "2rem" },
    h4: { size: "1.25rem", weight: 600, lineHeight: "1.75rem" },
    h5: { size: "1.125rem", weight: 500, lineHeight: "1.75rem" },
    h6: { size: "1rem", weight: 500, lineHeight: "1.5rem" },
  },
};

// ==========================================
// MAIN LOADER FUNCTIONS
// ==========================================

/**
 * Loads the complete design system (colors + typography)
 */
export function loadDesignSystem(): DesignSystem {
  return {
    colors: loadColors(),
    typography: loadTypography(),
  };
}

/**
 * Loads color definitions from colors.json
 */
export function loadColors(): DesignSystemColors {
  const content = designSystemFiles["/product/design-system/colors.json"];
  
  if (!content) {
    return defaultColors;
  }

  return validateColors(content as DesignSystemColors);
}

/**
 * Loads typography definitions from typography.json
 */
export function loadTypography(): DesignSystemTypography {
  const content = designSystemFiles["/product/design-system/typography.json"];
  
  if (!content) {
    return defaultTypography;
  }

  return validateTypography(content as DesignSystemTypography);
}

// ==========================================
// VALIDATION FUNCTIONS
// ==========================================

/**
 * Validates and normalizes color definitions
 */
function validateColors(input: unknown): DesignSystemColors {
  if (!input || typeof input !== "object") {
    return defaultColors;
  }

  const data = input as Record<string, unknown>;
  
  return {
    name: typeof data.name === "string" ? data.name : defaultColors.name,
    colors: {
      primary: validateColorScale(data.colors, "primary"),
      secondary: validateColorScale(data.colors, "secondary"),
      neutral: validateColorScale(data.colors, "neutral"),
      success: getColorValue(data.colors, "success", defaultColors.colors.success),
      warning: getColorValue(data.colors, "warning", defaultColors.colors.warning),
      error: getColorValue(data.colors, "error", defaultColors.colors.error),
      info: getColorValue(data.colors, "info", defaultColors.colors.info),
    },
  };
}

/**
 * Validates a color scale (50-900)
 */
function validateColorScale(
  colors: unknown,
  key: "primary" | "secondary" | "neutral"
): ColorScale {
  if (!colors || typeof colors !== "object") {
    return defaultColors.colors[key];
  }

  const data = colors as Record<string, unknown>;
  const scale = data[key];
  
  if (!scale || typeof scale !== "object") {
    return defaultColors.colors[key];
  }

  const scaleData = scale as Record<string, string>;
  const defaultScale = defaultColors.colors[key];

  return {
    50: scaleData["50"] ?? defaultScale["50"],
    100: scaleData["100"] ?? defaultScale["100"],
    200: scaleData["200"] ?? defaultScale["200"],
    300: scaleData["300"] ?? defaultScale["300"],
    400: scaleData["400"] ?? defaultScale["400"],
    500: scaleData["500"] ?? defaultScale["500"],
    600: scaleData["600"] ?? defaultScale["600"],
    700: scaleData["700"] ?? defaultScale["700"],
    800: scaleData["800"] ?? defaultScale["800"],
    900: scaleData["900"] ?? defaultScale["900"],
  };
}

/**
 * Gets a single color value with fallback
 */
function getColorValue(
  colors: unknown,
  key: string,
  defaultValue: string
): string {
  if (!colors || typeof colors !== "object") {
    return defaultValue;
  }
  
  const data = colors as Record<string, unknown>;
  const value = data[key];
  
  return typeof value === "string" ? value : defaultValue;
}

/**
 * Validates and normalizes typography definitions
 */
function validateTypography(input: unknown): DesignSystemTypography {
  if (!input || typeof input !== "object") {
    return defaultTypography;
  }

  const data = input as Record<string, unknown>;
  
  return {
    name: typeof data.name === "string" ? data.name : defaultTypography.name,
    fonts: validateFonts(data.fonts),
    sizes: validateSizes(data.sizes),
    headings: validateHeadings(data.headings),
  };
}

/**
 * Validates font definitions
 */
function validateFonts(
  fonts: unknown
): DesignSystemTypography["fonts"] {
  if (!fonts || typeof fonts !== "object") {
    return defaultTypography.fonts;
  }

  const data = fonts as Record<string, unknown>;
  
  return {
    sans: validateFontFamily(data.sans, defaultTypography.fonts.sans),
    mono: validateFontFamily(data.mono, defaultTypography.fonts.mono),
  };
}

/**
 * Validates a single font family
 */
function validateFontFamily(
  font: unknown,
  defaultFont: DesignSystemTypography["fonts"]["sans"]
): DesignSystemTypography["fonts"]["sans"] {
  if (!font || typeof font !== "object") {
    return defaultFont;
  }

  const data = font as Record<string, unknown>;
  
  return {
    family: typeof data.family === "string" ? data.family : defaultFont.family,
    weights: Array.isArray(data.weights) ? data.weights : defaultFont.weights,
    fallback: typeof data.fallback === "string" ? data.fallback : defaultFont.fallback,
  };
}

/**
 * Validates font sizes
 */
function validateSizes(
  sizes: unknown
): DesignSystemTypography["sizes"] {
  if (!sizes || typeof sizes !== "object") {
    return defaultTypography.sizes;
  }

  // Just return as-is with type assertion for now
  // In production, you'd validate each size
  return sizes as DesignSystemTypography["sizes"];
}

/**
 * Validates heading styles
 */
function validateHeadings(
  headings: unknown
): DesignSystemTypography["headings"] {
  if (!headings || typeof headings !== "object") {
    return defaultTypography.headings;
  }

  return headings as DesignSystemTypography["headings"];
}

// ==========================================
// UTILITY EXPORTS
// ==========================================

/**
 * Checks if custom colors are defined
 */
export function hasCustomColors(): boolean {
  return "/product/design-system/colors.json" in designSystemFiles;
}

/**
 * Checks if custom typography is defined
 */
export function hasCustomTypography(): boolean {
  return "/product/design-system/typography.json" in designSystemFiles;
}

/**
 * Checks if any design system files exist
 */
export function hasDesignTokens(): boolean {
  return hasCustomColors() || hasCustomTypography();
}

/**
 * Gets all color values as a flat list (for display)
 */
export function getAllColors(): Array<{ name: string; value: string }> {
  const colors = loadColors();
  const result: Array<{ name: string; value: string }> = [];
  
  // Add scale colors
  for (const [scaleName, scale] of Object.entries(colors.colors)) {
    if (typeof scale === "object") {
      for (const [shade, value] of Object.entries(scale)) {
        result.push({
          name: `${scaleName}-${shade}`,
          value: value as string,
        });
      }
    } else {
      result.push({
        name: scaleName,
        value: scale,
      });
    }
  }
  
  return result;
}

/**
 * Generates CSS custom properties from design tokens
 */
export function generateCSSTokens(): string {
  const colors = loadColors();
  const typography = loadTypography();
  
  let css = ":root {\n";
  
  // Add color tokens
  for (const [scaleName, scale] of Object.entries(colors.colors)) {
    if (typeof scale === "object") {
      for (const [shade, value] of Object.entries(scale)) {
        css += `  --color-${scaleName}-${shade}: ${value};\n`;
      }
    } else {
      css += `  --color-${scaleName}: ${scale};\n`;
    }
  }
  
  // Add font tokens
  css += `  --font-sans: "${typography.fonts.sans.family}", ${typography.fonts.sans.fallback};\n`;
  css += `  --font-mono: "${typography.fonts.mono.family}", ${typography.fonts.mono.fallback};\n`;
  
  css += "}\n";
  
  return css;
}
