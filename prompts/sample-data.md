# Sample Data Prompt

Generate realistic sample data for a specific section.

## Instructions

Read the existing files first:
- `prisma/schema.prisma` - For data model structure
- `lib/validators.ts` - For validation rules
- `product/sections/[section]/types.ts` - For TypeScript types (if exists)

Then create/update the following files:

### 1. `product/sections/[section]/data.json`

Sample data with:
- 10-20 realistic entries
- Variety in data (different statuses, dates, values)
- Relationships properly linked
- Realistic names, emails, dates, etc.

### 2. `product/sections/[section]/types.ts`

TypeScript types matching the data structure (if not exists).

## Output Format

### product/sections/[section]/data.json
```json
{
  "items": [
    {
      "id": "clx1234567890",
      "name": "John Smith",
      "email": "john.smith@example.com",
      "status": "active",
      "createdAt": "2024-01-15T10:30:00Z",
      "updatedAt": "2024-01-20T14:45:00Z"
    },
    {
      "id": "clx0987654321",
      "name": "Jane Doe",
      "email": "jane.doe@example.com",
      "status": "pending",
      "createdAt": "2024-01-18T09:15:00Z",
      "updatedAt": "2024-01-18T09:15:00Z"
    }
    // ... more entries
  ],
  "metadata": {
    "total": 20,
    "generated": "2024-01-20"
  }
}
```

### product/sections/[section]/types.ts
```typescript
export interface [Entity] {
  id: string;
  name: string;
  email: string;
  status: "active" | "pending" | "inactive";
  createdAt: string;
  updatedAt: string;
}

export interface [Section]Data {
  items: [Entity][];
  metadata: {
    total: number;
    generated: string;
  };
}
```

## Guidelines for Realistic Data

1. **Names**: Use diverse, realistic names
2. **Emails**: Match the name (john.smith@example.com)
3. **Dates**: Use recent, logical dates (created before updated)
4. **IDs**: Use cuid-style IDs (clx...)
5. **Status**: Distribute across different statuses
6. **Numbers**: Use realistic ranges

## Your Task

Generate sample data for:

---

**Section:** [SECTION_NAME]

**[DESCRIBE ANY SPECIFIC DATA REQUIREMENTS HERE]**

Example:
```
Section: patients

Generate 15 patient records with:
- Mix of active (70%), inactive (20%), pending (10%)
- Various age ranges (18-85)
- Different insurance providers
- Some with upcoming appointments, some without
- Include phone numbers and addresses
```
