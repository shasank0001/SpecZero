# Design Screen Prompt

Generate UI components for a specific feature section.

## Instructions

Read the existing files first:
- `product/product-overview.md` - For context
- `product/product-roadmap.md` - For section details
- `prisma/schema.prisma` - For data models
- `lib/validators.ts` - For validation schemas
- `product/design-system/colors.json` - For colors
- `product/design-system/typography.json` - For typography

Then create the following files for the specified section:

### 1. `product/sections/[section]/spec.md`

Section specification with:
- Purpose and user stories
- Component breakdown
- Interactions and flows
- Mockup descriptions

### 2. `product/sections/[section]/types.ts`

TypeScript types for:
- Component props
- Form data types
- State types

### 3. `product/sections/[section]/data.json`

Sample data for development and preview.

### 4. UI Components

- `src/sections/[section]/components/[Section]List.tsx`
- `src/sections/[section]/components/[Section]Card.tsx`
- `src/sections/[section]/components/[Section]Form.tsx`
- `src/sections/[section]/components/[Section]Detail.tsx`

## Output Format

### product/sections/[section]/spec.md
```markdown
# [Section Name] Screen Specification

## Purpose
[What does this screen do?]

## User Stories
- As a [user], I want to [action] so that [benefit]

## Components

### [Component Name]
- **Purpose**: [what it does]
- **Props**: [input props]
- **Behavior**: [interactions]

## Flows
1. [Flow 1 description]
2. [Flow 2 description]
```

### product/sections/[section]/types.ts
```typescript
export interface [Entity] {
  id: string;
  // fields...
}

export interface [Entity]ListProps {
  items: [Entity][];
  onSelect?: (item: [Entity]) => void;
}

export interface [Entity]FormData {
  // form fields...
}
```

### product/sections/[section]/data.json
```json
{
  "items": [
    {
      "id": "1",
      // sample data...
    }
  ]
}
```

## Your Task

Generate the specification, types, sample data, and components for:

---

**Section:** [SECTION_NAME]

**[DESCRIBE THE SCREEN REQUIREMENTS HERE]**

Example:
```
Section: patients

Create a patient management screen with:
- Patient list table with search and filters
- Patient detail card showing full info
- Add/Edit patient form with validation
- Delete confirmation dialog
- Filter by status (active, inactive)
- Sort by name, date added
```
