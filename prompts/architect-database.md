# Architect Database Prompt

Generate the database schema and validators for this project.

## Instructions

Create the following files:

### 1. `prisma/schema.prisma`

A Prisma schema file with:
- All entities/models with their fields
- Proper field types (String, Int, DateTime, Boolean, etc.)
- Relations between models (@relation)
- Indexes for frequently queried fields
- Proper IDs (cuid() or uuid())
- Timestamps (createdAt, updatedAt)

### 2. `lib/validators.ts`

Zod validation schemas for:
- Create operations (without id, timestamps)
- Update operations (all fields optional)
- Full entity validation

### 3. `product/data-model/data-model.md`

Documentation of the data model:
- Entity descriptions
- Field explanations
- Relationship diagrams (mermaid)

## Output Format

### prisma/schema.prisma
```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model [EntityName] {
  id        String   @id @default(cuid())
  // fields...
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  
  // relations
}
```

### lib/validators.ts
```typescript
import { z } from "zod";

// [EntityName] Schemas
export const [entityName]Schema = z.object({
  id: z.string(),
  // fields...
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const create[EntityName]Schema = [entityName]Schema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const update[EntityName]Schema = create[EntityName]Schema.partial();

export type [EntityName] = z.infer<typeof [entityName]Schema>;
export type Create[EntityName] = z.infer<typeof create[EntityName]Schema>;
export type Update[EntityName] = z.infer<typeof update[EntityName]Schema>;
```

## Your Task

Based on the entities and relationships described below, generate all three files:

---

**[DESCRIBE YOUR DATA MODEL HERE]**

Example:
```
Entities:
- Patient (name, email, phone, birthdate)
- Appointment (datetime, status, notes)
- Dentist (name, specialty)
- Treatment (name, price, duration)

Relationships:
- Patient has many Appointments
- Dentist has many Appointments
- Appointment has many Treatments
```
