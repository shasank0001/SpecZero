# Phase 1: Detailed Implementation Plan

> **Goal:** Working Vite app with routing, layout, and base UI components  
> **Duration:** 2 days  
> **Outcome:** A fully functional foundation with 4-tab navigation, Tailwind CSS styling, theme toggle, and shadcn/ui base components

---

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Step 1: Initialize Vite Project](#step-1-initialize-vite-project)
3. [Step 2: Install Dependencies](#step-2-install-dependencies)
4. [Step 3: Configure TypeScript](#step-3-configure-typescript)
5. [Step 4: Configure Vite](#step-4-configure-vite)
6. [Step 5: Set Up Tailwind CSS v4](#step-5-set-up-tailwind-css-v4)
7. [Step 6: Create Utility Functions](#step-6-create-utility-functions)
8. [Step 7: Create Base UI Components](#step-7-create-base-ui-components)
9. [Step 8: Set Up React Router](#step-8-set-up-react-router)
10. [Step 9: Create Page Components](#step-9-create-page-components)
11. [Step 10: Create Layout Components](#step-10-create-layout-components)
12. [Step 11: Configure Entry Points](#step-11-configure-entry-points)
13. [Step 12: Add Google Fonts](#step-12-add-google-fonts)
14. [Verification Checklist](#verification-checklist)
15. [File Structure Summary](#file-structure-summary)

---

## Prerequisites

Before starting, ensure you have:

- [ ] Node.js v18+ installed
- [ ] npm v9+ installed
- [ ] A code editor (VS Code recommended)
- [ ] Terminal access

---

## Step 1: Initialize Vite Project

### 1.1 Create the Project

```bash
# Navigate to your project directory
cd /path/to/vibe-architect

# Create Vite project with React + TypeScript template
npm create vite@latest . -- --template react-ts

# If the directory is not empty, choose to overwrite or clear it first
```

### 1.2 Initial Project Structure

After initialization, you'll have:

```
vibe-architect/
├── index.html
├── package.json
├── tsconfig.json
├── tsconfig.node.json
├── vite.config.ts
├── public/
│   └── vite.svg
└── src/
    ├── App.tsx
    ├── App.css
    ├── main.tsx
    ├── index.css
    ├── vite-env.d.ts
    └── assets/
        └── react.svg
```

### 1.3 Clean Up Default Files

Remove unnecessary default files:

```bash
rm src/App.css
rm src/assets/react.svg
rm public/vite.svg
```

---

## Step 2: Install Dependencies

### 2.1 Core Dependencies

```bash
npm install react-router-dom clsx tailwind-merge lucide-react @radix-ui/react-slot class-variance-authority
```

| Package | Purpose |
|---------|---------|
| `react-router-dom` | Client-side routing for 4-tab navigation |
| `clsx` | Conditional class name utility |
| `tailwind-merge` | Merge Tailwind classes without conflicts |
| `lucide-react` | Icon library (FileText, Database, Palette, Download icons) |
| `@radix-ui/react-slot` | Slot component for shadcn/ui Button |
| `class-variance-authority` | Variant-based component styling |

### 2.2 Dev Dependencies

```bash
npm install -D tailwindcss@next @tailwindcss/vite @types/node
```

| Package | Purpose |
|---------|---------|
| `tailwindcss@next` | Tailwind CSS v4 (latest) |
| `@tailwindcss/vite` | Vite plugin for Tailwind CSS v4 |
| `@types/node` | Node.js types for path aliases |

---

## Step 3: Configure TypeScript

### 3.1 Update `tsconfig.json`

Replace the contents with:

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,

    /* Bundler mode */
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",

    /* Linting */
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,

    /* Path Aliases */
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["src"],
  "references": [{ "path": "./tsconfig.node.json" }]
}
```

### 3.2 Key Configuration Points

- **Strict mode enabled** - Ensures type safety
- **Path aliases** - `@/` maps to `./src/` for cleaner imports
- **ES2020 target** - Modern JavaScript features
- **resolveJsonModule** - Allows importing JSON files

---

## Step 4: Configure Vite

### 4.1 Update `vite.config.ts`

```typescript
import path from "path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    port: 5173,
    open: true,
  },
  build: {
    outDir: "dist",
    sourcemap: true,
  },
});
```

### 4.2 Configuration Explanation

| Option | Purpose |
|--------|---------|
| `tailwindcss()` plugin | Integrates Tailwind CSS v4 with Vite |
| `resolve.alias` | Enables `@/` path alias |
| `server.port` | Development server runs on port 5173 |
| `server.open` | Auto-opens browser on dev server start |
| `build.sourcemap` | Enables source maps for debugging |

---

## Step 5: Set Up Tailwind CSS v4

### 5.1 Create `src/index.css`

```css
@import "tailwindcss";

/* ================================
   THEME CONFIGURATION
   ================================ */

@theme {
  /* Typography */
  --font-sans: "DM Sans", system-ui, sans-serif;
  --font-mono: "IBM Plex Mono", ui-monospace, monospace;

  /* Border Radius */
  --radius-sm: 0.25rem;
  --radius-md: 0.375rem;
  --radius-lg: 0.5rem;
  --radius-xl: 0.75rem;
}

/* ================================
   CSS CUSTOM PROPERTIES (LIGHT MODE)
   ================================ */

:root {
  /* Background Colors */
  --background: 0 0% 100%;
  --foreground: 222.2 84% 4.9%;

  /* Card Colors */
  --card: 0 0% 100%;
  --card-foreground: 222.2 84% 4.9%;

  /* Popover Colors */
  --popover: 0 0% 100%;
  --popover-foreground: 222.2 84% 4.9%;

  /* Primary Colors */
  --primary: 222.2 47.4% 11.2%;
  --primary-foreground: 210 40% 98%;

  /* Secondary Colors */
  --secondary: 210 40% 96.1%;
  --secondary-foreground: 222.2 47.4% 11.2%;

  /* Muted Colors */
  --muted: 210 40% 96.1%;
  --muted-foreground: 215.4 16.3% 46.9%;

  /* Accent Colors */
  --accent: 210 40% 96.1%;
  --accent-foreground: 222.2 47.4% 11.2%;

  /* Destructive Colors */
  --destructive: 0 84.2% 60.2%;
  --destructive-foreground: 210 40% 98%;

  /* Border & Input */
  --border: 214.3 31.8% 91.4%;
  --input: 214.3 31.8% 91.4%;
  --ring: 222.2 84% 4.9%;
}

/* ================================
   DARK MODE
   ================================ */

.dark {
  /* Background Colors */
  --background: 222.2 84% 4.9%;
  --foreground: 210 40% 98%;

  /* Card Colors */
  --card: 222.2 84% 4.9%;
  --card-foreground: 210 40% 98%;

  /* Popover Colors */
  --popover: 222.2 84% 4.9%;
  --popover-foreground: 210 40% 98%;

  /* Primary Colors */
  --primary: 210 40% 98%;
  --primary-foreground: 222.2 47.4% 11.2%;

  /* Secondary Colors */
  --secondary: 217.2 32.6% 17.5%;
  --secondary-foreground: 210 40% 98%;

  /* Muted Colors */
  --muted: 217.2 32.6% 17.5%;
  --muted-foreground: 215 20.2% 65.1%;

  /* Accent Colors */
  --accent: 217.2 32.6% 17.5%;
  --accent-foreground: 210 40% 98%;

  /* Destructive Colors */
  --destructive: 0 62.8% 30.6%;
  --destructive-foreground: 210 40% 98%;

  /* Border & Input */
  --border: 217.2 32.6% 17.5%;
  --input: 217.2 32.6% 17.5%;
  --ring: 212.7 26.8% 83.9%;
}

/* ================================
   BASE STYLES
   ================================ */

* {
  border-color: hsl(var(--border));
}

body {
  background-color: hsl(var(--background));
  color: hsl(var(--foreground));
  font-family: var(--font-sans);
}

/* ================================
   SCROLLBAR STYLING
   ================================ */

::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

::-webkit-scrollbar-track {
  background: hsl(var(--muted));
}

::-webkit-scrollbar-thumb {
  background: hsl(var(--muted-foreground) / 0.3);
  border-radius: var(--radius-md);
}

::-webkit-scrollbar-thumb:hover {
  background: hsl(var(--muted-foreground) / 0.5);
}
```

### 5.2 Theme Token Reference

| Token | Light Mode | Dark Mode | Usage |
|-------|------------|-----------|-------|
| `--background` | White | Near black | Page background |
| `--foreground` | Dark blue | Off-white | Text color |
| `--primary` | Dark blue | Off-white | Primary buttons |
| `--muted` | Light gray | Dark gray | Subtle backgrounds |
| `--border` | Light gray | Dark gray | Borders |

---

## Step 6: Create Utility Functions

### 6.1 Create `src/lib/utils.ts`

```typescript
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Combines class names using clsx and merges Tailwind classes
 * This prevents Tailwind class conflicts (e.g., "p-2 p-4" becomes "p-4")
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
```

### 6.2 Usage Example

```typescript
import { cn } from "@/lib/utils";

// Basic usage
<div className={cn("p-4 bg-white", isActive && "bg-blue-500")} />

// Merging conflicting classes (last one wins)
<div className={cn("p-2", "p-4")} /> // Results in "p-4"
```

---

## Step 7: Create Base UI Components

### 7.1 Create Directory Structure

```bash
mkdir -p src/components/ui
```

### 7.2 Create `src/components/ui/button.tsx`

```typescript
import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline:
          "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
```

### 7.3 Create `src/components/ui/card.tsx`

```typescript
import * as React from "react";
import { cn } from "@/lib/utils";

const Card = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "rounded-lg border bg-card text-card-foreground shadow-sm",
      className
    )}
    {...props}
  />
));
Card.displayName = "Card";

const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col space-y-1.5 p-6", className)}
    {...props}
  />
));
CardHeader.displayName = "CardHeader";

const CardTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn(
      "text-2xl font-semibold leading-none tracking-tight",
      className
    )}
    {...props}
  />
));
CardTitle.displayName = "CardTitle";

const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
));
CardDescription.displayName = "CardDescription";

