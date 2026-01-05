import type { SectionTemplateConfig } from '../types';

export function generateSectionInstructions(config: SectionTemplateConfig): string {
  return `# Phase ${config.phaseNumber}: ${config.name}

## Goal
Implement the ${config.name} feature with full CRUD operations.

## Duration
~3-4 hours

---

## Step 1: Create ${config.name} Page

### 1.1 Create List Page

Create \`src/app/(protected)/dashboard/${config.name.toLowerCase()}/page.tsx\`:

\`\`\`typescript
import { db } from '@/lib/db';
import { ${config.name}Table } from '@/components/sections/${config.name.toLowerCase()}/${config.name}Table';

export default async function ${config.name}Page() {
  const items = await db.${config.name.toLowerCase()}.findMany({
    orderBy: { createdAt: 'desc' },
  });

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">${config.name}</h1>
        {/* Add button component here */}
      </div>
      <${config.name}Table items={items} />
    </div>
  );
}
\`\`\`

---

## Step 2: Copy Pre-built Components

### 2.1 Copy Section Components

The following components are pre-built in \`src/components/sections/${config.name.toLowerCase()}/\`:

${config.features.length > 0 ? config.features.map(feature => `- \`${feature}.tsx\``).join('\n') : `- \`${config.name}Table.tsx\`
- \`${config.name}Form.tsx\`
- \`${config.name}Card.tsx\``}

Copy these components and ensure they're properly integrated.

### 2.2 Wire Up Components

Ensure components receive proper props from the page:

\`\`\`typescript
// Components receive data as props (never import data directly)
interface ${config.name}TableProps {
  items: ${config.name}[];
  onView?: (id: string) => void;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
}
\`\`\`

---

## Step 3: Create Server Actions

### 3.1 Create Actions File

Create \`src/app/(protected)/dashboard/${config.name.toLowerCase()}/actions.ts\`:

\`\`\`typescript
'use server';

import { db } from '@/lib/db';
import { revalidatePath } from 'next/cache';
import { ${config.name.toLowerCase()}Schema } from '@/lib/validators';

export async function create${config.name}(formData: FormData) {
  const data = Object.fromEntries(formData);
  const validated = ${config.name.toLowerCase()}Schema.parse(data);
  
  await db.${config.name.toLowerCase()}.create({
    data: validated,
  });
  
  revalidatePath('/dashboard/${config.name.toLowerCase()}');
}

export async function update${config.name}(id: string, formData: FormData) {
  const data = Object.fromEntries(formData);
  const validated = ${config.name.toLowerCase()}Schema.parse(data);
  
  await db.${config.name.toLowerCase()}.update({
    where: { id },
    data: validated,
  });
  
  revalidatePath('/dashboard/${config.name.toLowerCase()}');
}

export async function delete${config.name}(id: string) {
  await db.${config.name.toLowerCase()}.delete({
    where: { id },
  });
  
  revalidatePath('/dashboard/${config.name.toLowerCase()}');
}
\`\`\`

---

## Step 4: Create Detail Page (Optional)

### 4.1 Create Detail View

Create \`src/app/(protected)/dashboard/${config.name.toLowerCase()}/[id]/page.tsx\`:

\`\`\`typescript
import { db } from '@/lib/db';
import { notFound } from 'next/navigation';
import { ${config.name}Detail } from '@/components/sections/${config.name.toLowerCase()}/${config.name}Detail';

interface Props {
  params: { id: string };
}

export default async function ${config.name}DetailPage({ params }: Props) {
  const item = await db.${config.name.toLowerCase()}.findUnique({
    where: { id: params.id },
  });

  if (!item) {
    notFound();
  }

  return <${config.name}Detail item={item} />;
}
\`\`\`

---

## Verification

Run these checks before proceeding:

- [ ] ${config.name} list page renders correctly
- [ ] Create new ${config.name.toLowerCase()} works
- [ ] Edit existing ${config.name.toLowerCase()} works
- [ ] Delete ${config.name.toLowerCase()} works
- [ ] Validation errors display correctly
- [ ] Data persists after page refresh
`;
}
