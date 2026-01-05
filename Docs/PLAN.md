# Vibe Architect - Implementation Plan

> **Total Estimated Time:** 4 weeks  
> **Approach:** Phase-by-phase implementation with working deliverables at each stage

---

## Overview

This plan breaks down the implementation into **6 phases**, each producing a working increment. Every phase ends with a testable milestone.

```
Phase 1: Project Setup & Core Infrastructure     [Days 1-2]
Phase 2: File Loaders & Data Layer               [Days 3-4]
Phase 3: Plan Tab                                [Days 5-6]
Phase 4: Data Tab (Schema Visualization)         [Days 7-9]
Phase 5: Designs Tab (Component Preview)         [Days 10-14]
Phase 6: Export Tab & Polish                     [Days 15-18]
```

---

# Phase 1: Project Setup & Core Infrastructure

**Goal:** Working Vite app with routing, layout, and base UI components.

**Duration:** 2 days

---

## 1.1 Initialize Vite Project

### Tasks

- [ ] Create Vite project with React + TypeScript template
- [ ] Configure `vite.config.ts` with path aliases (`@/`)
- [ ] Set up `tsconfig.json` with strict mode

### Commands

```bash
npm create vite@latest . -- --template react-ts
npm install
```

### Files to Create

```
├── vite.config.ts          # Path aliases, build config
├── tsconfig.json           # TypeScript config
├── tsconfig.node.json      # Node config for Vite
└── .gitignore
```

---

## 1.2 Install Dependencies

### Core Dependencies

```bash
npm install react-router-dom
npm install clsx tailwind-merge
npm install lucide-react
npm install @radix-ui/react-slot
npm install class-variance-authority
```

### Dev Dependencies

```bash
npm install -D tailwindcss@next @tailwindcss/vite
npm install -D @types/node
```

---

## 1.3 Configure Tailwind CSS v4

### Tasks

- [ ] Create `src/index.css` with Tailwind directives
- [ ] Add Tailwind Vite plugin to config
- [ ] Define CSS custom properties for theming

### Files to Create/Modify

```
├── vite.config.ts          # Add @tailwindcss/vite plugin
└── src/
    └── index.css           # Tailwind imports + theme tokens
```

### CSS Structure

```css
@import "tailwindcss";

@theme {
  --font-sans: "DM Sans", system-ui, sans-serif;
  --font-mono: "IBM Plex Mono", monospace;
  
  --color-background: hsl(0 0% 100%);
  --color-foreground: hsl(222.2 84% 4.9%);
  /* ... more tokens */
}
```

---

## 1.4 Set Up shadcn/ui Base Components

### Tasks

- [ ] Create `src/lib/utils.ts` with `cn()` helper
- [ ] Create base components directory structure
- [ ] Implement initial components: Button, Card

### Files to Create

```
src/
├── lib/
│   └── utils.ts                    # cn() helper function
└── components/
    └── ui/
        ├── button.tsx
        └── card.tsx
```

### `utils.ts` Implementation

```typescript
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
```

---

## 1.5 Set Up React Router

### Tasks

- [ ] Create router configuration with 4 main routes
- [ ] Create placeholder page components
- [ ] Set up route structure

### Files to Create

```
src/
├── lib/
│   └── router.tsx                  # Router configuration
└── pages/
    ├── PlanPage.tsx               # Tab 1
    ├── DataPage.tsx               # Tab 2
    ├── DesignsPage.tsx            # Tab 3
    └── ExportPage.tsx             # Tab 4
```

### Route Structure

| Path | Component | Tab |
|------|-----------|-----|
| `/` | `PlanPage` | Plan |
| `/data` | `DataPage` | Data |
| `/designs` | `DesignsPage` | Designs |
| `/export` | `ExportPage` | Export |

---

## 1.6 Create App Layout

### Tasks

