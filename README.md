<p align="center">
  <img src="https://img.shields.io/badge/Hackathon-2026-blueviolet?style=for-the-badge" alt="Hackathon 2026"/>
  <img src="https://img.shields.io/badge/Status-Working%20Prototype-brightgreen?style=for-the-badge" alt="Status"/>
  <img src="https://img.shields.io/badge/License-MIT-blue?style=for-the-badge" alt="License"/>
</p>

<h1 align="center">🏗️ SpecZero</h1>

<p align="center">
  <strong>Design your product with AI. Then build it right.</strong>
</p>

<p align="center">
  <em>A guided design process that creates a shared source of truth between you and your AI coding agent</em>
</p>

---

## 🎯 The Problem

**AI coding tools are incredible at building fast. But the results often miss the mark.**

You describe what you want. The agent builds something. But it's not what you envisioned:

- 🎨 The UI looks generic
- ⚠️ Features get half-implemented  
- 🔄 You spend as much time fixing and redirecting as you would have spent building
- 😤 Starting over feels easier than course-correcting

**The core issue:** We're asking coding agents to figure out *what to build* and *build it* simultaneously.

Design decisions get made on the fly, buried in code, impossible to adjust without starting over. There's no spec. No shared understanding. **No source of truth for what "done" looks like.**

---

## 💡 The SpecZero Process

**SpecZero** powers a guided design and architecture process. **You + AI, working together through structured steps:**

```
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│   💭 Your Idea                                                  │
│        ↓                                                        │
│   📋 Product Planning — Vision, roadmap, data model             │
│        ↓                                                        │
│   🎨 Design System — Colors, typography, app shell              │
│        ↓                                                        │
│   📱 Section Design — Requirements, sample data, screens        │
│        ↓                                                        │
│   📦 Export — Complete handoff package for implementation       │
│        ↓                                                        │
│   🚀 Production Code (via any AI coding agent)                  │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

**Each step is a conversation.** The AI asks questions, you provide direction, and together you shape a product that matches your vision—**before any implementation begins.**

> 🎯 **Separate "what to build" from "how to build it"**

---

## ✨ The Four Phases

### 📋 **Phase 1: Product Planning**
Define your vision before touching code:
- Product overview and problem statement
- Feature roadmap with milestones
- Data model architecture (Prisma schema)
- Zod validation schemas

### 🎨 **Phase 2: Design System**
Establish visual foundations:
- Color palette with semantic tokens
- Typography scale
- Application shell (sidebar, navigation, header)
- Spacing and component patterns

### 📱 **Phase 3: Section Design**
Design each feature area through conversation:
- Specify requirements and user flows
- Generate realistic sample data
- Design screens with live preview
- Iterate until it matches your vision

### 📦 **Phase 4: Export**
Generate your implementation handoff:
- Complete **Next.js 15** project scaffold
- All designed components (props-based, production-ready)
- Database schema + seed files
- Step-by-step instructions in `docs/prompts/`
- Ready for any AI coding agent to finish the build

---

## 🎬 What You See

### The SpecZero Interface
Four tabs guide you through the design process:

| Tab | Purpose | What You See |
|-----|---------|--------------|
| **Plan** | Product definition | Vision, roadmap, section status |
| **Data** | Schema architecture | Mermaid ERD diagrams, Zod validators |
| **Designs** | Live UI preview | Components in iframe, device toggles |
| **Export** | Handoff generation | Validation checklist, ZIP download |

```
┌─────────────────────────────────────────────────────┐
│  [Plan] [Data] [Designs] [Export]                   │
├──────────┬──────────────────────────┬───────────────┤
│ Sections │                          │ Component     │
│ ├ dashboard│  ┌────────────────┐    │ Inspector     │
│ │  └ Stats │  │                │    │               │
│ │  └ Feed  │  │    Live        │    │ Props:        │
│ ├ patients │  │    Preview     │    │ - data[]      │
│ ├ appts    │  │    (iframe)    │    │ - onAction()  │
│            │  └────────────────┘    │               │
│            │  [📱][📱][🖥️]           │               │
└──────────┴──────────────────────────┴───────────────┘
```

### Sample Project: HealthClinic Pro
We designed a complete healthcare management system to demonstrate the process:

| Section | What We Designed | Components Created |
|---------|------------------|-------------------|
| **Dashboard** | Overview with metrics and activity | StatCard, QuickActions, RecentActivity, UpcomingAppointments |
| **Patients** | Full CRUD patient management | PatientTable, PatientCard, PatientForm |
| **Appointments** | Scheduling and calendar views | AppointmentList, CalendarView, AppointmentModal |
| **Settings** | User preferences and security | ProfileSettings, NotificationSettings, SecuritySettings |

**Database Schema:** 319 lines of Prisma covering Users, Patients, Appointments, Prescriptions, Documents, and more.

---

## 🏗️ Technical Architecture

### Tech Stack (The Tool)

| Category | Technology |
|----------|------------|
| **Build Tool** | Vite 7 |
| **UI Library** | React 19 |
| **Language** | TypeScript 5.9 |
| **Styling** | Tailwind CSS v4 |
| **UI Components** | shadcn/ui (Radix primitives) |
| **Routing** | React Router DOM 7 |
| **Diagrams** | Mermaid.js |
| **Export** | JSZip + FileSaver |
| **Icons** | Lucide React |

### The "Golden Stack" (Export Artifact)

| Layer | Technology |
|-------|------------|
| **Framework** | Next.js 15 (App Router) |
| **Language** | TypeScript |
| **Database** | PostgreSQL + Prisma ORM |
| **Authentication** | Clerk |
| **Validation** | Zod |
| **Styling** | Tailwind CSS v4 + shadcn/ui |

---

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- npm or pnpm

### Installation

```bash
# Clone the repository
git clone https://github.com/your-username/speczero.git
cd speczero