const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />
));
CardContent.displayName = "CardContent";

const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center p-6 pt-0", className)}
    {...props}
  />
));
CardFooter.displayName = "CardFooter";

export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardDescription,
  CardContent,
};
```

### 7.4 Button Variants Reference

| Variant | Use Case |
|---------|----------|
| `default` | Primary actions (Export, Save) |
| `secondary` | Secondary actions |
| `outline` | Less prominent actions |
| `ghost` | Subtle actions (icon buttons) |
| `destructive` | Delete, remove actions |
| `link` | Navigation links styled as buttons |

---

## Step 8: Set Up React Router

### 8.1 Create `src/lib/router.tsx`

```typescript
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import { AppLayout } from "@/components/layout/AppLayout";
import PlanPage from "@/pages/PlanPage";
import DataPage from "@/pages/DataPage";
import DesignsPage from "@/pages/DesignsPage";
import ExportPage from "@/pages/ExportPage";

const router = createBrowserRouter([
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
]);

export function Router() {
  return <RouterProvider router={router} />;
}
```

### 8.2 Route Structure

| Route | Page Component | Tab Label | Icon |
|-------|----------------|-----------|------|
| `/` | `PlanPage` | Plan | `FileText` |
| `/data` | `DataPage` | Data | `Database` |
| `/designs` | `DesignsPage` | Designs | `Palette` |
| `/export` | `ExportPage` | Export | `Download` |

---

## Step 9: Create Page Components

### 9.1 Create Pages Directory

```bash
mkdir -p src/pages
```

### 9.2 Create `src/pages/PlanPage.tsx`

```typescript
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function PlanPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Plan</h1>
        <p className="text-muted-foreground">
          Define your product vision and roadmap
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Product Overview</CardTitle>
            <CardDescription>
              Your product's vision, problem statement, and key features
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              No product overview found. Create a{" "}
              <code className="rounded bg-muted px-1 py-0.5">
                product/product-overview.md
              </code>{" "}
              file to get started.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Product Roadmap</CardTitle>
            <CardDescription>
              Sections and milestones for your product
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              No roadmap found. Create a{" "}
              <code className="rounded bg-muted px-1 py-0.5">
                product/product-roadmap.md
              </code>{" "}
              file to get started.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