- [ ] Create main layout wrapper with header and content area
- [ ] Create TabNav component with 4 tabs
- [ ] Create ThemeToggle component
- [ ] Add active state styling for tabs

### Files to Create

```
src/
└── components/
    └── layout/
        ├── AppLayout.tsx           # Main layout wrapper
        ├── TabNav.tsx              # 4-tab navigation
        └── ThemeToggle.tsx         # Light/dark toggle
```

### TabNav Structure

```typescript
const tabs = [
  { path: "/", label: "Plan", icon: FileText },
  { path: "/data", label: "Data", icon: Database },
  { path: "/designs", label: "Designs", icon: Palette },
  { path: "/export", label: "Export", icon: Download },
];
```

---

## 1.7 Create Entry Point

### Tasks

- [ ] Set up `main.tsx` with RouterProvider
- [ ] Create root App component
- [ ] Add font imports

### Files to Modify

```
├── index.html              # Add Google Fonts link
└── src/
    └── main.tsx            # Entry point with router
```

---

## Phase 1 Deliverable

✅ **Working Vite app with:**
- 4-tab navigation
- Routing between pages
- Tailwind CSS styling
- Light/dark theme toggle
- Base shadcn/ui components

### Verification

```bash
npm run dev
# Navigate to localhost:5173
# Click through all 4 tabs
# Toggle theme
```

---

# Phase 2: File Loaders & Data Layer

**Goal:** Load and parse product files (markdown, JSON, Prisma schema).

**Duration:** 2 days

---

## 2.1 Create Sample Product Files

### Tasks

- [ ] Create `product/` directory structure
- [ ] Add sample `product-overview.md`
- [ ] Add sample `product-roadmap.md`
- [ ] Add sample `prisma/schema.prisma`
- [ ] Add sample `lib/validators.ts`

### Files to Create

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
    └── patients/
        ├── spec.md
        ├── data.json
        └── types.ts

prisma/
└── schema.prisma

lib/
└── validators.ts
```

---

## 2.2 Create Type Definitions

### Tasks

- [ ] Define `ProductData` interface
- [ ] Define `PrismaSchema` interface
- [ ] Define `Section` interface
- [ ] Define `DesignSystem` interface

### Files to Create

```
src/
└── types/
    ├── product.ts          # ProductOverview, ProductRoadmap
    ├── schema.ts           # PrismaModel, PrismaField, PrismaRelation
    └── section.ts          # SectionData, SectionSpec
```

### Key Types

```typescript
// product.ts
interface ProductOverview {
  name: string;
  tagline: string;
  problem: string;
  targetUsers: string[];
  features: Feature[];
}

interface ProductRoadmap {
  sections: RoadmapSection[];
}

// schema.ts
interface PrismaModel {
  name: string;
  fields: PrismaField[];
  relations: PrismaRelation[];
}

interface PrismaField {
  name: string;
  type: string;
  isOptional: boolean;
  isUnique: boolean;
  isPrimaryKey: boolean;
  isForeignKey: boolean;
  default?: string;
}
```

---

## 2.3 Create Product Loader

### Tasks

- [ ] Use `import.meta.glob` to load markdown files
- [ ] Parse markdown front matter (if any)
- [ ] Extract structured data from markdown

### Files to Create

```
src/
└── lib/
    └── product-loader.ts
```

### Implementation Pattern

```typescript
const productFiles = import.meta.glob('/product/*.md', {
  query: '?raw',
  import: 'default',
  eager: true,
}) as Record<string, string>;

export function loadProductOverview(): ProductOverview | null {
  const content = productFiles['/product/product-overview.md'];
  if (!content) return null;
  return parseProductOverview(content);
}
```

---

## 2.4 Create Schema Loader (Prisma Parser)

### Tasks

- [ ] Parse `schema.prisma` file content
- [ ] Extract models, fields, and relationships
- [ ] Handle all Prisma field types
- [ ] Detect primary keys and foreign keys

### Files to Create

```
src/
└── lib/
    └── schema-loader.ts