# Install dependencies
cd frontend
npm install

# Start development server
npm run dev
```

### Open in Browser

```
http://localhost:5173
```

---

## 📁 Project Structure

```
speczero/
│
├── frontend/                    # The SpecZero tool
│   ├── src/
│   │   ├── components/          # UI components
│   │   │   ├── ui/              # shadcn/ui base components
│   │   │   ├── layout/          # AppLayout, TabNav
│   │   │   ├── plan/            # Plan tab components
│   │   │   ├── data/            # Data tab components
│   │   │   ├── designs/         # Designs tab components
│   │   │   └── export/          # Export tab components
│   │   │
│   │   ├── lib/                 # Core utilities
│   │   │   ├── product-loader.ts
│   │   │   ├── schema-loader.ts
│   │   │   ├── section-loader.ts
│   │   │   ├── mermaid-generator.ts
│   │   │   └── export-generator.ts
│   │   │
│   │   ├── pages/               # Route pages (4 tabs)
│   │   ├── sections/            # Live section previews
│   │   └── shell/               # App shell preview
│   │
│   └── package.json
│
├── product/                     # Product definition (user content)
│   ├── product-overview.md
│   ├── product-roadmap.md
│   ├── design-system/
│   │   ├── colors.json
│   │   └── typography.json
│   ├── shell/
│   └── sections/
│       ├── dashboard/
│       ├── patients/
│       ├── appointments/
│       └── settings/
│
├── prisma/
│   └── schema.prisma            # Database schema (319 lines)
│
├── lib/
│   └── validators.ts            # Zod validation schemas
│
├── prompts/                     # AI agent prompt templates
│   ├── product-vision.md
│   ├── architect-database.md
│   ├── design-tokens.md
│   ├── design-shell.md
│   ├── design-screen.md
│   └── sample-data.md
│
└── Docs/                        # Implementation documentation
    ├── PRD.md
    └── PLAN.md
```

---

## 🔄 How It Works

### The Conversation Flow

```bash
# Phase 1: Product Planning
You: "I want to build a healthcare clinic management system"
AI:  Questions about users, features, data entities...
→ Output: product-overview.md, product-roadmap.md, schema.prisma

# Phase 2: Design System  
You: "Medical/professional feel, blue primary, clean and modern"
AI:  Proposes color palette, typography, shell layout...
→ Output: colors.json, typography.json, AppShell.tsx

# Phase 3: Section Design
You: "The dashboard should show patient stats and upcoming appointments"
AI:  Designs components, generates sample data...
→ Output: StatCard.tsx, UpcomingAppointments.tsx, data.json

