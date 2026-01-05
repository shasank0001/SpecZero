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
    await db.$queryRaw\\\`SELECT 1\\\`;
    
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
