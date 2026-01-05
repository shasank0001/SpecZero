# Data Model Documentation

## Overview

The DentalFlow CRM data model is designed around the core entities of a dental practice: Patients, Appointments, Dentists, and Treatments.

## Entity Relationships

```
Patient --< Appointment >-- Dentist
    |
    +--< Treatment
```

## Models

### Patient
The central entity representing individuals receiving dental care.

| Field | Type | Description |
|-------|------|-------------|
| id | String | Unique identifier (CUID) |
| firstName | String | Patient's first name |
| lastName | String | Patient's last name |
| email | String | Contact email (unique) |
| phone | String? | Contact phone number |
| dateOfBirth | DateTime? | Patient's date of birth |
| createdAt | DateTime | Record creation timestamp |
| updatedAt | DateTime | Last update timestamp |

### Appointment
Scheduled visits linking patients to dentists.

| Field | Type | Description |
|-------|------|-------------|
| id | String | Unique identifier (CUID) |
| dateTime | DateTime | Scheduled date and time |
| duration | Int | Duration in minutes |
| status | AppointmentStatus | SCHEDULED, CONFIRMED, COMPLETED, CANCELLED |
| notes | String? | Additional notes |
| patientId | String | Reference to Patient |
| dentistId | String | Reference to Dentist |

### Dentist
Dental professionals providing care.

| Field | Type | Description |
|-------|------|-------------|
| id | String | Unique identifier (CUID) |
| name | String | Full name |
| email | String | Contact email (unique) |
| specialty | String? | Area of specialization |
| createdAt | DateTime | Record creation timestamp |
