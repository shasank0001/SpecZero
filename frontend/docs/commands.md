# AI Commands Reference

SpecZero uses AI prompt commands to generate project files. These prompts work with any AI coding agent.

## Using Commands

### VS Code with GitHub Copilot

Reference the prompt file in Copilot Chat:
```
#file:prompts/product-vision.md

[Your product description here]
```

Or attach the file directly to your chat message.

### Cursor / Windsurf

Use the slash command directly:
```
/product-vision

[Your product description here]
```

---

## Product Vision Commands

### `/product-vision`
**Prompt file:** `prompts/product-vision.md`

Generate product overview and roadmap.

**Output:**
- `product/product-overview.md`
- `product/product-roadmap.md`

**Example prompt:**
```
/product-vision

Build a dental clinic management system. Features:
- Patient management
- Appointment scheduling
- Treatment records
- Billing and invoices

Target users: Dental clinic staff and administrators.
```

## Database Commands

### `/architect-database`
**Prompt file:** `prompts/architect-database.md`

Generate Prisma schema and Zod validators.

**Output:**
- `prisma/schema.prisma`
- `lib/validators.ts`
- `product/data-model/data-model.md`

**Example prompt:**
```
/architect-database

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

## Design Commands

### `/design-tokens`
**Prompt file:** `prompts/design-tokens.md`

Generate color palette and typography definitions.

**Output:**
- `product/design-system/colors.json`
- `product/design-system/typography.json`

### `/design-shell`
**Prompt file:** `prompts/design-shell.md`

Generate app shell (navigation, sidebar, user menu).

**Output:**
- `src/shell/components/AppShell.tsx`
- `src/shell/components/MainNav.tsx`
- `src/shell/components/UserMenu.tsx`
- `product/shell/spec.md`

### `/design-screen [section]`
**Prompt file:** `prompts/design-screen.md`

Generate UI components for a specific feature section.

**Output:**
- `src/sections/[section]/components/*.tsx`
- `product/sections/[section]/spec.md`
- `product/sections/[section]/data.json`
- `product/sections/[section]/types.ts`

**Example:**
```
/design-screen patients

Create a patient management screen with:
- Patient list table with search and filters
- Patient detail card
- Add/Edit patient form
- Delete confirmation dialog
```

### `/sample-data [section]`
**Prompt file:** `prompts/sample-data.md`

Generate sample data for a section.

**Output:**
- `product/sections/[section]/data.json`
- `product/sections/[section]/types.ts`

## Tips for Better Results

1. **Be specific** - Provide detailed descriptions of what you want
2. **Include context** - Mention your target users and use cases
3. **Iterate** - Refine outputs by providing feedback
4. **Reference existing files** - Ask the agent to check existing schemas/components

