/**
 * Design System Types
 * 
 * Types for representing color palettes, typography, and other
 * design tokens from the product/design-system/ directory.
 */

// ==========================================
// COLOR TYPES
// ==========================================

export interface DesignSystemColors {
  name: string;
  colors: ColorPalette;
}

export interface ColorPalette {
  primary: ColorScale;
  secondary: ColorScale;
  neutral: ColorScale;
  success: string;
  warning: string;
  error: string;
  info: string;
}

export interface ColorScale {
  50: string;
  100: string;
  200: string;
  300: string;
  400: string;
  500: string;
  600: string;
  700: string;
  800: string;
  900: string;
}

// ==========================================
// TYPOGRAPHY TYPES
// ==========================================

export interface DesignSystemTypography {
  name: string;
  fonts: FontDefinitions;
  sizes: FontSizes;
  headings: HeadingStyles;
}

export interface FontDefinitions {
  sans: FontFamily;
  mono: FontFamily;
}

export interface FontFamily {
  family: string;
  weights: number[];
  fallback: string;
}

export interface FontSizes {
  xs: FontSizeDefinition;
  sm: FontSizeDefinition;
  base: FontSizeDefinition;
  lg: FontSizeDefinition;
  xl: FontSizeDefinition;
  "2xl": FontSizeDefinition;
  "3xl": FontSizeDefinition;
  "4xl": FontSizeDefinition;
}

export interface FontSizeDefinition {
  size: string;
  lineHeight: string;
}

export interface HeadingStyles {
  h1: HeadingStyle;
  h2: HeadingStyle;
  h3: HeadingStyle;
  h4: HeadingStyle;
  h5: HeadingStyle;
  h6: HeadingStyle;
}

export interface HeadingStyle {
  size: string;
  weight: number;
  lineHeight: string;
}

// ==========================================
// COMBINED DESIGN SYSTEM
// ==========================================

export interface DesignSystem {
  colors: DesignSystemColors | null;
  typography: DesignSystemTypography | null;
}
