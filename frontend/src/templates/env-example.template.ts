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
