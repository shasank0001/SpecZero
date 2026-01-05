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