```

### 9.3 Create `src/pages/DataPage.tsx`

```typescript
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function DataPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Data</h1>
        <p className="text-muted-foreground">
          Visualize your database schema and validators
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Entity Relationship Diagram</CardTitle>
            <CardDescription>
              Visual representation of your Prisma schema
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex h-64 items-center justify-center rounded-md border border-dashed">
              <p className="text-sm text-muted-foreground">
                No schema found. Create a{" "}
                <code className="rounded bg-muted px-1 py-0.5">
                  prisma/schema.prisma
                </code>{" "}
                file to generate the ERD.
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Data Models</CardTitle>
            <CardDescription>
              All entities defined in your schema
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              No models found.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Validators</CardTitle>
            <CardDescription>
              Zod schemas for data validation
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              No validators found. Create a{" "}
              <code className="rounded bg-muted px-1 py-0.5">
                lib/validators.ts
              </code>{" "}
              file to see Zod schemas.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
```

### 9.4 Create `src/pages/DesignsPage.tsx`

```typescript
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function DesignsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Designs</h1>
        <p className="text-muted-foreground">
          Preview your components and screens
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        {/* Sidebar - Component List */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Components</CardTitle>
            <CardDescription>
              Your app shell and section components
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">
                No components found. Create components in{" "}
                <code className="rounded bg-muted px-1 py-0.5">
                  src/sections/
                </code>{" "}
                to see them here.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Preview Area */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Preview</CardTitle>
            <CardDescription>
              Live component preview
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex h-96 items-center justify-center rounded-md border border-dashed">
              <p className="text-sm text-muted-foreground">
                Select a component to preview
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
```

### 9.5 Create `src/pages/ExportPage.tsx`

```typescript
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Download } from "lucide-react";

