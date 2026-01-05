# Phase 5: Designs Tab (Component Preview) - Detailed Implementation Plan

> **Goal:** Live preview of React components in isolated iframe with section navigation and design tokens viewer  
> **Duration:** 5 days  
> **Outcome:** A complete Designs tab that renders React components live in iframes, provides device size toggles, displays shell preview, component tree navigation, and design tokens viewer

---

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Step 1: Create Section Component Structure](#step-1-create-section-component-structure)
3. [Step 2: Create Shell Component Structure](#step-2-create-shell-component-structure)
4. [Step 3: Create Fullscreen Preview Routes](#step-3-create-fullscreen-preview-routes)
5. [Step 4: Create Iframe Preview Component](#step-4-create-iframe-preview-component)
6. [Step 5: Create Device Size Toggle](#step-5-create-device-size-toggle)
7. [Step 6: Create Section Navigator](#step-6-create-section-navigator)
8. [Step 7: Create Component Tree](#step-7-create-component-tree)
9. [Step 8: Create Design Tokens Viewer](#step-8-create-design-tokens-viewer)
10. [Step 9: Assemble Designs Page](#step-9-assemble-designs-page)
11. [Step 10: Enforce Props-Only Components](#step-10-enforce-props-only-components)
12. [Verification Checklist](#verification-checklist)
13. [File Structure Summary](#file-structure-summary)

---

## Prerequisites

Before starting Phase 5, ensure you have:

- [ ] Completed Phase 1 successfully (Vite app with routing and layout)
- [ ] Completed Phase 2 successfully (File loaders and data layer)
- [ ] Completed Phase 3 successfully (Plan tab with markdown rendering)
- [ ] Completed Phase 4 successfully (Data tab with Mermaid ERD diagram)
- [ ] Working section loader from Phase 2
- [ ] Working design system loader from Phase 2
- [ ] Sample section files in `product/sections/`
- [ ] All Phase 4 verification checks passing

**Required from Phase 2:**
- `src/lib/section-loader.ts` - Loads section specs, data, and types
- `src/lib/design-system-loader.ts` - Loads colors.json and typography.json
- `src/lib/shell-loader.ts` - Loads shell spec and components
- `src/types/section.ts` - Type definitions for SectionData, SectionSpec

**Required from Phase 3:**
- `src/components/shared/EmptyState.tsx` - Empty state component
- `src/components/shared/MarkdownRenderer.tsx` - Markdown rendering

**Required from Phase 4:**
- `src/components/shared/CodeBlock.tsx` - Syntax highlighting component

**Sample Files Needed:**
```
product/
├── design-system/
│   ├── colors.json
│   └── typography.json
├── shell/
│   └── spec.md
└── sections/
    └── patients/
        ├── spec.md
        ├── data.json
        └── types.ts
```

---

## Step 1: Create Section Component Structure

Sections are the main feature areas of the application. Each section contains components that receive data via props (never import data directly).

### 1.1 Create Directory Structure

```bash
mkdir -p src/sections/patients/components
```

### 1.2 Understand the Section Pattern

Each section follows this structure:

```
src/sections/
└── [section-id]/
    ├── components/           # Exportable, props-based components
    │   ├── [Component].tsx
    │   └── index.ts
    └── [ViewName].tsx        # Preview wrapper (NOT exported)
```

**Key Principle:** Components in `components/` folder are **props-based** and exportable. Preview wrappers inject sample data and are NOT included in the export.

### 1.3 Create Sample Patient Table Component

Create `src/sections/patients/components/PatientTable.tsx`:

```tsx
import { cn } from "@/lib/utils";

export interface Patient {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  createdAt: string;
}

export interface PatientTableProps {
  patients: Patient[];
  onView?: (id: string) => void;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
  className?: string;
}

/**
 * PatientTable - Displays a list of patients in a table format
 * 
 * This component is props-based and exportable.
 * It does NOT import any data files directly.
 */
export function PatientTable({
  patients,
  onView,
  onEdit,
  onDelete,
  className,
}: PatientTableProps) {
  if (patients.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        <p>No patients found</p>
      </div>
    );
  }

  return (
    <div className={cn("overflow-x-auto", className)}>
      <table className="w-full border-collapse">
        <thead>
          <tr className="border-b border-border bg-muted/50">
            <th className="text-left p-4 font-medium">Name</th>
            <th className="text-left p-4 font-medium">Email</th>
            <th className="text-left p-4 font-medium">Phone</th>
            <th className="text-left p-4 font-medium">Date of Birth</th>
            <th className="text-right p-4 font-medium">Actions</th>
          </tr>
        </thead>
        <tbody>
          {patients.map((patient) => (
            <tr
              key={patient.id}
              className="border-b border-border hover:bg-muted/30 transition-colors"
            >
              <td className="p-4">
                <span className="font-medium">
                  {patient.firstName} {patient.lastName}
                </span>
              </td>
              <td className="p-4 text-muted-foreground">{patient.email}</td>
              <td className="p-4 text-muted-foreground">{patient.phone}</td>
              <td className="p-4 text-muted-foreground">{patient.dateOfBirth}</td>
              <td className="p-4">
                <div className="flex items-center justify-end gap-2">
                  {onView && (
                    <button
                      onClick={() => onView(patient.id)}
                      className="text-sm text-primary hover:underline"
                    >
                      View
                    </button>
                  )}
                  {onEdit && (
                    <button
                      onClick={() => onEdit(patient.id)}
                      className="text-sm text-primary hover:underline"
                    >
                      Edit
                    </button>
                  )}
                  {onDelete && (
                    <button
                      onClick={() => onDelete(patient.id)}
                      className="text-sm text-destructive hover:underline"
                    >
                      Delete
                    </button>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
```

### 1.4 Create Sample Patient Card Component

Create `src/sections/patients/components/PatientCard.tsx`:

```tsx
import { cn } from "@/lib/utils";
import { User, Mail, Phone, Calendar } from "lucide-react";
import type { Patient } from "./PatientTable";

export interface PatientCardProps {
  patient: Patient;
  onView?: (id: string) => void;
  onEdit?: (id: string) => void;
  className?: string;
}

/**
 * PatientCard - Displays a single patient in a card format
 * 
 * This component is props-based and exportable.
 */
export function PatientCard({
  patient,
  onView,
  onEdit,
  className,
}: PatientCardProps) {
  return (
    <div
      className={cn(
        "p-6 rounded-lg border border-border bg-card hover:shadow-md transition-shadow",
        className
      )}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
            <User className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h3 className="font-semibold">
              {patient.firstName} {patient.lastName}
            </h3>
            <p className="text-sm text-muted-foreground">Patient</p>
          </div>
        </div>
      </div>

      <div className="space-y-2 text-sm">
        <div className="flex items-center gap-2 text-muted-foreground">
          <Mail className="w-4 h-4" />
          <span>{patient.email}</span>
        </div>
        <div className="flex items-center gap-2 text-muted-foreground">
          <Phone className="w-4 h-4" />
          <span>{patient.phone}</span>
        </div>
        <div className="flex items-center gap-2 text-muted-foreground">
          <Calendar className="w-4 h-4" />
          <span>{patient.dateOfBirth}</span>
        </div>
      </div>

      {(onView || onEdit) && (
        <div className="flex items-center gap-2 mt-4 pt-4 border-t border-border">
          {onView && (
            <button
              onClick={() => onView(patient.id)}
              className="flex-1 py-2 text-sm font-medium text-primary hover:bg-primary/10 rounded-md transition-colors"
            >
              View Details
            </button>
          )}
          {onEdit && (
            <button
              onClick={() => onEdit(patient.id)}
              className="flex-1 py-2 text-sm font-medium text-muted-foreground hover:bg-muted rounded-md transition-colors"
            >
              Edit
            </button>
          )}
        </div>
      )}
    </div>
  );
}
```

### 1.5 Create Component Index Export

Create `src/sections/patients/components/index.ts`:

```typescript
export { PatientTable } from "./PatientTable";
export { PatientCard } from "./PatientCard";
export type { Patient, PatientTableProps } from "./PatientTable";
export type { PatientCardProps } from "./PatientCard";
```

### 1.6 Create Preview Wrapper

Create `src/sections/patients/PatientList.tsx`:

```tsx
/**
 * PatientList Preview Wrapper
 * 
 * This file is NOT exported - it's used only for local preview.
 * It imports sample data and passes it to the props-based components.
 */
import { PatientTable } from "./components/PatientTable";
import { PatientCard } from "./components/PatientCard";

// Import sample data (preview only - not exported)
import sampleData from "@/../product/sections/patients/data.json";

export default function PatientListPreview() {
  const handleView = (id: string) => {
    console.log("View patient:", id);
  };

  const handleEdit = (id: string) => {
    console.log("Edit patient:", id);
  };

  const handleDelete = (id: string) => {
    console.log("Delete patient:", id);
  };

  return (
    <div className="p-6 space-y-8">
      <div>
        <h2 className="text-2xl font-bold mb-4">Patient Table View</h2>
        <PatientTable
          patients={sampleData.patients}
          onView={handleView}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </div>

      <div>
        <h2 className="text-2xl font-bold mb-4">Patient Card View</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {sampleData.patients.slice(0, 3).map((patient) => (
            <PatientCard
              key={patient.id}
              patient={patient}
              onView={handleView}
              onEdit={handleEdit}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
```

### 1.7 Create Sample Data File

Create `product/sections/patients/data.json`:

```json
{
  "patients": [
    {
      "id": "pat_001",
      "firstName": "John",
      "lastName": "Smith",
      "email": "john.smith@email.com",
      "phone": "(555) 123-4567",
      "dateOfBirth": "1985-03-15",
      "createdAt": "2024-01-10T10:30:00Z"
    },
    {
      "id": "pat_002",
      "firstName": "Sarah",
      "lastName": "Johnson",
      "email": "sarah.j@email.com",
      "phone": "(555) 234-5678",
      "dateOfBirth": "1990-07-22",
      "createdAt": "2024-01-12T14:45:00Z"
    },
    {
      "id": "pat_003",
      "firstName": "Michael",
      "lastName": "Williams",
      "email": "m.williams@email.com",
      "phone": "(555) 345-6789",
      "dateOfBirth": "1978-11-08",
      "createdAt": "2024-01-15T09:15:00Z"
    },
    {
      "id": "pat_004",
      "firstName": "Emily",
      "lastName": "Brown",
      "email": "emily.brown@email.com",
      "phone": "(555) 456-7890",
      "dateOfBirth": "1995-05-30",
      "createdAt": "2024-01-18T16:20:00Z"
    }
  ]
}
```

### 1.8 Create Sample Types File

Create `product/sections/patients/types.ts`:

```typescript
export interface Patient {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  createdAt: string;
}

export interface PatientsData {
  patients: Patient[];
}
```

### 1.9 Create Sample Spec File

Create `product/sections/patients/spec.md`:

```markdown
# Patients Section

## Overview

The Patients section manages patient records including viewing, creating, editing, and deleting patient information.

## Screens

### Patient List
- Display all patients in a table format
- Support for grid/card view toggle
- Search and filter functionality
- Pagination for large datasets

### Patient Detail
- View complete patient information
- Medical history section
- Appointment history
- Notes and documents

### Patient Form
- Create new patient
- Edit existing patient
- Form validation
- Date picker for DOB

## Components

| Component | Description | Props |
|-----------|-------------|-------|
| PatientTable | Table view of patients | patients, onView, onEdit, onDelete |
| PatientCard | Card view of single patient | patient, onView, onEdit |
| PatientForm | Form for creating/editing | patient?, onSubmit, onCancel |

## Data Requirements

- Patient: id, firstName, lastName, email, phone, dateOfBirth, createdAt
- Relationships: Patient has many Appointments
```

### 1.10 Section Component Principles

| Principle | Description |
|-----------|-------------|
| **Props-Based** | All exportable components receive data via props |
| **No Data Imports** | Components never import data.json or fixtures directly |
| **Preview Wrappers** | Separate files inject sample data for local preview |
| **Type Safety** | All props are fully typed with TypeScript interfaces |
| **Stateless** | Components are presentational; state lives in preview wrappers |

---

## Step 2: Create Shell Component Structure

The Shell is the application's main layout including navigation, header, and user menu. It wraps all section content.

### 2.1 Create Directory Structure

```bash
mkdir -p src/shell/components
```

### 2.2 Create AppShell Component

Create `src/shell/components/AppShell.tsx`:

```tsx
import { cn } from "@/lib/utils";
import { MainNav } from "./MainNav";
import { UserMenu } from "./UserMenu";

export interface NavItem {
  label: string;
  href: string;
  icon?: React.ReactNode;
  badge?: string | number;
}

export interface User {
  name: string;
  email: string;
  avatar?: string;
}

export interface AppShellProps {
  children: React.ReactNode;
  navItems: NavItem[];
  user?: User;
  currentPath?: string;
  appName?: string;
  appLogo?: React.ReactNode;
  onNavigate?: (href: string) => void;
  onLogout?: () => void;
  className?: string;
}

/**
 * AppShell - Main application layout wrapper
 * 
 * This component is props-based and exportable.
 * It provides the main layout structure with sidebar navigation.
 */
export function AppShell({
  children,
  navItems,
  user,
  currentPath = "/",
  appName = "App",
  appLogo,
  onNavigate,
  onLogout,
  className,
}: AppShellProps) {
  return (
    <div className={cn("min-h-screen bg-background", className)}>
      {/* Sidebar */}
      <aside className="fixed inset-y-0 left-0 z-50 w-64 bg-card border-r border-border">
        {/* Logo/Brand */}
        <div className="h-16 flex items-center gap-3 px-6 border-b border-border">
          {appLogo ? (
            appLogo
          ) : (
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-sm">
                {appName.charAt(0)}
              </span>
            </div>
          )}
          <span className="font-semibold text-lg">{appName}</span>
        </div>

        {/* Navigation */}
        <MainNav
          items={navItems}
          currentPath={currentPath}
          onNavigate={onNavigate}
        />

        {/* User Menu */}
        {user && (
          <div className="absolute bottom-0 left-0 right-0 border-t border-border">
            <UserMenu user={user} onLogout={onLogout} />
          </div>
        )}
      </aside>

      {/* Main Content */}
      <main className="pl-64">
        <div className="min-h-screen">{children}</div>
      </main>
    </div>
  );
}
```

### 2.3 Create MainNav Component

Create `src/shell/components/MainNav.tsx`:

```tsx
import { cn } from "@/lib/utils";
import type { NavItem } from "./AppShell";

export interface MainNavProps {
  items: NavItem[];
  currentPath?: string;
  onNavigate?: (href: string) => void;
  className?: string;
}

/**
 * MainNav - Sidebar navigation component
 * 
 * This component is props-based and exportable.
 */
export function MainNav({
  items,
  currentPath = "/",
  onNavigate,
  className,
}: MainNavProps) {
  const handleClick = (href: string, e: React.MouseEvent) => {
    if (onNavigate) {
      e.preventDefault();
      onNavigate(href);
    }
  };

  return (
    <nav className={cn("p-4 space-y-1", className)}>
      {items.map((item) => {
        const isActive = currentPath === item.href;

        return (
          <a
            key={item.href}
            href={item.href}
            onClick={(e) => handleClick(item.href, e)}
            className={cn(
              "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
              isActive
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
            )}
          >
            {item.icon && <span className="w-5 h-5">{item.icon}</span>}
            <span className="flex-1">{item.label}</span>
            {item.badge && (
              <span
                className={cn(
                  "px-2 py-0.5 text-xs rounded-full",
                  isActive
                    ? "bg-primary-foreground/20 text-primary-foreground"
                    : "bg-muted text-muted-foreground"
                )}
              >
                {item.badge}
              </span>
            )}
          </a>
        );
      })}
    </nav>
  );
}
```

### 2.4 Create UserMenu Component

Create `src/shell/components/UserMenu.tsx`:

```tsx
import { cn } from "@/lib/utils";
import { LogOut, Settings, User as UserIcon } from "lucide-react";
import type { User } from "./AppShell";

export interface UserMenuProps {
  user: User;
  onLogout?: () => void;
  onSettings?: () => void;
  className?: string;
}

/**
 * UserMenu - User profile and logout component
 * 
 * This component is props-based and exportable.
 */
export function UserMenu({
  user,
  onLogout,
  onSettings,
  className,
}: UserMenuProps) {
  return (
    <div className={cn("p-4", className)}>
      <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
        {/* Avatar */}
        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center overflow-hidden">
          {user.avatar ? (
            <img
              src={user.avatar}
              alt={user.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <UserIcon className="w-5 h-5 text-primary" />
          )}
        </div>

        {/* User Info */}
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium truncate">{user.name}</p>
          <p className="text-xs text-muted-foreground truncate">{user.email}</p>
        </div>
      </div>

      {/* Actions */}
      <div className="mt-2 flex items-center gap-1">
        {onSettings && (
          <button
            onClick={onSettings}
            className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-sm text-muted-foreground hover:bg-muted rounded-lg transition-colors"
          >
            <Settings className="w-4 h-4" />
            <span>Settings</span>
          </button>
        )}
        {onLogout && (
          <button
            onClick={onLogout}
            className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-sm text-muted-foreground hover:bg-muted rounded-lg transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>Logout</span>
          </button>
        )}
      </div>
    </div>
  );
}
```

### 2.5 Create Shell Component Index

Create `src/shell/components/index.ts`:

```typescript
export { AppShell } from "./AppShell";
export { MainNav } from "./MainNav";
export { UserMenu } from "./UserMenu";
export type { AppShellProps, NavItem, User } from "./AppShell";
export type { MainNavProps } from "./MainNav";
export type { UserMenuProps } from "./UserMenu";
```

### 2.6 Create Shell Preview Wrapper

Create `src/shell/ShellPreview.tsx`:

```tsx
/**
 * ShellPreview - Preview wrapper for the application shell
 * 
 * This file is NOT exported - it's used only for local preview.
 */
import { useState } from "react";
import { AppShell } from "./components/AppShell";
import {
  Users,
  Calendar,
  Settings,
  LayoutDashboard,
  FileText,
} from "lucide-react";

const navItems = [
  {
    label: "Dashboard",
    href: "/dashboard",
    icon: <LayoutDashboard className="w-5 h-5" />,
  },
  {
    label: "Patients",
    href: "/patients",
    icon: <Users className="w-5 h-5" />,
    badge: "12",
  },
  {
    label: "Appointments",
    href: "/appointments",
    icon: <Calendar className="w-5 h-5" />,
  },
  {
    label: "Reports",
    href: "/reports",
    icon: <FileText className="w-5 h-5" />,
  },
  {
    label: "Settings",
    href: "/settings",
    icon: <Settings className="w-5 h-5" />,
  },
];

const sampleUser = {
  name: "Dr. Jane Smith",
  email: "jane.smith@clinic.com",
};

export default function ShellPreview() {
  const [currentPath, setCurrentPath] = useState("/dashboard");

  const handleNavigate = (href: string) => {
    setCurrentPath(href);
    console.log("Navigate to:", href);
  };

  const handleLogout = () => {
    console.log("Logout clicked");
  };

  return (
    <AppShell
      navItems={navItems}
      user={sampleUser}
      currentPath={currentPath}
      appName="DentistCRM"
      onNavigate={handleNavigate}
      onLogout={handleLogout}
    >
      <div className="p-8">
        <h1 className="text-3xl font-bold mb-4">
          {navItems.find((item) => item.href === currentPath)?.label ||
            "Dashboard"}
        </h1>
        <p className="text-muted-foreground">
          This is the main content area. Current path: {currentPath}
        </p>

        {/* Sample Content */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="p-6 rounded-lg border border-border bg-card"
            >
              <h3 className="font-semibold mb-2">Card {i}</h3>
              <p className="text-sm text-muted-foreground">
                Sample content for the shell preview.
              </p>
            </div>
          ))}
        </div>
      </div>
    </AppShell>
  );
}
```

### 2.7 Create Shell Spec File

Create `product/shell/spec.md`:

```markdown
# Application Shell

## Overview

The application shell provides the main layout structure including sidebar navigation, header, and user menu.

## Components

### AppShell
Main wrapper component that provides:
- Fixed sidebar (256px width)
- Navigation items with icons and badges
- User profile section with avatar
- Logout functionality

### MainNav
Sidebar navigation with:
- Active state highlighting
- Icon support
- Badge counters
- Click handlers for SPA navigation

### UserMenu
User profile section with:
- Avatar display
- Name and email
- Settings link
- Logout button

## Props Reference

| Component | Prop | Type | Description |
|-----------|------|------|-------------|
| AppShell | navItems | NavItem[] | Navigation menu items |
| AppShell | user | User | Current user info |
| AppShell | currentPath | string | Active route path |
| AppShell | appName | string | Application name |
| AppShell | onNavigate | function | Navigation handler |
| AppShell | onLogout | function | Logout handler |

## Design Tokens

- Sidebar width: 256px (w-64)
- Header height: 64px (h-16)
- Primary color for active states
- Muted colors for inactive items
```

---

## Step 3: Create Fullscreen Preview Routes

Preview routes render components in isolation (for iframe embedding). These routes are separate from the main app navigation.

### 3.1 Understanding Preview Routes

| Route | Purpose | Component |
|-------|---------|-----------|
| `/preview/shell` | Shell preview without sections | ShellPreview |
| `/preview/sections/:sectionId/:screenName` | Section screen preview | Dynamic loader |

### 3.2 Create Preview Layout Component

Create `src/components/preview/PreviewLayout.tsx`:

```tsx
import { useEffect } from "react";

interface PreviewLayoutProps {
  children: React.ReactNode;
}

/**
 * PreviewLayout - Wrapper for preview routes
 * 
 * Handles theme synchronization with parent window
 * and provides a clean preview environment.
 */
export function PreviewLayout({ children }: PreviewLayoutProps) {
  // Sync theme with parent window
  useEffect(() => {
    const syncTheme = () => {
      // Try to get theme from parent window
      try {
        const parentTheme = window.parent?.document?.documentElement?.classList?.contains("dark");
        if (parentTheme !== undefined) {
          if (parentTheme) {
            document.documentElement.classList.add("dark");
          } else {
            document.documentElement.classList.remove("dark");
          }
        }
      } catch {
        // Cross-origin access not allowed, use local storage
        const localTheme = localStorage.getItem("theme");
        if (localTheme === "dark") {
          document.documentElement.classList.add("dark");
        }
      }
    };

    syncTheme();

    // Listen for theme changes
    const handleMessage = (event: MessageEvent) => {
      if (event.data?.type === "theme-change") {
        if (event.data.theme === "dark") {
          document.documentElement.classList.add("dark");
        } else {
          document.documentElement.classList.remove("dark");
        }
      }
    };

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground">
      {children}
    </div>
  );
}
```

### 3.3 Create Section Preview Loader

Create `src/components/preview/SectionPreviewLoader.tsx`:

```tsx
import { useParams } from "react-router-dom";
import { Suspense, lazy, useMemo } from "react";
import { PreviewLayout } from "./PreviewLayout";
import { EmptyState } from "@/components/shared/EmptyState";
import { FileQuestion } from "lucide-react";

// Dynamically import all section preview files
const sectionPreviews = import.meta.glob("/src/sections/*/[A-Z]*.tsx");

export function SectionPreviewLoader() {
  const { sectionId, screenName } = useParams<{
    sectionId: string;
    screenName: string;
  }>();

  const PreviewComponent = useMemo(() => {
    if (!sectionId || !screenName) return null;

    // Build the expected path
    const previewPath = `/src/sections/${sectionId}/${screenName}.tsx`;

    // Check if the preview exists
    const loader = sectionPreviews[previewPath];
    if (!loader) return null;

    // Create lazy component
    return lazy(loader as () => Promise<{ default: React.ComponentType }>);
  }, [sectionId, screenName]);

  if (!PreviewComponent) {
    return (
      <PreviewLayout>
        <div className="flex items-center justify-center min-h-screen p-8">
          <EmptyState
            icon={FileQuestion}
            title="Preview not found"
            description={`No preview found for ${sectionId}/${screenName}`}
          />
        </div>
      </PreviewLayout>
    );
  }

  return (
    <PreviewLayout>
      <Suspense
        fallback={
          <div className="flex items-center justify-center min-h-screen">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
          </div>
        }
      >
        <PreviewComponent />
      </Suspense>
    </PreviewLayout>
  );
}
```

### 3.4 Create Shell Preview Route Component

Create `src/components/preview/ShellPreviewRoute.tsx`:

```tsx
import { Suspense, lazy } from "react";
import { PreviewLayout } from "./PreviewLayout";
import { EmptyState } from "@/components/shared/EmptyState";
import { LayoutTemplate } from "lucide-react";

// Dynamically import shell preview
const ShellPreview = lazy(() =>
  import("@/shell/ShellPreview").catch(() => ({
    default: () => (
      <EmptyState
        icon={LayoutTemplate}
        title="No shell preview"
        description="Create shell components to see them here"
      />
    ),
  }))
);

export function ShellPreviewRoute() {
  return (
    <PreviewLayout>
      <Suspense
        fallback={
          <div className="flex items-center justify-center min-h-screen">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
          </div>
        }
      >
        <ShellPreview />
      </Suspense>
    </PreviewLayout>
  );
}
```

### 3.5 Create Preview Components Index

Create `src/components/preview/index.ts`:

```typescript
export { PreviewLayout } from "./PreviewLayout";
export { SectionPreviewLoader } from "./SectionPreviewLoader";
export { ShellPreviewRoute } from "./ShellPreviewRoute";
```

### 3.6 Update Router Configuration

Update `src/lib/router.tsx` to include preview routes:

```tsx
import { createBrowserRouter } from "react-router-dom";
import { AppLayout } from "@/components/layout/AppLayout";
import PlanPage from "@/pages/PlanPage";
import DataPage from "@/pages/DataPage";
import DesignsPage from "@/pages/DesignsPage";
import ExportPage from "@/pages/ExportPage";
import {
  SectionPreviewLoader,
  ShellPreviewRoute,
} from "@/components/preview";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <AppLayout />,
    children: [
      {
        index: true,
        element: <PlanPage />,
      },
      {
        path: "data",
        element: <DataPage />,
      },
      {
        path: "designs",
        element: <DesignsPage />,
      },
      {
        path: "export",
        element: <ExportPage />,
      },
    ],
  },
  // Preview routes (no AppLayout wrapper)
  {
    path: "/preview/shell",
    element: <ShellPreviewRoute />,
  },
  {
    path: "/preview/sections/:sectionId/:screenName",
    element: <SectionPreviewLoader />,
  },
]);
```

### 3.7 Route Structure Summary

```
/                     → Plan tab (with AppLayout)
/data                 → Data tab (with AppLayout)
/designs              → Designs tab (with AppLayout)
/export               → Export tab (with AppLayout)

/preview/shell        → Shell preview (no AppLayout - for iframe)
/preview/sections/:id/:screen → Section preview (no AppLayout - for iframe)
```

### 3.8 Preview Route Features

| Feature | Description |
|---------|-------------|
| **Isolation** | Preview routes render without AppLayout for clean iframe embedding |
| **Theme Sync** | PreviewLayout syncs dark/light theme with parent window |
| **Lazy Loading** | Components are lazy loaded for better performance |
| **Dynamic Loading** | Section previews are discovered via import.meta.glob |
| **Error Handling** | Graceful fallback when preview doesn't exist |

---

## Step 4: Create Iframe Preview Component

The Iframe Preview component embeds preview routes in an isolated iframe with resize and refresh capabilities.

### 4.1 Create Directory Structure

```bash
mkdir -p src/components/designs
```

### 4.2 Create IframePreview Component

Create `src/components/designs/IframePreview.tsx`:

```tsx
import { useRef, useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { RefreshCw, Maximize2, Minimize2 } from "lucide-react";

export interface IframePreviewProps {
  src: string;
  title: string;
  width?: string | number;
  height?: string | number;
  className?: string;
  showControls?: boolean;
}

/**
 * IframePreview - Embeds preview routes in an isolated iframe
 * 
 * Features:
 * - Theme synchronization with parent
 * - Refresh functionality
 * - Fullscreen toggle
 * - Loading state
 */
export function IframePreview({
  src,
  title,
  width = "100%",
  height = "100%",
  className,
  showControls = true,
}: IframePreviewProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [key, setKey] = useState(0);

  // Sync theme with iframe
  useEffect(() => {
    const syncTheme = () => {
      const isDark = document.documentElement.classList.contains("dark");
      try {
        iframeRef.current?.contentWindow?.postMessage(
          { type: "theme-change", theme: isDark ? "dark" : "light" },
          "*"
        );
      } catch {
        // Cross-origin access not allowed
      }
    };

    // Watch for theme changes
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (
          mutation.type === "attributes" &&
          mutation.attributeName === "class"
        ) {
          syncTheme();
        }
      });
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    // Initial sync after iframe loads
    const iframe = iframeRef.current;
    if (iframe) {
      iframe.addEventListener("load", syncTheme);
    }

    return () => {
      observer.disconnect();
      iframe?.removeEventListener("load", syncTheme);
    };
  }, [key]);

  const handleRefresh = () => {
    setIsLoading(true);
    setKey((prev) => prev + 1);
  };

  const handleFullscreen = () => {
    if (!document.fullscreenElement) {
      iframeRef.current?.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  // Listen for fullscreen changes
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () =>
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
  }, []);

  return (
    <div className={cn("relative flex flex-col", className)}>
      {/* Controls */}
      {showControls && (
        <div className="flex items-center justify-between px-3 py-2 border-b border-border bg-muted/30">
          <span className="text-sm font-medium text-muted-foreground truncate">
            {title}
          </span>
          <div className="flex items-center gap-1">
            <button
              onClick={handleRefresh}
              className="p-1.5 rounded-md hover:bg-muted transition-colors"
              title="Refresh preview"
            >
              <RefreshCw
                className={cn("w-4 h-4", isLoading && "animate-spin")}
              />
            </button>
            <button
              onClick={handleFullscreen}
              className="p-1.5 rounded-md hover:bg-muted transition-colors"
              title={isFullscreen ? "Exit fullscreen" : "Fullscreen"}
            >
              {isFullscreen ? (
                <Minimize2 className="w-4 h-4" />
              ) : (
                <Maximize2 className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>
      )}

      {/* Iframe Container */}
      <div className="relative flex-1 bg-background">
        {/* Loading Overlay */}
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-background/80 z-10">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
          </div>
        )}

        {/* Iframe */}
        <iframe
          key={key}
          ref={iframeRef}
          src={src}
          title={title}
          className="border-0 bg-background"
          style={{ width, height }}
          onLoad={() => setIsLoading(false)}
        />
      </div>
    </div>
  );
}
```

### 4.3 Create Responsive Iframe Wrapper

Create `src/components/designs/ResponsivePreview.tsx`:

```tsx
import { cn } from "@/lib/utils";
import { IframePreview } from "./IframePreview";

export type DeviceSize = "mobile" | "tablet" | "desktop" | "full";

export interface DeviceDimensions {
  width: number;
  height: number;
  label: string;
}

export const DEVICE_SIZES: Record<DeviceSize, DeviceDimensions> = {
  mobile: { width: 375, height: 667, label: "Mobile" },
  tablet: { width: 768, height: 1024, label: "Tablet" },
  desktop: { width: 1280, height: 800, label: "Desktop" },
  full: { width: 0, height: 0, label: "Full" }, // 0 means 100%
};

export interface ResponsivePreviewProps {
  src: string;
  title: string;
  deviceSize?: DeviceSize;
  className?: string;
}

/**
 * ResponsivePreview - Iframe preview with device size constraints
 */
export function ResponsivePreview({
  src,
  title,
  deviceSize = "full",
  className,
}: ResponsivePreviewProps) {
  const dimensions = DEVICE_SIZES[deviceSize];
  const isFullWidth = deviceSize === "full";

  return (
    <div
      className={cn(
        "flex items-start justify-center bg-muted/20 overflow-auto",
        className
      )}
    >
      <div
        className={cn(
          "bg-background shadow-lg rounded-lg overflow-hidden border border-border",
          isFullWidth && "w-full h-full rounded-none border-0 shadow-none"
        )}
        style={
          isFullWidth
            ? undefined
            : {
                width: dimensions.width,
                height: dimensions.height,
              }
        }
      >
        <IframePreview
          src={src}
          title={title}
          width={isFullWidth ? "100%" : dimensions.width}
          height={isFullWidth ? "100%" : dimensions.height}
        />
      </div>
    </div>
  );
}
```

### 4.4 Component Features

| Feature | Description |
|---------|-------------|
| **Theme Sync** | Automatically syncs dark/light mode with parent via postMessage |
| **Refresh** | Manual refresh button to reload preview content |
| **Fullscreen** | Toggle fullscreen mode for detailed inspection |
| **Loading State** | Shows spinner while iframe content loads |
| **Responsive** | ResponsivePreview wraps with device size constraints |
| **Isolation** | Complete CSS/JS isolation via iframe boundary |

---

## Step 5: Create Device Size Toggle

The Device Size Toggle allows switching between mobile, tablet, desktop, and full-width preview modes.

### 5.1 Create DeviceSizeToggle Component

Create `src/components/designs/DeviceSizeToggle.tsx`:

```tsx
import { cn } from "@/lib/utils";
import { Smartphone, Tablet, Monitor, Maximize } from "lucide-react";
import type { DeviceSize } from "./ResponsivePreview";

export interface DeviceSizeToggleProps {
  value: DeviceSize;
  onChange: (size: DeviceSize) => void;
  className?: string;
}

const DEVICE_OPTIONS: {
  value: DeviceSize;
  icon: React.ReactNode;
  label: string;
  dimensions: string;
}[] = [
  {
    value: "mobile",
    icon: <Smartphone className="w-4 h-4" />,
    label: "Mobile",
    dimensions: "375 × 667",
  },
  {
    value: "tablet",
    icon: <Tablet className="w-4 h-4" />,
    label: "Tablet",
    dimensions: "768 × 1024",
  },
  {
    value: "desktop",
    icon: <Monitor className="w-4 h-4" />,
    label: "Desktop",
    dimensions: "1280 × 800",
  },
  {
    value: "full",
    icon: <Maximize className="w-4 h-4" />,
    label: "Full",
    dimensions: "100%",
  },
];

/**
 * DeviceSizeToggle - Toggle between device preview sizes
 */
export function DeviceSizeToggle({
  value,
  onChange,
  className,
}: DeviceSizeToggleProps) {
  return (
    <div
      className={cn(
        "inline-flex items-center gap-1 p-1 rounded-lg bg-muted",
        className
      )}
    >
      {DEVICE_OPTIONS.map((option) => (
        <button
          key={option.value}
          onClick={() => onChange(option.value)}
          className={cn(
            "flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-colors",
            value === option.value
              ? "bg-background text-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          )}
          title={`${option.label} (${option.dimensions})`}
        >
          {option.icon}
          <span className="hidden sm:inline">{option.label}</span>
        </button>
      ))}
    </div>
  );
}
```

### 5.2 Create Custom Size Input

Create `src/components/designs/CustomSizeInput.tsx`:

```tsx
import { useState } from "react";
import { cn } from "@/lib/utils";

export interface CustomSize {
  width: number;
  height: number;
}

export interface CustomSizeInputProps {
  value: CustomSize;
  onChange: (size: CustomSize) => void;
  className?: string;
}

/**
 * CustomSizeInput - Input fields for custom preview dimensions
 */
export function CustomSizeInput({
  value,
  onChange,
  className,
}: CustomSizeInputProps) {
  const [localWidth, setLocalWidth] = useState(value.width.toString());
  const [localHeight, setLocalHeight] = useState(value.height.toString());

  const handleWidthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setLocalWidth(newValue);
    const parsed = parseInt(newValue, 10);
    if (!isNaN(parsed) && parsed > 0) {
      onChange({ ...value, width: parsed });
    }
  };

  const handleHeightChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setLocalHeight(newValue);
    const parsed = parseInt(newValue, 10);
    if (!isNaN(parsed) && parsed > 0) {
      onChange({ ...value, height: parsed });
    }
  };

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <label className="text-sm text-muted-foreground">Custom:</label>
      <input
        type="number"
        value={localWidth}
        onChange={handleWidthChange}
        className="w-20 px-2 py-1 text-sm border border-border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary"
        placeholder="Width"
        min={100}
        max={2560}
      />
      <span className="text-muted-foreground">×</span>
      <input
        type="number"
        value={localHeight}
        onChange={handleHeightChange}
        className="w-20 px-2 py-1 text-sm border border-border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary"
        placeholder="Height"
        min={100}
        max={1600}
      />
    </div>
  );
}
```

### 5.3 Create Combined Preview Controls

Create `src/components/designs/PreviewControls.tsx`:

```tsx
import { cn } from "@/lib/utils";
import { DeviceSizeToggle } from "./DeviceSizeToggle";
import { CustomSizeInput, CustomSize } from "./CustomSizeInput";
import type { DeviceSize } from "./ResponsivePreview";

export interface PreviewControlsProps {
  deviceSize: DeviceSize;
  onDeviceSizeChange: (size: DeviceSize) => void;
  customSize?: CustomSize;
  onCustomSizeChange?: (size: CustomSize) => void;
  showCustomInput?: boolean;
  className?: string;
}

/**
 * PreviewControls - Combined device size toggle and custom input
 */
export function PreviewControls({
  deviceSize,
  onDeviceSizeChange,
  customSize = { width: 800, height: 600 },
  onCustomSizeChange,
  showCustomInput = false,
  className,
}: PreviewControlsProps) {
  return (
    <div
      className={cn(
        "flex flex-wrap items-center justify-between gap-4",
        className
      )}
    >
      <DeviceSizeToggle value={deviceSize} onChange={onDeviceSizeChange} />

      {showCustomInput && onCustomSizeChange && (
        <CustomSizeInput value={customSize} onChange={onCustomSizeChange} />
      )}
    </div>
  );
}
```

### 5.4 Device Size Presets

| Preset | Width | Height | Use Case |
|--------|-------|--------|----------|
| **Mobile** | 375px | 667px | iPhone SE / standard mobile |
| **Tablet** | 768px | 1024px | iPad portrait |
| **Desktop** | 1280px | 800px | Standard laptop display |
| **Full** | 100% | 100% | Fill available space |

---

## Step 6: Create Section Navigator

The Section Navigator displays all available sections and their screens for easy navigation.

### 6.1 Create Section Types

Update `src/types/section.ts` to include navigation types:

```typescript
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

export type SectionStatus = "complete" | "in-progress" | "pending";
```

### 6.2 Create Section Loader for Navigator

Create `src/lib/section-navigator-loader.ts`:

```typescript
import type { SectionInfo, ScreenInfo } from "@/types/section";

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

// Import all section preview files
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
 * Get all available sections with their screens
 */
export function loadSections(): SectionInfo[] {
  const sectionsMap = new Map<string, SectionInfo>();

  // Process specs to get section IDs and names
  Object.keys(sectionSpecs).forEach((path) => {
    const sectionId = extractSectionId(path);
    if (!sectionId) return;

    const spec = sectionSpecs[path];
    const nameMatch = spec.match(/^#\s+(.+)$/m);
    const name = nameMatch ? nameMatch[1] : sectionId;

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
        name: sectionId,
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
        name: sectionId,
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
export function getSectionStatus(section: SectionInfo): SectionStatus {
  if (section.hasComponents && section.hasSpec && section.hasData) {
    return "complete";
  }
  if (section.hasSpec || section.hasComponents) {
    return "in-progress";
  }
  return "pending";
}
```

### 6.3 Create SectionNav Component

Create `src/components/designs/SectionNav.tsx`:

```tsx
import { useMemo } from "react";
import { cn } from "@/lib/utils";
import {
  loadSections,
  getSectionStatus,
} from "@/lib/section-navigator-loader";
import type { SectionInfo, ScreenInfo, SectionStatus } from "@/types/section";
import {
  ChevronRight,
  FolderOpen,
  FileCode,
  CheckCircle2,
  Clock,
  Circle,
} from "lucide-react";

export interface SectionNavProps {
  selectedSection?: string;
  selectedScreen?: string;
  onSelectScreen: (sectionId: string, screenName: string) => void;
  className?: string;
}

const STATUS_ICONS: Record<SectionStatus, React.ReactNode> = {
  complete: <CheckCircle2 className="w-4 h-4 text-green-500" />,
  "in-progress": <Clock className="w-4 h-4 text-yellow-500" />,
  pending: <Circle className="w-4 h-4 text-muted-foreground" />,
};

/**
 * SectionNav - Navigation sidebar for sections and screens
 */
export function SectionNav({
  selectedSection,
  selectedScreen,
  onSelectScreen,
  className,
}: SectionNavProps) {
  const sections = useMemo(() => loadSections(), []);

  if (sections.length === 0) {
    return (
      <div className={cn("p-4 text-center", className)}>
        <p className="text-sm text-muted-foreground">
          No sections found. Create sections in{" "}
          <code className="text-xs bg-muted px-1 py-0.5 rounded">
            src/sections/
          </code>
        </p>
      </div>
    );
  }

  return (
    <nav className={cn("p-2 space-y-1", className)}>
      {sections.map((section) => (
        <SectionItem
          key={section.id}
          section={section}
          isSelected={selectedSection === section.id}
          selectedScreen={selectedSection === section.id ? selectedScreen : undefined}
          onSelectScreen={onSelectScreen}
        />
      ))}
    </nav>
  );
}

interface SectionItemProps {
  section: SectionInfo;
  isSelected: boolean;
  selectedScreen?: string;
  onSelectScreen: (sectionId: string, screenName: string) => void;
}

function SectionItem({
  section,
  isSelected,
  selectedScreen,
  onSelectScreen,
}: SectionItemProps) {
  const status = getSectionStatus(section);
  const hasScreens = section.screens.length > 0;

  return (
    <div className="space-y-0.5">
      {/* Section Header */}
      <div
        className={cn(
          "flex items-center gap-2 px-3 py-2 rounded-lg text-sm",
          isSelected
            ? "bg-primary/10 text-primary"
            : "text-foreground hover:bg-muted"
        )}
      >
        <FolderOpen className="w-4 h-4 shrink-0" />
        <span className="flex-1 font-medium truncate">{section.name}</span>
        {STATUS_ICONS[status]}
        {hasScreens && (
          <ChevronRight
            className={cn(
              "w-4 h-4 transition-transform",
              isSelected && "rotate-90"
            )}
          />
        )}
      </div>

      {/* Screen List */}
      {isSelected && hasScreens && (
        <div className="ml-4 pl-3 border-l border-border space-y-0.5">
          {section.screens.map((screen) => (
            <ScreenItem
              key={screen.name}
              screen={screen}
              sectionId={section.id}
              isSelected={selectedScreen === screen.name}
              onSelect={onSelectScreen}
            />
          ))}
        </div>
      )}
    </div>
  );
}

interface ScreenItemProps {
  screen: ScreenInfo;
  sectionId: string;
  isSelected: boolean;
  onSelect: (sectionId: string, screenName: string) => void;
}

function ScreenItem({
  screen,
  sectionId,
  isSelected,
  onSelect,
}: ScreenItemProps) {
  return (
    <button
      onClick={() => onSelect(sectionId, screen.name)}
      className={cn(
        "w-full flex items-center gap-2 px-3 py-1.5 rounded-md text-sm transition-colors",
        isSelected
          ? "bg-primary text-primary-foreground"
          : "text-muted-foreground hover:bg-muted hover:text-foreground"
      )}
    >
      <FileCode className="w-4 h-4 shrink-0" />
      <span className="truncate">{screen.name}</span>
    </button>
  );
}
```

### 6.4 Create ScreenList Component

Create `src/components/designs/ScreenList.tsx`:

```tsx
import { cn } from "@/lib/utils";
import type { ScreenInfo } from "@/types/section";
import { FileCode, Eye } from "lucide-react";

export interface ScreenListProps {
  screens: ScreenInfo[];
  sectionId: string;
  selectedScreen?: string;
  onSelectScreen: (sectionId: string, screenName: string) => void;
  className?: string;
}

/**
 * ScreenList - Displays screens within a section
 */
export function ScreenList({
  screens,
  sectionId,
  selectedScreen,
  onSelectScreen,
  className,
}: ScreenListProps) {
  if (screens.length === 0) {
    return (
      <div className={cn("p-4 text-center", className)}>
        <p className="text-sm text-muted-foreground">
          No screens found in this section.
        </p>
      </div>
    );
  }

  return (
    <div className={cn("grid gap-2", className)}>
      {screens.map((screen) => (
        <button
          key={screen.name}
          onClick={() => onSelectScreen(sectionId, screen.name)}
          className={cn(
            "flex items-center gap-3 p-3 rounded-lg border border-border text-left transition-colors",
            selectedScreen === screen.name
              ? "bg-primary/10 border-primary"
              : "hover:bg-muted"
          )}
        >
          <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
            <FileCode className="w-5 h-5 text-muted-foreground" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-medium truncate">{screen.name}</p>
            <p className="text-xs text-muted-foreground truncate">
              {screen.path}
            </p>
          </div>
          <Eye className="w-5 h-5 text-muted-foreground" />
        </button>
      ))}
    </div>
  );
}
```

### 6.5 Section Navigator Features

| Feature | Description |
|---------|-------------|
| **Auto Discovery** | Automatically discovers sections from file system |
| **Status Indicators** | Shows completion status (complete, in-progress, pending) |
| **Hierarchical View** | Sections expand to show screens |
| **Active State** | Highlights currently selected section/screen |
| **Screen Paths** | Shows file paths for easy reference |

---

## Step 7: Create Component Tree

The Component Tree shows the component hierarchy and their props for the selected screen.

### 7.1 Create Component Info Types

Add to `src/types/section.ts`:

```typescript
export interface ComponentInfo {
  name: string;
  filePath: string;
  props: PropInfo[];
  children?: ComponentInfo[];
}

export interface PropInfo {
  name: string;
  type: string;
  required: boolean;
  description?: string;
}
```

### 7.2 Create ComponentTree Component

Create `src/components/designs/ComponentTree.tsx`:

```tsx
import { useState } from "react";
import { cn } from "@/lib/utils";
import { ChevronRight, Box, Code } from "lucide-react";
import type { ComponentInfo, PropInfo } from "@/types/section";

export interface ComponentTreeProps {
  components: ComponentInfo[];
  className?: string;
}

/**
 * ComponentTree - Displays component hierarchy with props
 */
export function ComponentTree({ components, className }: ComponentTreeProps) {
  if (components.length === 0) {
    return (
      <div className={cn("p-4 text-center", className)}>
        <p className="text-sm text-muted-foreground">
          No component information available.
        </p>
      </div>
    );
  }

  return (
    <div className={cn("space-y-1", className)}>
      {components.map((component, index) => (
        <ComponentNode key={`${component.name}-${index}`} component={component} level={0} />
      ))}
    </div>
  );
}

interface ComponentNodeProps {
  component: ComponentInfo;
  level: number;
}

function ComponentNode({ component, level }: ComponentNodeProps) {
  const [isExpanded, setIsExpanded] = useState(level === 0);
  const hasChildren = component.children && component.children.length > 0;
  const hasProps = component.props.length > 0;

  return (
    <div className="space-y-0.5">
      {/* Component Header */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className={cn(
          "w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm hover:bg-muted transition-colors text-left",
          level === 0 && "bg-muted/50"
        )}
        style={{ paddingLeft: `${level * 16 + 12}px` }}
      >
        {(hasChildren || hasProps) && (
          <ChevronRight
            className={cn(
              "w-4 h-4 shrink-0 transition-transform",
              isExpanded && "rotate-90"
            )}
          />
        )}
        <Box className="w-4 h-4 shrink-0 text-primary" />
        <span className="font-mono font-medium">{component.name}</span>
      </button>

      {/* Expanded Content */}
      {isExpanded && (
        <div className="space-y-0.5">
          {/* Props */}
          {hasProps && (
            <div
              className="py-2 space-y-1"
              style={{ paddingLeft: `${(level + 1) * 16 + 12}px` }}
            >
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                Props
              </p>
              {component.props.map((prop) => (
                <PropItem key={prop.name} prop={prop} />
              ))}
            </div>
          )}

          {/* Children */}
          {hasChildren &&
            component.children!.map((child, index) => (
              <ComponentNode
                key={`${child.name}-${index}`}
                component={child}
                level={level + 1}
              />
            ))}
        </div>
      )}
    </div>
  );
}

interface PropItemProps {
  prop: PropInfo;
}

function PropItem({ prop }: PropItemProps) {
  return (
    <div className="flex items-start gap-2 text-sm">
      <Code className="w-3.5 h-3.5 mt-0.5 text-muted-foreground" />
      <div className="flex-1 min-w-0">
        <span className="font-mono text-primary">{prop.name}</span>
        {prop.required && <span className="text-destructive">*</span>}
        <span className="text-muted-foreground">: </span>
        <span className="font-mono text-muted-foreground">{prop.type}</span>
        {prop.description && (
          <p className="text-xs text-muted-foreground mt-0.5">
            {prop.description}
          </p>
        )}
      </div>
    </div>
  );
}
```

### 7.3 Create Sample Data Inspector

Create `src/components/designs/DataInspector.tsx`:

```tsx
import { useState } from "react";
import { cn } from "@/lib/utils";
import { ChevronRight, Database, Copy, Check } from "lucide-react";

export interface DataInspectorProps {
  data: unknown;
  title?: string;
  className?: string;
}

/**
 * DataInspector - Displays sample data in a collapsible JSON viewer
 */
export function DataInspector({
  data,
  title = "Sample Data",
  className,
}: DataInspectorProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [copied, setCopied] = useState(false);

  const jsonString = JSON.stringify(data, null, 2);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(jsonString);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={cn("rounded-lg border border-border", className)}>
      {/* Header */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center gap-2 px-4 py-3 hover:bg-muted/50 transition-colors"
      >
        <ChevronRight
          className={cn(
            "w-4 h-4 transition-transform",
            isExpanded && "rotate-90"
          )}
        />
        <Database className="w-4 h-4 text-primary" />
        <span className="font-medium flex-1 text-left">{title}</span>
        <span className="text-xs text-muted-foreground">
          {typeof data === "object" && data !== null
            ? `${Object.keys(data).length} keys`
            : typeof data}
        </span>
      </button>

      {/* Content */}
      {isExpanded && (
        <div className="border-t border-border">
          <div className="flex items-center justify-end px-4 py-2 bg-muted/30">
            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 px-2 py-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  Copied
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  Copy JSON
                </>
              )}
            </button>
          </div>
          <pre className="p-4 text-sm font-mono overflow-auto max-h-80 bg-muted/20">
            {jsonString}
          </pre>
        </div>
      )}
    </div>
  );
}
```

### 7.4 Create Inspector Panel

Create `src/components/designs/InspectorPanel.tsx`:

```tsx
import { cn } from "@/lib/utils";
import { ComponentTree } from "./ComponentTree";
import { DataInspector } from "./DataInspector";
import type { ComponentInfo } from "@/types/section";

export interface InspectorPanelProps {
  components?: ComponentInfo[];
  sampleData?: unknown;
  screenName?: string;
  className?: string;
}

/**
 * InspectorPanel - Right sidebar showing component tree and sample data
 */
export function InspectorPanel({
  components = [],
  sampleData,
  screenName,
  className,
}: InspectorPanelProps) {
  return (
    <div className={cn("flex flex-col h-full", className)}>
      {/* Header */}
      <div className="px-4 py-3 border-b border-border">
        <h3 className="font-semibold">Inspector</h3>
        {screenName && (
          <p className="text-sm text-muted-foreground">{screenName}</p>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto p-4 space-y-4">
        {/* Component Tree */}
        <div>
          <h4 className="text-sm font-medium mb-2">Components</h4>
          <ComponentTree components={components} />
        </div>

        {/* Sample Data */}
        {sampleData && (
          <div>
            <h4 className="text-sm font-medium mb-2">Data</h4>
            <DataInspector data={sampleData} />
          </div>
        )}
      </div>
    </div>
  );
}
```

### 7.5 Component Tree Features

| Feature | Description |
|---------|-------------|
| **Hierarchical View** | Shows component nesting structure |
| **Props Display** | Lists all props with types and required indicators |
| **Collapsible** | Expand/collapse nodes for better navigation |
| **Data Inspector** | View and copy sample data as JSON |
| **Type Information** | Shows TypeScript types for each prop |

---

## Step 8: Create Design Tokens Viewer

The Design Tokens Viewer displays the design system colors and typography from JSON files.

### 8.1 Create Design Token Types

Add to `src/types/section.ts` or create `src/types/design-system.ts`:

```typescript
export interface ColorToken {
  name: string;
  value: string;
  description?: string;
}

export interface ColorGroup {
  name: string;
  colors: ColorToken[];
}

export interface TypographyToken {
  name: string;
  fontFamily?: string;
  fontSize?: string;
  fontWeight?: string | number;
  lineHeight?: string | number;
  letterSpacing?: string;
}

export interface DesignSystem {
  colors: ColorGroup[];
  typography: TypographyToken[];
}
```

### 8.2 Create Sample Design Token Files

Create `product/design-system/colors.json`:

```json
{
  "colors": [
    {
      "name": "Primary",
      "colors": [
        { "name": "primary-50", "value": "#eff6ff", "description": "Lightest" },
        { "name": "primary-100", "value": "#dbeafe" },
        { "name": "primary-200", "value": "#bfdbfe" },
        { "name": "primary-300", "value": "#93c5fd" },
        { "name": "primary-400", "value": "#60a5fa" },
        { "name": "primary-500", "value": "#3b82f6", "description": "Default" },
        { "name": "primary-600", "value": "#2563eb" },
        { "name": "primary-700", "value": "#1d4ed8" },
        { "name": "primary-800", "value": "#1e40af" },
        { "name": "primary-900", "value": "#1e3a8a", "description": "Darkest" }
      ]
    },
    {
      "name": "Neutral",
      "colors": [
        { "name": "gray-50", "value": "#f9fafb" },
        { "name": "gray-100", "value": "#f3f4f6" },
        { "name": "gray-200", "value": "#e5e7eb" },
        { "name": "gray-300", "value": "#d1d5db" },
        { "name": "gray-400", "value": "#9ca3af" },
        { "name": "gray-500", "value": "#6b7280" },
        { "name": "gray-600", "value": "#4b5563" },
        { "name": "gray-700", "value": "#374151" },
        { "name": "gray-800", "value": "#1f2937" },
        { "name": "gray-900", "value": "#111827" }
      ]
    },
    {
      "name": "Semantic",
      "colors": [
        { "name": "success", "value": "#22c55e", "description": "Success states" },
        { "name": "warning", "value": "#f59e0b", "description": "Warning states" },
        { "name": "error", "value": "#ef4444", "description": "Error states" },
        { "name": "info", "value": "#3b82f6", "description": "Info states" }
      ]
    }
  ]
}
```

Create `product/design-system/typography.json`:

```json
{
  "typography": [
    {
      "name": "Display Large",
      "fontFamily": "DM Sans",
      "fontSize": "48px",
      "fontWeight": 700,
      "lineHeight": 1.1,
      "letterSpacing": "-0.02em"
    },
    {
      "name": "Display Medium",
      "fontFamily": "DM Sans",
      "fontSize": "36px",
      "fontWeight": 700,
      "lineHeight": 1.2,
      "letterSpacing": "-0.01em"
    },
    {
      "name": "Heading 1",
      "fontFamily": "DM Sans",
      "fontSize": "30px",
      "fontWeight": 600,
      "lineHeight": 1.3
    },
    {
      "name": "Heading 2",
      "fontFamily": "DM Sans",
      "fontSize": "24px",
      "fontWeight": 600,
      "lineHeight": 1.4
    },
    {
      "name": "Heading 3",
      "fontFamily": "DM Sans",
      "fontSize": "20px",
      "fontWeight": 600,
      "lineHeight": 1.4
    },
    {
      "name": "Body Large",
      "fontFamily": "DM Sans",
      "fontSize": "18px",
      "fontWeight": 400,
      "lineHeight": 1.6
    },
    {
      "name": "Body",
      "fontFamily": "DM Sans",
      "fontSize": "16px",
      "fontWeight": 400,
      "lineHeight": 1.6
    },
    {
      "name": "Body Small",
      "fontFamily": "DM Sans",
      "fontSize": "14px",
      "fontWeight": 400,
      "lineHeight": 1.5
    },
    {
      "name": "Caption",
      "fontFamily": "DM Sans",
      "fontSize": "12px",
      "fontWeight": 400,
      "lineHeight": 1.4
    },
    {
      "name": "Code",
      "fontFamily": "IBM Plex Mono",
      "fontSize": "14px",
      "fontWeight": 400,
      "lineHeight": 1.6
    }
  ]
}
```

### 8.3 Create Color Swatch Component

Create `src/components/designs/ColorSwatch.tsx`:

```tsx
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Copy, Check } from "lucide-react";
import type { ColorToken } from "@/types/design-system";

export interface ColorSwatchProps {
  color: ColorToken;
  size?: "sm" | "md" | "lg";
  className?: string;
}

/**
 * ColorSwatch - Single color swatch with copy functionality
 */
export function ColorSwatch({
  color,
  size = "md",
  className,
}: ColorSwatchProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(color.value);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const sizeClasses = {
    sm: "w-8 h-8",
    md: "w-12 h-12",
    lg: "w-16 h-16",
  };

  return (
    <button
      onClick={handleCopy}
      className={cn(
        "group relative rounded-lg border border-border overflow-hidden transition-all hover:scale-105 hover:shadow-md",
        sizeClasses[size],
        className
      )}
      title={`${color.name}: ${color.value}`}
    >
      {/* Color Fill */}
      <div
        className="absolute inset-0"
        style={{ backgroundColor: color.value }}
      />

      {/* Copy Overlay */}
      <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity">
        {copied ? (
          <Check className="w-4 h-4 text-white" />
        ) : (
          <Copy className="w-4 h-4 text-white" />
        )}
      </div>
    </button>
  );
}
```

### 8.4 Create Color Palette Component

Create `src/components/designs/ColorPalette.tsx`:

```tsx
import { cn } from "@/lib/utils";
import { ColorSwatch } from "./ColorSwatch";
import type { ColorGroup } from "@/types/design-system";

export interface ColorPaletteProps {
  groups: ColorGroup[];
  className?: string;
}

/**
 * ColorPalette - Displays all color groups with swatches
 */
export function ColorPalette({ groups, className }: ColorPaletteProps) {
  if (groups.length === 0) {
    return (
      <div className={cn("p-4 text-center", className)}>
        <p className="text-sm text-muted-foreground">No colors defined.</p>
      </div>
    );
  }

  return (
    <div className={cn("space-y-6", className)}>
      {groups.map((group) => (
        <div key={group.name}>
          <h4 className="text-sm font-medium mb-3">{group.name}</h4>
          <div className="flex flex-wrap gap-2">
            {group.colors.map((color) => (
              <div key={color.name} className="flex flex-col items-center gap-1">
                <ColorSwatch color={color} size="lg" />
                <span className="text-xs text-muted-foreground">
                  {color.name}
                </span>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
```

### 8.5 Create Typography Preview Component

Create `src/components/designs/TypographyPreview.tsx`:

```tsx
import { cn } from "@/lib/utils";
import type { TypographyToken } from "@/types/design-system";

export interface TypographyPreviewProps {
  tokens: TypographyToken[];
  className?: string;
}

/**
 * TypographyPreview - Displays typography scale with samples
 */
export function TypographyPreview({
  tokens,
  className,
}: TypographyPreviewProps) {
  if (tokens.length === 0) {
    return (
      <div className={cn("p-4 text-center", className)}>
        <p className="text-sm text-muted-foreground">No typography defined.</p>
      </div>
    );
  }

  return (
    <div className={cn("space-y-6", className)}>
      {tokens.map((token) => (
        <div
          key={token.name}
          className="pb-4 border-b border-border last:border-0"
        >
          {/* Token Info */}
          <div className="flex items-baseline justify-between mb-2">
            <span className="text-sm font-medium text-muted-foreground">
              {token.name}
            </span>
            <span className="text-xs text-muted-foreground font-mono">
              {token.fontSize} / {token.fontWeight}
            </span>
          </div>

          {/* Sample Text */}
          <p
            style={{
              fontFamily: token.fontFamily,
              fontSize: token.fontSize,
              fontWeight: token.fontWeight,
              lineHeight: token.lineHeight,
              letterSpacing: token.letterSpacing,
            }}
          >
            The quick brown fox jumps over the lazy dog
          </p>
        </div>
      ))}
    </div>
  );
}
```

### 8.6 Create Design Tokens Viewer Component

Create `src/components/designs/DesignTokensViewer.tsx`:

```tsx
import { useState, useMemo } from "react";
import { cn } from "@/lib/utils";
import { ColorPalette } from "./ColorPalette";
import { TypographyPreview } from "./TypographyPreview";
import { loadDesignSystem } from "@/lib/design-system-loader";
import { Palette, Type } from "lucide-react";

export interface DesignTokensViewerProps {
  className?: string;
}

type TabType = "colors" | "typography";

/**
 * DesignTokensViewer - Tabbed view of design tokens
 */
export function DesignTokensViewer({ className }: DesignTokensViewerProps) {
  const [activeTab, setActiveTab] = useState<TabType>("colors");
  const designSystem = useMemo(() => loadDesignSystem(), []);

  const tabs: { id: TabType; label: string; icon: React.ReactNode }[] = [
    { id: "colors", label: "Colors", icon: <Palette className="w-4 h-4" /> },
    { id: "typography", label: "Typography", icon: <Type className="w-4 h-4" /> },
  ];

  return (
    <div className={cn("flex flex-col h-full", className)}>
      {/* Tabs */}
      <div className="flex border-b border-border">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              "flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors",
              activeTab === tab.id
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground"
            )}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto p-4">
        {activeTab === "colors" && (
          <ColorPalette groups={designSystem.colors} />
        )}
        {activeTab === "typography" && (
          <TypographyPreview tokens={designSystem.typography} />
        )}
      </div>
    </div>
  );
}
```

### 8.7 Update Design System Loader

Update `src/lib/design-system-loader.ts`:

```typescript
import type { DesignSystem, ColorGroup, TypographyToken } from "@/types/design-system";

// Import design system files
const colorsFile = import.meta.glob("/product/design-system/colors.json", {
  import: "default",
  eager: true,
}) as Record<string, { colors: ColorGroup[] }>;

const typographyFile = import.meta.glob("/product/design-system/typography.json", {
  import: "default",
  eager: true,
}) as Record<string, { typography: TypographyToken[] }>;

/**
 * Load design system from JSON files
 */
export function loadDesignSystem(): DesignSystem {
  const colorsData = Object.values(colorsFile)[0];
  const typographyData = Object.values(typographyFile)[0];

  return {
    colors: colorsData?.colors || getDefaultColors(),
    typography: typographyData?.typography || getDefaultTypography(),
  };
}

/**
 * Default colors if no file exists
 */
function getDefaultColors(): ColorGroup[] {
  return [
    {
      name: "Default",
      colors: [
        { name: "primary", value: "#3b82f6", description: "Primary color" },
        { name: "secondary", value: "#64748b", description: "Secondary color" },
      ],
    },
  ];
}

/**
 * Default typography if no file exists
 */
function getDefaultTypography(): TypographyToken[] {
  return [
    {
      name: "Body",
      fontFamily: "system-ui, sans-serif",
      fontSize: "16px",
      fontWeight: 400,
      lineHeight: 1.5,
    },
  ];
}
```

### 8.8 Design Tokens Viewer Features

| Feature | Description |
|---------|-------------|
| **Color Swatches** | Visual display of all colors with click-to-copy |
| **Color Groups** | Organized by category (Primary, Neutral, Semantic) |
| **Typography Scale** | Preview of all text styles with sample text |
| **Live Preview** | Styles applied in real-time |
| **Fallback Defaults** | Graceful defaults when files don't exist |

---

## Step 9: Assemble Designs Page

Now we combine all components into the complete Designs Page with a three-column layout.

### 9.1 Create Designs Components Index

Create `src/components/designs/index.ts`:

```typescript
export { IframePreview } from "./IframePreview";
export { ResponsivePreview } from "./ResponsivePreview";
export { DeviceSizeToggle } from "./DeviceSizeToggle";
export { CustomSizeInput } from "./CustomSizeInput";
export { PreviewControls } from "./PreviewControls";
export { SectionNav } from "./SectionNav";
export { ScreenList } from "./ScreenList";
export { ComponentTree } from "./ComponentTree";
export { DataInspector } from "./DataInspector";
export { InspectorPanel } from "./InspectorPanel";
export { ColorSwatch } from "./ColorSwatch";
export { ColorPalette } from "./ColorPalette";
export { TypographyPreview } from "./TypographyPreview";
export { DesignTokensViewer } from "./DesignTokensViewer";

export type { DeviceSize, DeviceDimensions } from "./ResponsivePreview";
export type { CustomSize } from "./CustomSizeInput";
```

### 9.2 Create Designs Page Component

Update `src/pages/DesignsPage.tsx`:

```tsx
import { useState, useMemo } from "react";
import { cn } from "@/lib/utils";
import {
  SectionNav,
  ResponsivePreview,
  PreviewControls,
  InspectorPanel,
  DesignTokensViewer,
  DeviceSize,
} from "@/components/designs";
import { EmptyState } from "@/components/shared/EmptyState";
import { loadSections } from "@/lib/section-navigator-loader";
import { LayoutTemplate, Layers, Palette, FolderOpen } from "lucide-react";

type DesignTab = "shell" | "sections" | "tokens";

export default function DesignsPage() {
  // State
  const [activeTab, setActiveTab] = useState<DesignTab>("sections");
  const [selectedSection, setSelectedSection] = useState<string | undefined>();
  const [selectedScreen, setSelectedScreen] = useState<string | undefined>();
  const [deviceSize, setDeviceSize] = useState<DeviceSize>("desktop");

  // Load sections
  const sections = useMemo(() => loadSections(), []);

  // Get preview URL
  const previewUrl = useMemo(() => {
    if (activeTab === "shell") {
      return "/preview/shell";
    }
    if (activeTab === "sections" && selectedSection && selectedScreen) {
      return `/preview/sections/${selectedSection}/${selectedScreen}`;
    }
    return null;
  }, [activeTab, selectedSection, selectedScreen]);

  // Get current section data
  const currentSection = useMemo(() => {
    if (!selectedSection) return null;
    return sections.find((s) => s.id === selectedSection);
  }, [sections, selectedSection]);

  // Handle screen selection
  const handleSelectScreen = (sectionId: string, screenName: string) => {
    setSelectedSection(sectionId);
    setSelectedScreen(screenName);
  };

  // Tab definitions
  const tabs: { id: DesignTab; label: string; icon: React.ReactNode }[] = [
    { id: "shell", label: "Shell", icon: <LayoutTemplate className="w-4 h-4" /> },
    { id: "sections", label: "Sections", icon: <Layers className="w-4 h-4" /> },
    { id: "tokens", label: "Tokens", icon: <Palette className="w-4 h-4" /> },
  ];

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-border">
        <div>
          <h1 className="text-2xl font-bold">Designs</h1>
          <p className="text-sm text-muted-foreground">
            Preview components and design tokens
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-1 p-1 rounded-lg bg-muted">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors",
                activeTab === tab.id
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Tokens Tab - Full Width */}
        {activeTab === "tokens" && (
          <div className="flex-1 overflow-auto">
            <DesignTokensViewer />
          </div>
        )}

        {/* Shell Tab */}
        {activeTab === "shell" && (
          <>
            {/* Preview Area */}
            <div className="flex-1 flex flex-col">
              {/* Preview Controls */}
              <div className="px-4 py-3 border-b border-border bg-muted/30">
                <PreviewControls
                  deviceSize={deviceSize}
                  onDeviceSizeChange={setDeviceSize}
                />
              </div>

              {/* Preview */}
              <div className="flex-1 p-4 overflow-auto bg-muted/10">
                <ResponsivePreview
                  src="/preview/shell"
                  title="Shell Preview"
                  deviceSize={deviceSize}
                  className="h-full"
                />
              </div>
            </div>

            {/* Inspector */}
            <aside className="w-80 border-l border-border bg-card">
              <InspectorPanel screenName="Shell" />
            </aside>
          </>
        )}

        {/* Sections Tab */}
        {activeTab === "sections" && (
          <>
            {/* Section Navigation */}
            <aside className="w-64 border-r border-border bg-card overflow-auto">
              <div className="px-4 py-3 border-b border-border">
                <h3 className="font-semibold flex items-center gap-2">
                  <FolderOpen className="w-4 h-4" />
                  Sections
                </h3>
              </div>
              <SectionNav
                selectedSection={selectedSection}
                selectedScreen={selectedScreen}
                onSelectScreen={handleSelectScreen}
              />
            </aside>

            {/* Preview Area */}
            <div className="flex-1 flex flex-col">
              {previewUrl ? (
                <>
                  {/* Preview Controls */}
                  <div className="px-4 py-3 border-b border-border bg-muted/30">
                    <PreviewControls
                      deviceSize={deviceSize}
                      onDeviceSizeChange={setDeviceSize}
                    />
                  </div>

                  {/* Preview */}
                  <div className="flex-1 p-4 overflow-auto bg-muted/10">
                    <ResponsivePreview
                      src={previewUrl}
                      title={`${selectedSection}/${selectedScreen}`}
                      deviceSize={deviceSize}
                      className="h-full"
                    />
                  </div>
                </>
              ) : (
                <div className="flex-1 flex items-center justify-center">
                  <EmptyState
                    icon={Layers}
                    title="Select a screen"
                    description="Choose a section and screen from the sidebar to preview"
                  />
                </div>
              )}
            </div>

            {/* Inspector */}
            <aside className="w-80 border-l border-border bg-card overflow-auto">
              <InspectorPanel
                screenName={selectedScreen}
                sampleData={currentSection ? {} : undefined}
              />
            </aside>
          </>
        )}
      </div>
    </div>
  );
}
```

### 9.3 Page Layout Structure

```
┌─────────────────────────────────────────────────────────┐
│  Designs                    [Shell] [Sections] [Tokens] │
├──────────┬──────────────────────────┬───────────────────┤
│ Sections │  [Mobile][Tablet][Desktop][Full]             │
│ ├ patients│ ┌───────────────────────┐ │ Inspector       │
│ │  └ List  │ │                       │ │                 │
│ │  └ Detail│ │                       │ │ Components:     │
│ ├ appts    │ │     Preview           │ │ └ PatientTable  │
│ │  └ List  │ │     (iframe)          │ │   └ patients[]  │
│ │          │ │                       │ │   └ onView()    │
│ │          │ │                       │ │                 │
│ │          │ └───────────────────────┘ │ Sample Data:    │
│ │          │                           │ {...}           │
└──────────┴──────────────────────────┴───────────────────┘
```

### 9.4 Tab Behavior

| Tab | Left Panel | Center Panel | Right Panel |
|-----|------------|--------------|-------------|
| **Shell** | None | Shell preview | Inspector |
| **Sections** | Section nav | Section preview | Inspector |
| **Tokens** | None | Full-width tokens viewer | None |

### 9.5 Page Features

| Feature | Description |
|---------|-------------|
| **Three-Column Layout** | Nav / Preview / Inspector (responsive collapse) |
| **Tab Navigation** | Switch between Shell, Sections, and Tokens views |
| **Dynamic Preview** | Preview URL updates based on selection |
| **Device Size Presets** | Quick toggle between mobile/tablet/desktop |
| **Empty States** | Helpful prompts when nothing is selected |

---

## Step 10: Enforce Props-Only Components

This step ensures exportable components follow the props-only pattern and don't import data directly.

### 10.1 Understanding the Problem

```tsx
// ❌ WRONG - Component imports data directly (not exportable)
import data from "@/../product/sections/patients/data.json";
export function PatientTable() {
  return <table>{data.patients.map(...)}</table>;
}

// ✅ CORRECT - Component receives data via props (exportable)
export function PatientTable({ patients }: PatientTableProps) {
  return <table>{patients.map(...)}</table>;
}
```

### 10.2 Create Validation Utility

Create `src/lib/export-validator.ts`:

```typescript
/**
 * Validates that components follow the props-only pattern
 */

// Import all component files from sections
const sectionComponents = import.meta.glob(
  "/src/sections/*/components/*.tsx",
  {
    query: "?raw",
    import: "default",
    eager: true,
  }
) as Record<string, string>;

// Import all shell components
const shellComponents = import.meta.glob("/src/shell/components/*.tsx", {
  query: "?raw",
  import: "default",
  eager: true,
}) as Record<string, string>;

export interface ValidationError {
  file: string;
  line?: number;
  message: string;
  severity: "error" | "warning";
}

export interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
  warnings: ValidationError[];
}

/**
 * Patterns that indicate direct data imports (not allowed in exportable components)
 */
const DATA_IMPORT_PATTERNS = [
  /import\s+.*\s+from\s+["'].*\/data\.json["']/,
  /import\s+.*\s+from\s+["'].*\/product\/.*["']/,
  /import\s+.*\s+from\s+["']@\/\.\.\/product\/.*["']/,
  /require\s*\(\s*["'].*\/data\.json["']\s*\)/,
];

/**
 * Validate a single component file
 */
function validateComponent(
  filePath: string,
  content: string
): ValidationError[] {
  const errors: ValidationError[] = [];

  // Check for data imports
  DATA_IMPORT_PATTERNS.forEach((pattern) => {
    if (pattern.test(content)) {
      // Find the line number
      const lines = content.split("\n");
      const lineNumber = lines.findIndex((line) => pattern.test(line)) + 1;

      errors.push({
        file: filePath,
        line: lineNumber,
        message: "Component imports data directly. Use props instead.",
        severity: "error",
      });
    }
  });

  // Check for missing Props type
  const hasExport = /export\s+(function|const)\s+\w+/.test(content);
  const hasProps = /Props\s*[}>)]/.test(content) || /:\s*\{[^}]*\}/.test(content);
  
  if (hasExport && !hasProps) {
    errors.push({
      file: filePath,
      message: "Exported component should define Props interface",
      severity: "warning",
    });
  }

  return errors;
}

/**
 * Validate all exportable components
 */
export function validateExportableComponents(): ValidationResult {
  const allErrors: ValidationError[] = [];

  // Validate section components
  Object.entries(sectionComponents).forEach(([path, content]) => {
    const errors = validateComponent(path, content);
    allErrors.push(...errors);
  });

  // Validate shell components
  Object.entries(shellComponents).forEach(([path, content]) => {
    const errors = validateComponent(path, content);
    allErrors.push(...errors);
  });

  const errors = allErrors.filter((e) => e.severity === "error");
  const warnings = allErrors.filter((e) => e.severity === "warning");

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
  };
}

/**
 * Get a summary of validation results
 */
export function getValidationSummary(): {
  valid: number;
  invalid: number;
  warnings: number;
} {
  const sectionCount = Object.keys(sectionComponents).length;
  const shellCount = Object.keys(shellComponents).length;
  const result = validateExportableComponents();

  return {
    valid: sectionCount + shellCount - result.errors.length,
    invalid: result.errors.length,
    warnings: result.warnings.length,
  };
}
```

### 10.3 Create Validation Display Component

Create `src/components/designs/ValidationStatus.tsx`:

```tsx
import { useMemo } from "react";
import { cn } from "@/lib/utils";
import {
  validateExportableComponents,
  ValidationResult,
} from "@/lib/export-validator";
import {
  CheckCircle2,
  AlertTriangle,
  XCircle,
  FileCode,
} from "lucide-react";

export interface ValidationStatusProps {
  className?: string;
}

/**
 * ValidationStatus - Displays component validation results
 */
export function ValidationStatus({ className }: ValidationStatusProps) {
  const result = useMemo<ValidationResult>(
    () => validateExportableComponents(),
    []
  );

  return (
    <div
      className={cn(
        "rounded-lg border p-4",
        result.isValid
          ? "border-green-200 bg-green-50 dark:border-green-900 dark:bg-green-950"
          : "border-red-200 bg-red-50 dark:border-red-900 dark:bg-red-950",
        className
      )}
    >
      {/* Header */}
      <div className="flex items-center gap-2 mb-2">
        {result.isValid ? (
          <CheckCircle2 className="w-5 h-5 text-green-600" />
        ) : (
          <XCircle className="w-5 h-5 text-red-600" />
        )}
        <span className="font-medium">
          {result.isValid
            ? "All components are exportable"
            : `${result.errors.length} component(s) need fixes`}
        </span>
      </div>

      {/* Errors */}
      {result.errors.length > 0 && (
        <div className="space-y-2 mt-3">
          {result.errors.map((error, index) => (
            <div
              key={index}
              className="flex items-start gap-2 text-sm text-red-600 dark:text-red-400"
            >
              <FileCode className="w-4 h-4 mt-0.5 shrink-0" />
              <div>
                <span className="font-mono text-xs">{error.file}</span>
                {error.line && (
                  <span className="text-xs"> (line {error.line})</span>
                )}
                <p className="text-xs opacity-75">{error.message}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Warnings */}
      {result.warnings.length > 0 && (
        <div className="space-y-2 mt-3 pt-3 border-t border-yellow-200 dark:border-yellow-900">
          {result.warnings.map((warning, index) => (
            <div
              key={index}
              className="flex items-start gap-2 text-sm text-yellow-600 dark:text-yellow-400"
            >
              <AlertTriangle className="w-4 h-4 mt-0.5 shrink-0" />
              <div>
                <span className="font-mono text-xs">{warning.file}</span>
                <p className="text-xs opacity-75">{warning.message}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
```

### 10.4 Add Validation to Inspector Panel

Update `src/components/designs/InspectorPanel.tsx` to include validation:

```tsx
import { cn } from "@/lib/utils";
import { ComponentTree } from "./ComponentTree";
import { DataInspector } from "./DataInspector";
import { ValidationStatus } from "./ValidationStatus";
import type { ComponentInfo } from "@/types/section";

export interface InspectorPanelProps {
  components?: ComponentInfo[];
  sampleData?: unknown;
  screenName?: string;
  showValidation?: boolean;
  className?: string;
}

/**
 * InspectorPanel - Right sidebar showing component tree and sample data
 */
export function InspectorPanel({
  components = [],
  sampleData,
  screenName,
  showValidation = true,
  className,
}: InspectorPanelProps) {
  return (
    <div className={cn("flex flex-col h-full", className)}>
      {/* Header */}
      <div className="px-4 py-3 border-b border-border">
        <h3 className="font-semibold">Inspector</h3>
        {screenName && (
          <p className="text-sm text-muted-foreground">{screenName}</p>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto p-4 space-y-4">
        {/* Validation Status */}
        {showValidation && <ValidationStatus />}

        {/* Component Tree */}
        {components.length > 0 && (
          <div>
            <h4 className="text-sm font-medium mb-2">Components</h4>
            <ComponentTree components={components} />
          </div>
        )}

        {/* Sample Data */}
        {sampleData && (
          <div>
            <h4 className="text-sm font-medium mb-2">Data</h4>
            <DataInspector data={sampleData} />
          </div>
        )}
      </div>
    </div>
  );
}
```

### 10.5 Props-Only Component Rules

| Rule | Description |
|------|-------------|
| **No Data Imports** | Components in `components/` folder cannot import JSON data files |
| **Props Interface** | All exported components should have a Props interface |
| **No Product Path** | Cannot import from `@/../product/` or `../../../product/` |
| **Preview Wrappers** | Only preview files (not in `components/`) can import sample data |

### 10.6 Component Structure Validation

```
src/sections/patients/
├── components/              # ✅ Validated - props-only
│   ├── PatientTable.tsx     #    Cannot import data.json
│   └── PatientCard.tsx      #    Must use props
└── PatientList.tsx          # ⚠️ Not validated - preview wrapper
                             #    Can import data for preview
```

---

## Verification Checklist

Before moving to Phase 6, ensure all of the following are working:

### Component Structure

- [ ] Section components created in `src/sections/patients/components/`
- [ ] Shell components created in `src/shell/components/`
- [ ] Preview wrappers created for sections and shell
- [ ] Component index files export all components

### Preview Routes

- [ ] `/preview/shell` route renders shell preview
- [ ] `/preview/sections/:sectionId/:screenName` route renders section previews
- [ ] Theme syncs correctly between main app and preview iframes
- [ ] Preview routes work without AppLayout wrapper

### Designs Page

- [ ] Tab navigation works (Shell / Sections / Tokens)
- [ ] Section navigator shows all available sections
- [ ] Screen selection updates preview
- [ ] Device size toggle changes preview dimensions
- [ ] Inspector panel shows component information

### Device Size Toggle

- [ ] Mobile preset (375 × 667) works
- [ ] Tablet preset (768 × 1024) works
- [ ] Desktop preset (1280 × 800) works
- [ ] Full width mode works

### Design Tokens Viewer

- [ ] Colors tab displays color palette from `colors.json`
- [ ] Typography tab displays font styles from `typography.json`
- [ ] Color swatches have copy-to-clipboard functionality
- [ ] Fallback defaults work when files are missing

### Validation

- [ ] Props-only validation catches data imports
- [ ] Validation status displays in inspector panel
- [ ] Warnings show for missing Props interfaces

### Manual Testing

```bash
# Start development server
npm run dev

# Test URLs
http://localhost:5173/designs          # Designs page
http://localhost:5173/preview/shell    # Shell preview (direct)
http://localhost:5173/preview/sections/patients/PatientList  # Section preview

# Verify in browser
1. Navigate to Designs tab
2. Click through Shell, Sections, Tokens sub-tabs
3. In Sections, select a section and screen
4. Toggle between device sizes
5. Check inspector panel for validation status
6. In Tokens, view colors and typography
7. Click a color swatch to copy the value
```

---

## File Structure Summary

After completing Phase 5, your project should have:

```
src/
├── components/
│   ├── designs/
│   │   ├── index.ts
│   │   ├── IframePreview.tsx
│   │   ├── ResponsivePreview.tsx
│   │   ├── DeviceSizeToggle.tsx
│   │   ├── CustomSizeInput.tsx
│   │   ├── PreviewControls.tsx
│   │   ├── SectionNav.tsx
│   │   ├── ScreenList.tsx
│   │   ├── ComponentTree.tsx
│   │   ├── DataInspector.tsx
│   │   ├── InspectorPanel.tsx
│   │   ├── ColorSwatch.tsx
│   │   ├── ColorPalette.tsx
│   │   ├── TypographyPreview.tsx
│   │   ├── DesignTokensViewer.tsx
│   │   └── ValidationStatus.tsx
│   ├── preview/
│   │   ├── index.ts
│   │   ├── PreviewLayout.tsx
│   │   ├── SectionPreviewLoader.tsx
│   │   └── ShellPreviewRoute.tsx
│   ├── shared/
│   │   └── (existing components)
│   └── layout/
│       └── (existing components)
│
├── lib/
│   ├── router.tsx               # Updated with preview routes
│   ├── section-navigator-loader.ts
│   ├── design-system-loader.ts  # Updated
│   └── export-validator.ts
│
├── pages/
│   └── DesignsPage.tsx          # Updated
│
├── sections/
│   └── patients/
│       ├── components/
│       │   ├── index.ts
│       │   ├── PatientTable.tsx
│       │   └── PatientCard.tsx
│       └── PatientList.tsx
│
├── shell/
│   ├── components/
│   │   ├── index.ts
│   │   ├── AppShell.tsx
│   │   ├── MainNav.tsx
│   │   └── UserMenu.tsx
│   └── ShellPreview.tsx
│
└── types/
    ├── section.ts               # Updated with new types
    └── design-system.ts         # New file

product/
├── design-system/
│   ├── colors.json
│   └── typography.json
├── shell/
│   └── spec.md
└── sections/
    └── patients/
        ├── spec.md
        ├── data.json
        └── types.ts
```

### New Files Created in Phase 5

| Category | Files | Count |
|----------|-------|-------|
| **Design Components** | IframePreview, ResponsivePreview, DeviceSizeToggle, etc. | 16 |
| **Preview Components** | PreviewLayout, SectionPreviewLoader, ShellPreviewRoute | 3 |
| **Section Components** | PatientTable, PatientCard, PatientList | 3 |
| **Shell Components** | AppShell, MainNav, UserMenu, ShellPreview | 4 |
| **Utilities** | section-navigator-loader, export-validator | 2 |
| **Types** | design-system.ts | 1 |
| **Sample Files** | colors.json, typography.json, spec.md, data.json | 5 |
| **Total** | | **34** |

---

## Next Steps

After completing Phase 5:

1. **Test all preview functionality** thoroughly
2. **Add more sample sections** to verify navigation
3. **Customize design tokens** for your use case
4. **Proceed to Phase 6** - Export Tab & Polish

Phase 6 will:
- Generate complete export ZIP
- Create instruction templates
- Add export validation
- Polish the entire application

---

*End of Phase 5 Implementation Plan*
