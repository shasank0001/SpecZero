# Export Format Reference

This document describes the structure and contents of the exported project.

## Exported Stack (The Golden Stack)

| Layer | Technology | Version |
|-------|------------|---------|
| Framework | Next.js (App Router) | 15.0.0 |
| Language | TypeScript | 5.6+ |
| Database | PostgreSQL + Prisma | 5.20+ |
| Auth | Clerk | 5.0+ |
| Validation | Zod | 3.23+ |
| Styling | Tailwind CSS v4 | 4.0+ |

## Directory Structure

```
project-name/
├── README.md                    # Quick start guide
├── package.json                 # Dependencies (pre-configured)
├── .env.example                 # Environment template
├── .cursorrules                 # AI agent rules
├── tsconfig.json                # TypeScript configuration
├── next.config.ts               # Next.js configuration
├── postcss.config.js            # PostCSS with Tailwind v4
│
├── docs/
│   ├── prompts/
│   │   └── kickoff.md           # Initial setup prompt
│   ├── instructions/
│   │   ├── main.md              # Master guide
│   │   ├── phase_1_foundation.md
│   │   ├── phase_2_shell.md
│   │   └── phase_N_[section].md
│   └── product/
│       ├── product-overview.md
│       └── product-roadmap.md
│
├── prisma/
│   ├── schema.prisma            # Database schema
│   └── seed.ts                  # Sample data seeder
│
├── src/
│   ├── app/
│   │   └── globals.css          # Tailwind v4 styles
│   ├── components/
│   │   ├── ui/                  # Base UI components
│   │   ├── shell/               # App shell (nav, sidebar)
│   │   └── sections/            # Feature components
│   └── lib/
│       ├── utils.ts             # Utility functions
│       └── validators.ts        # Zod schemas
│
├── design-system/
│   ├── colors.json              # Color palette
│   └── typography.json          # Typography scale
│
└── sample-data/
    └── [section]/
        ├── data.json            # Sample records
        └── types.ts             # TypeScript interfaces
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
```

Edit `.env` with your credentials:
- `DATABASE_URL` - PostgreSQL connection string
- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` - From Clerk Dashboard
- `CLERK_SECRET_KEY` - From Clerk Dashboard

### 4. Set Up Database

```bash
npm run db:generate    # Generate Prisma client
npm run db:push        # Push schema to database
npm run db:seed        # (Optional) Seed sample data
```

### 5. Start Development

```bash
npm run dev
```

### 6. Follow AI Instructions

Open `docs/prompts/kickoff.md` in your AI agent and follow the guided implementation.

## Key Files Explained

### `.cursorrules`

Contains AI-specific guidelines for code generation:
- Coding standards
- Tech stack requirements
- File organization rules
- Build commands

### `docs/instructions/main.md`

Master implementation guide with:
- Architecture overview
- Implementation phases
- Key decisions
- File references

### `docs/prompts/kickoff.md`

The "God Prompt" to start building:
- Pre-flight checklist
- Setup commands
- Phase links
- Success criteria

## Props-Only Components

All exported components follow the "props-only" pattern:

```tsx
// ✅ Correct - data passed as props
interface PatientTableProps {
  patients: Patient[];
  onView?: (id: string) => void;
}

export function PatientTable({ patients, onView }: PatientTableProps) {
  // Component logic
}
```

```tsx
// ❌ Wrong - importing data directly
import data from './data.json';

export function PatientTable() {
  // This breaks portability
}
```

This ensures components are portable and can work with real database data in the final application.
