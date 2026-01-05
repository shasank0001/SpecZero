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
