/**
 * Shell Types
 * 
 * Types for representing the app shell specification and components
 * from the product/shell/ directory.
 */

// ==========================================
// SHELL SPEC TYPES
// ==========================================

export interface ShellSpec {
  overview: string;
  layout: ShellLayout;
  navigation: NavigationItem[];
  components: ShellComponent[];
  responsiveBehavior: ResponsiveBehavior[];
  rawContent: string;
}

export interface ShellLayout {
  description: string;
  structure: string;
}

export interface NavigationItem {
  label: string;
  icon: string;
  path: string;
  description: string;
}

export interface ShellComponent {
  name: string;
  description: string;
}

export interface ResponsiveBehavior {
  breakpoint: string;
  range: string;
  behavior: string;
}

// ==========================================
// SHELL COMPONENT TYPES
// ==========================================

export interface ShellComponents {
  hasAppShell: boolean;
  hasMainNav: boolean;
  hasUserMenu: boolean;
  hasHeader: boolean;
  hasSidebar: boolean;
  components: string[];
}
