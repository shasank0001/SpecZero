/**
 * Dashboard Preview Wrapper
 * 
 * This file is NOT exported - it's used only for local preview.
 * It imports sample data and passes it to the props-based components.
 */
import { StatCard } from "./components/StatCard";
import { RecentActivity } from "./components/RecentActivity";
import { QuickActions } from "./components/QuickActions";
import { UpcomingAppointments } from "./components/UpcomingAppointments";
import { 
  Users, Calendar, FileText, TrendingUp, 
  UserPlus, CalendarPlus, ClipboardList, Bell,
  Activity
} from "lucide-react";
import type { ActivityItem } from "./components/RecentActivity";
import type { QuickAction } from "./components/QuickActions";
import type { UpcomingAppointment } from "./components/UpcomingAppointments";

// Sample data for preview
const sampleActivities: ActivityItem[] = [
  {
    id: "act_001",
    type: "patient",
    title: "New Patient Registered",
    description: "Sarah Johnson completed registration form",
    timestamp: "2026-01-06T14:30:00Z",
    user: "System",
  },
  {
    id: "act_002",
    type: "appointment",
    title: "Appointment Confirmed",
    description: "John Smith confirmed appointment for Jan 8th",
    timestamp: "2026-01-06T13:15:00Z",
    user: "John Smith",
  },
  {
    id: "act_003",
    type: "completed",
    title: "Session Completed",
    description: "Physical therapy session with Michael Williams",
    timestamp: "2026-01-06T11:00:00Z",
    user: "Dr. Adams",
  },
  {
    id: "act_004",
    type: "document",
    title: "Lab Results Uploaded",
    description: "Blood work results for Emily Brown",
    timestamp: "2026-01-06T09:45:00Z",
    user: "Lab Team",
  },
  {
    id: "act_005",
    type: "alert",
    title: "Prescription Expiring",
    description: "David Martinez's prescription expires in 7 days",
    timestamp: "2026-01-05T16:20:00Z",
    user: "System",
  },
];

const sampleQuickActions: QuickAction[] = [
  { id: "qa_001", label: "Add Patient", icon: UserPlus, color: "green" },
  { id: "qa_002", label: "Schedule", icon: CalendarPlus, color: "blue" },
  { id: "qa_003", label: "View Reports", icon: ClipboardList, color: "purple" },
  { id: "qa_004", label: "Notifications", icon: Bell, color: "orange" },
];

const sampleUpcomingAppointments: UpcomingAppointment[] = [
  {
    id: "apt_001",
    patientName: "John Smith",
    date: "2026-01-06",
    time: "14:00",
    type: "in-person",
    reason: "Annual Checkup",
  },
  {
    id: "apt_002",
    patientName: "Sarah Johnson",
    date: "2026-01-06",
    time: "15:30",
    type: "video",
    reason: "Follow-up Consultation",
  },
  {
    id: "apt_003",
    patientName: "Michael Williams",
    date: "2026-01-07",
    time: "09:00",
    type: "in-person",
    reason: "Physical Therapy",
  },
  {
    id: "apt_004",
    patientName: "Emily Brown",
    date: "2026-01-07",
    time: "11:30",
    type: "phone",
    reason: "Lab Results Discussion",
  },
  {
    id: "apt_005",
    patientName: "David Martinez",
    date: "2026-01-08",
    time: "10:00",
    type: "in-person",
    reason: "Initial Consultation",
  },
];

export default function DashboardPreview() {
  const handleViewAllActivity = () => {
    console.log("View all activity");
  };

  const handleViewAllAppointments = () => {
    console.log("View all appointments");
  };

  const handleViewAppointment = (id: string) => {
    console.log("View appointment:", id);
  };

  return (
    <div className="h-full w-full bg-background overflow-auto">
      <div className="p-4 sm:p-6 space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Welcome back! Here's an overview of your practice.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Total Patients"
            value="1,284"
            change={12}
            changeLabel="vs last month"
            icon={Users}
            color="blue"
          />
          <StatCard
            title="Today's Appointments"
            value="24"
            change={8}
            changeLabel="vs yesterday"
            icon={Calendar}
            color="green"
          />
          <StatCard
            title="Pending Reports"
            value="7"
            change={-15}
            changeLabel="vs last week"
            icon={FileText}
            color="orange"
          />
          <StatCard
            title="Revenue (MTD)"
            value="$48,250"
            change={23}
            changeLabel="vs last month"
            icon={TrendingUp}
            color="purple"
          />
        </div>

        {/* Quick Actions */}
        <QuickActions actions={sampleQuickActions} />

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Upcoming Appointments */}
          <UpcomingAppointments
            appointments={sampleUpcomingAppointments}
            onViewAppointment={handleViewAppointment}
            onViewAll={handleViewAllAppointments}
          />

          {/* Recent Activity */}
          <RecentActivity
            activities={sampleActivities}
            onViewAll={handleViewAllActivity}
          />
        </div>

        {/* Performance Overview */}
        <div className="bg-card border border-border rounded-xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-semibold text-foreground">Weekly Overview</h3>
            <select className="px-3 py-1.5 bg-muted/50 border border-border rounded-lg text-sm text-foreground">
              <option>This Week</option>
              <option>Last Week</option>
              <option>Last Month</option>
            </select>
          </div>
          
          {/* Placeholder Chart */}
          <div className="h-64 bg-muted/30 rounded-xl flex items-center justify-center">
            <div className="text-center">
              <Activity className="w-12 h-12 mx-auto text-muted-foreground/50" />
              <p className="mt-3 text-sm text-muted-foreground">
                Chart visualization would appear here
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                (Recharts or similar library in production)
              </p>
            </div>
          </div>
          
          {/* Stats Row */}
          <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-border">
            {[
              { label: "Appointments", value: "156", subtext: "This week" },
              { label: "New Patients", value: "23", subtext: "This week" },
              { label: "Completion Rate", value: "94%", subtext: "On schedule" },
            ].map((stat, index) => (
              <div key={index} className="text-center">
                <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{stat.subtext}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
