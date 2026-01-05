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
