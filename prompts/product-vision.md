# Product Vision Prompt

Generate the product overview and roadmap files for this project.

## Instructions

Create the following files:

### 1. `product/product-overview.md`

This file should contain:
- **Product Name**: A clear, memorable name
- **Vision Statement**: One-sentence description of what the product does
- **Problem Statement**: What problem does this solve?
- **Target Users**: Who will use this product?
- **Key Features**: List of main features with descriptions
- **Success Metrics**: How will success be measured?

### 2. `product/product-roadmap.md`

This file should contain:
- **Phases**: Break the product into development phases
- **Sections**: Each phase should have sections (features/modules)
- **Priority**: Order sections by implementation priority

## Output Format

### product/product-overview.md
```markdown
# [Product Name]

## Vision
[One-sentence vision statement]

## Problem Statement
[What problem does this solve?]

## Target Users
[Who will use this product?]

## Features

### [Feature 1 Name]
[Description of feature 1]

### [Feature 2 Name]
[Description of feature 2]

[... more features]

## Success Metrics
- [Metric 1]
- [Metric 2]
```

### product/product-roadmap.md
```markdown
# Product Roadmap

## Phase 1: [Phase Name]
[Phase description]

### Sections
- **[section-slug]**: [Section description]
- **[section-slug]**: [Section description]

## Phase 2: [Phase Name]
[Phase description]

### Sections
- **[section-slug]**: [Section description]

[... more phases]
```

## Your Task

Based on the user's description below, generate both files:

---

**[DESCRIBE YOUR PRODUCT HERE]**

Example:
```
Build a dental clinic management system. Features:
- Patient management
- Appointment scheduling  
- Treatment records
- Billing and invoices

Target users: Dental clinic staff and administrators.
```
