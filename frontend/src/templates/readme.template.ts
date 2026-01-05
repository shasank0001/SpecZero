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
