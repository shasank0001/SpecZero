# Getting Started with SpecZero

This guide walks you through creating your first project with SpecZero (Vibe Architect).

## Prerequisites

- Node.js 18 or later
- An AI coding agent (Cursor, Windsurf, Claude Code, etc.)

## Step 1: Start the Development Server

```bash
cd frontend
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173).

## Step 2: Create Product Vision

1. Open your AI agent
2. Run the `/product-vision` command
3. Describe your application idea
4. The agent will generate:
   - `product/product-overview.md`
   - `product/product-roadmap.md`

Check the **Plan** tab to see your product vision rendered.

## Step 3: Design Your Data Model

1. Run the `/architect-database` command
2. Describe your data entities and relationships
3. The agent will generate:
   - `prisma/schema.prisma`
   - `lib/validators.ts`

Check the **Data** tab to see the ERD diagram.

## Step 4: Design Your UI

1. Run `/design-shell` to create the app shell
2. Run `/design-screen [section]` for each feature
3. Components will appear in `src/sections/`

Check the **Designs** tab to preview your components.

## Step 5: Export Your Project

1. Go to the **Export** tab
2. Review the validation status
3. Click "Export Project"
4. Unzip and open in your editor

## Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| Ctrl/⌘ + 1 | Go to Plan tab |
| Ctrl/⌘ + 2 | Go to Data tab |
| Ctrl/⌘ + 3 | Go to Designs tab |
| Ctrl/⌘ + 4 | Go to Export tab |

## Next Steps

- Read the [AI Commands](./commands.md) documentation
- Check the [Export Format](./export-format.md) reference
- Explore the sample product in `product/`
