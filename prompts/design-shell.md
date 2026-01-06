# Design Shell Prompt

Generate the application shell (navigation, layout, user menu) for this project.

## Instructions

Read the existing files first:
- `product/product-overview.md` - For product name and features
- `product/product-roadmap.md` - For navigation sections
- `product/design-system/colors.json` - For color tokens
- `product/design-system/typography.json` - For typography tokens

Then create the following files:

### 1. `product/shell/spec.md`

Shell specification with:
- Layout description
- Navigation structure
- User menu items
- Responsive behavior

### 2. Shell Components (React/TypeScript)

- `src/shell/components/AppShell.tsx` - Main layout wrapper
- `src/shell/components/MainNav.tsx` - Primary navigation
- `src/shell/components/Sidebar.tsx` - Side navigation (if applicable)
- `src/shell/components/UserMenu.tsx` - User dropdown menu
- `src/shell/components/Header.tsx` - Top header bar

## Output Format

### product/shell/spec.md
```markdown
# Application Shell Specification

## Layout
[Describe the overall layout - sidebar, header, content area]

## Navigation
| Label | Route | Icon | Description |
|-------|-------|------|-------------|
| Dashboard | /dashboard | Home | Main overview |
| [Section] | /[section] | [Icon] | [Description] |

## User Menu
- Profile
- Settings
- Sign Out

## Responsive Behavior
- Desktop: [behavior]
- Tablet: [behavior]
- Mobile: [behavior]
```

### Component Structure
```typescript
// AppShell.tsx - wraps the entire application
// MainNav.tsx - horizontal or vertical navigation
// UserMenu.tsx - dropdown with user actions
```

## Your Task

Based on the product overview and roadmap, generate the shell specification and components:

---

**[DESCRIBE ANY SPECIFIC SHELL REQUIREMENTS HERE]**

Example:
```
Layout: Sidebar navigation with top header
Features:
- Collapsible sidebar
- Breadcrumbs in header
- Quick search in header
- Notifications bell
- Dark mode toggle
```