```

### Parser Logic

1. Split file by `model` keyword
2. Extract model name
3. Parse each line for field definitions
4. Detect `@id`, `@unique`, `@relation` attributes
5. Build relationships from `@relation` fields

---

## 2.5 Create Section Loader

### Tasks

- [ ] Load all sections from `product/sections/*/`
- [ ] Load section specs (`spec.md`)
- [ ] Load section data (`data.json`)
- [ ] Load section types (`types.ts`)

### Files to Create

```
src/
└── lib/
    └── section-loader.ts
```

### Pattern

```typescript
const sectionSpecs = import.meta.glob('/product/sections/*/spec.md', {
  query: '?raw',
  import: 'default',
  eager: true,
});

const sectionData = import.meta.glob('/product/sections/*/data.json', {
  import: 'default',
  eager: true,
});
```

---

## 2.6 Create Design System Loader

### Tasks

- [ ] Load `colors.json`
- [ ] Load `typography.json`
- [ ] Provide fallback defaults

### Files to Create

```
src/
└── lib/
    └── design-system-loader.ts
```

---

## 2.7 Create Shell Loader

### Tasks

- [ ] Load shell spec from `product/shell/spec.md`
- [ ] Load shell components from `src/shell/`

### Files to Create

```
src/
└── lib/
    └── shell-loader.ts
```

---

## Phase 2 Deliverable

✅ **Working file loaders with:**
- Product overview parsing
- Product roadmap parsing
- Prisma schema parsing (models, fields, relations)
- Section data loading
- Design system loading
- Sample data files for testing

### Verification

```typescript
// In browser console or test file
import { loadProductOverview } from './lib/product-loader';
import { loadPrismaSchema } from './lib/schema-loader';

console.log(loadProductOverview());
console.log(loadPrismaSchema());
```

---

# Phase 3: Plan Tab

**Goal:** Fully functional Plan tab displaying product overview and roadmap.

**Duration:** 2 days

---

## 3.1 Create Markdown Renderer Component

### Tasks

- [ ] Install markdown parser (or use simple regex-based parsing)
- [ ] Create `MarkdownRenderer` component
- [ ] Support headings, lists, paragraphs, code blocks
- [ ] Style with Tailwind typography

### Dependencies

```bash
npm install react-markdown
npm install remark-gfm
```

### Files to Create

```
src/
└── components/
    └── shared/
        └── MarkdownRenderer.tsx
```

---

## 3.2 Create Overview Card Component

### Tasks

- [ ] Display product name and tagline
- [ ] Show problem statement
- [ ] List target users
- [ ] Show key features with icons

### Files to Create

```
src/
└── components/
    └── plan/
        └── OverviewCard.tsx
```

---

## 3.3 Create Features List Component

### Tasks

- [ ] Display features as cards/list
- [ ] Show feature name and description
- [ ] Optional: priority/status indicators

### Files to Create

```
src/
└── components/
    └── plan/
        └── FeaturesList.tsx
```

---

## 3.4 Create Roadmap Timeline Component

### Tasks

- [ ] Display sections/milestones in a timeline
- [ ] Show section name and description
- [ ] Indicate completion status (based on file existence)
- [ ] Link sections to Designs tab

### Files to Create

```
src/
└── components/
    └── plan/
        └── RoadmapTimeline.tsx
```

### Completion Logic

```typescript
function getSectionStatus(sectionId: string): 'complete' | 'in-progress' | 'pending' {
  const hasSpec = sectionExists(`/product/sections/${sectionId}/spec.md`);
  const hasComponents = sectionExists(`/src/sections/${sectionId}/`);
  
  if (hasComponents) return 'complete';
  if (hasSpec) return 'in-progress';
  return 'pending';
}
```

---

## 3.5 Create Empty State Component

### Tasks

- [ ] Show when no product files exist
- [ ] Display prompt command to run
- [ ] Copy-to-clipboard functionality

### Files to Create

```
src/
└── components/
    └── shared/
        └── EmptyState.tsx
