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
