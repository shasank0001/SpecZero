# Phase 6: Export Tab & Polish - Detailed Implementation Plan

> **Goal:** Generate complete export ZIP with production-ready scaffolding and polish the entire application  
> **Duration:** 4 days  
> **Outcome:** A complete Export tab that validates project completeness, generates production-ready Next.js scaffolding with AI agent instructions, and polished UX throughout the application

---

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Step 1: Install Export Dependencies](#step-1-install-export-dependencies)
3. [Step 2: Create Export Template Files](#step-2-create-export-template-files)
4. [Step 3: Create Instruction Templates](#step-3-create-instruction-templates)
5. [Step 4: Create Path Transformer](#step-4-create-path-transformer)
6. [Step 5: Create Export Validator](#step-5-create-export-validator)
7. [Step 6: Create Export Generator](#step-6-create-export-generator)
8. [Step 7: Create Export Preview Component](#step-7-create-export-preview-component)
9. [Step 8: Create Export Button Component](#step-8-create-export-button-component)
10. [Step 9: Assemble Export Page](#step-9-assemble-export-page)
11. [Step 10: Polish & Error Handling](#step-10-polish--error-handling)
12. [Step 11: Documentation](#step-11-documentation)
13. [Verification Checklist](#verification-checklist)
14. [File Structure Summary](#file-structure-summary)

---

## Prerequisites

Before starting Phase 6, ensure you have:

- [ ] Completed Phase 1 successfully (Vite app with routing and layout)
- [ ] Completed Phase 2 successfully (File loaders and data layer)
- [ ] Completed Phase 3 successfully (Plan tab with markdown rendering)
- [ ] Completed Phase 4 successfully (Data tab with Mermaid ERD diagram)
- [ ] Completed Phase 5 successfully (Designs tab with iframe previews)
- [ ] All previous phase verification checks passing
- [ ] Sample product files created and working

**Required from Phase 1:**
- `src/lib/utils.ts` - cn() helper function
- `src/components/ui/button.tsx` - Button component
- `src/components/ui/card.tsx` - Card component
- `src/components/layout/AppLayout.tsx` - Main layout wrapper

**Required from Phase 2:**
- `src/lib/product-loader.ts` - Loads product overview and roadmap
- `src/lib/schema-loader.ts` - Loads and parses Prisma schema
- `src/lib/section-loader.ts` - Loads section specs, data, and types
- `src/lib/design-system-loader.ts` - Loads colors.json and typography.json
- `src/types/product.ts` - ProductOverview, ProductRoadmap types
- `src/types/schema.ts` - PrismaModel, PrismaField types
- `src/types/section.ts` - SectionData, SectionSpec types

**Required from Phase 3:**
- `src/components/shared/EmptyState.tsx` - Empty state component

**Required from Phase 4:**
- `src/components/shared/CodeBlock.tsx` - Syntax highlighting component

**Required from Phase 5:**
- `src/sections/` - Section components structure
- `src/shell/` - Shell components structure

**Sample Files Expected:**
```
product/
├── product-overview.md
├── product-roadmap.md
├── data-model/
│   └── data-model.md
├── design-system/
│   ├── colors.json
│   └── typography.json
├── shell/
│   └── spec.md
└── sections/
    └── [section-id]/
        ├── spec.md
        ├── data.json
        └── types.ts

prisma/
└── schema.prisma

lib/
└── validators.ts

src/
├── sections/
│   └── [section-id]/
│       ├── components/
│       │   └── [Component].tsx
│       └── [ViewName].tsx
└── shell/
    └── components/
        ├── AppShell.tsx
        ├── MainNav.tsx
        └── UserMenu.tsx
```

---

## Step 1: Install Export Dependencies

### 1.1 Install Required Packages

```bash
npm install jszip file-saver
npm install -D @types/file-saver
```

| Package | Purpose |
|---------|---------|
| `jszip` | JavaScript library for creating, reading and editing ZIP files |
| `file-saver` | FileSaver implementation for saving files on the client side |
| `@types/file-saver` | TypeScript definitions for file-saver |

### 1.2 Why These Packages?

- **jszip** provides:
  - Pure JavaScript ZIP file creation
  - Support for adding files and folders programmatically
  - Async blob generation for large exports
  - No server-side requirements

- **file-saver** provides:
  - Cross-browser file download functionality
  - Handles blob-to-file conversion
  - Triggers native save dialog

### 1.3 Verify Installation

```bash
npm ls jszip file-saver
```

Expected output:
```
├── file-saver@2.x.x
└── jszip@3.x.x
```

### 1.4 Type Definitions Check

Ensure TypeScript recognizes the packages:

```typescript
// Quick test in any .ts file
import JSZip from 'jszip';
import { saveAs } from 'file-saver';

// Both should have no type errors
```

---

## Step 2: Create Export Template Files

The export templates define the golden stack configuration files that will be included in every export. These are pre-configured for the Next.js 15 + Tailwind v4 + Prisma + Clerk stack.

> Tailwind alignment: keep Tailwind v4 tokens in CSS (`@import "tailwindcss"` + `@theme`). For the exported Next.js project, include `postcss.config.js` using `@tailwindcss/postcss` and generate a `src/app/globals.css` entry file. Do not generate `tailwind.config.ts` by default.

### 2.1 Create Templates Directory

```bash
mkdir -p src/templates
```

### 2.2 Create Template Types

Create `src/templates/types.ts`:

```typescript
/**
 * Template configuration types for export generation
 */

export interface TemplateConfig {
  projectName: string;
  projectDescription: string;
  sections: string[];
  hasShell: boolean;
  hasDesignTokens: boolean;
}

export interface GeneratedFile {
  path: string;
  content: string;
}
```

### 2.3 Create Package.json Template

Create `src/templates/package-json.template.ts`:

```typescript
import type { TemplateConfig } from './types';

export function generatePackageJson(config: TemplateConfig): string {
  const packageJson = {
    name: config.projectName.toLowerCase().replace(/\s+/g, '-'),
    version: "0.1.0",
    private: true,
    scripts: {
      dev: "next dev",
      build: "next build",
      start: "next start",
      lint: "next lint",
      "db:generate": "prisma generate",
      "db:push": "prisma db push",
      "db:migrate": "prisma migrate dev",
      "db:seed": "npx tsx prisma/seed.ts",
      "db:studio": "prisma studio"
    },
    dependencies: {
      "next": "15.0.0",
      "react": "^18.3.1",
      "react-dom": "^18.3.1",
      "@clerk/nextjs": "^5.0.0",
      "@prisma/client": "^5.20.0",
      "zod": "^3.23.8",
      "clsx": "^2.1.1",
      "tailwind-merge": "^2.5.2",
      "lucide-react": "^0.447.0",
      "@radix-ui/react-slot": "^1.1.0",
      "class-variance-authority": "^0.7.0"
    },
    devDependencies: {
      "@types/node": "^22.0.0",
      "@types/react": "^18.3.11",
      "@types/react-dom": "^18.3.0",
      "typescript": "^5.6.0",
      "tailwindcss": "^4.0.0",
      "@tailwindcss/postcss": "^4.0.0",
      "prisma": "^5.20.0",
      "tsx": "^4.19.0"
    }
  };

  return JSON.stringify(packageJson, null, 2);
}
```

### 2.4 Create TypeScript Config Template

Create `src/templates/tsconfig.template.ts`:

```typescript
export function generateTsConfig(): string {
  const tsconfig = {
    compilerOptions: {
      target: "ES2020",
      lib: ["dom", "dom.iterable", "esnext"],
      allowJs: true,
      skipLibCheck: true,
      strict: true,
      noEmit: true,
      esModuleInterop: true,
      module: "esnext",
      moduleResolution: "bundler",
      resolveJsonModule: true,
      isolatedModules: true,
      jsx: "preserve",
      incremental: true,
      plugins: [
        { name: "next" }
      ],
      paths: {
        "@/*": ["./src/*"]
      }
    },
    include: ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
    exclude: ["node_modules"]
  };

  return JSON.stringify(tsconfig, null, 2);
}
```

### 2.5 Create Environment Template

Create `src/templates/env-example.template.ts`:

```typescript
import type { TemplateConfig } from './types';

export function generateEnvExample(config: TemplateConfig): string {
  return `# Database (PostgreSQL via Supabase, Neon, or local)
DATABASE_URL="postgresql://user:password@localhost:5432/${config.projectName.toLowerCase().replace(/\s+/g, '_')}"

# Clerk Authentication
# Get these from https://dashboard.clerk.com
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_xxxxx
CLERK_SECRET_KEY=sk_test_xxxxx

# Clerk URLs (optional, defaults work for most cases)
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/dashboard
`;
}
```

### 2.6 Create Next.js Config Template

Create `src/templates/next-config.template.ts`:

```typescript
export function generateNextConfig(): string {
  return `import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Enable React strict mode for better development experience
  reactStrictMode: true,
  
  // Optimize images from external sources if needed
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.clerk.dev',
      },
    ],
  },
};

export default nextConfig;
`;
}
```

### 2.7 Create Tailwind CSS Entry Template

Create `src/templates/tailwind-css.template.ts`:

```typescript
export function generateTailwindCss(): string {
  return `@import "tailwindcss";

@theme {
  --font-sans: "DM Sans", system-ui, sans-serif;
  --font-mono: "IBM Plex Mono", ui-monospace, monospace;

  --background: 0 0% 100%;
  --foreground: 222.2 84% 4.9%;
}

:root {
  color: hsl(var(--foreground));
  background-color: hsl(var(--background));
}

.dark {
  --background: 222.2 84% 4.9%;
  --foreground: 210 40% 98%;
}
`;
}
```

### 2.8 Create PostCSS Config Template

Create `src/templates/postcss-config.template.ts`:

```typescript
export function generatePostcssConfig(): string {
  return `module.exports = {
  plugins: {
    "@tailwindcss/postcss": {},
  },
};
`;
}
```

### 2.9 Create Cursor Rules Template

Create `src/templates/cursorrules.template.ts`:

```typescript
import type { TemplateConfig } from './types';

export function generateCursorRules(config: TemplateConfig): string {
  return `# ${config.projectName} - AI Agent Rules

## Project Overview
${config.projectDescription}

## Technology Stack
- **Framework:** Next.js 15 (App Router)
- **Language:** TypeScript (strict mode)
- **Database:** PostgreSQL with Prisma ORM
- **Authentication:** Clerk
- **Validation:** Zod
- **Styling:** Tailwind CSS v4 + shadcn/ui patterns

## Code Style Guidelines

### TypeScript
- Use strict TypeScript - no \`any\` types
- Prefer interfaces over types for object shapes
- Use proper type imports: \`import type { X } from 'y'\`
- Export types alongside components when needed

### React Components
- Use functional components with TypeScript
- Props should be typed with interfaces
- Use \`'use client'\` directive only when necessary
- Prefer Server Components by default

### File Organization
- Components in \`src/components/\`
- Pages in \`src/app/\`
- Utilities in \`src/lib/\`
- Types in \`src/types/\`

### Database
- All database operations through Prisma
- Use transactions for multi-step operations
- Validate input with Zod before database operations

### Authentication
- Protect routes using Clerk middleware
- Use \`auth()\` in Server Components
- Use \`useUser()\` hook in Client Components

## Important Files
- \`docs/instructions/main.md\` - Master implementation guide
- \`docs/prompts/kickoff.md\` - Initial setup prompt
- \`prisma/schema.prisma\` - Database schema (source of truth)
- \`lib/validators.ts\` - Zod validation schemas

## Build Commands
\`\`\`bash
npm run dev          # Start development server
npm run db:generate  # Generate Prisma client
npm run db:push      # Push schema to database
npm run db:seed      # Seed sample data
\`\`\`
`;
}
```

### 2.10 Create README Template

Create `src/templates/readme.template.ts`:

```typescript
import type { TemplateConfig } from './types';

export function generateReadme(config: TemplateConfig): string {
  return `# ${config.projectName}

${config.projectDescription}

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- PostgreSQL database (local or hosted)
- Clerk account for authentication

### 1. Install Dependencies

\`\`\`bash
npm install
\`\`\`

### 2. Set Up Environment Variables

\`\`\`bash
cp .env.example .env
\`\`\`

Edit \`.env\` with your actual values:
- \`DATABASE_URL\` - Your PostgreSQL connection string
- \`CLERK_SECRET_KEY\` - From Clerk Dashboard
- \`NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY\` - From Clerk Dashboard

### 3. Set Up Database

\`\`\`bash
npm run db:generate  # Generate Prisma client
npm run db:push      # Push schema to database
npm run db:seed      # (Optional) Seed sample data
\`\`\`

### 4. Start Development Server

\`\`\`bash
npm run dev
\`\`\`

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📁 Project Structure

\`\`\`
├── src/
│   ├── app/              # Next.js App Router pages
│   ├── components/       # React components
│   │   ├── ui/           # Base UI components
│   │   ├── shell/        # App shell (nav, sidebar)
│   │   └── sections/     # Feature-specific components
│   └── lib/              # Utilities and helpers
├── prisma/
│   ├── schema.prisma     # Database schema
│   └── seed.ts           # Sample data seeder
├── docs/
│   ├── prompts/          # AI agent prompts
│   └── instructions/     # Step-by-step guides
└── design-system/        # Design tokens
\`\`\`

## 🤖 AI Agent Instructions

This project includes comprehensive instructions for AI coding agents:

1. **Start here:** \`docs/prompts/kickoff.md\`
2. **Detailed guides:** \`docs/instructions/\`

## 📚 Documentation

- [Next.js Documentation](https://nextjs.org/docs)
- [Prisma Documentation](https://www.prisma.io/docs)
- [Clerk Documentation](https://clerk.com/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)

## License

MIT
`;
}
```

### 2.11 Create Templates Index

Create `src/templates/index.ts`:

```typescript
export * from './types';
export * from './package-json.template';
export * from './tsconfig.template';
export * from './env-example.template';
export * from './next-config.template';
export * from './tailwind-css.template';
export * from './postcss-config.template';
export * from './cursorrules.template';
export * from './readme.template';
```

---

## Step 3: Create Instruction Templates

Instruction templates are the AI-agent-friendly guides that tell any coding agent (Cursor, Windsurf, Claude Code, etc.) how to complete the build.

### 3.1 Create Instructions Directory

```bash
mkdir -p src/templates/instructions
```

### 3.2 Create Kickoff Prompt Template

Create `src/templates/instructions/kickoff.template.ts`:

```typescript
import type { TemplateConfig } from '../types';

export function generateKickoffPrompt(config: TemplateConfig): string {
  return `# ${config.projectName} - Project Kickoff

## 🎯 Mission

Build a production-ready ${config.projectName} application using the pre-defined architecture.

## 📋 Pre-Flight Checklist

Before starting, ensure:

1. [ ] \`.env\` file is configured with valid credentials
2. [ ] PostgreSQL database is accessible
3. [ ] Clerk application is set up

## 🚀 Start Command

Run this sequence to initialize the project:

\`\`\`bash
# 1. Install dependencies
npm install

# 2. Generate Prisma client
npm run db:generate

# 3. Push schema to database
npm run db:push

# 4. Start development server
npm run dev
\`\`\`

## 📖 Implementation Guide

Follow the instructions in order:

1. **\`docs/instructions/main.md\`** - Overview and architecture
2. **\`docs/instructions/phase_1_foundation.md\`** - Database, Auth, Base setup
3. **\`docs/instructions/phase_2_shell.md\`** - App Shell implementation
${config.sections.map((section, index) => 
  `4. **\`docs/instructions/phase_${index + 3}_${section}.md\`** - ${section} feature`
).join('\n')}

## 🎨 Design Reference

- Components are pre-built in \`src/components/\`
- Design tokens in \`design-system/\`
- Sample data in \`sample-data/\`

## ✅ Success Criteria

The build is complete when:

- [ ] All database tables are created and seeded
- [ ] Authentication flow works (sign up, sign in, sign out)
- [ ] App shell renders with navigation
${config.sections.map(section => `- [ ] ${section} feature is functional`).join('\n')}
- [ ] All pages are protected with authentication
`;
}
```

### 3.3 Create Main Instructions Template

Create `src/templates/instructions/main.template.ts`:

```typescript
import type { TemplateConfig } from '../types';

export function generateMainInstructions(config: TemplateConfig): string {
  return `# ${config.projectName} - Implementation Guide

## Overview

This document is the master guide for implementing ${config.projectName}. It provides the architecture overview, technology decisions, and implementation sequence.

## Technology Stack

| Layer | Technology | Version |
|-------|------------|---------|
| Framework | Next.js (App Router) | 15.0.0 |
| Language | TypeScript | 5.6+ |
| Database | PostgreSQL + Prisma | 5.20+ |
| Authentication | Clerk | 5.0+ |
| Validation | Zod | 3.23+ |
| Styling | Tailwind CSS + shadcn/ui | 4.0+ |

## Architecture Principles

### 1. Server-First
- Default to Server Components
- Use Client Components only for interactivity
- Fetch data in Server Components

### 2. Type Safety
- Strict TypeScript throughout
- Zod validation at boundaries
- Prisma for type-safe database access

### 3. Authentication
- Clerk handles all auth flows
- Middleware protects routes
- User context available everywhere

## Project Structure

\`\`\`
src/
├── app/                    # Next.js App Router
│   ├── (auth)/             # Auth routes (sign-in, sign-up)
│   ├── (protected)/        # Protected routes
│   │   └── dashboard/      # Main app pages
│   ├── api/                # API routes
│   ├── layout.tsx          # Root layout with Clerk
│   └── page.tsx            # Landing page
├── components/
│   ├── ui/                 # Base UI (button, card, etc.)
│   ├── shell/              # App shell (nav, sidebar)
│   └── sections/           # Feature components
├── lib/
│   ├── db.ts               # Prisma client instance
│   ├── validators.ts       # Zod schemas
│   └── utils.ts            # Utility functions
└── types/                  # TypeScript types
\`\`\`

## Implementation Phases

### Phase 1: Foundation
- Set up Prisma and database connection
- Configure Clerk authentication
- Create base layout with Clerk provider
- Implement middleware for route protection

### Phase 2: Shell
- Implement App Shell component
- Create main navigation
- Add user menu with sign out
- Set up dashboard layout

${config.sections.map((section, index) => `### Phase ${index + 3}: ${section}
- Implement ${section} data fetching
- Create ${section} pages
- Add CRUD operations
- Connect to sample data`).join('\n\n')}

## Key Files Reference

| File | Purpose |
|------|---------|
| \`prisma/schema.prisma\` | Database schema (source of truth) |
| \`lib/validators.ts\` | Zod validation schemas |
| \`middleware.ts\` | Clerk route protection |
| \`src/app/layout.tsx\` | Root layout with providers |

## Getting Help

- Check component implementations in \`src/components/\`
- Reference sample data in \`sample-data/\`
- See design tokens in \`design-system/\`
`;
}
```

### 3.4 Create Phase 1 Foundation Template

Create `src/templates/instructions/phase-1-foundation.template.ts`:

```typescript
import type { TemplateConfig } from '../types';

export function generatePhase1Instructions(config: TemplateConfig): string {
  return `# Phase 1: Foundation

## Goal
Set up the database, authentication, and base application structure.

## Duration
~2 hours

---

## Step 1: Verify Database Connection

### 1.1 Check Environment Variables

Ensure \`.env\` has a valid \`DATABASE_URL\`:

\`\`\`env
DATABASE_URL="postgresql://user:password@host:5432/database"
\`\`\`

### 1.2 Generate Prisma Client

\`\`\`bash
npm run db:generate
\`\`\`

### 1.3 Push Schema to Database

\`\`\`bash
npm run db:push
\`\`\`

### 1.4 Verify Tables Created

\`\`\`bash
npm run db:studio
\`\`\`

This opens Prisma Studio - verify all tables exist.

---

## Step 2: Configure Clerk Authentication

### 2.1 Verify Clerk Environment Variables

\`\`\`env
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_xxxxx
CLERK_SECRET_KEY=sk_test_xxxxx
\`\`\`

### 2.2 Create Clerk Middleware

Create \`middleware.ts\` in the project root:

\`\`\`typescript
import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';

const isPublicRoute = createRouteMatcher([
  '/',
  '/sign-in(.*)',
  '/sign-up(.*)',
  '/api/health(.*)',
]);

export default clerkMiddleware(async (auth, request) => {
  if (!isPublicRoute(request)) {
    await auth.protect();
  }
});

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
};
\`\`\`

### 2.3 Update Root Layout

Update \`src/app/layout.tsx\`:

\`\`\`typescript
import { ClerkProvider } from '@clerk/nextjs';
import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: '${config.projectName}',
  description: '${config.projectDescription}',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body>{children}</body>
      </html>
    </ClerkProvider>
  );
}
\`\`\`

### 2.4 Create Auth Routes

Create \`src/app/(auth)/sign-in/[[...sign-in]]/page.tsx\`:

\`\`\`typescript
import { SignIn } from '@clerk/nextjs';

export default function SignInPage() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <SignIn />
    </div>
  );
}
\`\`\`

Create \`src/app/(auth)/sign-up/[[...sign-up]]/page.tsx\`:

\`\`\`typescript
import { SignUp } from '@clerk/nextjs';

export default function SignUpPage() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <SignUp />
    </div>
  );
}
\`\`\`

---

## Step 3: Create Database Client

### 3.1 Create Prisma Client Instance

Create \`src/lib/db.ts\`:

\`\`\`typescript
import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const db = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = db;
}
\`\`\`

---

## Step 4: Create Utils

### 4.1 Create cn() Helper

Create \`src/lib/utils.ts\`:

\`\`\`typescript
import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
\`\`\`

---

## Step 5: Create Health Check API

### 5.1 Create API Route

Create \`src/app/api/health/route.ts\`:

\`\`\`typescript
import { db } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Test database connection
    await db.$queryRaw\`SELECT 1\`;
    
    return NextResponse.json({
      status: 'healthy',
      database: 'connected',
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    return NextResponse.json(
      {
        status: 'unhealthy',
        database: 'disconnected',
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
\`\`\`

---

## Verification

Run these checks before proceeding to Phase 2:

- [ ] \`npm run dev\` starts without errors
- [ ] Visit \`/api/health\` - returns healthy status
- [ ] Visit \`/sign-in\` - shows Clerk sign-in form
- [ ] Sign in successfully redirects to dashboard
- [ ] Protected routes redirect to sign-in when logged out
`;
}
```

### 3.5 Create Phase 2 Shell Template

Create `src/templates/instructions/phase-2-shell.template.ts`:

```typescript
import type { TemplateConfig } from '../types';

export function generatePhase2Instructions(config: TemplateConfig): string {
  return `# Phase 2: App Shell

## Goal
Implement the application shell with navigation, sidebar, and user menu.

## Duration
~2 hours

---

## Step 1: Create Shell Layout

### 1.1 Create Dashboard Layout

Create \`src/app/(protected)/layout.tsx\`:

\`\`\`typescript
import { AppShell } from '@/components/shell/AppShell';

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AppShell>{children}</AppShell>;
}
\`\`\`

### 1.2 Copy Shell Components

Copy the pre-built shell components from \`src/components/shell/\`:

- \`AppShell.tsx\` - Main shell wrapper
- \`MainNav.tsx\` - Navigation menu
- \`UserMenu.tsx\` - User profile dropdown

These components are already implemented - just ensure they're in place.

---

## Step 2: Create Dashboard Page

### 2.1 Create Dashboard Home

Create \`src/app/(protected)/dashboard/page.tsx\`:

\`\`\`typescript
import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';

export default async function DashboardPage() {
  const { userId } = await auth();
  
  if (!userId) {
    redirect('/sign-in');
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
      <p className="text-muted-foreground">
        Welcome to ${config.projectName}!
      </p>
    </div>
  );
}
\`\`\`

---

## Step 3: Configure Navigation

### 3.1 Update Navigation Items

In \`src/components/shell/MainNav.tsx\`, ensure navigation includes:

\`\`\`typescript
const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: Home },
${config.sections.map(section => `  { href: '/dashboard/${section.toLowerCase()}', label: '${section}', icon: /* appropriate icon */ },`).join('\n')}
];
\`\`\`

---

## Step 4: Update Root Page

### 4.1 Create Landing Page

Update \`src/app/page.tsx\`:

\`\`\`typescript
import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import Link from 'next/link';

export default async function HomePage() {
  const { userId } = await auth();
  
  if (userId) {
    redirect('/dashboard');
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center">
      <h1 className="text-4xl font-bold mb-4">${config.projectName}</h1>
      <p className="text-muted-foreground mb-8">
        ${config.projectDescription}
      </p>
      <div className="flex gap-4">
        <Link
          href="/sign-in"
          className="px-4 py-2 bg-primary text-primary-foreground rounded-md"
        >
          Sign In
        </Link>
        <Link
          href="/sign-up"
          className="px-4 py-2 border rounded-md"
        >
          Sign Up
        </Link>
      </div>
    </div>
  );
}
\`\`\`

---

## Verification

Run these checks before proceeding:

- [ ] \`npm run dev\` starts without errors
- [ ] Landing page shows with sign in/up links
- [ ] Dashboard has working navigation
- [ ] User menu shows current user
- [ ] Sign out works correctly
- [ ] Navigation highlights current page
`;
}
```

### 3.6 Create Section Instruction Template

Create `src/templates/instructions/section.template.ts`:

```typescript
interface SectionConfig {
  name: string;
  phaseNumber: number;
  models: string[];
  features: string[];
}

export function generateSectionInstructions(config: SectionConfig): string {
  return `# Phase ${config.phaseNumber}: ${config.name}

## Goal
Implement the ${config.name} feature with full CRUD operations.

## Duration
~3-4 hours

---

## Step 1: Create ${config.name} Page

### 1.1 Create List Page

Create \`src/app/(protected)/dashboard/${config.name.toLowerCase()}/page.tsx\`:

\`\`\`typescript
import { db } from '@/lib/db';
import { ${config.name}Table } from '@/components/sections/${config.name.toLowerCase()}/${config.name}Table';

export default async function ${config.name}Page() {
  const items = await db.${config.name.toLowerCase()}.findMany({
    orderBy: { createdAt: 'desc' },
  });

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">${config.name}</h1>
        {/* Add button component here */}
      </div>
      <${config.name}Table items={items} />
    </div>
  );
}
\`\`\`

---

## Step 2: Copy Pre-built Components

### 2.1 Copy Section Components

The following components are pre-built in \`src/components/sections/${config.name.toLowerCase()}/\`:

${config.features.map(feature => `- \`${feature}.tsx\``).join('\n')}

Copy these components and ensure they're properly integrated.

### 2.2 Wire Up Components

Ensure components receive proper props from the page:

\`\`\`typescript
// Components receive data as props (never import data directly)
interface ${config.name}TableProps {
  items: ${config.name}[];
  onView?: (id: string) => void;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
}
\`\`\`

---

## Step 3: Create Server Actions

### 3.1 Create Actions File

Create \`src/app/(protected)/dashboard/${config.name.toLowerCase()}/actions.ts\`:

\`\`\`typescript
'use server';

import { db } from '@/lib/db';
import { revalidatePath } from 'next/cache';
import { ${config.name.toLowerCase()}Schema } from '@/lib/validators';

export async function create${config.name}(formData: FormData) {
  const data = Object.fromEntries(formData);
  const validated = ${config.name.toLowerCase()}Schema.parse(data);
  
  await db.${config.name.toLowerCase()}.create({
    data: validated,
  });
  
  revalidatePath('/dashboard/${config.name.toLowerCase()}');
}

export async function update${config.name}(id: string, formData: FormData) {
  const data = Object.fromEntries(formData);
  const validated = ${config.name.toLowerCase()}Schema.parse(data);
  
  await db.${config.name.toLowerCase()}.update({
    where: { id },
    data: validated,
  });
  
  revalidatePath('/dashboard/${config.name.toLowerCase()}');
}

export async function delete${config.name}(id: string) {
  await db.${config.name.toLowerCase()}.delete({
    where: { id },
  });
  
  revalidatePath('/dashboard/${config.name.toLowerCase()}');
}
\`\`\`

---

## Step 4: Create Detail Page (Optional)

### 4.1 Create Detail View

Create \`src/app/(protected)/dashboard/${config.name.toLowerCase()}/[id]/page.tsx\`:

\`\`\`typescript
import { db } from '@/lib/db';
import { notFound } from 'next/navigation';
import { ${config.name}Detail } from '@/components/sections/${config.name.toLowerCase()}/${config.name}Detail';

interface Props {
  params: { id: string };
}

export default async function ${config.name}DetailPage({ params }: Props) {
  const item = await db.${config.name.toLowerCase()}.findUnique({
    where: { id: params.id },
  });

  if (!item) {
    notFound();
  }

  return <${config.name}Detail item={item} />;
}
\`\`\`

---

## Verification

Run these checks before proceeding:

- [ ] ${config.name} list page renders correctly
- [ ] Create new ${config.name.toLowerCase()} works
- [ ] Edit existing ${config.name.toLowerCase()} works
- [ ] Delete ${config.name.toLowerCase()} works
- [ ] Validation errors display correctly
- [ ] Data persists after page refresh
`;
}
```

### 3.7 Create Instructions Index

Create `src/templates/instructions/index.ts`:

```typescript
export * from './kickoff.template';
export * from './main.template';
export * from './phase-1-foundation.template';
export * from './phase-2-shell.template';
export * from './section.template';
```

---

## Step 4: Create Path Transformer

The path transformer converts Vite-style `@/` imports to relative paths for portability in the exported project.

### 4.1 Create Path Transformer Utility

Create `src/lib/path-transformer.ts`:

```typescript
/**
 * Path Transformer
 * 
 * Converts @ alias imports to relative paths for export portability.
 * Handles TypeScript/TSX files with various import patterns.
 */

interface TransformOptions {
  /** Current file path relative to src/ */
  currentFilePath: string;
  /** Content to transform */
  content: string;
}

interface TransformResult {
  content: string;
  transformedImports: number;
}

/**
 * Calculate relative path from one file to another
 */
function getRelativePath(from: string, to: string): string {
  const fromParts = from.split('/').slice(0, -1); // Remove filename
  const toParts = to.split('/');
  
  // Find common prefix
  let commonLength = 0;
  while (
    commonLength < fromParts.length &&
    commonLength < toParts.length &&
    fromParts[commonLength] === toParts[commonLength]
  ) {
    commonLength++;
  }
  
  // Calculate relative path
  const upCount = fromParts.length - commonLength;
  const upPath = upCount > 0 ? '../'.repeat(upCount) : './';
  const downPath = toParts.slice(commonLength).join('/');
  
  return upPath + downPath;
}

/**
 * Transform @ alias imports to relative paths
 */
export function transformImports(options: TransformOptions): TransformResult {
  const { currentFilePath, content } = options;
  let transformedContent = content;
  let transformedImports = 0;
  
  // Match various import patterns with @ alias
  // Handles: import X from '@/...'
  //          import { X } from '@/...'
  //          import type { X } from '@/...'
  //          import '@/...'
  const importRegex = /(import\s+(?:type\s+)?(?:\{[^}]*\}|\*\s+as\s+\w+|\w+)\s+from\s+['"])@\/([^'"]+)(['"])/g;
  const sideEffectImportRegex = /(import\s+['"])@\/([^'"]+)(['"])/g;
  
  // Transform standard imports
  transformedContent = transformedContent.replace(
    importRegex,
    (match, prefix, importPath, suffix) => {
      transformedImports++;
      const relativePath = getRelativePath(currentFilePath, importPath);
      return `${prefix}${relativePath}${suffix}`;
    }
  );
  
  // Transform side-effect imports
  transformedContent = transformedContent.replace(
    sideEffectImportRegex,
    (match, prefix, importPath, suffix) => {
      // Skip if already transformed
      if (!match.includes('@/')) return match;
      transformedImports++;
      const relativePath = getRelativePath(currentFilePath, importPath);
      return `${prefix}${relativePath}${suffix}`;
    }
  );
  
  return {
    content: transformedContent,
    transformedImports,
  };
}

/**
 * Batch transform multiple files
 */
export function transformFiles(
  files: Map<string, string>
): Map<string, string> {
  const transformedFiles = new Map<string, string>();
  
  for (const [filePath, content] of files) {
    // Only transform TypeScript/TSX files
    if (filePath.endsWith('.ts') || filePath.endsWith('.tsx')) {
      const result = transformImports({
        currentFilePath: filePath,
        content,
      });
      transformedFiles.set(filePath, result.content);
    } else {
      transformedFiles.set(filePath, content);
    }
  }
  
  return transformedFiles;
}

/**
 * Check if a file contains @ alias imports
 */
export function hasAliasImports(content: string): boolean {
  return /@\//.test(content);
}
```

### 4.2 Create Transform Tests

For verification, create test cases:

```typescript
// Example transformations:

// Before (src/components/ui/Button.tsx):
// import { cn } from '@/lib/utils';
// import type { ButtonProps } from '@/types/components';

// After:
// import { cn } from '../../lib/utils';
// import type { ButtonProps } from '../../types/components';

// Before (src/app/dashboard/page.tsx):
// import { db } from '@/lib/db';
// import { PatientTable } from '@/components/sections/patients/PatientTable';

// After:
// import { db } from '../../lib/db';
// import { PatientTable } from '../../components/sections/patients/PatientTable';
```

### 4.3 Handle Edge Cases

The transformer handles these edge cases:

| Pattern | Example | Handling |
|---------|---------|----------|
| Type imports | `import type { X }` | Preserves `type` keyword |
| Named imports | `import { X, Y }` | Transforms path only |
| Default imports | `import X from` | Transforms path only |
| Namespace imports | `import * as X` | Transforms path only |
| Side effect imports | `import '@/styles.css'` | Transforms path only |
| Re-exports | `export { X } from '@/...'` | Transforms path |
| Multi-line imports | Spread across lines | Handles correctly |

---

## Step 5: Create Export Validator

The export validator checks project completeness before allowing export, ensuring all required files exist and components follow the props-only pattern.

> Keep the props-only signal consistent: reuse the ESLint rule from Phase 5 in `npm run lint` and also surface violations in the Export tab validation table so users see the same errors in both places.

### 5.1 Create Validation Types

Create `src/lib/export-validator.ts`:

```typescript
/**
 * Export Validator
 * 
 * Validates project completeness and component patterns before export.
 */

export interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
  warnings: ValidationWarning[];
  summary: ValidationSummary;
}

export interface ValidationError {
  code: string;
  message: string;
  file?: string;
  suggestion?: string;
}

export interface ValidationWarning {
  code: string;
  message: string;
  file?: string;
  suggestion?: string;
}

export interface ValidationSummary {
  totalChecks: number;
  passedChecks: number;
  failedChecks: number;
  warningCount: number;
  completionPercentage: number;
}

// Validation rule codes
export const ValidationCodes = {
  // Critical errors
  MISSING_PRODUCT_OVERVIEW: 'E001',
  MISSING_PRISMA_SCHEMA: 'E002',
  MISSING_VALIDATORS: 'E003',
  MISSING_CLERK_ENV: 'E004',
  INVALID_PRISMA_SYNTAX: 'E005',
  DATA_IMPORTING_COMPONENT: 'E006',
  
  // Warnings
  MISSING_DESIGN_TOKENS: 'W001',
  MISSING_SECTIONS: 'W002',
  MISSING_SHELL: 'W003',
  MISSING_SAMPLE_DATA: 'W004',
  STACK_NOT_PINNED: 'W005',
  MISSING_ROADMAP: 'W006',
} as const;
```

### 5.2 Create Validation Checks

Continue in `src/lib/export-validator.ts`:

```typescript
import { loadProductOverview, loadProductRoadmap } from './product-loader';
import { loadPrismaSchema } from './schema-loader';
import { loadAllSections } from './section-loader';
import { loadDesignSystem } from './design-system-loader';

/**
 * Check if product overview exists
 */
function checkProductOverview(): ValidationError | null {
  const overview = loadProductOverview();
  if (!overview) {
    return {
      code: ValidationCodes.MISSING_PRODUCT_OVERVIEW,
      message: 'Missing product-overview.md file',
      file: 'product/product-overview.md',
      suggestion: 'Create product-overview.md with project name, description, and features',
    };
  }
  return null;
}

/**
 * Check if product roadmap exists
 */
function checkProductRoadmap(): ValidationWarning | null {
  const roadmap = loadProductRoadmap();
  if (!roadmap) {
    return {
      code: ValidationCodes.MISSING_ROADMAP,
      message: 'Missing product-roadmap.md file',
      file: 'product/product-roadmap.md',
      suggestion: 'Create product-roadmap.md to define implementation phases',
    };
  }
  return null;
}

/**
 * Check if Prisma schema exists and is valid
 */
function checkPrismaSchema(): ValidationError | null {
  try {
    const schema = loadPrismaSchema();
    if (!schema || schema.models.length === 0) {
      return {
        code: ValidationCodes.MISSING_PRISMA_SCHEMA,
        message: 'Missing or empty schema.prisma file',
        file: 'prisma/schema.prisma',
        suggestion: 'Create schema.prisma with at least one model',
      };
    }
    return null;
  } catch (error) {
    return {
      code: ValidationCodes.INVALID_PRISMA_SYNTAX,
      message: `Invalid Prisma schema syntax: ${error instanceof Error ? error.message : 'Unknown error'}`,
      file: 'prisma/schema.prisma',
      suggestion: 'Fix syntax errors in schema.prisma',
    };
  }
}

/**
 * Check if validators file exists
 */
function checkValidators(): ValidationError | null {
  // This would check for lib/validators.ts existence
  // Implementation depends on how validators are loaded
  const validatorsExist = checkFileExists('lib/validators.ts');
  if (!validatorsExist) {
    return {
      code: ValidationCodes.MISSING_VALIDATORS,
      message: 'Missing validators.ts file',
      file: 'lib/validators.ts',
      suggestion: 'Create validators.ts with Zod schemas matching your Prisma models',
    };
  }
  return null;
}

/**
 * Check if design tokens exist
 */
function checkDesignTokens(): ValidationWarning | null {
  const designSystem = loadDesignSystem();
  if (!designSystem.colors || !designSystem.typography) {
    return {
      code: ValidationCodes.MISSING_DESIGN_TOKENS,
      message: 'Missing design tokens (colors.json and/or typography.json)',
      file: 'product/design-system/',
      suggestion: 'Create colors.json and typography.json for consistent styling',
    };
  }
  return null;
}

/**
 * Check if sections are defined
 */
function checkSections(): ValidationWarning | null {
  const sections = loadAllSections();
  if (!sections || sections.length === 0) {
    return {
      code: ValidationCodes.MISSING_SECTIONS,
      message: 'No sections defined',
      file: 'product/sections/',
      suggestion: 'Create at least one section in product/sections/',
    };
  }
  return null;
}

/**
 * Check if shell components exist
 */
function checkShell(): ValidationWarning | null {
  const shellExists = checkFileExists('src/shell/components/AppShell.tsx');
  if (!shellExists) {
    return {
      code: ValidationCodes.MISSING_SHELL,
      message: 'Missing shell components',
      file: 'src/shell/components/',
      suggestion: 'Create AppShell.tsx, MainNav.tsx, and UserMenu.tsx',
    };
  }
  return null;
}

/**
 * Helper to check file existence
 */
function checkFileExists(path: string): boolean {
  // Implementation using import.meta.glob or similar
  // This is a placeholder - actual implementation depends on file loading mechanism
  try {
    // Would use Vite's import.meta.glob to check
    return true;
  } catch {
    return false;
  }
}
```

### 5.3 Create Props-Only Component Validator

Continue in `src/lib/export-validator.ts`:

```typescript
/**
 * Check if exportable components import data directly
 * 
 * Components in src/sections/*/components/ should NOT import:
 * - data.json files
 * - /product/ paths
 * - Local fixture data
 */
function checkPropsOnlyComponents(): ValidationError[] {
  const errors: ValidationError[] = [];
  
  // Get all component files in sections
  const sectionComponents = import.meta.glob(
    '/src/sections/*/components/*.tsx',
    { query: '?raw', import: 'default', eager: true }
  ) as Record<string, string>;
  
  for (const [filePath, content] of Object.entries(sectionComponents)) {
    // Check for data imports
    const dataImportPatterns = [
      /import\s+.*\s+from\s+['"].*data\.json['"]/,
      /import\s+.*\s+from\s+['"]@\/\.\.\/product\//,
      /import\s+.*\s+from\s+['"]\.\.\/\.\.\/\.\.\/product\//,
      /import\s+data\s+from/,
    ];
    
    for (const pattern of dataImportPatterns) {
      if (pattern.test(content)) {
        errors.push({
          code: ValidationCodes.DATA_IMPORTING_COMPONENT,
          message: `Component imports data directly instead of receiving via props`,
          file: filePath,
          suggestion: 'Refactor to receive data via props. Use preview wrapper for sample data.',
        });
        break;
      }
    }
  }
  
  return errors;
}
```

### 5.4 Create Main Validation Function

Continue in `src/lib/export-validator.ts`:

```typescript
/**
 * Run all validation checks
 */
export function validateExport(): ValidationResult {
  const errors: ValidationError[] = [];
  const warnings: ValidationWarning[] = [];
  
  // Critical checks (must pass)
  const productOverviewError = checkProductOverview();
  if (productOverviewError) errors.push(productOverviewError);
  
  const prismaSchemaError = checkPrismaSchema();
  if (prismaSchemaError) errors.push(prismaSchemaError);
  
  const validatorsError = checkValidators();
  if (validatorsError) errors.push(validatorsError);
  
  const propsOnlyErrors = checkPropsOnlyComponents();
  errors.push(...propsOnlyErrors);
  
  // Warning checks (recommended but not required)
  const roadmapWarning = checkProductRoadmap();
  if (roadmapWarning) warnings.push(roadmapWarning);
  
  const designTokensWarning = checkDesignTokens();
  if (designTokensWarning) warnings.push(designTokensWarning);
  
  const sectionsWarning = checkSections();
  if (sectionsWarning) warnings.push(sectionsWarning);
  
  const shellWarning = checkShell();
  if (shellWarning) warnings.push(shellWarning);
  
  // Calculate summary
  const totalChecks = 8; // Total number of checks
  const passedChecks = totalChecks - errors.length - warnings.length;
  const summary: ValidationSummary = {
    totalChecks,
    passedChecks,
    failedChecks: errors.length,
    warningCount: warnings.length,
    completionPercentage: Math.round((passedChecks / totalChecks) * 100),
  };
  
  return {
    isValid: errors.length === 0,
    errors,
    warnings,
    summary,
  };
}

/**
 * Get human-readable validation status
 */
export function getValidationStatus(result: ValidationResult): string {
  if (result.isValid && result.warnings.length === 0) {
    return 'Ready to export';
  }
  if (result.isValid) {
    return `Ready with ${result.warnings.length} warning(s)`;
  }
  return `${result.errors.length} error(s) must be fixed`;
}
```

### 5.5 Validation Result Display

The validation results will be displayed in the Export tab UI with:

| Status | Icon | Color | Meaning |
|--------|------|-------|---------|
| Pass | ✓ | Green | Check passed |
| Warning | ⚠ | Yellow | Recommended but optional |
| Error | ✗ | Red | Must fix before export |

---

## Step 6: Create Export Generator

The export generator assembles all project files into a downloadable ZIP archive with the correct structure for a Next.js project.

### 6.1 Create Export Generator Types

Create `src/lib/export-generator.ts`:

```typescript
/**
 * Export Generator
 * 
 * Generates a complete Next.js project scaffold as a ZIP file.
 */

import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import { transformFiles } from './path-transformer';
import { validateExport } from './export-validator';
import { loadProductOverview, loadProductRoadmap } from './product-loader';
import { loadPrismaSchema } from './schema-loader';
import { loadAllSections } from './section-loader';
import { loadDesignSystem } from './design-system-loader';
import {
  generatePackageJson,
  generateTsConfig,
  generateEnvExample,
  generateNextConfig,
  generateTailwindConfig,
  generatePostcssConfig,
  generateCursorRules,
  generateReadme,
  type TemplateConfig,
} from '@/templates';
import {
  generateKickoffPrompt,
  generateMainInstructions,
  generatePhase1Instructions,
  generatePhase2Instructions,
  generateSectionInstructions,
} from '@/templates/instructions';

export interface ExportOptions {
  projectName?: string;
  includePreviewWrappers?: boolean;
}

export interface ExportProgress {
  stage: string;
  percentage: number;
}

export type ProgressCallback = (progress: ExportProgress) => void;
```

### 6.2 Create File Collection Functions

Continue in `src/lib/export-generator.ts`:

```typescript
/**
 * Collect all product files
 */
function collectProductFiles(): Map<string, string> {
  const files = new Map<string, string>();
  
  // Load markdown files from product/
  const productMd = import.meta.glob('/product/**/*.md', {
    query: '?raw',
    import: 'default',
    eager: true,
  }) as Record<string, string>;
  
  for (const [path, content] of Object.entries(productMd)) {
    // Convert /product/... to docs/product/...
    const exportPath = path.replace('/product/', 'docs/product/');
    files.set(exportPath, content);
  }
  
  return files;
}

/**
 * Collect Prisma schema files
 */
function collectPrismaFiles(): Map<string, string> {
  const files = new Map<string, string>();
  
  const prismaFiles = import.meta.glob('/prisma/**/*', {
    query: '?raw',
    import: 'default',
    eager: true,
  }) as Record<string, string>;
  
  for (const [path, content] of Object.entries(prismaFiles)) {
    files.set(path.slice(1), content); // Remove leading /
  }
  
  return files;
}

/**
 * Collect component files (shell and sections)
 */
function collectComponentFiles(includePreviewWrappers: boolean): Map<string, string> {
  const files = new Map<string, string>();
  
  // Collect shell components
  const shellFiles = import.meta.glob('/src/shell/components/*.tsx', {
    query: '?raw',
    import: 'default',
    eager: true,
  }) as Record<string, string>;
  
  for (const [path, content] of Object.entries(shellFiles)) {
    const exportPath = path.replace('/src/shell/', 'src/components/shell/');
    files.set(exportPath, content);
  }
  
  // Collect section components (only from components/ subfolder)
  const sectionComponents = import.meta.glob('/src/sections/*/components/**/*.tsx', {
    query: '?raw',
    import: 'default',
    eager: true,
  }) as Record<string, string>;
  
  for (const [path, content] of Object.entries(sectionComponents)) {
    const exportPath = path.replace('/src/sections/', 'src/components/sections/');
    files.set(exportPath, content);
  }
  
  // Optionally collect preview wrappers (not typically exported)
  if (includePreviewWrappers) {
    const previewFiles = import.meta.glob('/src/sections/*/*.tsx', {
      query: '?raw',
      import: 'default',
      eager: true,
    }) as Record<string, string>;
    
    for (const [path, content] of Object.entries(previewFiles)) {
      // Skip if it's in components/ folder
      if (path.includes('/components/')) continue;
      const exportPath = path.replace('/src/sections/', 'previews/sections/');
      files.set(exportPath, content);
    }
  }
  
  return files;
}

/**
 * Collect UI components
 */
function collectUIComponents(): Map<string, string> {
  const files = new Map<string, string>();
  
  const uiFiles = import.meta.glob('/src/components/ui/*.tsx', {
    query: '?raw',
    import: 'default',
    eager: true,
  }) as Record<string, string>;
  
  for (const [path, content] of Object.entries(uiFiles)) {
    files.set(path.slice(1), content); // Remove leading /
  }
  
  return files;
}

/**
 * Collect lib files (utils, validators)
 */
function collectLibFiles(): Map<string, string> {
  const files = new Map<string, string>();
  
  const libFiles = import.meta.glob('/lib/**/*.ts', {
    query: '?raw',
    import: 'default',
    eager: true,
  }) as Record<string, string>;
  
  for (const [path, content] of Object.entries(libFiles)) {
    // Move to src/lib/
    const exportPath = `src${path}`;
    files.set(exportPath, content);
  }
  
  return files;
}

/**
 * Collect design system files
 */
function collectDesignSystemFiles(): Map<string, string> {
  const files = new Map<string, string>();
  
  const designFiles = import.meta.glob('/product/design-system/**/*.json', {
    query: '?raw',
    import: 'default',
    eager: true,
  }) as Record<string, string>;
  
  for (const [path, content] of Object.entries(designFiles)) {
    const exportPath = path.replace('/product/', '');
    files.set(exportPath, content);
  }
  
  return files;
}

/**
 * Collect sample data files
 */
function collectSampleDataFiles(): Map<string, string> {
  const files = new Map<string, string>();
  
  const dataFiles = import.meta.glob('/product/sections/**/data.json', {
    query: '?raw',
    import: 'default',
    eager: true,
  }) as Record<string, string>;
  
  for (const [path, content] of Object.entries(dataFiles)) {
    const exportPath = path.replace('/product/sections/', 'sample-data/');
    files.set(exportPath, content);
  }
  
  const typeFiles = import.meta.glob('/product/sections/**/types.ts', {
    query: '?raw',
    import: 'default',
    eager: true,
  }) as Record<string, string>;
  
  for (const [path, content] of Object.entries(typeFiles)) {
    const exportPath = path.replace('/product/sections/', 'sample-data/');
    files.set(exportPath, content);
  }
  
  return files;
}
```

### 6.3 Create Seed File Generator

Continue in `src/lib/export-generator.ts`:

```typescript
/**
 * Generate Prisma seed file from sample data
 */
function generateSeedFile(sections: string[]): string {
  return `import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');
  
  // Clear existing data (optional - remove in production)
  // await prisma.$executeRaw\`TRUNCATE TABLE ... CASCADE\`;
  
${sections.map(section => `  // Seed ${section} data
  // const ${section.toLowerCase()}Data = await import('../sample-data/${section}/data.json');
  // await prisma.${section.toLowerCase()}.createMany({ data: ${section.toLowerCase()}Data.default });
  // console.log('✓ ${section} seeded');
`).join('\n')}
  
  console.log('✅ Database seeded successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
`;
}
```

### 6.4 Create Main Export Function

Continue in `src/lib/export-generator.ts`:

```typescript
/**
 * Generate export ZIP file
 */
export async function generateExport(
  options: ExportOptions = {},
  onProgress?: ProgressCallback
): Promise<Blob> {
  const zip = new JSZip();
  
  // Report progress
  const report = (stage: string, percentage: number) => {
    onProgress?.({ stage, percentage });
  };
  
  report('Validating project...', 5);
  
  // Validate before export
  const validation = validateExport();
  if (!validation.isValid) {
    throw new Error(
      `Cannot export: ${validation.errors.map(e => e.message).join(', ')}`
    );
  }
  
  report('Loading project data...', 10);
  
  // Load project data for templates
  const overview = loadProductOverview();
  const roadmap = loadProductRoadmap();
  const sections = loadAllSections();
  const designSystem = loadDesignSystem();
  
  const projectName = options.projectName || overview?.name || 'my-project';
  const projectDescription = overview?.tagline || 'A Vibe Architect project';
  const sectionNames = sections.map(s => s.name);
  
  const templateConfig: TemplateConfig = {
    projectName,
    projectDescription,
    sections: sectionNames,
    hasShell: true, // Check shell existence
    hasDesignTokens: !!designSystem.colors,
  };
  
  report('Generating config files...', 20);
  
  // 1. Add root config files
  zip.file('package.json', generatePackageJson(templateConfig));
  zip.file('tsconfig.json', generateTsConfig());
  zip.file('.env.example', generateEnvExample(templateConfig));
  zip.file('next.config.ts', generateNextConfig());
  zip.file('postcss.config.js', generatePostcssConfig());
  zip.file('src/app/globals.css', generateTailwindCss());
  zip.file('.cursorrules', generateCursorRules(templateConfig));
  zip.file('README.md', generateReadme(templateConfig));
  
  report('Generating instruction files...', 30);
  
  // 2. Add docs/prompts/
  zip.file('docs/prompts/kickoff.md', generateKickoffPrompt(templateConfig));
  
  // 3. Add docs/instructions/
  zip.file('docs/instructions/main.md', generateMainInstructions(templateConfig));
  zip.file('docs/instructions/phase_1_foundation.md', generatePhase1Instructions(templateConfig));
  zip.file('docs/instructions/phase_2_shell.md', generatePhase2Instructions(templateConfig));
  
  // Generate section-specific instructions
  sectionNames.forEach((section, index) => {
    const sectionInstructions = generateSectionInstructions({
      name: section,
      phaseNumber: index + 3,
      models: [], // Would extract from Prisma schema
      features: [], // Would extract from section spec
    });
    zip.file(`docs/instructions/phase_${index + 3}_${section.toLowerCase()}.md`, sectionInstructions);
  });
  
  report('Collecting source files...', 40);
  
  // 4. Collect all source files
  const allFiles = new Map<string, string>();
  
  // Collect and merge all file types
  const productFiles = collectProductFiles();
  const prismaFiles = collectPrismaFiles();
  const componentFiles = collectComponentFiles(options.includePreviewWrappers ?? false);
  const uiFiles = collectUIComponents();
  const libFiles = collectLibFiles();
  const designFiles = collectDesignSystemFiles();
  const sampleDataFiles = collectSampleDataFiles();
  
  for (const [path, content] of productFiles) allFiles.set(path, content);
  for (const [path, content] of prismaFiles) allFiles.set(path, content);
  for (const [path, content] of componentFiles) allFiles.set(path, content);
  for (const [path, content] of uiFiles) allFiles.set(path, content);
  for (const [path, content] of libFiles) allFiles.set(path, content);
  for (const [path, content] of designFiles) allFiles.set(path, content);
  for (const [path, content] of sampleDataFiles) allFiles.set(path, content);
  
  report('Transforming import paths...', 60);
  
  // 5. Transform import paths
  const transformedFiles = transformFiles(allFiles);
  
  report('Adding files to archive...', 70);
  
  // 6. Add all files to ZIP
  for (const [path, content] of transformedFiles) {
    zip.file(path, content);
  }
  
  // 7. Add seed file
  zip.file('prisma/seed.ts', generateSeedFile(sectionNames));
  
  report('Generating ZIP archive...', 90);
  
  // 8. Generate ZIP blob
  const blob = await zip.generateAsync({
    type: 'blob',
    compression: 'DEFLATE',
    compressionOptions: { level: 6 },
  });
  
  report('Export complete!', 100);
  
  return blob;
}

/**
 * Download export as ZIP file
 */
export async function downloadExport(
  options: ExportOptions = {},
  onProgress?: ProgressCallback
): Promise<void> {
  const blob = await generateExport(options, onProgress);
  
  const overview = loadProductOverview();
  const projectName = options.projectName || overview?.name || 'my-project';
  const filename = `${projectName.toLowerCase().replace(/\s+/g, '-')}.zip`;
  
  saveAs(blob, filename);
}
```

### 6.5 Export File Structure

The generated ZIP will have this structure:

```
[project-name]/
├── README.md
├── package.json
├── .env.example
├── .cursorrules
├── tsconfig.json
├── next.config.ts
├── postcss.config.js
│
├── docs/
│   ├── prompts/
│   │   └── kickoff.md
│   ├── instructions/
│   │   ├── main.md
│   │   ├── phase_1_foundation.md
│   │   ├── phase_2_shell.md
│   │   └── phase_3_[section].md
│   └── product/
│       ├── product-overview.md
│       └── product-roadmap.md
│
├── prisma/
│   ├── schema.prisma
│   └── seed.ts
│
├── src/
│   ├── components/
│   │   ├── ui/
│   │   │   └── *.tsx
│   │   ├── shell/
│   │   │   ├── AppShell.tsx
│   │   │   ├── MainNav.tsx
│   │   │   └── UserMenu.tsx
│   │   └── sections/
│   │       └── [section]/
│   │           └── *.tsx
│   └── lib/
│       ├── utils.ts
│       └── validators.ts
│
├── design-system/
│   ├── colors.json
│   └── typography.json
│
└── sample-data/
    └── [section]/
        ├── data.json
        └── types.ts
```

---

## Step 7: Create Export Preview Component

The export preview shows users exactly what will be exported before they download.

### 7.1 Create Export Preview Types

Create `src/components/export/types.ts`:

```typescript
export interface FileNode {
  name: string;
  path: string;
  type: 'file' | 'folder';
  children?: FileNode[];
  size?: number;
  content?: string;
}

export interface ExportPreviewProps {
  onFileSelect?: (file: FileNode) => void;
  selectedFile?: FileNode | null;
}
```

### 7.2 Create File Tree Component

Create `src/components/export/FileTree.tsx`:

```typescript
import { useState } from 'react';
import { ChevronRight, ChevronDown, Folder, FolderOpen, FileText, FileCode } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { FileNode } from './types';

interface FileTreeProps {
  nodes: FileNode[];
  onSelect?: (node: FileNode) => void;
  selectedPath?: string;
  level?: number;
}

export function FileTree({ nodes, onSelect, selectedPath, level = 0 }: FileTreeProps) {
  return (
    <div className="font-mono text-sm">
      {nodes.map((node) => (
        <FileTreeNode
          key={node.path}
          node={node}
          onSelect={onSelect}
          selectedPath={selectedPath}
          level={level}
        />
      ))}
    </div>
  );
}

interface FileTreeNodeProps {
  node: FileNode;
  onSelect?: (node: FileNode) => void;
  selectedPath?: string;
  level: number;
}

function FileTreeNode({ node, onSelect, selectedPath, level }: FileTreeNodeProps) {
  const [isExpanded, setIsExpanded] = useState(level < 2);
  const isSelected = selectedPath === node.path;
  
  const handleClick = () => {
    if (node.type === 'folder') {
      setIsExpanded(!isExpanded);
    } else {
      onSelect?.(node);
    }
  };
  
  const getIcon = () => {
    if (node.type === 'folder') {
      return isExpanded ? (
        <FolderOpen className="w-4 h-4 text-blue-500" />
      ) : (
        <Folder className="w-4 h-4 text-blue-500" />
      );
    }
    
    // File type icons
    if (node.name.endsWith('.tsx') || node.name.endsWith('.ts')) {
      return <FileCode className="w-4 h-4 text-blue-400" />;
    }
    if (node.name.endsWith('.json')) {
      return <FileCode className="w-4 h-4 text-yellow-500" />;
    }
    if (node.name.endsWith('.md')) {
      return <FileText className="w-4 h-4 text-gray-500" />;
    }
    return <FileText className="w-4 h-4 text-gray-400" />;
  };
  
  return (
    <div>
      <div
        className={cn(
          'flex items-center gap-1 py-1 px-2 rounded cursor-pointer hover:bg-zinc-100 dark:hover:bg-zinc-800',
          isSelected && 'bg-blue-50 dark:bg-blue-900/30'
        )}
        style={{ paddingLeft: `${level * 16 + 8}px` }}
        onClick={handleClick}
      >
        {node.type === 'folder' && (
          <span className="w-4 h-4 flex items-center justify-center">
            {isExpanded ? (
              <ChevronDown className="w-3 h-3" />
            ) : (
              <ChevronRight className="w-3 h-3" />
            )}
          </span>
        )}
        {node.type === 'file' && <span className="w-4" />}
        {getIcon()}
        <span className={cn(
          'ml-1',
          node.type === 'folder' && 'font-medium'
        )}>
          {node.name}
        </span>
        {node.size && (
          <span className="ml-auto text-xs text-zinc-400">
            {formatFileSize(node.size)}
          </span>
        )}
      </div>
      
      {node.type === 'folder' && isExpanded && node.children && (
        <FileTree
          nodes={node.children}
          onSelect={onSelect}
          selectedPath={selectedPath}
          level={level + 1}
        />
      )}
    </div>
  );
}

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}
```

### 7.3 Create File Preview Component

Create `src/components/export/FilePreview.tsx`:

```typescript
import { CodeBlock } from '@/components/shared/CodeBlock';
import type { FileNode } from './types';

interface FilePreviewProps {
  file: FileNode | null;
}

export function FilePreview({ file }: FilePreviewProps) {
  if (!file) {
    return (
      <div className="flex items-center justify-center h-full text-zinc-400">
        <p>Select a file to preview</p>
      </div>
    );
  }
  
  if (file.type === 'folder') {
    return (
      <div className="flex items-center justify-center h-full text-zinc-400">
        <p>Select a file to preview</p>
      </div>
    );
  }
  
  const getLanguage = (filename: string): string => {
    if (filename.endsWith('.tsx')) return 'tsx';
    if (filename.endsWith('.ts')) return 'typescript';
    if (filename.endsWith('.json')) return 'json';
    if (filename.endsWith('.md')) return 'markdown';
    if (filename.endsWith('.prisma')) return 'prisma';
    if (filename.endsWith('.css')) return 'css';
    return 'text';
  };
  
  return (
    <div className="h-full overflow-auto">
      <div className="sticky top-0 bg-zinc-100 dark:bg-zinc-800 px-4 py-2 border-b">
        <span className="font-mono text-sm">{file.path}</span>
      </div>
      <div className="p-4">
        <CodeBlock
          code={file.content || '// No content available'}
          language={getLanguage(file.name)}
        />
      </div>
    </div>
  );
}
```

### 7.4 Create Export Preview Component

Create `src/components/export/ExportPreview.tsx`:

```typescript
import { useState, useMemo } from 'react';
import { FileTree } from './FileTree';
import { FilePreview } from './FilePreview';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { FileNode, ExportPreviewProps } from './types';

// Build file tree from flat file map
function buildFileTree(files: Map<string, string>): FileNode[] {
  const root: Map<string, FileNode> = new Map();
  
  for (const [path, content] of files) {
    const parts = path.split('/');
    let currentLevel = root;
    let currentPath = '';
    
    parts.forEach((part, index) => {
      currentPath = currentPath ? `${currentPath}/${part}` : part;
      const isFile = index === parts.length - 1;
      
      if (!currentLevel.has(part)) {
        const node: FileNode = {
          name: part,
          path: currentPath,
          type: isFile ? 'file' : 'folder',
          children: isFile ? undefined : [],
          content: isFile ? content : undefined,
          size: isFile ? new Blob([content]).size : undefined,
        };
        currentLevel.set(part, node);
      }
      
      const node = currentLevel.get(part)!;
      if (!isFile && node.children) {
        // Convert children array to map for next level
        const childMap = new Map<string, FileNode>();
        node.children.forEach(child => childMap.set(child.name, child));
        currentLevel = childMap;
        // Update node.children from map
        node.children = Array.from(childMap.values());
      }
    });
  }
  
  // Convert root map to sorted array
  return Array.from(root.values()).sort((a, b) => {
    // Folders first, then alphabetically
    if (a.type !== b.type) return a.type === 'folder' ? -1 : 1;
    return a.name.localeCompare(b.name);
  });
}

interface ExportPreviewComponentProps extends ExportPreviewProps {
  files: Map<string, string>;
}

export function ExportPreview({ files, onFileSelect }: ExportPreviewComponentProps) {
  const [selectedFile, setSelectedFile] = useState<FileNode | null>(null);
  
  const fileTree = useMemo(() => buildFileTree(files), [files]);
  
  const stats = useMemo(() => {
    let totalSize = 0;
    let fileCount = 0;
    
    for (const content of files.values()) {
      totalSize += new Blob([content]).size;
      fileCount++;
    }
    
    return { totalSize, fileCount };
  }, [files]);
  
  const handleSelect = (node: FileNode) => {
    setSelectedFile(node);
    onFileSelect?.(node);
  };
  
  return (
    <Card className="h-full">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between">
          <span>Export Preview</span>
          <span className="text-sm font-normal text-zinc-500">
            {stats.fileCount} files • {formatFileSize(stats.totalSize)}
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="grid grid-cols-[300px_1fr] h-[500px] border-t">
          {/* File tree */}
          <div className="border-r overflow-auto">
            <FileTree
              nodes={fileTree}
              onSelect={handleSelect}
              selectedPath={selectedFile?.path}
            />
          </div>
          
          {/* File preview */}
          <div className="overflow-hidden">
            <FilePreview file={selectedFile} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}
```

---

## Step 8: Create Export Button Component

The export button handles the download process with progress indication and error handling.

### 8.1 Create Export Button Component

Create `src/components/export/ExportButton.tsx`:

```typescript
import { useState } from 'react';
import { Download, Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { downloadExport, type ExportProgress } from '@/lib/export-generator';
import { cn } from '@/lib/utils';

interface ExportButtonProps {
  disabled?: boolean;
  projectName?: string;
  className?: string;
}

type ExportState = 'idle' | 'exporting' | 'success' | 'error';

export function ExportButton({ disabled, projectName, className }: ExportButtonProps) {
  const [state, setState] = useState<ExportState>('idle');
  const [progress, setProgress] = useState<ExportProgress | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  const handleExport = async () => {
    setState('exporting');
    setError(null);
    
    try {
      await downloadExport(
        { projectName },
        (progress) => setProgress(progress)
      );
      
      setState('success');
      
      // Reset to idle after 3 seconds
      setTimeout(() => {
        setState('idle');
        setProgress(null);
      }, 3000);
    } catch (err) {
      setState('error');
      setError(err instanceof Error ? err.message : 'Export failed');
      
      // Reset to idle after 5 seconds
      setTimeout(() => {
        setState('idle');
        setError(null);
      }, 5000);
    }
  };
  
  const getButtonContent = () => {
    switch (state) {
      case 'exporting':
        return (
          <>
            <Loader2 className="w-4 h-4 animate-spin mr-2" />
            {progress?.stage || 'Exporting...'}
          </>
        );
      case 'success':
        return (
          <>
            <CheckCircle className="w-4 h-4 mr-2" />
            Download Complete!
          </>
        );
      case 'error':
        return (
          <>
            <AlertCircle className="w-4 h-4 mr-2" />
            Export Failed
          </>
        );
      default:
        return (
          <>
            <Download className="w-4 h-4 mr-2" />
            Export Project
          </>
        );
    }
  };
  
  const getButtonVariant = () => {
    switch (state) {
      case 'success':
        return 'default';
      case 'error':
        return 'destructive';
      default:
        return 'default';
    }
  };
  
  return (
    <div className="space-y-2">
      <Button
        variant={getButtonVariant()}
        size="lg"
        disabled={disabled || state === 'exporting'}
        onClick={handleExport}
        className={cn('w-full', className)}
      >
        {getButtonContent()}
      </Button>
      
      {/* Progress bar */}
      {state === 'exporting' && progress && (
        <div className="w-full bg-zinc-200 dark:bg-zinc-700 rounded-full h-2">
          <div
            className="bg-blue-500 h-2 rounded-full transition-all duration-300"
            style={{ width: `${progress.percentage}%` }}
          />
        </div>
      )}
      
      {/* Error message */}
      {state === 'error' && error && (
        <p className="text-sm text-red-500">{error}</p>
      )}
    </div>
  );
}
```

### 8.2 Create Validation Status Component

Create `src/components/export/ValidationStatus.tsx`:

```typescript
import { CheckCircle, AlertCircle, AlertTriangle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import type { ValidationResult, ValidationError, ValidationWarning } from '@/lib/export-validator';

interface ValidationStatusProps {
  result: ValidationResult;
}

export function ValidationStatus({ result }: ValidationStatusProps) {
  const { isValid, errors, warnings, summary } = result;
  
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between">
          <span>Export Readiness</span>
          <StatusBadge isValid={isValid} warningCount={warnings.length} />
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Progress indicator */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Completion</span>
            <span>{summary.completionPercentage}%</span>
          </div>
          <div className="w-full bg-zinc-200 dark:bg-zinc-700 rounded-full h-2">
            <div
              className={cn(
                'h-2 rounded-full transition-all',
                isValid ? 'bg-green-500' : 'bg-red-500'
              )}
              style={{ width: `${summary.completionPercentage}%` }}
            />
          </div>
        </div>
        
        {/* Errors */}
        {errors.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-red-600 dark:text-red-400 flex items-center gap-2">
              <AlertCircle className="w-4 h-4" />
              Errors ({errors.length})
            </h4>
            <ul className="space-y-1">
              {errors.map((error, index) => (
                <ValidationItem key={index} item={error} type="error" />
              ))}
            </ul>
          </div>
        )}
        
        {/* Warnings */}
        {warnings.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-yellow-600 dark:text-yellow-400 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4" />
              Warnings ({warnings.length})
            </h4>
            <ul className="space-y-1">
              {warnings.map((warning, index) => (
                <ValidationItem key={index} item={warning} type="warning" />
              ))}
            </ul>
          </div>
        )}
        
        {/* All good */}
        {isValid && warnings.length === 0 && (
          <div className="flex items-center gap-2 text-green-600 dark:text-green-400">
            <CheckCircle className="w-5 h-5" />
            <span>All checks passed! Ready to export.</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function StatusBadge({ isValid, warningCount }: { isValid: boolean; warningCount: number }) {
  if (!isValid) {
    return (
      <span className="px-2 py-1 text-xs rounded-full bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400">
        Not Ready
      </span>
    );
  }
  
  if (warningCount > 0) {
    return (
      <span className="px-2 py-1 text-xs rounded-full bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400">
        Ready (with warnings)
      </span>
    );
  }
  
  return (
    <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
      Ready
    </span>
  );
}

interface ValidationItemProps {
  item: ValidationError | ValidationWarning;
  type: 'error' | 'warning';
}

function ValidationItem({ item, type }: ValidationItemProps) {
  return (
    <li className={cn(
      'text-sm p-2 rounded',
      type === 'error' 
        ? 'bg-red-50 dark:bg-red-900/20' 
        : 'bg-yellow-50 dark:bg-yellow-900/20'
    )}>
      <div className="font-medium">{item.message}</div>
      {item.file && (
        <div className="text-xs text-zinc-500 font-mono mt-1">{item.file}</div>
      )}
      {item.suggestion && (
        <div className="text-xs text-zinc-600 dark:text-zinc-400 mt-1">
          💡 {item.suggestion}
        </div>
      )}
    </li>
  );
}
```

### 8.3 Create Export Components Index

Create `src/components/export/index.ts`:

```typescript
export * from './ExportButton';
export * from './ExportPreview';
export * from './ValidationStatus';
export * from './FileTree';
export * from './FilePreview';
export * from './types';
```

---

## Step 9: Assemble Export Page

Now we bring all the export components together into the complete Export page.

### 9.1 Update Export Page

Update `src/pages/ExportPage.tsx`:

```typescript
import { useState, useEffect, useMemo } from 'react';
import { Package, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ExportButton } from '@/components/export/ExportButton';
import { ExportPreview } from '@/components/export/ExportPreview';
import { ValidationStatus } from '@/components/export/ValidationStatus';
import { validateExport, type ValidationResult } from '@/lib/export-validator';
import { loadProductOverview } from '@/lib/product-loader';

export default function ExportPage() {
  const [validation, setValidation] = useState<ValidationResult | null>(null);
  const [isValidating, setIsValidating] = useState(true);
  const [previewFiles, setPreviewFiles] = useState<Map<string, string>>(new Map());
  
  // Get project name for export
  const overview = loadProductOverview();
  const projectName = overview?.name || 'my-project';
  
  // Run validation on mount and when refreshed
  const runValidation = () => {
    setIsValidating(true);
    // Small delay to show loading state
    setTimeout(() => {
      const result = validateExport();
      setValidation(result);
      setIsValidating(false);
    }, 500);
  };
  
  useEffect(() => {
    runValidation();
    loadPreviewFiles();
  }, []);
  
  // Load files for preview
  const loadPreviewFiles = () => {
    // This would collect all files that will be exported
    // For now, we'll show a subset
    const files = new Map<string, string>();
    
    // Add sample structure for preview
    // In real implementation, this would use the same collection
    // functions as the export generator
    
    setPreviewFiles(files);
  };
  
  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Package className="w-6 h-6" />
            Export Project
          </h1>
          <p className="text-zinc-500 mt-1">
            Generate a production-ready Next.js project scaffold
          </p>
        </div>
        
        <Button
          variant="outline"
          size="sm"
          onClick={runValidation}
          disabled={isValidating}
        >
          <RefreshCw className={`w-4 h-4 mr-2 ${isValidating ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>
      
      {/* Main content */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_350px] gap-6">
        {/* Left column - Preview */}
        <div className="space-y-6">
          <ExportPreview files={previewFiles} />
        </div>
        
        {/* Right column - Validation & Export */}
        <div className="space-y-6">
          {/* Validation status */}
          {validation && (
            <ValidationStatus result={validation} />
          )}
          
          {/* Loading state */}
          {isValidating && !validation && (
            <div className="p-8 text-center text-zinc-500">
              <RefreshCw className="w-8 h-8 mx-auto mb-4 animate-spin" />
              <p>Validating project...</p>
            </div>
          )}
          
          {/* Export button */}
          <ExportButton
            disabled={!validation?.isValid || isValidating}
            projectName={projectName}
          />
          
          {/* Export info */}
          <div className="text-sm text-zinc-500 space-y-2">
            <p><strong>What's included:</strong></p>
            <ul className="list-disc list-inside space-y-1 ml-2">
              <li>Pre-configured Next.js 15 project</li>
              <li>Prisma schema and seed file</li>
              <li>Clerk authentication setup</li>
              <li>UI components (shadcn/ui style)</li>
              <li>AI agent instructions</li>
              <li>Design tokens and sample data</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
```

### 9.2 Export Page Layout Structure

The Export page follows this layout:

```
┌─────────────────────────────────────────────────────────────┐
│  Export Project                              [Refresh]      │
│  Generate a production-ready Next.js project scaffold       │
├──────────────────────────────────────┬──────────────────────┤
│                                      │ Export Readiness     │
│  Export Preview                      │ ┌──────────────────┐ │
│  ┌────────────────────────────────┐  │ │ ✓ Product overview│ │
│  │ 📁 project-name/               │  │ │ ✓ Database schema │ │
│  │ ├── README.md                  │  │ │ ✓ 3 sections      │ │
│  │ ├── package.json               │  │ │ ⚠ No shell        │ │
│  │ ├── 📁 docs/                   │  │ └──────────────────┘ │
│  │ │   ├── 📁 prompts/            │  │                      │
│  │ │   └── 📁 instructions/       │  │ ┌──────────────────┐ │
│  │ ├── 📁 prisma/                 │  │ │ [Export Project] │ │
│  │ └── 📁 src/                    │  │ └──────────────────┘ │
│  └────────────────────────────────┘  │                      │
│                                      │ What's included:     │
│  [Selected file preview]             │ • Next.js 15 project │
│                                      │ • Prisma schema      │
│                                      │ • Clerk auth setup   │
│                                      │ • UI components      │
│                                      │ • AI instructions    │
└──────────────────────────────────────┴──────────────────────┘
```

---

## Step 10: Polish & Error Handling

This step adds loading states, error boundaries, toast notifications, and other UX improvements across the entire application.

### 10.1 Create Skeleton Component

Create `src/components/shared/Skeleton.tsx`:

```typescript
import { cn } from '@/lib/utils';

interface SkeletonProps {
  className?: string;
}

export function Skeleton({ className }: SkeletonProps) {
  return (
    <div
      className={cn(
        'animate-pulse rounded-md bg-zinc-200 dark:bg-zinc-700',
        className
      )}
    />
  );
}

// Pre-built skeleton patterns
export function SkeletonCard() {
  return (
    <div className="p-4 space-y-3 border rounded-lg">
      <Skeleton className="h-4 w-3/4" />
      <Skeleton className="h-4 w-1/2" />
      <div className="flex gap-2 pt-2">
        <Skeleton className="h-8 w-20" />
        <Skeleton className="h-8 w-20" />
      </div>
    </div>
  );
}

export function SkeletonTable() {
  return (
    <div className="space-y-2">
      <Skeleton className="h-10 w-full" />
      {[...Array(5)].map((_, i) => (
        <Skeleton key={i} className="h-12 w-full" />
      ))}
    </div>
  );
}

export function SkeletonDiagram() {
  return (
    <div className="flex items-center justify-center h-[400px] border rounded-lg">
      <div className="text-center space-y-4">
        <Skeleton className="h-32 w-32 mx-auto rounded-lg" />
        <Skeleton className="h-4 w-24 mx-auto" />
      </div>
    </div>
  );
}
```

### 10.2 Create Error Boundary Component

Create `src/components/shared/ErrorBoundary.tsx`:

```typescript
import { Component, type ReactNode } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  
  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }
  
  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }
  
  handleReset = () => {
    this.setState({ hasError: false, error: null });
  };
  
  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }
      
      return (
        <div className="flex flex-col items-center justify-center p-8 text-center">
          <AlertTriangle className="w-12 h-12 text-red-500 mb-4" />
          <h2 className="text-lg font-semibold mb-2">Something went wrong</h2>
          <p className="text-zinc-500 mb-4 max-w-md">
            {this.state.error?.message || 'An unexpected error occurred'}
          </p>
          <Button onClick={this.handleReset} variant="outline">
            <RefreshCw className="w-4 h-4 mr-2" />
            Try Again
          </Button>
        </div>
      );
    }
    
    return this.props.children;
  }
}
```

### 10.3 Create Toast Notification System

Create `src/components/shared/Toast.tsx`:

```typescript
import { useState, createContext, useContext, useCallback, type ReactNode } from 'react';
import { X, CheckCircle, AlertCircle, AlertTriangle, Info } from 'lucide-react';
import { cn } from '@/lib/utils';

type ToastType = 'success' | 'error' | 'warning' | 'info';

interface Toast {
  id: string;
  type: ToastType;
  title: string;
  description?: string;
}

interface ToastContextValue {
  toasts: Toast[];
  addToast: (toast: Omit<Toast, 'id'>) => void;
  removeToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  
  const addToast = useCallback((toast: Omit<Toast, 'id'>) => {
    const id = Math.random().toString(36).substring(7);
    setToasts((prev) => [...prev, { ...toast, id }]);
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 5000);
  }, []);
  
  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);
  
  return (
    <ToastContext.Provider value={{ toasts, addToast, removeToast }}>
      {children}
      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}

function ToastContainer({ toasts, onRemove }: { toasts: Toast[]; onRemove: (id: string) => void }) {
  return (
    <div className="fixed bottom-4 right-4 z-50 space-y-2">
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onRemove={onRemove} />
      ))}
    </div>
  );
}

function ToastItem({ toast, onRemove }: { toast: Toast; onRemove: (id: string) => void }) {
  const icons = {
    success: <CheckCircle className="w-5 h-5 text-green-500" />,
    error: <AlertCircle className="w-5 h-5 text-red-500" />,
    warning: <AlertTriangle className="w-5 h-5 text-yellow-500" />,
    info: <Info className="w-5 h-5 text-blue-500" />,
  };
  
  const backgrounds = {
    success: 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800',
    error: 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800',
    warning: 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800',
    info: 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800',
  };
  
  return (
    <div
      className={cn(
        'flex items-start gap-3 p-4 rounded-lg border shadow-lg max-w-sm animate-in slide-in-from-right',
        backgrounds[toast.type]
      )}
    >
      {icons[toast.type]}
      <div className="flex-1">
        <p className="font-medium">{toast.title}</p>
        {toast.description && (
          <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-1">
            {toast.description}
          </p>
        )}
      </div>
      <button
        onClick={() => onRemove(toast.id)}
        className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}
```

### 10.4 Create Keyboard Shortcuts Hook

Create `src/hooks/useKeyboardShortcuts.ts`:

```typescript
import { useEffect, useCallback } from 'react';

interface ShortcutConfig {
  key: string;
  ctrlKey?: boolean;
  metaKey?: boolean;
  shiftKey?: boolean;
  altKey?: boolean;
  callback: () => void;
  description?: string;
}

export function useKeyboardShortcuts(shortcuts: ShortcutConfig[]) {
  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      for (const shortcut of shortcuts) {
        const matchesKey = event.key.toLowerCase() === shortcut.key.toLowerCase();
        const matchesCtrl = shortcut.ctrlKey ? event.ctrlKey : !event.ctrlKey;
        const matchesMeta = shortcut.metaKey ? event.metaKey : !event.metaKey;
        const matchesShift = shortcut.shiftKey ? event.shiftKey : !event.shiftKey;
        const matchesAlt = shortcut.altKey ? event.altKey : !event.altKey;
        
        // Handle Cmd on Mac, Ctrl on Windows
        const matchesCmdOrCtrl = shortcut.ctrlKey 
          ? (event.ctrlKey || event.metaKey) 
          : true;
        
        if (matchesKey && matchesCmdOrCtrl && matchesShift && matchesAlt) {
          event.preventDefault();
          shortcut.callback();
          break;
        }
      }
    },
    [shortcuts]
  );
  
  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);
}

// App-wide keyboard shortcuts
export const APP_SHORTCUTS: ShortcutConfig[] = [
  {
    key: '1',
    ctrlKey: true,
    callback: () => window.location.href = '/',
    description: 'Go to Plan tab',
  },
  {
    key: '2',
    ctrlKey: true,
    callback: () => window.location.href = '/data',
    description: 'Go to Data tab',
  },
  {
    key: '3',
    ctrlKey: true,
    callback: () => window.location.href = '/designs',
    description: 'Go to Designs tab',
  },
  {
    key: '4',
    ctrlKey: true,
    callback: () => window.location.href = '/export',
    description: 'Go to Export tab',
  },
  {
    key: 'e',
    ctrlKey: true,
    shiftKey: true,
    callback: () => {
      // Trigger export (would need to be wired up)
      console.log('Export shortcut triggered');
    },
    description: 'Quick export',
  },
];
```

### 10.5 Add Global Styles for Animations

Add to `src/index.css`:

```css
/* Animation utilities */
@keyframes slide-in-from-right {
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

@keyframes fade-in {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes scale-in {
  from {
    transform: scale(0.95);
    opacity: 0;
  }
  to {
    transform: scale(1);
    opacity: 1;
  }
}

.animate-in {
  animation-duration: 200ms;
  animation-timing-function: ease-out;
  animation-fill-mode: forwards;
}

.slide-in-from-right {
  animation-name: slide-in-from-right;
}

.fade-in {
  animation-name: fade-in;
}

.scale-in {
  animation-name: scale-in;
}
```

### 10.6 Update App Layout with Providers

Update `src/main.tsx`:

```typescript
import React from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import { router } from './lib/router';
import { ToastProvider } from './components/shared/Toast';
import { ErrorBoundary } from './components/shared/ErrorBoundary';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ErrorBoundary>
      <ToastProvider>
        <RouterProvider router={router} />
      </ToastProvider>
    </ErrorBoundary>
  </React.StrictMode>
);
```

### 10.7 Create Shared Components Index

Create `src/components/shared/index.ts`:

```typescript
export * from './CodeBlock';
export * from './EmptyState';
export * from './ErrorBoundary';
export * from './MarkdownRenderer';
export * from './MermaidDiagram';
export * from './Skeleton';
export * from './Toast';
```

---

## Step 11: Documentation

Create comprehensive documentation for the Vibe Architect tool.

### 11.1 Create Main README

Create `README.md` in project root:

```markdown
# Vibe Architect

> The missing design process between your idea and your codebase

Vibe Architect is a local-first development environment that acts as a "Full-Stack Mock App" designer. Design your application's database, authentication, and UI components visually, then export a production-ready Next.js scaffold with AI agent instructions.

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

## 📋 Features

### Plan Tab
- Define product vision and features
- Create implementation roadmap
- Track section completion status

### Data Tab
- Design database schema with Prisma
- Visualize ERD diagrams with Mermaid.js
- Define Zod validation schemas

### Designs Tab
- Live preview React components
- Test responsive layouts
- View design tokens (colors, typography)

### Export Tab
- One-click export to ZIP
- Production-ready Next.js scaffold
- AI agent instructions included

## 🛠 Tech Stack

| Category | Technology |
|----------|------------|
| Build | Vite |
| UI | React 18 + TypeScript |
| Styling | Tailwind CSS v4 + shadcn/ui |
| Routing | React Router DOM |
| Icons | Lucide React |
| Diagrams | Mermaid.js |

## 📁 Project Structure

```
vibe-architect/
├── src/
│   ├── components/     # UI components
│   ├── lib/            # Utilities and loaders
│   ├── pages/          # Page components
│   ├── sections/       # User's screen designs
│   ├── shell/          # User's app shell
│   ├── templates/      # Export templates
│   └── types/          # TypeScript types
├── product/            # User's product definition
├── prisma/             # Database schema
└── lib/                # Validators
```

## 🎯 Workflow

1. **Plan** - Define what you're building
2. **Architect** - Design your data model
3. **Design** - Create UI components
4. **Export** - Generate production scaffold

## 📖 Documentation

- [Getting Started](./docs/getting-started.md)
- [AI Commands](./docs/commands.md)
- [Export Format](./docs/export-format.md)

## 📜 License

MIT
```

### 11.2 Create Getting Started Guide

Create `docs/getting-started.md`:

```markdown
# Getting Started with Vibe Architect

This guide walks you through creating your first project with Vibe Architect.

## Prerequisites

- Node.js 18 or later
- An AI coding agent (Cursor, Windsurf, Claude Code, etc.)

## Step 1: Start the Development Server

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173).

## Step 2: Create Product Vision

1. Open your AI agent
2. Run the `/product-vision` command
3. Describe your application idea
4. The agent will generate:
   - `product/product-overview.md`
   - `product/product-roadmap.md`

Check the **Plan** tab to see your product vision rendered.

## Step 3: Design Your Data Model

1. Run the `/architect-database` command
2. Describe your data entities and relationships
3. The agent will generate:
   - `prisma/schema.prisma`
   - `lib/validators.ts`

Check the **Data** tab to see the ERD diagram.

## Step 4: Design Your UI

1. Run `/design-shell` to create the app shell
2. Run `/design-screen [section]` for each feature
3. Components will appear in `src/sections/`

Check the **Designs** tab to preview your components.

## Step 5: Export Your Project

1. Go to the **Export** tab
2. Review the validation status
3. Click "Export Project"
4. Unzip and open in your editor

## Next Steps

- Read the [AI Commands](./commands.md) documentation
- Check out example projects in `docs/examples/`
- Customize the export templates in `src/templates/`
```

### 11.3 Create Commands Documentation

Create `docs/commands.md`:

```markdown
# AI Commands Reference

Vibe Architect uses AI prompt commands to generate project files. Run these commands in your AI coding agent (Cursor, Windsurf, etc.).

## Product Vision Commands

### `/product-vision`

Generate product overview and roadmap.

**Output:**
- `product/product-overview.md`
- `product/product-roadmap.md`

**Example prompt:**
```
/product-vision

Build a dental clinic management system. Features:
- Patient management
- Appointment scheduling
- Treatment records
- Billing and invoices

Target users: Dental clinic staff and administrators.
```

## Database Commands

### `/architect-database`

Generate Prisma schema and Zod validators.

**Output:**
- `prisma/schema.prisma`
- `lib/validators.ts`
- `product/data-model/data-model.md`

**Example prompt:**
```
/architect-database

Entities:
- Patient (name, email, phone, birthdate)
- Appointment (datetime, status, notes)
- Dentist (name, specialty)
- Treatment (name, price, duration)

Relationships:
- Patient has many Appointments
- Dentist has many Appointments
- Appointment has many Treatments
```

## Design Commands

### `/design-tokens`

Generate color palette and typography definitions.

**Output:**
- `product/design-system/colors.json`
- `product/design-system/typography.json`

### `/design-shell`

Generate app shell (navigation, sidebar, user menu).

**Output:**
- `src/shell/components/AppShell.tsx`
- `src/shell/components/MainNav.tsx`
- `src/shell/components/UserMenu.tsx`

### `/design-screen [section]`

Generate UI components for a specific feature section.

**Output:**
- `src/sections/[section]/components/*.tsx`
- `product/sections/[section]/spec.md`
- `product/sections/[section]/data.json`
- `product/sections/[section]/types.ts`

**Example:**
```
/design-screen patients

Create a patient management screen with:
- Patient list table with search and filters
- Patient detail card
- Add/Edit patient form
- Delete confirmation dialog
```

### `/sample-data [section]`

Generate sample data for a section.

**Output:**
- `product/sections/[section]/data.json`
- `product/sections/[section]/types.ts`

## Export Command

### `/export-project`

Generate the export package (same as clicking Export button).

**Output:**
- `product-plan.zip`
```

### 11.4 Create Export Format Documentation

Create `docs/export-format.md`:

```markdown
# Export Format Reference

This document describes the structure and contents of the exported project.

## Exported Stack

| Layer | Technology | Version |
|-------|------------|---------|
| Framework | Next.js (App Router) | 15.0.0 |
| Language | TypeScript | 5.6+ |
| Database | PostgreSQL + Prisma | 5.20+ |
| Auth | Clerk | 5.0+ |
| Validation | Zod | 3.23+ |
| Styling | Tailwind CSS | 4.0+ |

## Directory Structure

```
project-name/
├── README.md                    # Quick start guide
├── package.json                 # Dependencies (pre-configured)
├── .env.example                 # Environment template
├── .cursorrules                 # AI agent rules
│
├── docs/
│   ├── prompts/
│   │   └── kickoff.md           # Initial setup prompt
│   └── instructions/
│       ├── main.md              # Master guide
│       ├── phase_1_foundation.md
│       ├── phase_2_shell.md
│       └── phase_N_[section].md
│
├── prisma/
│   ├── schema.prisma            # Database schema
│   └── seed.ts                  # Sample data seeder
│
├── src/
│   ├── components/
│   │   ├── ui/                  # Base components
│   │   ├── shell/               # App shell
│   │   └── sections/            # Feature components
│   └── lib/
│       ├── utils.ts
│       └── validators.ts
│
├── design-system/
│   ├── colors.json
│   └── typography.json
│
└── sample-data/
    └── [section]/
        ├── data.json
        └── types.ts
```

## Using the Export

### 1. Extract and Open

```bash
unzip project-name.zip
cd project-name
code .
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment

```bash
cp .env.example .env
# Edit .env with your credentials
```

### 4. Set Up Database

```bash
npm run db:generate
npm run db:push
npm run db:seed
```

### 5. Start Development

```bash
npm run dev
```

### 6. Follow AI Instructions

Open `docs/prompts/kickoff.md` in your AI agent and follow the guided implementation.
```

---

## Verification Checklist

Before considering Phase 6 complete, verify all these items:

### Export Dependencies
- [ ] `jszip` is installed and working
- [ ] `file-saver` is installed and working
- [ ] Type definitions are properly loaded

### Export Templates
- [ ] `package.json` template generates valid JSON
- [ ] `tsconfig.json` template has correct paths
- [ ] `.env.example` includes all required variables
- [ ] `next.config.ts` is valid Next.js config
- [ ] `postcss.config.js` uses `@tailwindcss/postcss`
- [ ] `src/app/globals.css` includes Tailwind v4 imports and theme tokens
- [ ] `.cursorrules` includes project-specific guidance
- [ ] `README.md` has clear setup instructions

### Instruction Templates
- [ ] `kickoff.md` provides clear starting steps
- [ ] `main.md` has comprehensive architecture overview
- [ ] `phase_1_foundation.md` covers database and auth setup
- [ ] `phase_2_shell.md` covers app shell implementation
- [ ] Section templates generate correctly for each section

### Path Transformer
- [ ] Correctly transforms `@/` imports to relative paths
- [ ] Handles type imports properly
- [ ] Handles multi-line imports
- [ ] Handles re-exports

### Export Validator
- [ ] Detects missing product overview
- [ ] Detects missing Prisma schema
- [ ] Detects missing validators
- [ ] Detects components importing data directly
- [ ] Shows appropriate warnings for optional items
- [ ] Returns valid/invalid status correctly

### Export Generator
- [ ] Collects all product files
- [ ] Collects Prisma schema files
- [ ] Collects component files (excluding preview wrappers)
- [ ] Collects UI components
- [ ] Collects lib files
- [ ] Collects design system files
- [ ] Collects sample data files
- [ ] Transforms import paths correctly
- [ ] Generates valid ZIP file
- [ ] File names and paths are correct

### Export Preview Component
- [ ] File tree displays correctly
- [ ] Files can be selected
- [ ] Selected file content displays
- [ ] File sizes are calculated
- [ ] Folder expand/collapse works

### Export Button Component
- [ ] Shows progress during export
- [ ] Downloads ZIP file
- [ ] Shows success state
- [ ] Shows error state with message
- [ ] Disabled when validation fails

### Export Page
- [ ] Validation runs on page load
- [ ] Refresh button triggers re-validation
- [ ] Preview shows expected file structure
- [ ] Export button is enabled/disabled correctly
- [ ] Info section lists included items

### Polish Items
- [ ] Skeleton components display during loading
- [ ] Error boundary catches errors gracefully
- [ ] Toast notifications appear and auto-dismiss
- [ ] Keyboard shortcuts work (Ctrl+1-4)
- [ ] Animations are smooth

### Documentation
- [ ] Main README is complete and accurate
- [ ] Getting started guide walks through workflow
- [ ] Commands documentation covers all AI prompts
- [ ] Export format documentation matches actual output

---

## File Structure Summary

Files created or modified in Phase 6:

```
src/
├── lib/
│   ├── path-transformer.ts          # NEW - Import path transformation
│   ├── export-validator.ts          # NEW - Project validation
│   └── export-generator.ts          # NEW - ZIP generation
│
├── templates/
│   ├── types.ts                     # NEW - Template config types
│   ├── index.ts                     # NEW - Templates index
│   ├── package-json.template.ts     # NEW
│   ├── tsconfig.template.ts         # NEW
│   ├── env-example.template.ts      # NEW
│   ├── next-config.template.ts      # NEW
│   ├── tailwind-css.template.ts     # NEW
│   ├── postcss-config.template.ts   # NEW
│   ├── cursorrules.template.ts      # NEW
│   ├── readme.template.ts           # NEW
│   └── instructions/
│       ├── index.ts                 # NEW
│       ├── kickoff.template.ts      # NEW
│       ├── main.template.ts         # NEW
│       ├── phase-1-foundation.template.ts  # NEW
│       ├── phase-2-shell.template.ts       # NEW
│       └── section.template.ts      # NEW
│
├── components/
│   ├── export/
│   │   ├── index.ts                 # NEW - Export components index
│   │   ├── types.ts                 # NEW - Export types
│   │   ├── ExportButton.tsx         # NEW - Download button
│   │   ├── ExportPreview.tsx        # NEW - File tree preview
│   │   ├── ValidationStatus.tsx     # NEW - Validation display
│   │   ├── FileTree.tsx             # NEW - Directory tree
│   │   └── FilePreview.tsx          # NEW - File content preview
│   │
│   └── shared/
│       ├── index.ts                 # MODIFIED - Added new exports
│       ├── Skeleton.tsx             # NEW - Loading skeletons
│       ├── ErrorBoundary.tsx        # NEW - Error handling
│       └── Toast.tsx                # NEW - Notifications
│
├── hooks/
│   └── useKeyboardShortcuts.ts      # NEW - Keyboard shortcuts
│
├── pages/
│   └── ExportPage.tsx               # MODIFIED - Complete implementation
│
├── main.tsx                         # MODIFIED - Added providers
└── index.css                        # MODIFIED - Added animations

docs/
├── getting-started.md               # NEW
├── commands.md                      # NEW
└── export-format.md                 # NEW

README.md                            # NEW - Project documentation
```

---

## Phase 6 Complete! 🎉

At the end of Phase 6, you should have:

✅ **Working Export System**
- ZIP file generation with all project files
- Correctly structured Next.js scaffold
- Transformed import paths for portability

✅ **Comprehensive Validation**
- Pre-export validation checks
- Clear error and warning messages
- Props-only component enforcement

✅ **Production-Ready Templates**
- Golden stack configuration (Next.js 15, Tailwind v4, Prisma, Clerk)
- AI agent instruction files
- Complete setup documentation

✅ **Polished User Experience**
- Loading skeletons
- Error boundaries
- Toast notifications
- Keyboard shortcuts
- Smooth animations

✅ **Documentation**
- Main README
- Getting started guide
- AI commands reference
- Export format documentation

### Final Verification

```bash
# Start the dev server
npm run dev

# Navigate to http://localhost:5173/export
# 1. Verify validation shows correct status
# 2. Click Export Project
# 3. Unzip the downloaded file
# 4. Verify file structure matches documentation
# 5. Open in VS Code
# 6. Follow docs/prompts/kickoff.md instructions
```

---

*End of Phase 6 Implementation Plan*