```

### Empty State Content

```tsx
<EmptyState
  icon={FileText}
  title="No product overview yet"
  description="Run the product vision command to get started"
  command="/product-vision"
/>
```

---

## 3.6 Assemble Plan Page

### Tasks

- [ ] Combine all components into PlanPage
- [ ] Add loading states
- [ ] Handle empty/error states
- [ ] Add responsive layout

### Files to Modify

```
src/
└── pages/
    └── PlanPage.tsx
```

### Layout Structure

```
┌─────────────────────────────────────┐
│  Product Overview Card              │
│  ┌─────────────────────────────────┐│
│  │ Name, Tagline, Problem          ││
│  └─────────────────────────────────┘│
├─────────────────────────────────────┤
│  Key Features                       │
│  ┌──────┐ ┌──────┐ ┌──────┐        │
│  │ F1   │ │ F2   │ │ F3   │        │
│  └──────┘ └──────┘ └──────┘        │
├─────────────────────────────────────┤
│  Roadmap Timeline                   │
│  ○──●──○──○──○                      │
│  S1  S2  S3  S4  S5                │
└─────────────────────────────────────┘
```

---

## Phase 3 Deliverable

✅ **Working Plan tab with:**
- Product overview display
- Features list
- Roadmap timeline with status
- Empty states when no data
- Markdown rendering

### Verification

1. Add sample `product-overview.md` → See it rendered
2. Add sample `product-roadmap.md` → See timeline
3. Delete files → See empty states

---

# Phase 4: Data Tab (Schema Visualization)

**Goal:** Visualize Prisma schema as Mermaid ERD diagram.

**Duration:** 3 days

---

## 4.1 Install Mermaid.js

### Dependencies

```bash
npm install mermaid
```

---

## 4.2 Create Mermaid Diagram Component

### Tasks

- [ ] Create wrapper component for Mermaid
- [ ] Handle rendering and re-rendering
- [ ] Support dark/light theme
- [ ] Add zoom/pan controls (optional)

### Files to Create

```
src/
└── components/
    └── shared/
        └── MermaidDiagram.tsx
```

### Implementation

```typescript
import mermaid from 'mermaid';

export function MermaidDiagram({ chart }: { chart: string }) {
  const ref = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    mermaid.initialize({ theme: 'default' });
    mermaid.run({ nodes: [ref.current!] });
  }, [chart]);
  
  return <div ref={ref}>{chart}</div>;
}
```

---

## 4.3 Create Prisma-to-Mermaid Generator

### Tasks

- [ ] Convert PrismaModel[] to Mermaid ERD syntax
- [ ] Handle all field types
- [ ] Generate relationship lines
- [ ] Mark PK/FK fields

### Files to Create

```
src/
└── lib/
    └── mermaid-generator.ts