export default function ExportPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Export</h1>
        <p className="text-muted-foreground">
          Generate your production-ready project scaffold
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Export Preview</CardTitle>
            <CardDescription>
              Files that will be included in your export
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground">📁</span>
                <span>docs/prompts/</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground">📁</span>
                <span>prisma/</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground">📁</span>
                <span>components/</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground">📄</span>
                <span>package.json</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground">📄</span>
                <span>README.md</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Export Status</CardTitle>
            <CardDescription>
              Validation status for your project
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm">Product Overview</span>
                <span className="text-sm text-muted-foreground">
                  ⚠️ Missing
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Database Schema</span>
                <span className="text-sm text-muted-foreground">
                  ⚠️ Missing
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Components</span>
                <span className="text-sm text-muted-foreground">
                  ⚠️ Missing
                </span>
              </div>
            </div>
            <Button className="w-full" disabled>
              <Download className="mr-2 h-4 w-4" />
              Export Project
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
```

---

## Step 10: Create Layout Components

### 10.1 Create Layout Directory

```bash
mkdir -p src/components/layout
```

### 10.2 Create `src/components/layout/TabNav.tsx`

```typescript
import { NavLink } from "react-router-dom";
import { FileText, Database, Palette, Download } from "lucide-react";
import { cn } from "@/lib/utils";

const tabs = [
  { path: "/", label: "Plan", icon: FileText },
  { path: "/data", label: "Data", icon: Database },
  { path: "/designs", label: "Designs", icon: Palette },
  { path: "/export", label: "Export", icon: Download },
];

export function TabNav() {
  return (
    <nav className="flex items-center space-x-1 border-b">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        return (
          <NavLink
            key={tab.path}
            to={tab.path}
            end={tab.path === "/"}
            className={({ isActive }) =>
              cn(
                "flex items-center gap-2 border-b-2 px-4 py-3 text-sm font-medium transition-colors",
                isActive
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:border-muted-foreground/30 hover:text-foreground"
              )
            }
          >
            <Icon className="h-4 w-4" />
            {tab.label}
          </NavLink>
        );
      })}
    </nav>
  );
}
```

### 10.3 Create `src/components/layout/ThemeToggle.tsx`

```typescript
import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

export function ThemeToggle() {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    // Check for saved preference or system preference
    const savedTheme = localStorage.getItem("theme");
    const prefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)"
    ).matches;

    if (savedTheme === "dark" || (!savedTheme && prefersDark)) {
      setIsDark(true);
      document.documentElement.classList.add("dark");
    }
  }, []);

  const toggleTheme = () => {
    const newIsDark = !isDark;
    setIsDark(newIsDark);

    if (newIsDark) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleTheme}
      aria-label="Toggle theme"
    >
      {isDark ? (
        <Sun className="h-5 w-5" />
      ) : (
        <Moon className="h-5 w-5" />
      )}
    </Button>
  );
}
```

### 10.4 Create `src/components/layout/AppLayout.tsx`

```typescript
import { Outlet } from "react-router-dom";
import { TabNav } from "./TabNav";
import { ThemeToggle } from "./ThemeToggle";

