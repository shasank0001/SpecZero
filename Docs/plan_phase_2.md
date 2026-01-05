# Phase 2: File Loaders & Data Layer - Detailed Implementation Plan

> **Goal:** Load and parse product files (markdown, JSON, Prisma schema)  
> **Duration:** 2 days  
> **Outcome:** Fully functional file loaders that can parse product artifacts and make them available to the UI components

---

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Step 1: Create Sample Product Files](#step-1-create-sample-product-files)
3. [Step 2: Create Type Definitions](#step-2-create-type-definitions)
4. [Step 3: Create Product Loader](#step-3-create-product-loader)
5. [Step 4: Create Prisma Schema Loader](#step-4-create-prisma-schema-loader)
6. [Step 5: Create Section Loader](#step-5-create-section-loader)
7. [Step 6: Create Design System Loader](#step-6-create-design-system-loader)
8. [Step 7: Create Shell Loader](#step-7-create-shell-loader)
9. [Step 8: Create Markdown Parser Utility](#step-8-create-markdown-parser-utility)
10. [Verification Checklist](#verification-checklist)
11. [File Structure Summary](#file-structure-summary)

---

## Prerequisites

Before starting Phase 2, ensure you have:

- [ ] Completed Phase 1 successfully
- [ ] Working Vite app with routing and layout
- [ ] Tailwind CSS v4 configured
- [ ] shadcn/ui base components (Button, Card) in place
- [ ] All Phase 1 verification checks passing

---

## Step 1: Create Sample Product Files

This step creates the directory structure and sample files that will be loaded by our loaders. These files represent the "product definition" that users will create via AI prompts.

### 1.1 Create Directory Structure

```bash
# Create product directories
mkdir -p product/data-model
mkdir -p product/design-system
mkdir -p product/shell
mkdir -p product/sections/patients

# Create prisma directory
mkdir -p prisma

# Create lib directory for validators (if not exists)
mkdir -p lib
```

### 1.2 Create `product/product-overview.md`

```markdown
# DentalFlow CRM

> Modern dental practice management made simple

## Problem Statement

Dental practices struggle with fragmented systems for patient management, appointment scheduling, and treatment tracking. Staff waste hours on administrative tasks instead of focusing on patient care.

## Target Users

- **Practice Managers** - Need oversight of daily operations and staff scheduling
- **Dentists** - Require quick access to patient history and treatment plans
- **Receptionists** - Handle appointment booking and patient check-ins
- **Patients** - Want easy appointment booking and communication

## Key Features

### Patient Management
Comprehensive patient profiles with medical history, treatment records, and communication preferences.

### Appointment Scheduling
Intuitive calendar interface with drag-and-drop scheduling, automated reminders, and conflict detection.

### Treatment Tracking
Track ongoing treatments, procedures, and follow-up appointments with visual timelines.

### Billing & Invoicing
Generate invoices, track payments, and integrate with insurance providers.

## Success Metrics

- Reduce appointment no-shows by 40%
- Cut administrative time by 50%
- Improve patient satisfaction scores to 4.5+/5
```

### 1.3 Create `product/product-roadmap.md`

```markdown
# Product Roadmap

## Phase 1: Foundation
- [x] Project setup and configuration
- [x] Database schema design
- [ ] Authentication with Clerk
- [ ] Base UI components

## Phase 2: Core Features

### Section: Patients
**Status:** In Progress  
**Priority:** High  
**Description:** Patient management module with CRUD operations, search, and filtering.

**Screens:**
- Patient List (table view with search)
- Patient Detail (profile, history, appointments)
- Patient Form (add/edit patient)

### Section: Appointments
**Status:** Planned  
**Priority:** High  
**Description:** Appointment scheduling and calendar management.

**Screens:**
- Calendar View (weekly/monthly calendar)
- Appointment Detail (appointment info, patient link)
- Appointment Form (schedule new appointment)

### Section: Dentists
**Status:** Planned  
**Priority:** Medium  
**Description:** Dentist profiles and schedule management.

**Screens:**
- Dentist List
- Dentist Detail
- Dentist Schedule

## Phase 3: Advanced Features

### Section: Treatments
**Status:** Planned  
**Priority:** Medium  
**Description:** Treatment plans and procedure tracking.

### Section: Billing
**Status:** Planned  
**Priority:** Low  
**Description:** Invoice generation and payment tracking.
```

### 1.4 Create `product/data-model/data-model.md`

```markdown
# Data Model Documentation

## Overview

The DentalFlow CRM data model is designed around the core entities of a dental practice: Patients, Appointments, Dentists, and Treatments.

## Entity Relationships

```
Patient --< Appointment >-- Dentist
    |
    +--< Treatment
```

## Models

### Patient
The central entity representing individuals receiving dental care.

| Field | Type | Description |
|-------|------|-------------|
| id | String | Unique identifier (CUID) |
| firstName | String | Patient's first name |
| lastName | String | Patient's last name |
| email | String | Contact email (unique) |
| phone | String? | Contact phone number |
| dateOfBirth | DateTime? | Patient's date of birth |
| createdAt | DateTime | Record creation timestamp |
| updatedAt | DateTime | Last update timestamp |

### Appointment
Scheduled visits linking patients to dentists.

| Field | Type | Description |
|-------|------|-------------|
| id | String | Unique identifier (CUID) |
| dateTime | DateTime | Scheduled date and time |
| duration | Int | Duration in minutes |
| status | AppointmentStatus | SCHEDULED, CONFIRMED, COMPLETED, CANCELLED |
| notes | String? | Additional notes |
| patientId | String | Reference to Patient |
| dentistId | String | Reference to Dentist |

### Dentist
Dental professionals providing care.

| Field | Type | Description |
|-------|------|-------------|
| id | String | Unique identifier (CUID) |
| name | String | Full name |
| email | String | Contact email (unique) |
| specialty | String? | Area of specialization |
| createdAt | DateTime | Record creation timestamp |
```

### 1.5 Create `prisma/schema.prisma`

```prisma
// Prisma Schema for DentalFlow CRM
// Database: PostgreSQL

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

// ==========================================
// ENUMS
// ==========================================

enum AppointmentStatus {
  SCHEDULED
  CONFIRMED
  COMPLETED
  CANCELLED
}

enum TreatmentStatus {
  PLANNED
  IN_PROGRESS
  COMPLETED
}

// ==========================================
// MODELS
// ==========================================

model Patient {
  id          String   @id @default(cuid())
  firstName   String
  lastName    String
  email       String   @unique
  phone       String?
  dateOfBirth DateTime?
  address     String?
  notes       String?
  
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  // Relations
  appointments Appointment[]
  treatments   Treatment[]
}

model Dentist {
  id        String   @id @default(cuid())
  name      String
  email     String   @unique
  specialty String?
  phone     String?
  
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  // Relations
  appointments Appointment[]
}

model Appointment {
  id        String            @id @default(cuid())
  dateTime  DateTime
  duration  Int               @default(30)
  status    AppointmentStatus @default(SCHEDULED)
  notes     String?
  
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  // Relations
  patient   Patient @relation(fields: [patientId], references: [id], onDelete: Cascade)
  patientId String
  
  dentist   Dentist @relation(fields: [dentistId], references: [id], onDelete: Cascade)
  dentistId String

  @@index([patientId])
  @@index([dentistId])
  @@index([dateTime])
}

model Treatment {
  id          String          @id @default(cuid())
  name        String
  description String?
  status      TreatmentStatus @default(PLANNED)
  startDate   DateTime?
  endDate     DateTime?
  cost        Float?
  notes       String?
  
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  // Relations
  patient   Patient @relation(fields: [patientId], references: [id], onDelete: Cascade)
  patientId String

  @@index([patientId])
}
```

### 1.6 Create `lib/validators.ts`

```typescript
import { z } from "zod";

// ==========================================
// ENUMS
// ==========================================

export const AppointmentStatusEnum = z.enum([
  "SCHEDULED",
  "CONFIRMED", 
  "COMPLETED",
  "CANCELLED",
]);

export const TreatmentStatusEnum = z.enum([
  "PLANNED",
  "IN_PROGRESS",
  "COMPLETED",
]);

// ==========================================
// PATIENT SCHEMAS
// ==========================================

export const PatientSchema = z.object({
  id: z.string().cuid(),
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().optional(),
  dateOfBirth: z.coerce.date().optional(),
  address: z.string().optional(),
  notes: z.string().optional(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
});

export const CreatePatientSchema = PatientSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const UpdatePatientSchema = CreatePatientSchema.partial();

// ==========================================
// DENTIST SCHEMAS
// ==========================================

export const DentistSchema = z.object({
  id: z.string().cuid(),
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  specialty: z.string().optional(),
  phone: z.string().optional(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
});

export const CreateDentistSchema = DentistSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const UpdateDentistSchema = CreateDentistSchema.partial();

// ==========================================
// APPOINTMENT SCHEMAS
// ==========================================

export const AppointmentSchema = z.object({
  id: z.string().cuid(),
  dateTime: z.coerce.date(),
  duration: z.number().int().positive().default(30),
  status: AppointmentStatusEnum.default("SCHEDULED"),
  notes: z.string().optional(),
  patientId: z.string().cuid(),
  dentistId: z.string().cuid(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
});

export const CreateAppointmentSchema = AppointmentSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const UpdateAppointmentSchema = CreateAppointmentSchema.partial();

// ==========================================
// TREATMENT SCHEMAS
// ==========================================

export const TreatmentSchema = z.object({
  id: z.string().cuid(),
  name: z.string().min(1, "Treatment name is required"),
  description: z.string().optional(),
  status: TreatmentStatusEnum.default("PLANNED"),
  startDate: z.coerce.date().optional(),
  endDate: z.coerce.date().optional(),
  cost: z.number().positive().optional(),
  notes: z.string().optional(),
  patientId: z.string().cuid(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
});

export const CreateTreatmentSchema = TreatmentSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const UpdateTreatmentSchema = CreateTreatmentSchema.partial();

// ==========================================
// TYPE EXPORTS
// ==========================================

export type Patient = z.infer<typeof PatientSchema>;
export type CreatePatient = z.infer<typeof CreatePatientSchema>;
export type UpdatePatient = z.infer<typeof UpdatePatientSchema>;

export type Dentist = z.infer<typeof DentistSchema>;
export type CreateDentist = z.infer<typeof CreateDentistSchema>;
export type UpdateDentist = z.infer<typeof UpdateDentistSchema>;

export type Appointment = z.infer<typeof AppointmentSchema>;
export type CreateAppointment = z.infer<typeof CreateAppointmentSchema>;
export type UpdateAppointment = z.infer<typeof UpdateAppointmentSchema>;

export type Treatment = z.infer<typeof TreatmentSchema>;
export type CreateTreatment = z.infer<typeof CreateTreatmentSchema>;
export type UpdateTreatment = z.infer<typeof UpdateTreatmentSchema>;

export type AppointmentStatus = z.infer<typeof AppointmentStatusEnum>;
export type TreatmentStatus = z.infer<typeof TreatmentStatusEnum>;
```

### 1.7 Create `product/design-system/colors.json`

```json
{
  "name": "DentalFlow Design System",
  "colors": {
    "primary": {
      "50": "#eff6ff",
      "100": "#dbeafe",
      "200": "#bfdbfe",
      "300": "#93c5fd",
      "400": "#60a5fa",
      "500": "#3b82f6",
      "600": "#2563eb",
      "700": "#1d4ed8",
      "800": "#1e40af",
      "900": "#1e3a8a"
    },
    "secondary": {
      "50": "#f0fdf4",
      "100": "#dcfce7",
      "200": "#bbf7d0",
      "300": "#86efac",
      "400": "#4ade80",
      "500": "#22c55e",
      "600": "#16a34a",
      "700": "#15803d",
      "800": "#166534",
      "900": "#14532d"
    },
    "neutral": {
      "50": "#fafafa",
      "100": "#f4f4f5",
      "200": "#e4e4e7",
      "300": "#d4d4d8",
      "400": "#a1a1aa",
      "500": "#71717a",
      "600": "#52525b",
      "700": "#3f3f46",
      "800": "#27272a",
      "900": "#18181b"
    },
    "success": "#22c55e",
    "warning": "#f59e0b",
    "error": "#ef4444",
    "info": "#3b82f6"
  }
}
```

### 1.8 Create `product/design-system/typography.json`

```json
{
  "name": "DentalFlow Typography",
  "fonts": {
    "sans": {
      "family": "DM Sans",
      "weights": [400, 500, 600, 700],
      "fallback": "system-ui, sans-serif"
    },
    "mono": {
      "family": "IBM Plex Mono", 
      "weights": [400, 500],
      "fallback": "ui-monospace, monospace"
    }
  },
  "sizes": {
    "xs": { "size": "0.75rem", "lineHeight": "1rem" },
    "sm": { "size": "0.875rem", "lineHeight": "1.25rem" },
    "base": { "size": "1rem", "lineHeight": "1.5rem" },
    "lg": { "size": "1.125rem", "lineHeight": "1.75rem" },
    "xl": { "size": "1.25rem", "lineHeight": "1.75rem" },
    "2xl": { "size": "1.5rem", "lineHeight": "2rem" },
    "3xl": { "size": "1.875rem", "lineHeight": "2.25rem" },
    "4xl": { "size": "2.25rem", "lineHeight": "2.5rem" }
  },
  "headings": {
    "h1": { "size": "2.25rem", "weight": 700, "lineHeight": "2.5rem" },
    "h2": { "size": "1.875rem", "weight": 600, "lineHeight": "2.25rem" },
    "h3": { "size": "1.5rem", "weight": 600, "lineHeight": "2rem" },
    "h4": { "size": "1.25rem", "weight": 600, "lineHeight": "1.75rem" },
    "h5": { "size": "1.125rem", "weight": 500, "lineHeight": "1.75rem" },
    "h6": { "size": "1rem", "weight": 500, "lineHeight": "1.5rem" }
  }
}
```

### 1.9 Create `product/shell/spec.md`

```markdown
# App Shell Specification

## Overview

The DentalFlow app shell provides the main navigation and layout structure for the application.

## Layout Structure

```
┌─────────────────────────────────────────────┐
│  Header (Logo + User Menu)                  │
├──────────┬──────────────────────────────────┤
│          │                                  │
│  Sidebar │         Main Content             │
│  (Nav)   │                                  │
│          │                                  │
│          │                                  │
├──────────┴──────────────────────────────────┤
│  Footer (Optional)                          │
└─────────────────────────────────────────────┘
```

## Navigation Items

| Label | Icon | Path | Description |
|-------|------|------|-------------|
| Dashboard | LayoutDashboard | / | Overview and quick stats |
| Patients | Users | /patients | Patient management |
| Appointments | Calendar | /appointments | Scheduling |
| Dentists | UserCog | /dentists | Staff management |
| Treatments | Stethoscope | /treatments | Treatment tracking |
| Settings | Settings | /settings | App configuration |

## Components

### AppShell
Main wrapper component that includes header, sidebar, and content area.

### MainNav
Sidebar navigation with collapsible menu items.

### UserMenu
Dropdown menu with user avatar, profile link, and logout.

## Responsive Behavior

- **Desktop (≥1024px):** Full sidebar visible
- **Tablet (768-1023px):** Collapsible sidebar
- **Mobile (<768px):** Bottom navigation or hamburger menu
```

### 1.10 Create `product/sections/patients/spec.md`

```markdown
# Patients Section Specification

## Overview

The Patients section handles all patient-related functionality including listing, viewing, creating, and editing patient records.

## Screens

### Patient List
**Path:** `/patients`

Displays a searchable, sortable table of all patients.

**Features:**
- Search by name or email
- Sort by name, email, or date added
- Pagination (20 per page)
- Quick actions (view, edit, delete)
- Add new patient button

**Columns:**
| Column | Sortable | Description |
|--------|----------|-------------|
| Name | Yes | Full name (firstName + lastName) |
| Email | Yes | Contact email |
| Phone | No | Contact phone |
| Created | Yes | Registration date |
| Actions | No | View, Edit, Delete buttons |

### Patient Detail
**Path:** `/patients/:id`

Shows comprehensive patient information.

**Sections:**
- Basic Info (name, contact details)
- Appointment History
- Treatment History
- Notes

### Patient Form
**Path:** `/patients/new` or `/patients/:id/edit`

Form for creating or editing patient records.

**Fields:**
| Field | Type | Required | Validation |
|-------|------|----------|------------|
| First Name | text | Yes | Min 1 char |
| Last Name | text | Yes | Min 1 char |
| Email | email | Yes | Valid email |
| Phone | tel | No | Valid phone |
| Date of Birth | date | No | Past date |
| Address | textarea | No | - |
| Notes | textarea | No | - |
```

### 1.11 Create `product/sections/patients/data.json`

```json
{
  "patients": [
    {
      "id": "clx1234567890",
      "firstName": "John",
      "lastName": "Smith",
      "email": "john.smith@email.com",
      "phone": "(555) 123-4567",
      "dateOfBirth": "1985-03-15",
      "address": "123 Main St, Springfield, IL 62701",
      "notes": "Allergic to penicillin",
      "createdAt": "2024-01-15T10:30:00Z",
      "updatedAt": "2024-06-20T14:45:00Z"
    },
    {
      "id": "clx2345678901",
      "firstName": "Sarah",
      "lastName": "Johnson",
      "email": "sarah.j@email.com",
      "phone": "(555) 234-5678",
      "dateOfBirth": "1990-07-22",
      "address": "456 Oak Ave, Springfield, IL 62702",
      "notes": null,
      "createdAt": "2024-02-10T09:15:00Z",
      "updatedAt": "2024-02-10T09:15:00Z"
    },
    {
      "id": "clx3456789012",
      "firstName": "Michael",
      "lastName": "Brown",
      "email": "m.brown@email.com",
      "phone": "(555) 345-6789",
      "dateOfBirth": "1978-11-08",
      "address": "789 Pine Rd, Springfield, IL 62703",
      "notes": "Prefers morning appointments",
      "createdAt": "2024-03-05T11:00:00Z",
      "updatedAt": "2024-05-18T16:20:00Z"
    },
    {
      "id": "clx4567890123",
      "firstName": "Emily",
      "lastName": "Davis",
      "email": "emily.davis@email.com",
      "phone": "(555) 456-7890",
      "dateOfBirth": "1995-01-30",
      "address": null,
      "notes": null,
      "createdAt": "2024-04-12T13:45:00Z",
      "updatedAt": "2024-04-12T13:45:00Z"
    },
    {
      "id": "clx5678901234",
      "firstName": "Robert",
      "lastName": "Wilson",
      "email": "r.wilson@email.com",
      "phone": null,
      "dateOfBirth": "1982-09-14",
      "address": "321 Elm St, Springfield, IL 62704",
      "notes": "Dental anxiety - requires extra care",
      "createdAt": "2024-05-20T08:30:00Z",
      "updatedAt": "2024-06-25T10:00:00Z"
    }
  ]
}
```

### 1.12 Create `product/sections/patients/types.ts`

```typescript
export interface Patient {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string | null;
  dateOfBirth: string | null;
  address: string | null;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface PatientListProps {
  patients: Patient[];
  onView: (id: string) => void;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

export interface PatientDetailProps {
  patient: Patient;
  onEdit: () => void;
  onBack: () => void;
}

export interface PatientFormProps {
  patient?: Patient;
  onSubmit: (data: Omit<Patient, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onCancel: () => void;
  isLoading?: boolean;
}
```

---

## Step 2: Create Type Definitions

This step defines the TypeScript interfaces that will be used throughout the application to represent product data, schema models, and section information.

### 2.1 Create Directory Structure

```bash
mkdir -p src/types
```

### 2.2 Create `src/types/product.ts`

```typescript
/**
 * Product Types
 * 
 * Types for representing the product overview and roadmap
 * parsed from markdown files in the product/ directory.
 */

// ==========================================
// PRODUCT OVERVIEW TYPES
// ==========================================

export interface ProductOverview {
  name: string;
  tagline: string;
  problem: string;
  targetUsers: TargetUser[];
  features: Feature[];
  successMetrics: SuccessMetric[];
  rawContent: string;
}

export interface TargetUser {
  name: string;
  description: string;
}

export interface Feature {
  name: string;
  description: string;
  priority?: "high" | "medium" | "low";
}

export interface SuccessMetric {
  metric: string;
  target: string;
}

// ==========================================
// PRODUCT ROADMAP TYPES
// ==========================================

export interface ProductRoadmap {
  phases: RoadmapPhase[];
  rawContent: string;
}

export interface RoadmapPhase {
  name: string;
  sections: RoadmapSection[];
}

export interface RoadmapSection {
  id: string;
  name: string;
  status: SectionStatus;
  priority: "high" | "medium" | "low";
  description: string;
  screens: ScreenDefinition[];
}

export type SectionStatus = "complete" | "in-progress" | "planned" | "not-started";

export interface ScreenDefinition {
  name: string;
  description?: string;
}

// ==========================================
// DATA MODEL DOCUMENTATION TYPES
// ==========================================

export interface DataModelDoc {
  overview: string;
  entities: EntityDoc[];
  rawContent: string;
}

export interface EntityDoc {
  name: string;
  description: string;
  fields: EntityFieldDoc[];
}

export interface EntityFieldDoc {
  name: string;
  type: string;
  description: string;
}
```

### 2.3 Create `src/types/schema.ts`

```typescript
/**
 * Schema Types
 * 
 * Types for representing Prisma schema models, fields, and relationships
 * parsed from the prisma/schema.prisma file.
 */

// ==========================================
// PRISMA SCHEMA TYPES
// ==========================================

export interface PrismaSchema {
  models: PrismaModel[];
  enums: PrismaEnum[];
  datasource: PrismaDatasource | null;
  generator: PrismaGenerator | null;
}

export interface PrismaModel {
  name: string;
  fields: PrismaField[];
  relations: PrismaRelation[];
  indexes: PrismaIndex[];
}

export interface PrismaField {
  name: string;
  type: string;
  isOptional: boolean;
  isArray: boolean;
  isUnique: boolean;
  isPrimaryKey: boolean;
  isForeignKey: boolean;
  isRelation: boolean;
  default?: string;
  attributes: PrismaAttribute[];
}

export interface PrismaAttribute {
  name: string;
  args: string[];
}

export interface PrismaRelation {
  name: string;
  fromModel: string;
  toModel: string;
  fromField: string;
  toField: string;
  type: RelationType;
  onDelete?: string;
  onUpdate?: string;
}

export type RelationType = "one-to-one" | "one-to-many" | "many-to-many";

export interface PrismaEnum {
  name: string;
  values: string[];
}

export interface PrismaDatasource {
  name: string;
  provider: string;
  url: string;
}

export interface PrismaGenerator {
  name: string;
  provider: string;
}

export interface PrismaIndex {
  fields: string[];
  isUnique: boolean;
}

// ==========================================
// VALIDATOR TYPES
// ==========================================

export interface ValidatorFile {
  schemas: ValidatorSchema[];
  types: ValidatorType[];
  rawContent: string;
}

export interface ValidatorSchema {
  name: string;
  code: string;
  isExported: boolean;
}

export interface ValidatorType {
  name: string;
  code: string;
  isExported: boolean;
}
```

### 2.4 Create `src/types/section.ts`

```typescript
/**
 * Section Types
 * 
 * Types for representing section data, specs, and component information
 * from the product/sections/ directory.
 */

// ==========================================
// SECTION TYPES
// ==========================================

export interface Section {
  id: string;
  name: string;
  spec: SectionSpec | null;
  data: Record<string, unknown> | null;
  types: string | null;
  hasComponents: boolean;
  screens: SectionScreen[];
  status: SectionStatus;
}

export type SectionStatus = "complete" | "in-progress" | "planned";

export interface SectionSpec {
  overview: string;
  screens: SectionScreenSpec[];
  rawContent: string;
}

export interface SectionScreenSpec {
  name: string;
  path: string;
  description: string;
  features: string[];
  fields?: ScreenField[];
  columns?: ScreenColumn[];
}

export interface ScreenField {
  name: string;
  type: string;
  required: boolean;
  validation?: string;
}

export interface ScreenColumn {
  name: string;
  sortable: boolean;
  description: string;
}

export interface SectionScreen {
  name: string;
  path: string;
  component: string;
  hasPreview: boolean;
}

// ==========================================
// SECTION DATA TYPES
// ==========================================

export interface SectionData {
  sectionId: string;
  data: Record<string, unknown>;
  types: SectionTypeDefinition[];
}

export interface SectionTypeDefinition {
  name: string;
  properties: TypeProperty[];
  code: string;
}

export interface TypeProperty {
  name: string;
  type: string;
  optional: boolean;
}
```

### 2.5 Create `src/types/design-system.ts`

```typescript
/**
 * Design System Types
 * 
 * Types for representing color palettes, typography, and other
 * design tokens from the product/design-system/ directory.
 */

// ==========================================
// COLOR TYPES
// ==========================================

export interface DesignSystemColors {
  name: string;
  colors: ColorPalette;
}

export interface ColorPalette {
  primary: ColorScale;
  secondary: ColorScale;
  neutral: ColorScale;
  success: string;
  warning: string;
  error: string;
  info: string;
}

export interface ColorScale {
  50: string;
  100: string;
  200: string;
  300: string;
  400: string;
  500: string;
  600: string;
  700: string;
  800: string;
  900: string;
}

// ==========================================
// TYPOGRAPHY TYPES
// ==========================================

export interface DesignSystemTypography {
  name: string;
  fonts: FontDefinitions;
  sizes: FontSizes;
  headings: HeadingStyles;
}

export interface FontDefinitions {
  sans: FontFamily;
  mono: FontFamily;
}

export interface FontFamily {
  family: string;
  weights: number[];
  fallback: string;
}

export interface FontSizes {
  xs: FontSizeDefinition;
  sm: FontSizeDefinition;
  base: FontSizeDefinition;
  lg: FontSizeDefinition;
  xl: FontSizeDefinition;
  "2xl": FontSizeDefinition;
  "3xl": FontSizeDefinition;
  "4xl": FontSizeDefinition;
}

export interface FontSizeDefinition {
  size: string;
  lineHeight: string;
}

export interface HeadingStyles {
  h1: HeadingStyle;
  h2: HeadingStyle;
  h3: HeadingStyle;
  h4: HeadingStyle;
  h5: HeadingStyle;
  h6: HeadingStyle;
}

export interface HeadingStyle {
  size: string;
  weight: number;
  lineHeight: string;
}

// ==========================================
// COMBINED DESIGN SYSTEM
// ==========================================

export interface DesignSystem {
  colors: DesignSystemColors | null;
  typography: DesignSystemTypography | null;
}
```

### 2.6 Create `src/types/shell.ts`

```typescript
/**
 * Shell Types
 * 
 * Types for representing the app shell specification and components
 * from the product/shell/ directory.
 */

// ==========================================
// SHELL SPEC TYPES
// ==========================================

export interface ShellSpec {
  overview: string;
  layout: ShellLayout;
  navigation: NavigationItem[];
  components: ShellComponent[];
  responsiveBehavior: ResponsiveBehavior[];
  rawContent: string;
}

export interface ShellLayout {
  description: string;
  structure: string;
}

export interface NavigationItem {
  label: string;
  icon: string;
  path: string;
  description: string;
}

export interface ShellComponent {
  name: string;
  description: string;
}

export interface ResponsiveBehavior {
  breakpoint: string;
  range: string;
  behavior: string;
}

// ==========================================
// SHELL COMPONENT TYPES
// ==========================================

export interface ShellComponents {
  hasAppShell: boolean;
  hasMainNav: boolean;
  hasUserMenu: boolean;
  hasHeader: boolean;
  hasSidebar: boolean;
  components: string[];
}
```

### 2.7 Create `src/types/index.ts`

Create a barrel export file for convenient imports:

```typescript
/**
 * Type Exports
 * 
 * Central export point for all type definitions.
 */

// Product types
export * from "./product";

// Schema types  
export * from "./schema";

// Section types
export * from "./section";

// Design system types
export * from "./design-system";

// Shell types
export * from "./shell";
```

---

## Step 3: Create Product Loader

This step creates the product loader that parses markdown files from the `product/` directory to extract structured data about the product overview and roadmap.

### 3.1 Create `src/lib/product-loader.ts`

```typescript
/**
 * Product Loader
 * 
 * Loads and parses product definition files from the product/ directory.
 * Uses Vite's import.meta.glob for build-time file loading.
 */

import type {
  ProductOverview,
  ProductRoadmap,
  TargetUser,
  Feature,
  SuccessMetric,
  RoadmapPhase,
  RoadmapSection,
  ScreenDefinition,
  DataModelDoc,
} from "@/types/product";

// ==========================================
// FILE LOADING WITH VITE GLOB
// ==========================================

// Load all markdown files from product directory
const productFiles = import.meta.glob("/product/*.md", {
  query: "?raw",
  import: "default",
  eager: true,
}) as Record<string, string>;

// Load data model markdown
const dataModelFiles = import.meta.glob("/product/data-model/*.md", {
  query: "?raw",
  import: "default",
  eager: true,
}) as Record<string, string>;

// ==========================================
// PRODUCT OVERVIEW LOADER
// ==========================================

/**
 * Loads and parses the product overview from product-overview.md
 */
export function loadProductOverview(): ProductOverview | null {
  const content = productFiles["/product/product-overview.md"];
  
  if (!content) {
    return null;
  }

  return parseProductOverview(content);
}

/**
 * Parses product overview markdown into structured data
 */
function parseProductOverview(content: string): ProductOverview {
  const lines = content.split("\n");
  
  // Extract product name (first H1)
  const nameMatch = content.match(/^#\s+(.+)$/m);
  const name = nameMatch ? nameMatch[1].trim() : "Untitled Product";
  
  // Extract tagline (blockquote after H1)
  const taglineMatch = content.match(/^>\s*(.+)$/m);
  const tagline = taglineMatch ? taglineMatch[1].trim() : "";
  
  // Extract problem statement
  const problem = extractSection(content, "Problem Statement");
  
  // Extract target users
  const targetUsers = extractTargetUsers(content);
  
  // Extract features
  const features = extractFeatures(content);
  
  // Extract success metrics
  const successMetrics = extractSuccessMetrics(content);
  
  return {
    name,
    tagline,
    problem,
    targetUsers,
    features,
    successMetrics,
    rawContent: content,
  };
}

/**
 * Extracts a section's content by heading
 */
function extractSection(content: string, sectionName: string): string {
  const regex = new RegExp(
    `##\\s+${sectionName}[\\s\\S]*?(?=\\n##\\s|$)`,
    "i"
  );
  const match = content.match(regex);
  
  if (!match) return "";
  
  // Remove the heading and return the content
  return match[0]
    .replace(/^##\s+.+\n/, "")
    .trim();
}

/**
 * Extracts target users from the markdown
 */
function extractTargetUsers(content: string): TargetUser[] {
  const section = extractSection(content, "Target Users");
  if (!section) return [];
  
  const users: TargetUser[] = [];
  const lines = section.split("\n");
  
  for (const line of lines) {
    // Match pattern: - **Name** - Description
    const match = line.match(/^-\s+\*\*(.+?)\*\*\s*[-–]\s*(.+)$/);
    if (match) {
      users.push({
        name: match[1].trim(),
        description: match[2].trim(),
      });
    }
  }
  
  return users;
}

/**
 * Extracts features from the markdown
 */
function extractFeatures(content: string): Feature[] {
  const section = extractSection(content, "Key Features");
  if (!section) return [];
  
  const features: Feature[] = [];
  const lines = section.split("\n");
  
  let currentFeature: Partial<Feature> | null = null;
  
  for (const line of lines) {
    // Match H3 heading (feature name)
    const h3Match = line.match(/^###\s+(.+)$/);
    if (h3Match) {
      if (currentFeature && currentFeature.name) {
        features.push(currentFeature as Feature);
      }
      currentFeature = { name: h3Match[1].trim(), description: "" };
      continue;
    }
    
    // Add description lines
    if (currentFeature && line.trim()) {
      currentFeature.description = (currentFeature.description || "") + line.trim() + " ";
    }
  }
  
  // Add last feature
  if (currentFeature && currentFeature.name) {
    currentFeature.description = currentFeature.description?.trim() || "";
    features.push(currentFeature as Feature);
  }
  
  return features;
}

/**
 * Extracts success metrics from the markdown
 */
function extractSuccessMetrics(content: string): SuccessMetric[] {
  const section = extractSection(content, "Success Metrics");
  if (!section) return [];
  
  const metrics: SuccessMetric[] = [];
  const lines = section.split("\n");
  
  for (const line of lines) {
    // Match pattern: - Metric description by/to XX%
    const match = line.match(/^-\s+(.+)$/);
    if (match) {
      const text = match[1].trim();
      // Try to extract target value
      const targetMatch = text.match(/(\d+[%+]?|\d+\.?\d*\/\d+)/);
      metrics.push({
        metric: text,
        target: targetMatch ? targetMatch[1] : "",
      });
    }
  }
  
  return metrics;
}

// ==========================================
// PRODUCT ROADMAP LOADER
// ==========================================

/**
 * Loads and parses the product roadmap from product-roadmap.md
 */
export function loadProductRoadmap(): ProductRoadmap | null {
  const content = productFiles["/product/product-roadmap.md"];
  
  if (!content) {
    return null;
  }

  return parseProductRoadmap(content);
}

/**
 * Parses product roadmap markdown into structured data
 */
function parseProductRoadmap(content: string): ProductRoadmap {
  const phases: RoadmapPhase[] = [];
  
  // Split by Phase headings (## Phase X:)
  const phaseSections = content.split(/(?=^##\s+Phase\s+\d+)/m);
  
  for (const phaseContent of phaseSections) {
    if (!phaseContent.trim()) continue;
    
    // Extract phase name
    const phaseMatch = phaseContent.match(/^##\s+(.+)$/m);
    if (!phaseMatch) continue;
    
    const phaseName = phaseMatch[1].trim();
    const sections = extractRoadmapSections(phaseContent);
    
    phases.push({
      name: phaseName,
      sections,
    });
  }
  
  return {
    phases,
    rawContent: content,
  };
}

/**
 * Extracts roadmap sections from a phase
 */
function extractRoadmapSections(phaseContent: string): RoadmapSection[] {
  const sections: RoadmapSection[] = [];
  
  // Split by Section headings (### Section:)
  const sectionBlocks = phaseContent.split(/(?=^###\s+Section:)/m);
  
  for (const block of sectionBlocks) {
    if (!block.includes("### Section:")) continue;
    
    // Extract section name
    const nameMatch = block.match(/^###\s+Section:\s+(.+)$/m);
    if (!nameMatch) continue;
    
    const name = nameMatch[1].trim();
    const id = name.toLowerCase().replace(/\s+/g, "-");
    
    // Extract status
    const statusMatch = block.match(/\*\*Status:\*\*\s*(.+)/i);
    const statusText = statusMatch ? statusMatch[1].trim().toLowerCase() : "planned";
    const status = parseStatus(statusText);
    
    // Extract priority
    const priorityMatch = block.match(/\*\*Priority:\*\*\s*(.+)/i);
    const priorityText = priorityMatch ? priorityMatch[1].trim().toLowerCase() : "medium";
    const priority = parsePriority(priorityText);
    
    // Extract description
    const descMatch = block.match(/\*\*Description:\*\*\s*(.+)/i);
    const description = descMatch ? descMatch[1].trim() : "";
    
    // Extract screens
    const screens = extractScreens(block);
    
    sections.push({
      id,
      name,
      status,
      priority,
      description,
      screens,
    });
  }
  
  return sections;
}

/**
 * Parses status text to enum value
 */
function parseStatus(text: string): RoadmapSection["status"] {
  if (text.includes("complete")) return "complete";
  if (text.includes("progress")) return "in-progress";
  if (text.includes("planned")) return "planned";
  return "not-started";
}

/**
 * Parses priority text to enum value
 */
function parsePriority(text: string): RoadmapSection["priority"] {
  if (text.includes("high")) return "high";
  if (text.includes("low")) return "low";
  return "medium";
}

/**
 * Extracts screen definitions from a section block
 */
function extractScreens(block: string): ScreenDefinition[] {
  const screens: ScreenDefinition[] = [];
  
  // Find **Screens:** section
  const screensMatch = block.match(/\*\*Screens:\*\*([\s\S]*?)(?=\n###|\n\*\*|$)/i);
  if (!screensMatch) return screens;
  
  const screensContent = screensMatch[1];
  const lines = screensContent.split("\n");
  
  for (const line of lines) {
    // Match pattern: - Screen Name (description)
    const match = line.match(/^-\s+(.+?)(?:\s*\((.+)\))?$/);
    if (match) {
      screens.push({
        name: match[1].trim(),
        description: match[2]?.trim(),
      });
    }
  }
  
  return screens;
}

// ==========================================
// DATA MODEL DOC LOADER
// ==========================================

/**
 * Loads and parses the data model documentation
 */
export function loadDataModelDoc(): DataModelDoc | null {
  const content = dataModelFiles["/product/data-model/data-model.md"];
  
  if (!content) {
    return null;
  }

  // Extract overview section
  const overviewMatch = content.match(/##\s+Overview\s+([\s\S]*?)(?=\n##\s|$)/i);
  const overview = overviewMatch ? overviewMatch[1].trim() : "";
  
  return {
    overview,
    entities: [], // Parsed from schema.prisma instead
    rawContent: content,
  };
}

// ==========================================
// UTILITY EXPORTS
// ==========================================

/**
 * Checks if product overview exists
 */
export function hasProductOverview(): boolean {
  return "/product/product-overview.md" in productFiles;
}

/**
 * Checks if product roadmap exists
 */
export function hasProductRoadmap(): boolean {
  return "/product/product-roadmap.md" in productFiles;
}

/**
 * Gets raw product file content
 */
export function getProductFile(filename: string): string | null {
  const path = `/product/${filename}`;
  return productFiles[path] ?? null;
}
```

### 3.2 Usage Example

```typescript
import { 
  loadProductOverview, 
  loadProductRoadmap,
  hasProductOverview,
  hasProductRoadmap 
} from "@/lib/product-loader";

// In a component
function PlanPage() {
  const overview = loadProductOverview();
  const roadmap = loadProductRoadmap();
  
  if (!overview) {
    return <EmptyState message="No product overview found" />;
  }
  
  return (
    <div>
      <h1>{overview.name}</h1>
      <p>{overview.tagline}</p>
      {/* ... */}
    </div>
  );
}
```

---

## Step 4: Create Prisma Schema Loader

This step creates a parser for Prisma schema files that extracts models, fields, relationships, and enums into structured TypeScript objects.

### 4.1 Create `src/lib/schema-loader.ts`

```typescript
/**
 * Schema Loader
 * 
 * Loads and parses Prisma schema files from the prisma/ directory.
 * Extracts models, fields, relations, and enums.
 */

import type {
  PrismaSchema,
  PrismaModel,
  PrismaField,
  PrismaRelation,
  PrismaEnum,
  PrismaAttribute,
  PrismaIndex,
  RelationType,
  PrismaDatasource,
  PrismaGenerator,
} from "@/types/schema";

// ==========================================
// FILE LOADING WITH VITE GLOB
// ==========================================

const schemaFiles = import.meta.glob("/prisma/*.prisma", {
  query: "?raw",
  import: "default",
  eager: true,
}) as Record<string, string>;

// ==========================================
// MAIN LOADER FUNCTION
// ==========================================

/**
 * Loads and parses the Prisma schema
 */
export function loadPrismaSchema(): PrismaSchema | null {
  const content = schemaFiles["/prisma/schema.prisma"];
  
  if (!content) {
    return null;
  }

  return parsePrismaSchema(content);
}

/**
 * Parses Prisma schema content into structured data
 */
function parsePrismaSchema(content: string): PrismaSchema {
  const models = parseModels(content);
  const enums = parseEnums(content);
  const datasource = parseDatasource(content);
  const generator = parseGenerator(content);
  
  // Build relations from model fields
  const relations = buildRelations(models);
  
  // Attach relations to models
  for (const model of models) {
    model.relations = relations.filter(
      (r) => r.fromModel === model.name || r.toModel === model.name
    );
  }
  
  return {
    models,
    enums,
    datasource,
    generator,
  };
}

// ==========================================
// MODEL PARSING
// ==========================================

/**
 * Parses all model definitions from schema
 */
function parseModels(content: string): PrismaModel[] {
  const models: PrismaModel[] = [];
  
  // Match model blocks
  const modelRegex = /model\s+(\w+)\s*\{([^}]+)\}/g;
  let match;
  
  while ((match = modelRegex.exec(content)) !== null) {
    const modelName = match[1];
    const modelBody = match[2];
    
    const fields = parseFields(modelBody);
    const indexes = parseIndexes(modelBody);
    
    models.push({
      name: modelName,
      fields,
      relations: [], // Populated later
      indexes,
    });
  }
  
  return models;
}

/**
 * Parses fields from a model body
 */
function parseFields(modelBody: string): PrismaField[] {
  const fields: PrismaField[] = [];
  const lines = modelBody.split("\n");
  
  for (const line of lines) {
    const trimmed = line.trim();
    
    // Skip empty lines, comments, and special directives
    if (!trimmed || trimmed.startsWith("//") || trimmed.startsWith("@@")) {
      continue;
    }
    
    const field = parseFieldLine(trimmed);
    if (field) {
      fields.push(field);
    }
  }
  
  return fields;
}

/**
 * Parses a single field line
 */
function parseFieldLine(line: string): PrismaField | null {
  // Field pattern: fieldName Type? @attributes
  const fieldRegex = /^(\w+)\s+(\w+)(\[\])?(\?)?\s*(.*)?$/;
  const match = line.match(fieldRegex);
  
  if (!match) return null;
  
  const [, name, type, isArray, isOptional, attributesStr] = match;
  
  // Parse attributes
  const attributes = parseAttributes(attributesStr || "");
  
  // Determine field properties from attributes
  const isPrimaryKey = attributes.some((a) => a.name === "id");
  const isUnique = attributes.some((a) => a.name === "unique");
  const isForeignKey = attributes.some((a) => a.name === "relation");
  const isRelation = isRelationType(type);
  
  // Extract default value
  const defaultAttr = attributes.find((a) => a.name === "default");
  const defaultValue = defaultAttr ? defaultAttr.args[0] : undefined;
  
  return {
    name,
    type,
    isOptional: !!isOptional,
    isArray: !!isArray,
    isUnique,
    isPrimaryKey,
    isForeignKey,
    isRelation,
    default: defaultValue,
    attributes,
  };
}

/**
 * Parses attributes from a string like @id @default(cuid())
 */
function parseAttributes(str: string): PrismaAttribute[] {
  const attributes: PrismaAttribute[] = [];
  
  // Match @attribute or @attribute(args)
  const attrRegex = /@(\w+)(?:\(([^)]*)\))?/g;
  let match;
  
  while ((match = attrRegex.exec(str)) !== null) {
    const name = match[1];
    const argsStr = match[2] || "";
    
    // Parse arguments
    const args = argsStr
      .split(",")
      .map((a) => a.trim())
      .filter((a) => a);
    
    attributes.push({ name, args });
  }
  
  return attributes;
}

/**
 * Checks if a type is a relation (model reference)
 */
function isRelationType(type: string): boolean {
  // Prisma scalar types
  const scalarTypes = [
    "String",
    "Int",
    "Float",
    "Boolean",
    "DateTime",
    "Json",
    "Bytes",
    "BigInt",
    "Decimal",
  ];
  
  return !scalarTypes.includes(type);
}

/**
 * Parses @@index and @@unique directives
 */
function parseIndexes(modelBody: string): PrismaIndex[] {
  const indexes: PrismaIndex[] = [];
  const lines = modelBody.split("\n");
  
  for (const line of lines) {
    const trimmed = line.trim();
    
    // Match @@index([field1, field2])
    const indexMatch = trimmed.match(/@@index\(\[([^\]]+)\]\)/);
    if (indexMatch) {
      const fields = indexMatch[1].split(",").map((f) => f.trim());
      indexes.push({ fields, isUnique: false });
    }
    
    // Match @@unique([field1, field2])
    const uniqueMatch = trimmed.match(/@@unique\(\[([^\]]+)\]\)/);
    if (uniqueMatch) {
      const fields = uniqueMatch[1].split(",").map((f) => f.trim());
      indexes.push({ fields, isUnique: true });
    }
  }
  
  return indexes;
}

// ==========================================
// ENUM PARSING
// ==========================================

/**
 * Parses all enum definitions from schema
 */
function parseEnums(content: string): PrismaEnum[] {
  const enums: PrismaEnum[] = [];
  
  // Match enum blocks
  const enumRegex = /enum\s+(\w+)\s*\{([^}]+)\}/g;
  let match;
  
  while ((match = enumRegex.exec(content)) !== null) {
    const enumName = match[1];
    const enumBody = match[2];
    
    // Extract values (each line is a value)
    const values = enumBody
      .split("\n")
      .map((line) => line.trim())
      .filter((line) => line && !line.startsWith("//"));
    
    enums.push({
      name: enumName,
      values,
    });
  }
  
  return enums;
}

// ==========================================
// RELATION BUILDING
// ==========================================

/**
 * Builds relations from model fields
 */
function buildRelations(models: PrismaModel[]): PrismaRelation[] {
  const relations: PrismaRelation[] = [];
  
  for (const model of models) {
    for (const field of model.fields) {
      if (!field.isRelation) continue;
      
      // Find the relation attribute
      const relationAttr = field.attributes.find((a) => a.name === "relation");
      
      if (!relationAttr) {
        // This is the "many" side of a relation (e.g., appointments Appointment[])
        continue;
      }
      
      // Parse relation attribute: @relation(fields: [patientId], references: [id])
      const fieldsMatch = relationAttr.args.find((a) => a.startsWith("fields:"));
      const refsMatch = relationAttr.args.find((a) => a.startsWith("references:"));
      const onDeleteMatch = relationAttr.args.find((a) => a.startsWith("onDelete:"));
      
      if (!fieldsMatch || !refsMatch) continue;
      
      // Extract field names
      const fromField = fieldsMatch.match(/\[(\w+)\]/)?.[1] || "";
      const toField = refsMatch.match(/\[(\w+)\]/)?.[1] || "";
      const onDelete = onDeleteMatch?.split(":")[1]?.trim();
      
      // Determine relation type
      const toModel = field.type;
      const type = determineRelationType(model, field, models);
      
      relations.push({
        name: `${model.name}_${field.name}`,
        fromModel: model.name,
        toModel,
        fromField,
        toField,
        type,
        onDelete,
      });
    }
  }
  
  return relations;
}

/**
 * Determines the type of relation (one-to-one, one-to-many, many-to-many)
 */
function determineRelationType(
  fromModel: PrismaModel,
  field: PrismaField,
  models: PrismaModel[]
): RelationType {
  const toModel = models.find((m) => m.name === field.type);
  if (!toModel) return "one-to-many";
  
  // Check if the reverse relation is an array
  const reverseField = toModel.fields.find(
    (f) => f.type === fromModel.name
  );
  
  if (!reverseField) return "one-to-many";
  
  if (reverseField.isArray) {
    return "one-to-many"; // From perspective of this field
  }
  
  return "one-to-one";
}

// ==========================================
// DATASOURCE & GENERATOR PARSING
// ==========================================

/**
 * Parses datasource configuration
 */
function parseDatasource(content: string): PrismaDatasource | null {
  const match = content.match(/datasource\s+(\w+)\s*\{([^}]+)\}/);
  if (!match) return null;
  
  const name = match[1];
  const body = match[2];
  
  const providerMatch = body.match(/provider\s*=\s*"([^"]+)"/);
  const urlMatch = body.match(/url\s*=\s*(?:env\("([^"]+)"\)|"([^"]+)")/);
  
  return {
    name,
    provider: providerMatch?.[1] || "",
    url: urlMatch?.[1] || urlMatch?.[2] || "",
  };
}

/**
 * Parses generator configuration
 */
function parseGenerator(content: string): PrismaGenerator | null {
  const match = content.match(/generator\s+(\w+)\s*\{([^}]+)\}/);
  if (!match) return null;
  
  const name = match[1];
  const body = match[2];
  
  const providerMatch = body.match(/provider\s*=\s*"([^"]+)"/);
  
  return {
    name,
    provider: providerMatch?.[1] || "",
  };
}

// ==========================================
// UTILITY EXPORTS
// ==========================================

/**
 * Checks if Prisma schema exists
 */
export function hasPrismaSchema(): boolean {
  return "/prisma/schema.prisma" in schemaFiles;
}

/**
 * Gets raw schema content
 */
export function getRawSchema(): string | null {
  return schemaFiles["/prisma/schema.prisma"] ?? null;
}

/**
 * Gets all model names
 */
export function getModelNames(): string[] {
  const schema = loadPrismaSchema();
  if (!schema) return [];
  return schema.models.map((m) => m.name);
}

/**
 * Gets a specific model by name
 */
export function getModel(name: string): PrismaModel | null {
  const schema = loadPrismaSchema();
  if (!schema) return null;
  return schema.models.find((m) => m.name === name) ?? null;
}
```

### 4.2 Key Parsing Features

| Feature | Description |
|---------|-------------|
| **Model Extraction** | Parses model name, fields, and body |
| **Field Parsing** | Extracts type, optionality, array status |
| **Attribute Detection** | Parses `@id`, `@unique`, `@default`, `@relation` |
| **Relation Building** | Determines relationships between models |
| **Enum Parsing** | Extracts enum definitions and values |
| **Index Detection** | Parses `@@index` and `@@unique` directives |

### 4.3 Usage Example

```typescript
import { 
  loadPrismaSchema, 
  getModel, 
  getModelNames,
  hasPrismaSchema 
} from "@/lib/schema-loader";

// Check if schema exists
if (!hasPrismaSchema()) {
  console.log("No Prisma schema found");
}

// Load full schema
const schema = loadPrismaSchema();
if (schema) {
  console.log("Models:", schema.models.map(m => m.name));
  console.log("Enums:", schema.enums.map(e => e.name));
}

// Get specific model
const patientModel = getModel("Patient");
if (patientModel) {
  console.log("Patient fields:", patientModel.fields);
  console.log("Patient relations:", patientModel.relations);
}
```

---

## Step 5: Create Section Loader

This step creates the section loader that loads section specifications, sample data, and type definitions from the `product/sections/` directory.

### 5.1 Create `src/lib/section-loader.ts`

```typescript
/**
 * Section Loader
 * 
 * Loads section artifacts from the product/sections/ directory.
 * Each section can have: spec.md, data.json, types.ts
 */

import type {
  Section,
  SectionSpec,
  SectionScreenSpec,
  SectionScreen,
  SectionStatus,
  ScreenField,
  ScreenColumn,
} from "@/types/section";

// ==========================================
// FILE LOADING WITH VITE GLOB
// ==========================================

// Load all section spec files
const sectionSpecs = import.meta.glob("/product/sections/*/spec.md", {
  query: "?raw",
  import: "default",
  eager: true,
}) as Record<string, string>;

// Load all section data files
const sectionData = import.meta.glob("/product/sections/*/data.json", {
  import: "default",
  eager: true,
}) as Record<string, Record<string, unknown>>;

// Load all section type files
const sectionTypes = import.meta.glob("/product/sections/*/types.ts", {
  query: "?raw",
  import: "default",
  eager: true,
}) as Record<string, string>;

// Check for component directories (to determine if section has implementations)
const sectionComponents = import.meta.glob("/src/sections/*/components/*.tsx", {
  query: "?raw",
  import: "default",
  eager: true,
}) as Record<string, string>;

// ==========================================
// MAIN LOADER FUNCTIONS
// ==========================================

/**
 * Gets all section IDs from the product/sections/ directory
 */
export function getSectionIds(): string[] {
  const ids = new Set<string>();
  
  // Extract section IDs from all file paths
  const allPaths = [
    ...Object.keys(sectionSpecs),
    ...Object.keys(sectionData),
    ...Object.keys(sectionTypes),
  ];
  
  for (const path of allPaths) {
    const match = path.match(/\/product\/sections\/([^/]+)\//);
    if (match) {
      ids.add(match[1]);
    }
  }
  
  return Array.from(ids).sort();
}

/**
 * Loads all sections with their data
 */
export function loadAllSections(): Section[] {
  const sectionIds = getSectionIds();
  return sectionIds.map((id) => loadSection(id)).filter(Boolean) as Section[];
}

/**
 * Loads a single section by ID
 */
export function loadSection(sectionId: string): Section | null {
  const specPath = `/product/sections/${sectionId}/spec.md`;
  const dataPath = `/product/sections/${sectionId}/data.json`;
  const typesPath = `/product/sections/${sectionId}/types.ts`;
  
  // Check if section exists (at least spec should exist)
  const specContent = sectionSpecs[specPath];
  const dataContent = sectionData[dataPath];
  const typesContent = sectionTypes[typesPath];
  
  // Determine if section has component implementations
  const hasComponents = Object.keys(sectionComponents).some(
    (path) => path.includes(`/src/sections/${sectionId}/`)
  );
  
  // Parse spec if exists
  const spec = specContent ? parseSectionSpec(specContent) : null;
  
  // Determine section status
  const status = determineSectionStatus(hasComponents, spec);
  
  // Get screen list
  const screens = getScreenList(sectionId, spec);
  
  // Format section name from ID
  const name = formatSectionName(sectionId);
  
  return {
    id: sectionId,
    name,
    spec,
    data: dataContent ?? null,
    types: typesContent ?? null,
    hasComponents,
    screens,
    status,
  };
}

// ==========================================
// SPEC PARSING
// ==========================================

/**
 * Parses a section spec.md file
 */
function parseSectionSpec(content: string): SectionSpec {
  const screens = parseScreenSpecs(content);
  
  // Extract overview section
  const overviewMatch = content.match(
    /##\s+Overview\s+([\s\S]*?)(?=\n##\s|$)/i
  );
  const overview = overviewMatch ? overviewMatch[1].trim() : "";
  
  return {
    overview,
    screens,
    rawContent: content,
  };
}

/**
 * Parses screen specifications from spec content
 */
function parseScreenSpecs(content: string): SectionScreenSpec[] {
  const screens: SectionScreenSpec[] = [];
  
  // Split by screen headings (### Screen Name)
  const screenBlocks = content.split(/(?=^###\s+(?!#))/m);
  
  for (const block of screenBlocks) {
    // Extract screen name
    const nameMatch = block.match(/^###\s+(.+)$/m);
    if (!nameMatch) continue;
    
    const name = nameMatch[1].trim();
    
    // Skip non-screen headings
    if (name.toLowerCase() === "overview" || name.toLowerCase() === "screens") {
      continue;
    }
    
    // Extract path
    const pathMatch = block.match(/\*\*Path:\*\*\s*`?([^`\n]+)`?/i);
    const path = pathMatch ? pathMatch[1].trim() : `/${name.toLowerCase().replace(/\s+/g, "-")}`;
    
    // Extract description (text after heading, before features)
    const descMatch = block.match(/^###\s+.+\n\n([\s\S]*?)(?=\n\*\*|$)/m);
    const description = descMatch ? descMatch[1].trim() : "";
    
    // Extract features
    const features = parseFeatures(block);
    
    // Extract fields (for form screens)
    const fields = parseFields(block);
    
    // Extract columns (for table screens)
    const columns = parseColumns(block);
    
    screens.push({
      name,
      path,
      description,
      features,
      fields: fields.length > 0 ? fields : undefined,
      columns: columns.length > 0 ? columns : undefined,
    });
  }
  
  return screens;
}

/**
 * Parses features list from a screen block
 */
function parseFeatures(block: string): string[] {
  const features: string[] = [];
  
  // Find **Features:** section
  const match = block.match(/\*\*Features:\*\*([\s\S]*?)(?=\n\*\*|\n###|$)/i);
  if (!match) return features;
  
  const lines = match[1].split("\n");
  for (const line of lines) {
    const featureMatch = line.match(/^-\s+(.+)$/);
    if (featureMatch) {
      features.push(featureMatch[1].trim());
    }
  }
  
  return features;
}

/**
 * Parses field definitions from a screen block (for forms)
 */
function parseFields(block: string): ScreenField[] {
  const fields: ScreenField[] = [];
  
  // Find **Fields:** section with table
  const match = block.match(/\*\*Fields:\*\*([\s\S]*?)(?=\n\*\*|\n###|$)/i);
  if (!match) return fields;
  
  // Parse markdown table
  const lines = match[1].split("\n").filter((l) => l.includes("|"));
  
  // Skip header and separator rows
  const dataRows = lines.slice(2);
  
  for (const row of dataRows) {
    const cells = row.split("|").map((c) => c.trim()).filter(Boolean);
    if (cells.length >= 3) {
      fields.push({
        name: cells[0],
        type: cells[1],
        required: cells[2].toLowerCase() === "yes",
        validation: cells[3],
      });
    }
  }
  
  return fields;
}

/**
 * Parses column definitions from a screen block (for tables)
 */
function parseColumns(block: string): ScreenColumn[] {
  const columns: ScreenColumn[] = [];
  
  // Find **Columns:** section with table
  const match = block.match(/\*\*Columns:\*\*([\s\S]*?)(?=\n\*\*|\n###|$)/i);
  if (!match) return columns;
  
  // Parse markdown table
  const lines = match[1].split("\n").filter((l) => l.includes("|"));
  
  // Skip header and separator rows
  const dataRows = lines.slice(2);
  
  for (const row of dataRows) {
    const cells = row.split("|").map((c) => c.trim()).filter(Boolean);
    if (cells.length >= 3) {
      columns.push({
        name: cells[0],
        sortable: cells[1].toLowerCase() === "yes",
        description: cells[2],
      });
    }
  }
  
  return columns;
}

// ==========================================
// UTILITY FUNCTIONS
// ==========================================

/**
 * Determines section status based on artifacts
 */
function determineSectionStatus(
  hasComponents: boolean,
  spec: SectionSpec | null
): SectionStatus {
  if (hasComponents) return "complete";
  if (spec) return "in-progress";
  return "planned";
}

/**
 * Gets list of screens for a section
 */
function getScreenList(
  sectionId: string,
  spec: SectionSpec | null
): SectionScreen[] {
  const screens: SectionScreen[] = [];
  
  if (spec) {
    for (const screenSpec of spec.screens) {
      const componentName = screenSpec.name.replace(/\s+/g, "");
      const componentPath = `/src/sections/${sectionId}/${componentName}.tsx`;
      
      screens.push({
        name: screenSpec.name,
        path: screenSpec.path,
        component: componentName,
        hasPreview: componentPath in sectionComponents,
      });
    }
  }
  
  // Also check for components without specs
  const componentPaths = Object.keys(sectionComponents).filter(
    (path) => path.includes(`/src/sections/${sectionId}/`)
  );
  
  for (const path of componentPaths) {
    const match = path.match(/\/([^/]+)\.tsx$/);
    if (match) {
      const componentName = match[1];
      // Check if already added from spec
      if (!screens.find((s) => s.component === componentName)) {
        screens.push({
          name: formatComponentName(componentName),
          path: `/${sectionId}/${componentName.toLowerCase()}`,
          component: componentName,
          hasPreview: true,
        });
      }
    }
  }
  
  return screens;
}

/**
 * Formats section ID to display name
 */
function formatSectionName(id: string): string {
  return id
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

/**
 * Formats component name for display
 */
function formatComponentName(name: string): string {
  // Convert PascalCase to Title Case with spaces
  return name.replace(/([A-Z])/g, " $1").trim();
}

// ==========================================
// EXPORT UTILITIES
// ==========================================

/**
 * Checks if any sections exist
 */
export function hasSections(): boolean {
  return getSectionIds().length > 0;
}

/**
 * Gets section data by ID
 */
export function getSectionData(sectionId: string): Record<string, unknown> | null {
  const path = `/product/sections/${sectionId}/data.json`;
  return sectionData[path] ?? null;
}

/**
 * Gets section types by ID
 */
export function getSectionTypes(sectionId: string): string | null {
  const path = `/product/sections/${sectionId}/types.ts`;
  return sectionTypes[path] ?? null;
}

/**
 * Gets section spec by ID
 */
export function getSectionSpec(sectionId: string): SectionSpec | null {
  const path = `/product/sections/${sectionId}/spec.md`;
  const content = sectionSpecs[path];
  return content ? parseSectionSpec(content) : null;
}
```

### 5.2 Usage Example

```typescript
import {
  loadAllSections,
  loadSection,
  getSectionIds,
  getSectionData,
  hasSections,
} from "@/lib/section-loader";

// Check if sections exist
if (!hasSections()) {
  console.log("No sections defined");
}

// Get all section IDs
const ids = getSectionIds();
console.log("Available sections:", ids);

// Load all sections
const sections = loadAllSections();
for (const section of sections) {
  console.log(`${section.name}: ${section.status}`);
  console.log(`  Screens: ${section.screens.length}`);
  console.log(`  Has data: ${section.data !== null}`);
}

// Load specific section
const patients = loadSection("patients");
if (patients) {
  console.log("Patients section:", patients);
  console.log("Sample data:", patients.data);
}
```

---

## Step 6: Create Design System Loader

This step creates the design system loader that loads color palettes and typography definitions from JSON files.

### 6.1 Create `src/lib/design-system-loader.ts`

```typescript
/**
 * Design System Loader
 * 
 * Loads design tokens (colors, typography) from the
 * product/design-system/ directory.
 */

import type {
  DesignSystem,
  DesignSystemColors,
  DesignSystemTypography,
  ColorScale,
} from "@/types/design-system";

// ==========================================
// FILE LOADING WITH VITE GLOB
// ==========================================

const designSystemFiles = import.meta.glob("/product/design-system/*.json", {
  import: "default",
  eager: true,
}) as Record<string, unknown>;

// ==========================================
// DEFAULT VALUES
// ==========================================

const defaultColors: DesignSystemColors = {
  name: "Default Design System",
  colors: {
    primary: {
      50: "#eff6ff",
      100: "#dbeafe",
      200: "#bfdbfe",
      300: "#93c5fd",
      400: "#60a5fa",
      500: "#3b82f6",
      600: "#2563eb",
      700: "#1d4ed8",
      800: "#1e40af",
      900: "#1e3a8a",
    },
    secondary: {
      50: "#f8fafc",
      100: "#f1f5f9",
      200: "#e2e8f0",
      300: "#cbd5e1",
      400: "#94a3b8",
      500: "#64748b",
      600: "#475569",
      700: "#334155",
      800: "#1e293b",
      900: "#0f172a",
    },
    neutral: {
      50: "#fafafa",
      100: "#f4f4f5",
      200: "#e4e4e7",
      300: "#d4d4d8",
      400: "#a1a1aa",
      500: "#71717a",
      600: "#52525b",
      700: "#3f3f46",
      800: "#27272a",
      900: "#18181b",
    },
    success: "#22c55e",
    warning: "#f59e0b",
    error: "#ef4444",
    info: "#3b82f6",
  },
};

const defaultTypography: DesignSystemTypography = {
  name: "Default Typography",
  fonts: {
    sans: {
      family: "DM Sans",
      weights: [400, 500, 600, 700],
      fallback: "system-ui, sans-serif",
    },
    mono: {
      family: "IBM Plex Mono",
      weights: [400, 500],
      fallback: "ui-monospace, monospace",
    },
  },
  sizes: {
    xs: { size: "0.75rem", lineHeight: "1rem" },
    sm: { size: "0.875rem", lineHeight: "1.25rem" },
    base: { size: "1rem", lineHeight: "1.5rem" },
    lg: { size: "1.125rem", lineHeight: "1.75rem" },
    xl: { size: "1.25rem", lineHeight: "1.75rem" },
    "2xl": { size: "1.5rem", lineHeight: "2rem" },
    "3xl": { size: "1.875rem", lineHeight: "2.25rem" },
    "4xl": { size: "2.25rem", lineHeight: "2.5rem" },
  },
  headings: {
    h1: { size: "2.25rem", weight: 700, lineHeight: "2.5rem" },
    h2: { size: "1.875rem", weight: 600, lineHeight: "2.25rem" },
    h3: { size: "1.5rem", weight: 600, lineHeight: "2rem" },
    h4: { size: "1.25rem", weight: 600, lineHeight: "1.75rem" },
    h5: { size: "1.125rem", weight: 500, lineHeight: "1.75rem" },
    h6: { size: "1rem", weight: 500, lineHeight: "1.5rem" },
  },
};

// ==========================================
// MAIN LOADER FUNCTIONS
// ==========================================

/**
 * Loads the complete design system (colors + typography)
 */
export function loadDesignSystem(): DesignSystem {
  return {
    colors: loadColors(),
    typography: loadTypography(),
  };
}

/**
 * Loads color definitions from colors.json
 */
export function loadColors(): DesignSystemColors {
  const content = designSystemFiles["/product/design-system/colors.json"];
  
  if (!content) {
    return defaultColors;
  }

  return validateColors(content as DesignSystemColors);
}

/**
 * Loads typography definitions from typography.json
 */
export function loadTypography(): DesignSystemTypography {
  const content = designSystemFiles["/product/design-system/typography.json"];
  
  if (!content) {
    return defaultTypography;
  }

  return validateTypography(content as DesignSystemTypography);
}

// ==========================================
// VALIDATION FUNCTIONS
// ==========================================

/**
 * Validates and normalizes color definitions
 */
function validateColors(input: unknown): DesignSystemColors {
  if (!input || typeof input !== "object") {
    return defaultColors;
  }

  const data = input as Record<string, unknown>;
  
  return {
    name: typeof data.name === "string" ? data.name : defaultColors.name,
    colors: {
      primary: validateColorScale(data.colors, "primary"),
      secondary: validateColorScale(data.colors, "secondary"),
      neutral: validateColorScale(data.colors, "neutral"),
      success: getColorValue(data.colors, "success", defaultColors.colors.success),
      warning: getColorValue(data.colors, "warning", defaultColors.colors.warning),
      error: getColorValue(data.colors, "error", defaultColors.colors.error),
      info: getColorValue(data.colors, "info", defaultColors.colors.info),
    },
  };
}

/**
 * Validates a color scale (50-900)
 */
function validateColorScale(
  colors: unknown,
  key: "primary" | "secondary" | "neutral"
): ColorScale {
  if (!colors || typeof colors !== "object") {
    return defaultColors.colors[key];
  }

  const data = colors as Record<string, unknown>;
  const scale = data[key];
  
  if (!scale || typeof scale !== "object") {
    return defaultColors.colors[key];
  }

  const scaleData = scale as Record<string, string>;
  const defaultScale = defaultColors.colors[key];

  return {
    50: scaleData["50"] ?? defaultScale["50"],
    100: scaleData["100"] ?? defaultScale["100"],
    200: scaleData["200"] ?? defaultScale["200"],
    300: scaleData["300"] ?? defaultScale["300"],
    400: scaleData["400"] ?? defaultScale["400"],
    500: scaleData["500"] ?? defaultScale["500"],
    600: scaleData["600"] ?? defaultScale["600"],
    700: scaleData["700"] ?? defaultScale["700"],
    800: scaleData["800"] ?? defaultScale["800"],
    900: scaleData["900"] ?? defaultScale["900"],
  };
}

/**
 * Gets a single color value with fallback
 */
function getColorValue(
  colors: unknown,
  key: string,
  defaultValue: string
): string {
  if (!colors || typeof colors !== "object") {
    return defaultValue;
  }
  
  const data = colors as Record<string, unknown>;
  const value = data[key];
  
  return typeof value === "string" ? value : defaultValue;
}

/**
 * Validates and normalizes typography definitions
 */
function validateTypography(input: unknown): DesignSystemTypography {
  if (!input || typeof input !== "object") {
    return defaultTypography;
  }

  const data = input as Record<string, unknown>;
  
  return {
    name: typeof data.name === "string" ? data.name : defaultTypography.name,
    fonts: validateFonts(data.fonts),
    sizes: validateSizes(data.sizes),
    headings: validateHeadings(data.headings),
  };
}

/**
 * Validates font definitions
 */
function validateFonts(
  fonts: unknown
): DesignSystemTypography["fonts"] {
  if (!fonts || typeof fonts !== "object") {
    return defaultTypography.fonts;
  }

  const data = fonts as Record<string, unknown>;
  
  return {
    sans: validateFontFamily(data.sans, defaultTypography.fonts.sans),
    mono: validateFontFamily(data.mono, defaultTypography.fonts.mono),
  };
}

/**
 * Validates a single font family
 */
function validateFontFamily(
  font: unknown,
  defaultFont: DesignSystemTypography["fonts"]["sans"]
): DesignSystemTypography["fonts"]["sans"] {
  if (!font || typeof font !== "object") {
    return defaultFont;
  }

  const data = font as Record<string, unknown>;
  
  return {
    family: typeof data.family === "string" ? data.family : defaultFont.family,
    weights: Array.isArray(data.weights) ? data.weights : defaultFont.weights,
    fallback: typeof data.fallback === "string" ? data.fallback : defaultFont.fallback,
  };
}

/**
 * Validates font sizes
 */
function validateSizes(
  sizes: unknown
): DesignSystemTypography["sizes"] {
  if (!sizes || typeof sizes !== "object") {
    return defaultTypography.sizes;
  }

  // Just return as-is with type assertion for now
  // In production, you'd validate each size
  return sizes as DesignSystemTypography["sizes"];
}

/**
 * Validates heading styles
 */
function validateHeadings(
  headings: unknown
): DesignSystemTypography["headings"] {
  if (!headings || typeof headings !== "object") {
    return defaultTypography.headings;
  }

  return headings as DesignSystemTypography["headings"];
}

// ==========================================
// UTILITY EXPORTS
// ==========================================

/**
 * Checks if custom colors are defined
 */
export function hasCustomColors(): boolean {
  return "/product/design-system/colors.json" in designSystemFiles;
}

/**
 * Checks if custom typography is defined
 */
export function hasCustomTypography(): boolean {
  return "/product/design-system/typography.json" in designSystemFiles;
}

/**
 * Checks if any design system files exist
 */
export function hasDesignTokens(): boolean {
  return hasCustomColors() || hasCustomTypography();
}

/**
 * Gets all color values as a flat list (for display)
 */
export function getAllColors(): Array<{ name: string; value: string }> {
  const colors = loadColors();
  const result: Array<{ name: string; value: string }> = [];
  
  // Add scale colors
  for (const [scaleName, scale] of Object.entries(colors.colors)) {
    if (typeof scale === "object") {
      for (const [shade, value] of Object.entries(scale)) {
        result.push({
          name: `${scaleName}-${shade}`,
          value: value as string,
        });
      }
    } else {
      result.push({
        name: scaleName,
        value: scale,
      });
    }
  }
  
  return result;
}

/**
 * Generates CSS custom properties from design tokens
 */
export function generateCSSTokens(): string {
  const colors = loadColors();
  const typography = loadTypography();
  
  let css = ":root {\n";
  
  // Add color tokens
  for (const [scaleName, scale] of Object.entries(colors.colors)) {
    if (typeof scale === "object") {
      for (const [shade, value] of Object.entries(scale)) {
        css += `  --color-${scaleName}-${shade}: ${value};\n`;
      }
    } else {
      css += `  --color-${scaleName}: ${scale};\n`;
    }
  }
  
  // Add font tokens
  css += `  --font-sans: "${typography.fonts.sans.family}", ${typography.fonts.sans.fallback};\n`;
  css += `  --font-mono: "${typography.fonts.mono.family}", ${typography.fonts.mono.fallback};\n`;
  
  css += "}\n";
  
  return css;
}
```

### 6.2 Usage Example

```typescript
import {
  loadDesignSystem,
  loadColors,
  loadTypography,
  hasDesignTokens,
  getAllColors,
  generateCSSTokens,
} from "@/lib/design-system-loader";

// Check if design tokens exist
console.log("Has design tokens:", hasDesignTokens());

// Load complete design system
const designSystem = loadDesignSystem();
console.log("Colors:", designSystem.colors);
console.log("Typography:", designSystem.typography);

// Get all colors for display
const colorList = getAllColors();
colorList.forEach(({ name, value }) => {
  console.log(`${name}: ${value}`);
});

// Generate CSS
const css = generateCSSTokens();
console.log(css);
```

---

## Step 7: Create Shell Loader

This step creates the shell loader that loads app shell specifications and checks for shell component implementations.

### 7.1 Create `src/lib/shell-loader.ts`

```typescript
/**
 * Shell Loader
 * 
 * Loads shell specifications and component information from
 * the product/shell/ and src/shell/ directories.
 */

import type {
  ShellSpec,
  ShellLayout,
  NavigationItem,
  ShellComponent,
  ResponsiveBehavior,
  ShellComponents,
} from "@/types/shell";

// ==========================================
// FILE LOADING WITH VITE GLOB
// ==========================================

// Load shell spec
const shellSpecs = import.meta.glob("/product/shell/*.md", {
  query: "?raw",
  import: "default",
  eager: true,
}) as Record<string, string>;

// Check for shell component implementations
const shellComponents = import.meta.glob("/src/shell/components/*.tsx", {
  query: "?raw",
  import: "default",
  eager: true,
}) as Record<string, string>;

// Load shell preview wrapper
const shellPreview = import.meta.glob("/src/shell/ShellPreview.tsx", {
  query: "?raw",
  import: "default",
  eager: true,
}) as Record<string, string>;

// ==========================================
// MAIN LOADER FUNCTIONS
// ==========================================

/**
 * Loads and parses the shell specification
 */
export function loadShellSpec(): ShellSpec | null {
  const content = shellSpecs["/product/shell/spec.md"];
  
  if (!content) {
    return null;
  }

  return parseShellSpec(content);
}

/**
 * Checks what shell components are implemented
 */
export function loadShellComponents(): ShellComponents {
  const componentPaths = Object.keys(shellComponents);
  
  const components = componentPaths.map((path) => {
    const match = path.match(/\/([^/]+)\.tsx$/);
    return match ? match[1] : null;
  }).filter(Boolean) as string[];
  
  return {
    hasAppShell: components.includes("AppShell"),
    hasMainNav: components.includes("MainNav"),
    hasUserMenu: components.includes("UserMenu"),
    hasHeader: components.includes("Header"),
    hasSidebar: components.includes("Sidebar"),
    components,
  };
}

// ==========================================
// SPEC PARSING
// ==========================================

/**
 * Parses the shell spec markdown
 */
function parseShellSpec(content: string): ShellSpec {
  return {
    overview: extractOverview(content),
    layout: extractLayout(content),
    navigation: extractNavigation(content),
    components: extractComponents(content),
    responsiveBehavior: extractResponsiveBehavior(content),
    rawContent: content,
  };
}

/**
 * Extracts overview section
 */
function extractOverview(content: string): string {
  const match = content.match(/##\s+Overview\s+([\s\S]*?)(?=\n##\s|$)/i);
  return match ? match[1].trim() : "";
}

/**
 * Extracts layout structure
 */
function extractLayout(content: string): ShellLayout {
  const match = content.match(/##\s+Layout\s+Structure\s+([\s\S]*?)(?=\n##\s|$)/i);
  
  if (!match) {
    return { description: "", structure: "" };
  }
  
  const section = match[1];
  
  // Extract code block (ASCII diagram)
  const codeMatch = section.match(/```[\s\S]*?\n([\s\S]*?)```/);
  const structure = codeMatch ? codeMatch[1].trim() : "";
  
  // Description is text before the code block
  const description = section.split("```")[0].trim();
  
  return { description, structure };
}

/**
 * Extracts navigation items from table
 */
function extractNavigation(content: string): NavigationItem[] {
  const items: NavigationItem[] = [];
  
  // Find Navigation Items section
  const match = content.match(/##\s+Navigation\s+Items\s+([\s\S]*?)(?=\n##\s|$)/i);
  if (!match) return items;
  
  // Parse markdown table
  const lines = match[1].split("\n").filter((l) => l.includes("|"));
  
  // Skip header and separator rows
  const dataRows = lines.slice(2);
  
  for (const row of dataRows) {
    const cells = row.split("|").map((c) => c.trim()).filter(Boolean);
    if (cells.length >= 4) {
      items.push({
        label: cells[0],
        icon: cells[1],
        path: cells[2],
        description: cells[3],
      });
    }
  }
  
  return items;
}

/**
 * Extracts component descriptions
 */
function extractComponents(content: string): ShellComponent[] {
  const components: ShellComponent[] = [];
  
  // Find Components section
  const match = content.match(/##\s+Components\s+([\s\S]*?)(?=\n##\s|$)/i);
  if (!match) return components;
  
  const section = match[1];
  
  // Match ### ComponentName patterns
  const componentBlocks = section.split(/(?=^###\s+)/m);
  
  for (const block of componentBlocks) {
    const nameMatch = block.match(/^###\s+(\w+)/);
    if (!nameMatch) continue;
    
    const name = nameMatch[1];
    
    // Get description (text after heading)
    const descMatch = block.match(/^###\s+\w+\s*\n([\s\S]*?)(?=\n###|$)/m);
    const description = descMatch ? descMatch[1].trim() : "";
    
    components.push({ name, description });
  }
  
  return components;
}

/**
 * Extracts responsive behavior
 */
function extractResponsiveBehavior(content: string): ResponsiveBehavior[] {
  const behaviors: ResponsiveBehavior[] = [];
  
  // Find Responsive Behavior section
  const match = content.match(/##\s+Responsive\s+Behavior\s+([\s\S]*?)(?=\n##\s|$)/i);
  if (!match) return behaviors;
  
  const section = match[1];
  
  // Match bullet points with breakpoint info
  const lines = section.split("\n");
  
  for (const line of lines) {
    // Pattern: - **Breakpoint (range):** behavior
    const behaviorMatch = line.match(
      /^-\s+\*\*(\w+)\s*\(([^)]+)\):\*\*\s*(.+)$/
    );
    
    if (behaviorMatch) {
      behaviors.push({
        breakpoint: behaviorMatch[1],
        range: behaviorMatch[2],
        behavior: behaviorMatch[3],
      });
    }
  }
  
  return behaviors;
}

// ==========================================
// UTILITY EXPORTS
// ==========================================

/**
 * Checks if shell spec exists
 */
export function hasShellSpec(): boolean {
  return "/product/shell/spec.md" in shellSpecs;
}

/**
 * Checks if shell components are implemented
 */
export function hasShellComponents(): boolean {
  return Object.keys(shellComponents).length > 0;
}

/**
 * Checks if shell preview is available
 */
export function hasShellPreview(): boolean {
  return "/src/shell/ShellPreview.tsx" in shellPreview;
}

/**
 * Gets shell component source code
 */
export function getShellComponentSource(
  componentName: string
): string | null {
  const path = `/src/shell/components/${componentName}.tsx`;
  return shellComponents[path] ?? null;
}

/**
 * Gets all shell component names
 */
export function getShellComponentNames(): string[] {
  const components = loadShellComponents();
  return components.components;
}

/**
 * Gets navigation items for the shell
 */
export function getNavigationItems(): NavigationItem[] {
  const spec = loadShellSpec();
  return spec?.navigation ?? [];
}
```

### 7.2 Usage Example

```typescript
import {
  loadShellSpec,
  loadShellComponents,
  hasShellSpec,
  hasShellComponents,
  getNavigationItems,
} from "@/lib/shell-loader";

// Check if shell spec exists
if (!hasShellSpec()) {
  console.log("No shell specification found");
}

// Load shell spec
const spec = loadShellSpec();
if (spec) {
  console.log("Overview:", spec.overview);
  console.log("Layout:", spec.layout.structure);
  console.log("Navigation items:", spec.navigation);
}

// Check implemented components
const components = loadShellComponents();
console.log("Has AppShell:", components.hasAppShell);
console.log("Has MainNav:", components.hasMainNav);
console.log("All components:", components.components);

// Get navigation for rendering
const navItems = getNavigationItems();
navItems.forEach((item) => {
  console.log(`${item.label} -> ${item.path}`);
});
```

---

## Step 8: Create Markdown Parser Utility

This step creates a reusable markdown parsing utility that can be used across all loaders for consistent parsing behavior.

### 8.1 Create `src/lib/markdown-parser.ts`

```typescript
/**
 * Markdown Parser Utility
 * 
 * Provides utility functions for parsing markdown content
 * into structured data. Used by product, section, and shell loaders.
 */

// ==========================================
// TYPES
// ==========================================

export interface ParsedHeading {
  level: number;
  text: string;
  line: number;
}

export interface ParsedSection {
  heading: string;
  level: number;
  content: string;
  startLine: number;
  endLine: number;
}

export interface ParsedTable {
  headers: string[];
  rows: string[][];
}

export interface ParsedListItem {
  text: string;
  indent: number;
  isOrdered: boolean;
  children: ParsedListItem[];
}

// ==========================================
// HEADING PARSING
// ==========================================

/**
 * Extracts all headings from markdown content
 */
export function parseHeadings(content: string): ParsedHeading[] {
  const headings: ParsedHeading[] = [];
  const lines = content.split("\n");
  
  for (let i = 0; i < lines.length; i++) {
    const match = lines[i].match(/^(#{1,6})\s+(.+)$/);
    if (match) {
      headings.push({
        level: match[1].length,
        text: match[2].trim(),
        line: i + 1,
      });
    }
  }
  
  return headings;
}

/**
 * Gets the main title (first H1) from markdown
 */
export function getTitle(content: string): string | null {
  const match = content.match(/^#\s+(.+)$/m);
  return match ? match[1].trim() : null;
}

// ==========================================
// SECTION PARSING
// ==========================================

/**
 * Splits content into sections by heading level
 */
export function parseSections(
  content: string,
  level: number = 2
): ParsedSection[] {
  const sections: ParsedSection[] = [];
  const lines = content.split("\n");
  const headingPattern = new RegExp(`^${"#".repeat(level)}\\s+(.+)$`);
  
  let currentSection: ParsedSection | null = null;
  let contentLines: string[] = [];
  
  for (let i = 0; i < lines.length; i++) {
    const match = lines[i].match(headingPattern);
    
    if (match) {
      // Save previous section
      if (currentSection) {
        currentSection.content = contentLines.join("\n").trim();
        currentSection.endLine = i;
        sections.push(currentSection);
      }
      
      // Start new section
      currentSection = {
        heading: match[1].trim(),
        level,
        content: "",
        startLine: i + 1,
        endLine: -1,
      };
      contentLines = [];
    } else if (currentSection) {
      contentLines.push(lines[i]);
    }
  }
  
  // Save last section
  if (currentSection) {
    currentSection.content = contentLines.join("\n").trim();
    currentSection.endLine = lines.length;
    sections.push(currentSection);
  }
  
  return sections;
}

/**
 * Extracts a specific section by heading name
 */
export function getSection(
  content: string,
  sectionName: string,
  level: number = 2
): string | null {
  const escapedName = sectionName.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const pattern = new RegExp(
    `^${"#".repeat(level)}\\s+${escapedName}\\s*\\n([\\s\\S]*?)(?=\\n${"#".repeat(level)}\\s|$)`,
    "im"
  );
  
  const match = content.match(pattern);
  return match ? match[1].trim() : null;
}

// ==========================================
// TABLE PARSING
// ==========================================

/**
 * Parses a markdown table into headers and rows
 */
export function parseTable(content: string): ParsedTable | null {
  const lines = content.split("\n").filter((l) => l.trim().startsWith("|"));
  
  if (lines.length < 2) return null;
  
  // Parse header row
  const headers = parseTableRow(lines[0]);
  
  // Skip separator row (index 1)
  // Parse data rows
  const rows: string[][] = [];
  for (let i = 2; i < lines.length; i++) {
    const row = parseTableRow(lines[i]);
    if (row.length > 0) {
      rows.push(row);
    }
  }
  
  return { headers, rows };
}

/**
 * Parses a single table row
 */
function parseTableRow(line: string): string[] {
  return line
    .split("|")
    .map((cell) => cell.trim())
    .filter((cell) => cell && !cell.match(/^[-:]+$/));
}

/**
 * Finds and parses a table after a specific heading
 */
export function getTableAfterHeading(
  content: string,
  headingName: string
): ParsedTable | null {
  const section = getSection(content, headingName);
  if (!section) return null;
  return parseTable(section);
}

// ==========================================
// LIST PARSING
// ==========================================

/**
 * Parses a markdown list into structured items
 */
export function parseList(content: string): ParsedListItem[] {
  const items: ParsedListItem[] = [];
  const lines = content.split("\n");
  
  for (const line of lines) {
    // Match unordered list: - or *
    const unorderedMatch = line.match(/^(\s*)[-*]\s+(.+)$/);
    // Match ordered list: 1. or 1)
    const orderedMatch = line.match(/^(\s*)\d+[.)]\s+(.+)$/);
    
    const match = unorderedMatch || orderedMatch;
    if (match) {
      items.push({
        text: match[2].trim(),
        indent: match[1].length,
        isOrdered: !!orderedMatch,
        children: [],
      });
    }
  }
  
  return items;
}

/**
 * Builds a nested list structure from flat items
 */
export function buildNestedList(items: ParsedListItem[]): ParsedListItem[] {
  if (items.length === 0) return [];
  
  const result: ParsedListItem[] = [];
  const stack: ParsedListItem[] = [];
  
  for (const item of items) {
    // Find parent based on indent
    while (stack.length > 0 && stack[stack.length - 1].indent >= item.indent) {
      stack.pop();
    }
    
    if (stack.length === 0) {
      result.push(item);
    } else {
      stack[stack.length - 1].children.push(item);
    }
    
    stack.push(item);
  }
  
  return result;
}

// ==========================================
// TEXT EXTRACTION
// ==========================================

/**
 * Extracts bold text (**text**)
 */
export function extractBoldText(content: string): string[] {
  const matches = content.match(/\*\*([^*]+)\*\*/g) || [];
  return matches.map((m) => m.replace(/\*\*/g, ""));
}

/**
 * Extracts inline code (`code`)
 */
export function extractInlineCode(content: string): string[] {
  const matches = content.match(/`([^`]+)`/g) || [];
  return matches.map((m) => m.replace(/`/g, ""));
}

/**
 * Extracts code blocks
 */
export function extractCodeBlocks(
  content: string
): Array<{ language: string; code: string }> {
  const blocks: Array<{ language: string; code: string }> = [];
  const regex = /```(\w*)\n([\s\S]*?)```/g;
  
  let match;
  while ((match = regex.exec(content)) !== null) {
    blocks.push({
      language: match[1] || "text",
      code: match[2].trim(),
    });
  }
  
  return blocks;
}

/**
 * Extracts blockquotes (> text)
 */
export function extractBlockquotes(content: string): string[] {
  const matches = content.match(/^>\s*(.+)$/gm) || [];
  return matches.map((m) => m.replace(/^>\s*/, "").trim());
}

// ==========================================
// FRONT MATTER PARSING
// ==========================================

/**
 * Parses YAML front matter from markdown
 */
export function parseFrontMatter(
  content: string
): Record<string, string> | null {
  const match = content.match(/^---\n([\s\S]*?)\n---/);
  if (!match) return null;
  
  const frontMatter: Record<string, string> = {};
  const lines = match[1].split("\n");
  
  for (const line of lines) {
    const [key, ...valueParts] = line.split(":");
    if (key && valueParts.length > 0) {
      frontMatter[key.trim()] = valueParts.join(":").trim();
    }
  }
  
  return frontMatter;
}

/**
 * Removes front matter from content
 */
export function stripFrontMatter(content: string): string {
  return content.replace(/^---\n[\s\S]*?\n---\n/, "").trim();
}

// ==========================================
// UTILITY FUNCTIONS
// ==========================================

/**
 * Converts markdown to plain text (strips formatting)
 */
export function toPlainText(content: string): string {
  return content
    .replace(/\*\*([^*]+)\*\*/g, "$1") // Bold
    .replace(/\*([^*]+)\*/g, "$1") // Italic
    .replace(/`([^`]+)`/g, "$1") // Inline code
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1") // Links
    .replace(/^#+\s+/gm, "") // Headings
    .replace(/^[-*]\s+/gm, "") // List items
    .replace(/^\d+\.\s+/gm, "") // Ordered list items
    .replace(/^>\s+/gm, "") // Blockquotes
    .trim();
}

/**
 * Counts words in markdown content
 */
export function countWords(content: string): number {
  const plainText = toPlainText(content);
  const words = plainText.split(/\s+/).filter((w) => w.length > 0);
  return words.length;
}

/**
 * Estimates reading time in minutes
 */
export function estimateReadingTime(content: string): number {
  const words = countWords(content);
  const wordsPerMinute = 200;
  return Math.ceil(words / wordsPerMinute);
}
```

### 8.2 Usage Example

```typescript
import {
  parseHeadings,
  parseSections,
  getSection,
  parseTable,
  parseList,
  extractCodeBlocks,
  parseFrontMatter,
  estimateReadingTime,
} from "@/lib/markdown-parser";

const markdown = `
# My Document

## Introduction

This is the introduction section.

## Features

| Feature | Status |
|---------|--------|
| Auth | Done |
| API | In Progress |

- Feature 1
- Feature 2
- Feature 3
`;

// Get all headings
const headings = parseHeadings(markdown);
console.log("Headings:", headings);

// Get specific section
const intro = getSection(markdown, "Introduction");
console.log("Introduction:", intro);

// Parse table
const featuresSection = getSection(markdown, "Features");
const table = parseTable(featuresSection!);
console.log("Table:", table);

// Estimate reading time
const time = estimateReadingTime(markdown);
console.log(`Reading time: ${time} min`);
```

---

## Verification Checklist

Use this checklist to verify that Phase 2 is complete and working correctly.

### Sample Files Verification

- [ ] `product/product-overview.md` exists and contains valid markdown
- [ ] `product/product-roadmap.md` exists and contains valid markdown
- [ ] `product/data-model/data-model.md` exists
- [ ] `product/design-system/colors.json` exists and is valid JSON
- [ ] `product/design-system/typography.json` exists and is valid JSON
- [ ] `product/shell/spec.md` exists
- [ ] `product/sections/patients/spec.md` exists
- [ ] `product/sections/patients/data.json` exists and is valid JSON
- [ ] `product/sections/patients/types.ts` exists
- [ ] `prisma/schema.prisma` exists and is valid Prisma schema
- [ ] `lib/validators.ts` exists and compiles without errors

### Type Definitions Verification

- [ ] `src/types/product.ts` compiles without errors
- [ ] `src/types/schema.ts` compiles without errors
- [ ] `src/types/section.ts` compiles without errors
- [ ] `src/types/design-system.ts` compiles without errors
- [ ] `src/types/shell.ts` compiles without errors
- [ ] `src/types/index.ts` exports all types correctly

### Loader Verification

Run these tests in the browser console or create a test file:

```typescript
// Test in browser console or a test component

// 1. Product Loader
import { loadProductOverview, loadProductRoadmap } from "@/lib/product-loader";

const overview = loadProductOverview();
console.assert(overview !== null, "Product overview should load");
console.assert(overview?.name !== "", "Product name should not be empty");
console.log("✓ Product loader works");

// 2. Schema Loader
import { loadPrismaSchema, getModelNames } from "@/lib/schema-loader";

const schema = loadPrismaSchema();
console.assert(schema !== null, "Schema should load");
console.assert(schema?.models.length > 0, "Should have models");
console.log("✓ Schema loader works");

// 3. Section Loader
import { loadAllSections, getSectionIds } from "@/lib/section-loader";

const sections = loadAllSections();
console.assert(sections.length > 0, "Should have sections");
console.log("✓ Section loader works");

// 4. Design System Loader
import { loadDesignSystem, hasDesignTokens } from "@/lib/design-system-loader";

const designSystem = loadDesignSystem();
console.assert(designSystem.colors !== null, "Should have colors");
console.log("✓ Design system loader works");

// 5. Shell Loader
import { loadShellSpec, hasShellSpec } from "@/lib/shell-loader";

const shellSpec = loadShellSpec();
console.assert(shellSpec !== null, "Shell spec should load");
console.log("✓ Shell loader works");

console.log("\n🎉 All loaders working correctly!");
```

### Quick Verification Component

Create a temporary test component to verify all loaders:

```typescript
// src/components/DebugLoaders.tsx (temporary - remove after verification)

import { loadProductOverview, loadProductRoadmap } from "@/lib/product-loader";
import { loadPrismaSchema } from "@/lib/schema-loader";
import { loadAllSections } from "@/lib/section-loader";
import { loadDesignSystem } from "@/lib/design-system-loader";
import { loadShellSpec } from "@/lib/shell-loader";

export function DebugLoaders() {
  const overview = loadProductOverview();
  const roadmap = loadProductRoadmap();
  const schema = loadPrismaSchema();
  const sections = loadAllSections();
  const designSystem = loadDesignSystem();
  const shellSpec = loadShellSpec();

  return (
    <div className="p-8 space-y-4">
      <h1 className="text-2xl font-bold">Phase 2 Verification</h1>
      
      <div className="grid gap-4">
        <VerifyCard
          title="Product Overview"
          status={overview !== null}
          details={overview ? `Name: ${overview.name}` : "Not loaded"}
        />
        
        <VerifyCard
          title="Product Roadmap"
          status={roadmap !== null}
          details={roadmap ? `Phases: ${roadmap.phases.length}` : "Not loaded"}
        />
        
        <VerifyCard
          title="Prisma Schema"
          status={schema !== null}
          details={schema ? `Models: ${schema.models.map(m => m.name).join(", ")}` : "Not loaded"}
        />
        
        <VerifyCard
          title="Sections"
          status={sections.length > 0}
          details={`Found ${sections.length} sections: ${sections.map(s => s.name).join(", ")}`}
        />
        
        <VerifyCard
          title="Design System"
          status={designSystem.colors !== null}
          details={designSystem.colors ? `Colors: ${designSystem.colors.name}` : "Using defaults"}
        />
        
        <VerifyCard
          title="Shell Spec"
          status={shellSpec !== null}
          details={shellSpec ? `Nav items: ${shellSpec.navigation.length}` : "Not loaded"}
        />
      </div>
    </div>
  );
}

function VerifyCard({ 
  title, 
  status, 
  details 
}: { 
  title: string; 
  status: boolean; 
  details: string;
}) {
  return (
    <div className={`p-4 rounded-lg border ${
      status ? "bg-green-50 border-green-200" : "bg-red-50 border-red-200"
    }`}>
      <div className="flex items-center gap-2">
        <span>{status ? "✓" : "✗"}</span>
        <span className="font-medium">{title}</span>
      </div>
      <p className="text-sm text-muted-foreground mt-1">{details}</p>
    </div>
  );
}
```

### Terminal Verification Commands

```bash
# Check TypeScript compilation
npm run build

# Run development server
npm run dev

# Check for type errors
npx tsc --noEmit

# Verify all files exist
ls -la product/
ls -la product/sections/patients/
ls -la prisma/
ls -la src/lib/
ls -la src/types/
```

---

## File Structure Summary

After completing Phase 2, your project should have this structure:

```
vibe-architect/
├── index.html
├── package.json
├── vite.config.ts
├── tsconfig.json
│
├── product/                              # Product definition files
│   ├── product-overview.md               # Product vision and features
│   ├── product-roadmap.md                # Development phases and sections
│   ├── data-model/
│   │   └── data-model.md                 # Data model documentation
│   ├── design-system/
│   │   ├── colors.json                   # Color palette
│   │   └── typography.json               # Typography settings
│   ├── shell/
│   │   └── spec.md                       # App shell specification
│   └── sections/
│       └── patients/
│           ├── spec.md                   # Section specification
│           ├── data.json                 # Sample data
│           └── types.ts                  # TypeScript interfaces
│
├── prisma/
│   └── schema.prisma                     # Database schema
│
├── lib/
│   └── validators.ts                     # Zod validation schemas
│
└── src/
    ├── main.tsx                          # Entry point (from Phase 1)
    ├── index.css                         # Tailwind styles (from Phase 1)
    │
    ├── types/                            # TypeScript type definitions
    │   ├── index.ts                      # Barrel export
    │   ├── product.ts                    # Product overview/roadmap types
    │   ├── schema.ts                     # Prisma schema types
    │   ├── section.ts                    # Section data types
    │   ├── design-system.ts              # Design token types
    │   └── shell.ts                      # Shell specification types
    │
    ├── lib/                              # Utility libraries
    │   ├── utils.ts                      # cn() helper (from Phase 1)
    │   ├── router.tsx                    # Router config (from Phase 1)
    │   ├── product-loader.ts             # Product markdown loader
    │   ├── schema-loader.ts              # Prisma schema parser
    │   ├── section-loader.ts             # Section data loader
    │   ├── design-system-loader.ts       # Design tokens loader
    │   ├── shell-loader.ts               # Shell spec loader
    │   └── markdown-parser.ts            # Markdown parsing utilities
    │
    ├── components/
    │   ├── ui/                           # shadcn/ui components (from Phase 1)
    │   │   ├── button.tsx
    │   │   └── card.tsx
    │   └── layout/                       # Layout components (from Phase 1)
    │       ├── AppLayout.tsx
    │       ├── TabNav.tsx
    │       └── ThemeToggle.tsx
    │
    └── pages/                            # Page components (from Phase 1)
        ├── PlanPage.tsx
        ├── DataPage.tsx
        ├── DesignsPage.tsx
        └── ExportPage.tsx
```

---

## Summary

### What We Built in Phase 2

| Item | Description |
|------|-------------|
| **Sample Product Files** | Created representative markdown, JSON, and Prisma files for testing |
| **Type Definitions** | Defined TypeScript interfaces for all data structures |
| **Product Loader** | Parses product-overview.md and product-roadmap.md |
| **Schema Loader** | Parses Prisma schema into models, fields, and relations |
| **Section Loader** | Loads section specs, sample data, and types |
| **Design System Loader** | Loads color and typography tokens with fallbacks |
| **Shell Loader** | Loads app shell specifications |
| **Markdown Parser** | Reusable utilities for parsing markdown content |

### Key Patterns Used

1. **Vite's `import.meta.glob`** - Build-time file loading for static assets
2. **Type-safe parsing** - All parsers return strongly-typed objects
3. **Graceful fallbacks** - Loaders return defaults when files are missing
4. **Utility extraction** - Common parsing logic in `markdown-parser.ts`

### What's Next (Phase 3)

Phase 3 will build the **Plan Tab** UI components:

- Markdown renderer component
- Product overview card
- Features list component
- Roadmap timeline component
- Empty state handling

These components will use the loaders created in Phase 2 to display the product data.

---

## Troubleshooting

### Common Issues

#### "Cannot find module" errors

```bash
# Ensure all dependencies are installed
npm install

# Clear Vite cache
rm -rf node_modules/.vite
npm run dev
```

#### TypeScript errors in loaders

```bash
# Check TypeScript configuration
npx tsc --noEmit

# Ensure path aliases are configured
# Check tsconfig.json has @/* path alias
```

#### Files not loading

1. Check file paths match exactly (case-sensitive)
2. Verify files are in the correct directories
3. Restart the dev server after adding new files

#### JSON parsing errors

```bash
# Validate JSON files
npx jsonlint product/design-system/colors.json
npx jsonlint product/design-system/typography.json
```

### Debug Tips

1. **Console logging** - Add `console.log` in loaders to see raw file content
2. **Check glob patterns** - Use `Object.keys()` on glob results to see loaded paths
3. **Type assertions** - Use `as unknown as T` carefully with proper validation

---

*End of Phase 2 Implementation Plan*