```

### Output Format

```
erDiagram
    Patient {
        String id PK
        String firstName
        String lastName
        String email
        DateTime createdAt
    }
    Appointment {
        String id PK
        DateTime dateTime
        String patientId FK
    }
    Patient ||--o{ Appointment : "has"
```

### Relationship Mapping

| Prisma | Mermaid |
|--------|---------|
| One-to-One | `\|\|--\|\|` |
| One-to-Many | `\|\|--o{` |
| Many-to-Many | `}o--o{` |

---

## 4.4 Create Schema Viewer Component

### Tasks

- [ ] Display model list sidebar
- [ ] Show model details on selection
- [ ] Highlight fields by type (PK, FK, required, optional)

### Files to Create

```
src/
└── components/
    └── data/
        ├── SchemaViewer.tsx
        └── ModelCard.tsx
```

---

## 4.5 Create Validator Viewer Component

### Tasks

- [ ] Display Zod schemas with syntax highlighting
- [ ] Load from `lib/validators.ts`
- [ ] Show per-model schemas

### Files to Create

```
src/
└── components/
    └── data/
        └── ValidatorViewer.tsx
```

---

## 4.6 Create Code Display Component

### Tasks

- [ ] Syntax highlighting for TypeScript/Prisma
- [ ] Copy-to-clipboard button
- [ ] Line numbers (optional)

### Dependencies

```bash
npm install prism-react-renderer
```

### Files to Create

```
src/
└── components/
    └── shared/
        └── CodeBlock.tsx
```

---

## 4.7 Assemble Data Page

### Tasks

- [ ] Layout with ERD diagram (main) and sidebar (model list)
- [ ] Tabs for Schema vs Validators
- [ ] Handle empty state
- [ ] Responsive design

### Files to Modify

```
src/
└── pages/
    └── DataPage.tsx
```

### Layout Structure

```
┌────────────────────────────────────────────┐
│  [Schema] [Validators]                     │
├────────────────────────────────────────────┤
│                        │ Models            │
│                        │ ┌──────────────┐  │
│   ┌───────────────┐    │ │ Patient      │  │
│   │   ERD         │    │ │ Appointment  │  │
│   │   Diagram     │    │ │ Dentist      │  │
│   │               │    │ └──────────────┘  │
│   └───────────────┘    │                   │
│                        │ Selected Model:   │
│                        │ ┌──────────────┐  │
│                        │ │ Field list   │  │
│                        │ └──────────────┘  │
└────────────────────────────────────────────┘
```

---

## Phase 4 Deliverable

✅ **Working Data tab with:**
- Mermaid ERD diagram from Prisma schema
- Model list sidebar
- Model detail view
- Zod schema viewer
- Syntax highlighting
- Empty states

### Verification

1. Add `prisma/schema.prisma` → See ERD diagram
2. Add `lib/validators.ts` → See Zod schemas
3. Click model → See field details

---

# Phase 5: Designs Tab (Component Preview)

**Goal:** Live preview of React components in isolated iframe.

**Duration:** 5 days

---

## 5.1 Create Section Component Structure

### Tasks

- [ ] Set up `src/sections/` directory
- [ ] Create sample section with components
- [ ] Create preview wrapper pattern

### Files to Create

```
src/
└── sections/
    └── patients/
        ├── components/
        │   ├── PatientTable.tsx
        │   ├── PatientCard.tsx
        │   └── index.ts
        └── PatientList.tsx         # Preview wrapper
```

---

## 5.2 Create Shell Component Structure

### Tasks

- [ ] Set up `src/shell/` directory
- [ ] Create AppShell component
- [ ] Create MainNav component
- [ ] Create UserMenu component
- [ ] Create ShellPreview wrapper

### Files to Create

```
src/
└── shell/
    ├── components/
    │   ├── AppShell.tsx
    │   ├── MainNav.tsx
    │   ├── UserMenu.tsx
    │   └── index.ts
    └── ShellPreview.tsx
```

---

## 5.3 Create Fullscreen Preview Routes

### Tasks

- [ ] Add routes for iframe preview targets
- [ ] `/preview/shell` - Shell preview
- [ ] `/preview/sections/:sectionId/:screenName` - Section preview
- [ ] Wrap in shell if available

### Files to Modify

```
src/
└── lib/
    └── router.tsx                  # Add preview routes
```

### New Routes

| Path | Purpose |
|------|---------|
| `/preview/shell` | Shell-only preview |
| `/preview/sections/:id/:screen` | Section screen preview |

---

## 5.4 Create Iframe Preview Component

### Tasks

- [ ] Create resizable iframe container
- [ ] Sync theme with parent
- [ ] Add device size presets
- [ ] Add refresh button

### Files to Create

```
src/
└── components/
    └── designs/
        └── IframePreview.tsx
```

### Implementation

```tsx
<iframe
  src={`/preview/sections/${sectionId}/${screenName}`}
  className="w-full h-full border-0 bg-white dark:bg-zinc-900"
  title={`${screenName} Preview`}
/>
```

---

## 5.5 Create Device Size Toggle

### Tasks

- [ ] Desktop (100%)
- [ ] Tablet (768px)
- [ ] Mobile (375px)
- [ ] Custom size input

### Files to Create

```
src/
└── components/
    └── designs/
        └── DeviceSizeToggle.tsx
```

---

## 5.6 Create Section Navigator

### Tasks

- [ ] List all sections from `product/sections/`
- [ ] List screens within each section
- [ ] Show completion status
- [ ] Link to preview

### Files to Create

```
src/
└── components/
    └── designs/
        ├── SectionNav.tsx
        └── ScreenList.tsx
```

---

## 5.7 Create Component Tree

### Tasks

- [ ] Show component hierarchy
- [ ] Display props for each component
- [ ] Show sample data structure

### Files to Create

```
src/
└── components/
    └── designs/
        └── ComponentTree.tsx
```

---

## 5.8 Create Design Tokens Viewer

### Tasks

- [ ] Display color palette from `colors.json`
- [ ] Display typography from `typography.json`
- [ ] Color swatches with copy-to-clipboard

### Files to Create

```
src/
└── components/
    └── designs/
        └── DesignTokensViewer.tsx
```

---

## 5.9 Assemble Designs Page

### Tasks

- [ ] Three-column layout: Nav | Preview | Inspector
- [ ] Sub-tabs: Shell | Sections | Tokens
- [ ] Responsive collapse behavior

### Files to Modify

```
src/
└── pages/
    └── DesignsPage.tsx
```

### Layout Structure

```
┌─────────────────────────────────────────────────────┐
│  [Shell] [Sections] [Tokens]                        │
├──────────┬──────────────────────────┬───────────────┤
│ Sections │                          │ Component     │
│ ├ patients│    ┌────────────────┐   │ Tree          │
│ │  └ List  │    │                │   │               │
│ │  └ Detail│    │    Preview     │   │ Props:        │
│ ├ appts    │    │    (iframe)    │   │ - patients[]  │
│          │    │                │   │ - onView()    │
│          │    └────────────────┘   │               │
│          │    [Mobile][Tablet][Desktop]             │
└──────────┴──────────────────────────┴───────────────┘
```

---

## 5.10 Enforce Props-Only Components

### Tasks

- [ ] Add lint rule or custom ESLint plugin to block data imports inside exportable components
- [ ] Add build-time check that exported components accept props and do not import `data.json` or section fixtures directly
- [ ] Surface violations in Designs tab inspector (flag components pulling local data)

### Files to Create/Modify

```
src/
├── lint/
│   └── no-data-import.ts          # Custom rule
└── lib/
    └── export-validator.ts        # Hook props-only check into validation
```

---

## Phase 5 Deliverable

✅ **Working Designs tab with:**
- Section navigation
- Iframe-based component preview
- Device size toggles
- Shell preview
- Design tokens viewer
- Component tree inspector

### Verification

1. Add section components → See in preview
2. Toggle device sizes → Responsive preview
3. View design tokens → See color/typography

---

# Phase 6: Export Tab & Polish

**Goal:** Generate complete export ZIP and polish the entire application.

**Duration:** 4 days

---

## 6.1 Install JSZip

### Dependencies

```bash
npm install jszip
npm install file-saver
npm install @types/file-saver -D
```

---

## 6.2 Create Export Template Files

### Tasks

- [ ] Create template `package.json`
- [ ] Create template `tsconfig.json`
- [ ] Create template `.env.example`
- [ ] Create template `.cursorrules`
- [ ] Create template `next.config.ts`
- [ ] Create template `tailwind.config.ts`
- [ ] Pin golden stack: Next.js 15 App Router, TypeScript, Tailwind v4, Prisma, PostgreSQL, Clerk
- [ ] Include Clerk keys in `.env.example` (`CLERK_SECRET_KEY`, `CLERK_PUBLISHABLE_KEY`) and a Postgres `DATABASE_URL` placeholder
- [ ] Add Clerk provider wiring placeholder in App Router layout template notes

### Files to Create

```
src/
└── templates/
    ├── package.json.template
    ├── tsconfig.json.template
    ├── env.example.template
    ├── cursorrules.template
    ├── next.config.template
    └── tailwind.config.template
```

---

## 6.3 Create Instruction Templates

### Tasks

- [ ] Create `kickoff.md` template
- [ ] Create `main.md` template
- [ ] Create `phase_1_foundation.md` template
- [ ] Create `phase_2_shell.md` template
- [ ] Create section instruction generator
- [ ] Include auth setup steps (Clerk keys, middleware, protected routes) in foundation template
- [ ] Ensure prompts reference design tokens and data model completion before shell/screens

### Files to Create

```
src/
└── templates/
    └── instructions/
        ├── kickoff.md.template
        ├── main.md.template
        ├── phase_1_foundation.md.template
        ├── phase_2_shell.md.template
        └── phase_section.md.template
```

---

## 6.4 Create Export Generator

### Tasks

- [ ] Collect all product files
- [ ] Transform import paths (@ → relative)
- [ ] Generate instruction files from templates
- [ ] Assemble ZIP structure
- [ ] Generate `README.md`

### Files to Create

```
src/
└── lib/
    └── export-generator.ts
```

### Export Process

```typescript
export async function generateExport(): Promise<Blob> {
  const zip = new JSZip();
  
  // 1. Add root config files
  zip.file('package.json', generatePackageJson());
  zip.file('.env.example', generateEnvExample());
  // ...
  
  // 2. Add docs/prompts/
  zip.file('docs/prompts/kickoff.md', generateKickoff());
  
  // 3. Add docs/instructions/
  zip.file('docs/instructions/main.md', generateMain());
  // ...
  
  // 4. Add prisma/
  zip.file('prisma/schema.prisma', getPrismaSchema());
  zip.file('prisma/seed.ts', generateSeedFile());
  
  // 5. Add components/
  addComponents(zip);
  
  // 6. Generate ZIP blob
  return zip.generateAsync({ type: 'blob' });
}
```

---

## 6.5 Create Path Transformer

### Tasks

- [ ] Convert `@/` imports to relative paths
- [ ] Handle component re-exports
- [ ] Preserve type imports

### Files to Create

```
src/
└── lib/
    └── path-transformer.ts
```

---

## 6.6 Create Export Preview Component

### Tasks

- [ ] Show file tree of export contents
- [ ] Allow file preview before export
- [ ] Show file count and size estimate

### Files to Create

```
src/
└── components/
    └── export/
        └── ExportPreview.tsx
```

---

## 6.7 Create Export Validation

### Tasks

- [ ] Check required files exist
- [ ] Validate schema syntax
- [ ] Check component completeness
- [ ] Show warnings/errors
- [ ] Validate prompts/instructions coverage (kickoff, main, per-section)
- [ ] Validate design tokens presence (`colors.json`, `typography.json`)
- [ ] Validate auth readiness (Clerk keys present, auth wiring template included)
- [ ] Enforce props-only components (no local data imports in exportable code)
- [ ] Validate stack pinning (Next.js 15 App Router, Tailwind v4, Prisma/Postgres versions)

### Files to Create

```
src/
└── lib/
    └── export-validator.ts
```

### Validation Checks

```typescript
interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

function validateExport(): ValidationResult {
  const errors = [];
  const warnings = [];
  
  if (!hasProductOverview()) {
    errors.push('Missing product-overview.md');
  }
  if (!hasPrismaSchema()) {
    errors.push('Missing schema.prisma');
  }
    if (!hasDesignTokens()) {
        warnings.push('Missing design tokens (colors.json, typography.json)');
    }
    if (!hasClerkEnv()) {
        errors.push('Missing Clerk keys in .env.example');
    }
    if (!hasPromptsAndInstructions()) {
        warnings.push('Missing prompts/instructions templates');
    }
    if (hasDataImportingComponents()) {
        errors.push('Some exportable components import local data instead of using props');
    }
    if (!isGoldenStackPinned()) {
        warnings.push('Golden stack versions are not pinned to Next.js 15 / Tailwind v4 / Prisma');
    }
  if (!hasSections()) {
    warnings.push('No sections defined');
  }
  
  return { isValid: errors.length === 0, errors, warnings };
}
```

---

## 6.8 Create Export Button Component

### Tasks

- [ ] Trigger export generation
- [ ] Show progress indicator
- [ ] Download ZIP file
- [ ] Show success message

### Files to Create

```
src/
└── components/
    └── export/
        └── ExportButton.tsx
```

---

## 6.9 Assemble Export Page

### Tasks

- [ ] Show validation status
- [ ] Show export preview
- [ ] Export button with confirmation
- [ ] Success/error states

### Files to Modify

```
src/
└── pages/
    └── ExportPage.tsx
```

### Layout Structure

```
┌─────────────────────────────────────────┐
│  Export Project                         │
├─────────────────────────────────────────┤
│  Validation Status                      │
│  ✓ Product overview                     │
│  ✓ Database schema                      │
│  ✓ 3 sections defined                   │
│  ⚠ No shell components                  │
├─────────────────────────────────────────┤
│  Preview                                │
│  📁 product-plan/                       │
│  ├── 📄 README.md                       │
│  ├── 📄 package.json                    │
│  ├── 📁 docs/                           │
│  │   ├── 📁 prompts/                    │
│  │   └── 📁 instructions/               │
│  └── ...                                │
├─────────────────────────────────────────┤
│  [Export Project]                       │
└─────────────────────────────────────────┘
```

---

## 6.10 Polish & Error Handling

### Tasks

- [ ] Add loading skeletons
- [ ] Add error boundaries
- [ ] Add toast notifications
- [ ] Improve responsive design
- [ ] Add keyboard shortcuts
- [ ] Performance optimization

### Files to Create/Modify

```
src/
├── components/
│   └── shared/
│       ├── Skeleton.tsx
│       ├── ErrorBoundary.tsx
│       └── Toast.tsx
└── hooks/
    └── useKeyboardShortcuts.ts
```

---

## 6.11 Documentation

### Tasks

- [ ] Write README.md for the tool
- [ ] Document AI prompt commands
- [ ] Create sample project

### Files to Create

```
├── README.md
└── docs/
    ├── getting-started.md
    ├── commands.md
    └── examples/
        └── dentist-crm/
```

---

## Phase 6 Deliverable

✅ **Complete application with:**
- Working export to ZIP
- Instruction file generation
- Export validation
- Path transformation
- Error handling
- Documentation

### Verification

1. Complete a sample project
2. Click Export → Download ZIP
3. Unzip → Verify file structure
4. Open in VS Code → Run AI prompts

---

# Summary

| Phase | Duration | Key Deliverable |
|-------|----------|-----------------|
| 1 | 2 days | Working Vite app with routing and layout |
| 2 | 2 days | File loaders for all product artifacts |
| 3 | 2 days | Plan tab with overview and roadmap |
| 4 | 3 days | Data tab with Mermaid ERD diagram |
| 5 | 5 days | Designs tab with iframe previews |
| 6 | 4 days | Export tab and polish |
| **Total** | **18 days** | **Complete Vibe Architect** |

---

# Next Steps

1. **Start Phase 1** — Run `npm create vite@latest`
2. **Track progress** — Check off tasks as completed
3. **Test each phase** — Verify deliverables before moving on
4. **Iterate** — Adjust plan based on learnings

---

*End of Implementation Plan*
