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
      target: "ES2017",
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

### 2.7 Create Tailwind Config Template

Create `src/templates/tailwind-config.template.ts`:

```typescript
export function generateTailwindConfig(): string {
  return `import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "monospace"],
      },
    },
  },
  plugins: [],
};

export default config;
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
export * from './tailwind-config.template';
export * from './postcss-config.template';
export * from './cursorrules.template';
export * from './readme.template';
```

---
