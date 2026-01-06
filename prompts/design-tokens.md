# Design Tokens Prompt

Generate the design system tokens (colors and typography) for this project.

## Instructions

Create the following files:

### 1. `product/design-system/colors.json`

A color palette with:
- Primary color (main brand color)
- Secondary color (accent color)
- Semantic colors (success, warning, error, info)
- Neutral colors (gray scale)
- Each color should have shades (50-950)

### 2. `product/design-system/typography.json`

Typography definitions with:
- Font families (display, body, mono)
- Font sizes with line heights
- Font weights
- Letter spacing values

## Output Format

### product/design-system/colors.json
```json
{
  "colors": {
    "primary": {
      "50": "#f0f9ff",
      "100": "#e0f2fe",
      "200": "#bae6fd",
      "300": "#7dd3fc",
      "400": "#38bdf8",
      "500": "#0ea5e9",
      "600": "#0284c7",
      "700": "#0369a1",
      "800": "#075985",
      "900": "#0c4a6e",
      "950": "#082f49"
    },
    "secondary": {
      // shades...
    },
    "success": {
      // shades...
    },
    "warning": {
      // shades...
    },
    "error": {
      // shades...
    },
    "neutral": {
      // shades...
    }
  }
}
```

### product/design-system/typography.json
```json
{
  "fonts": {
    "display": "Inter, system-ui, sans-serif",
    "body": "Inter, system-ui, sans-serif",
    "mono": "JetBrains Mono, monospace"
  },
  "fontSizes": {
    "xs": { "size": "0.75rem", "lineHeight": "1rem" },
    "sm": { "size": "0.875rem", "lineHeight": "1.25rem" },
    "base": { "size": "1rem", "lineHeight": "1.5rem" },
    "lg": { "size": "1.125rem", "lineHeight": "1.75rem" },
    "xl": { "size": "1.25rem", "lineHeight": "1.75rem" },
    "2xl": { "size": "1.5rem", "lineHeight": "2rem" },
    "3xl": { "size": "1.875rem", "lineHeight": "2.25rem" },
    "4xl": { "size": "2.25rem", "lineHeight": "2.5rem" }
  },
  "fontWeights": {
    "normal": 400,
    "medium": 500,
    "semibold": 600,
    "bold": 700
  },
  "letterSpacing": {
    "tight": "-0.025em",
    "normal": "0",
    "wide": "0.025em"
  }
}
```

## Your Task

Based on the design preferences described below, generate both files:

---

**[DESCRIBE YOUR DESIGN PREFERENCES HERE]**

Example:
```
Brand: Professional healthcare application
Primary color: Blue (trust, reliability)
Style: Clean, modern, accessible
Mood: Calm and professional
```
