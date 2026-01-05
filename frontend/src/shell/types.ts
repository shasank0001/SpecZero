/**
 * Shell component type definitions
 */

export interface NavItem {
  label: string;
  href: string;
  icon?: React.ReactNode;
  badge?: string | number;
  active?: boolean;
}

export interface User {
  name: string;
  email: string;
  avatar?: string;
  role?: string;
}
