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