# Phase 4: Export
Click "Export" → Download complete Next.js project
→ Hand to any AI coding agent to finish the build
```

### What Gets Exported

```
product-plan/
├── README.md                    # Quick start guide
├── package.json                 # Pre-configured dependencies
├── prisma/schema.prisma         # Your data model
├── components/                  # All designed UI components
├── sample-data/                 # Realistic test data
└── docs/
    ├── prompts/kickoff.md       # "God Prompt" to start implementation
    └── instructions/            # Step-by-step build guides
```

---

## 🎨 Design System

### Color Palette
Our sample project uses a carefully crafted color system:

| Color | Usage | Hex |
|-------|-------|-----|
| 🔵 Primary | Actions, links | `#3b82f6` |
| 🟢 Secondary | Success states | `#22c55e` |
| ⚫ Neutral | Text, backgrounds | `#71717a` |
| 🔴 Error | Destructive actions | `#ef4444` |
| 🟡 Warning | Alerts | `#f59e0b` |

### Typography
- **Sans:** DM Sans (headings, body)
- **Mono:** IBM Plex Mono (code, data)

---

## 🏆 Why This Approach Wins

### 1. **Design Before Implementation**
Make all the important decisions upfront, when changes are cheap. See your product take shape before committing to code.

### 2. **Shared Source of Truth**
Everyone—you, your AI agent, your team—agrees on what "done" looks like. No more miscommunication.

### 3. **AI-Agent Agnostic**
Works with Cursor, Windsurf, Claude Code, GitHub Copilot — any AI agent can execute the exported instructions.

### 4. **Local-First, File-Based**
No cloud dependencies. Everything is markdown, JSON, and TypeScript files. Version control friendly.

### 5. **Production-Ready Output**
Export isn't a prototype — it's a complete scaffold with real components, real data models, and real instructions.

---

## 📊 Results

| Before (Traditional AI Coding) | After (SpecZero Process) |
|-------------------------------|---------------------------|
| ❌ Vague prompts → generic output | ✅ Structured conversation → precise output |
| ❌ Decisions buried in code | ✅ Decisions documented upfront |
| ❌ Constant course corrections | ✅ Iterate during design, not implementation |
| ❌ "Start over" syndrome | ✅ Clear spec to build against |
| ❌ 2-3 hours of back-and-forth | ✅ ~20 minutes to complete design |

---

## 🛠️ Technical Highlights

### File-Based State Management
```typescript
// No database needed — state derived from file existence
const productFiles = import.meta.glob('/product/*.md', {
  query: '?raw',
  import: 'default',
  eager: true,
});
```

### Props-Based Component Architecture
```tsx
// ✅ Exportable — receives data via props
export function PatientTable({ patients, onView, onEdit }: Props) {
  return <table>...</table>;
}

// Preview wrapper injects sample data (not exported)
<PatientTable patients={sampleData} onView={console.log} />
```

### Prisma → Mermaid ERD Conversion
```typescript
// Automatic diagram generation from schema.prisma
const mermaidCode = generateMermaidERD(prismaModels);
// Output: erDiagram Patient ||--o{ Appointment : "has" ...
```

---

## 🔮 Future Roadmap

- [ ] Git integration for version control
- [ ] Multiple project support
- [ ] Component library marketplace
- [ ] Collaborative editing
- [ ] API route generation (Server Actions)
- [ ] Storybook-style documentation

---

## 👥 Team

| Role | Name |
|------|------|
| Developer | Shasank |

---

## 📄 License

MIT License — feel free to use this project for your own hackathons!

---

## 🙏 Acknowledgments

- [shadcn/ui](https://ui.shadcn.com/) — Beautiful component library
- [Mermaid.js](https://mermaid.js.org/) — Diagram generation
- [Prisma](https://www.prisma.io/) — Next-gen ORM
- [Clerk](https://clerk.com/) — Authentication made simple

---

<p align="center">
  <strong>Built with ❤️ for Hackathon 2026</strong>
</p>

<p align="center">
  <a href="#-quick-start">Get Started</a> •
  <a href="#-what-you-see">See It In Action</a> •
  <a href="#-the-design-os-process">How It Works</a> •
  <a href="#-why-this-approach-wins">Why It Wins</a>
</p>