export function AppLayout() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto flex h-14 items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <span className="text-xl font-bold">Vibe Architect</span>
            <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
              v1.0
            </span>
          </div>
          <ThemeToggle />
        </div>
        <div className="container mx-auto px-4">
          <TabNav />
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="border-t py-4">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          Vibe Architect — The missing design process between your idea and your
          codebase
        </div>
      </footer>
    </div>
  );
}
```

---

## Step 11: Configure Entry Points

### 11.1 Update `src/main.tsx`

```typescript
import React from "react";
import ReactDOM from "react-dom/client";
import { Router } from "@/lib/router";
import "@/index.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Router />
  </React.StrictMode>
);
```

### 11.2 Delete `src/App.tsx`

The default App.tsx is no longer needed since we're using React Router:

```bash
rm src/App.tsx
```

---

## Step 12: Add Google Fonts

### 12.1 Update `index.html`

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Vibe Architect</title>
    
    <!-- Google Fonts -->
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link
      href="https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,100..1000;1,9..40,100..1000&family=IBM+Plex+Mono:wght@400;500;600&display=swap"
      rel="stylesheet"
    />
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

### 12.2 Create `public/favicon.svg`

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
  <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
  <polyline points="9 22 9 12 15 12 15 22"/>
</svg>
```

---

## Verification Checklist

After completing all steps, verify:

### Development Server

```bash
npm run dev
```

- [ ] Server starts without errors
- [ ] Browser opens to `http://localhost:5173`
- [ ] Page loads without console errors

### Navigation

- [ ] All 4 tabs are visible (Plan, Data, Designs, Export)
- [ ] Clicking each tab navigates to the correct page
- [ ] Active tab is highlighted with primary color
- [ ] URL changes correctly for each tab

### Theme Toggle

- [ ] Light/dark toggle button is visible in header
- [ ] Clicking toggle switches between light and dark modes
- [ ] Theme preference is saved to localStorage
- [ ] Theme persists after page refresh

### Styling

- [ ] DM Sans font is applied to body text
- [ ] IBM Plex Mono font is applied to code elements
- [ ] Cards have proper borders and shadows
- [ ] Colors match the design tokens

### Responsive Design

- [ ] Layout works on desktop (1200px+)
- [ ] Layout works on tablet (768px-1199px)
- [ ] Layout works on mobile (< 768px)

---

## File Structure Summary

After completing Phase 1, your project should have this structure:

```
vibe-architect/
├── index.html
├── package.json
├── vite.config.ts
├── tsconfig.json
├── tsconfig.node.json
│
├── public/
│   └── favicon.svg
│
└── src/
    ├── main.tsx
    ├── index.css
    │
    ├── lib/
    │   ├── utils.ts
    │   └── router.tsx
    │
    ├── components/
    │   ├── ui/
    │   │   ├── button.tsx
    │   │   └── card.tsx
    │   │
    │   └── layout/
    │       ├── AppLayout.tsx
    │       ├── TabNav.tsx
    │       └── ThemeToggle.tsx
    │
    └── pages/
        ├── PlanPage.tsx
        ├── DataPage.tsx
        ├── DesignsPage.tsx
        └── ExportPage.tsx
```

---

## Next Steps (Phase 2)

After completing Phase 1, proceed to Phase 2 which covers:

1. Creating sample product files (`product/` directory)
2. Implementing type definitions (`src/types/`)
3. Building file loaders:
   - `product-loader.ts` - Load markdown product files
   - `schema-loader.ts` - Parse Prisma schema
   - `section-loader.ts` - Load section components
   - `design-system-loader.ts` - Load design tokens
   - `shell-loader.ts` - Load app shell configuration

---

## Troubleshooting

### Common Issues

| Issue | Solution |
|-------|----------|
| `@/` imports not working | Check `tsconfig.json` paths and `vite.config.ts` alias |
| Tailwind styles not applied | Ensure `@import "tailwindcss"` is in `index.css` |
| Dark mode not working | Check that `.dark` class is on `html` element |
| Fonts not loading | Verify Google Fonts link in `index.html` |
| Router not working | Ensure `RouterProvider` is in `main.tsx` |

### Useful Commands

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Type check
npx tsc --noEmit
```

---

*End of Phase 1 Implementation Plan*
