// Appointment Types for the Appointments Section

export type AppointmentType = "in-person" | "video" | "phone";

export type AppointmentStatus = 
  | "scheduled" 
  | "confirmed" 
  | "completed" 
  | "cancelled" 
  | "no-show";

export interface Appointment {
  id: string;
  patientId: string;
  patientName: string;
  patientAvatar?: string;
  date: string;
  time: string;
  duration: number;
  type: AppointmentType;
  status: AppointmentStatus;
  location?: string;
  reason: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AppointmentListProps {
  appointments: Appointment[];
  onView: (id: string) => void;
  onEdit: (id: string) => void;
  onCancel: (id: string) => void;
}

export interface AppointmentFormData {
  patientId: string;
  date: string;
  time: string;
  duration: number;
  type: AppointmentType;
  reason: string;
  location?: string;
  notes?: string;
}

export interface AppointmentFilters {
  search: string;
  status: AppointmentStatus | "all";
  type: AppointmentType | "all";
  dateRange: {
    start: string;
    end: string;
  };
}
