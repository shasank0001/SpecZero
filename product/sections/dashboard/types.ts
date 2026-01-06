// Dashboard Types for the Dashboard Section
// Note: These types reference component types that will be available in React context

export interface DashboardStats {
  totalPatients: number;
  totalPatientsChange: number;
  todaysAppointments: number;
  todaysAppointmentsChange: number;
  pendingReports: number;
  pendingReportsChange: number;
  revenue: number;
  revenueChange: number;
}

export type ActivityType = 
  | "appointment" 
  | "patient" 
  | "document" 
  | "alert" 
  | "completed";

export interface ActivityItem {
  id: string;
  type: ActivityType;
  title: string;
  description: string;
  timestamp: string;
  user?: string;
}

export interface UpcomingAppointment {
  id: string;
  patientName: string;
  patientAvatar?: string;
  date: string;
  time: string;
  type: "in-person" | "video" | "phone";
  reason: string;
}

export interface WeeklyStats {
  appointments: number;
  newPatients: number;
  completionRate: number;
}

export interface DashboardData {
  stats: DashboardStats;
  activities: ActivityItem[];
  upcomingAppointments: UpcomingAppointment[];
  weeklyStats: WeeklyStats;
}

export interface StatCardProps {
  title: string;
  value: string | number;
  change?: number;
  changeLabel?: string;
  icon: unknown; // Component type - React.ComponentType in React context
  color?: "blue" | "green" | "purple" | "orange" | "red" | "cyan";
}

export interface QuickAction {
  id: string;
  label: string;
  icon: unknown; // Component type - React.ComponentType in React context
  color?: "blue" | "green" | "purple" | "orange" | "red" | "cyan";
  onClick?: () => void;
}
