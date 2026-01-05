import { z } from "zod";

// ==========================================
// ENUMS
// ==========================================

export const AppointmentStatusEnum = z.enum([
  "SCHEDULED",
  "CONFIRMED", 
  "COMPLETED",
  "CANCELLED",
]);

export const TreatmentStatusEnum = z.enum([
  "PLANNED",
  "IN_PROGRESS",
  "COMPLETED",
]);

// ==========================================
// PATIENT SCHEMAS
// ==========================================

export const PatientSchema = z.object({
  id: z.string().cuid(),
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().optional(),
  dateOfBirth: z.coerce.date().optional(),
  address: z.string().optional(),
  notes: z.string().optional(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
});

export const CreatePatientSchema = PatientSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const UpdatePatientSchema = CreatePatientSchema.partial();

// ==========================================
// DENTIST SCHEMAS
// ==========================================

export const DentistSchema = z.object({
  id: z.string().cuid(),
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  specialty: z.string().optional(),
  phone: z.string().optional(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
});

export const CreateDentistSchema = DentistSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const UpdateDentistSchema = CreateDentistSchema.partial();

// ==========================================
// APPOINTMENT SCHEMAS
// ==========================================

export const AppointmentSchema = z.object({
  id: z.string().cuid(),
  dateTime: z.coerce.date(),
  duration: z.number().int().positive().default(30),
  status: AppointmentStatusEnum.default("SCHEDULED"),
  notes: z.string().optional(),
  patientId: z.string().cuid(),
  dentistId: z.string().cuid(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
});

export const CreateAppointmentSchema = AppointmentSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const UpdateAppointmentSchema = CreateAppointmentSchema.partial();

// ==========================================
// TREATMENT SCHEMAS
// ==========================================

export const TreatmentSchema = z.object({
  id: z.string().cuid(),
  name: z.string().min(1, "Treatment name is required"),
  description: z.string().optional(),
  status: TreatmentStatusEnum.default("PLANNED"),
  startDate: z.coerce.date().optional(),
  endDate: z.coerce.date().optional(),
  cost: z.number().positive().optional(),
  notes: z.string().optional(),
  patientId: z.string().cuid(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
});

export const CreateTreatmentSchema = TreatmentSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const UpdateTreatmentSchema = CreateTreatmentSchema.partial();

// ==========================================
// TYPE EXPORTS
// ==========================================

export type Patient = z.infer<typeof PatientSchema>;
export type CreatePatient = z.infer<typeof CreatePatientSchema>;
export type UpdatePatient = z.infer<typeof UpdatePatientSchema>;

export type Dentist = z.infer<typeof DentistSchema>;
export type CreateDentist = z.infer<typeof CreateDentistSchema>;
export type UpdateDentist = z.infer<typeof UpdateDentistSchema>;

export type Appointment = z.infer<typeof AppointmentSchema>;
export type CreateAppointment = z.infer<typeof CreateAppointmentSchema>;
export type UpdateAppointment = z.infer<typeof UpdateAppointmentSchema>;

export type Treatment = z.infer<typeof TreatmentSchema>;
export type CreateTreatment = z.infer<typeof CreateTreatmentSchema>;
export type UpdateTreatment = z.infer<typeof UpdateTreatmentSchema>;

export type AppointmentStatus = z.infer<typeof AppointmentStatusEnum>;
export type TreatmentStatus = z.infer<typeof TreatmentStatusEnum>;
