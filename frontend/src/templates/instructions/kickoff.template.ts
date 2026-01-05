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
  `${index + 4}. **\`docs/instructions/phase_${index + 3}_${section.toLowerCase()}.md\`** - ${section} feature`
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
