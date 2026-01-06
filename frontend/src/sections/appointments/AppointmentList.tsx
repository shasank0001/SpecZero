/**
 * AppointmentList Preview Wrapper
 * 
 * This file is NOT exported - it's used only for local preview.
 * It imports sample data and passes it to the props-based components.
 */
import { useState } from "react";
import { AppointmentTable } from "./components/AppointmentTable";
import { AppointmentCard } from "./components/AppointmentCard";
import { LayoutGrid, List, Plus, Search, Calendar, ChevronLeft, ChevronRight } from "lucide-react";
import type { Appointment } from "./components/AppointmentCard";

// Sample data for preview
const sampleAppointments: Appointment[] = [
  {
    id: "apt_001",
    patientId: "pat_001",
    patientName: "John Smith",
    date: "2026-01-08",
    time: "09:00",
    duration: 30,
    type: "in-person",
    status: "confirmed",
    location: "Room 101",
    reason: "Annual Checkup",
  },
  {
    id: "apt_002",
    patientId: "pat_002",
    patientName: "Sarah Johnson",
    date: "2026-01-08",
    time: "10:30",
    duration: 45,
    type: "video",
    status: "scheduled",
    reason: "Follow-up Consultation",
  },
  {
    id: "apt_003",
    patientId: "pat_003",
    patientName: "Michael Williams",
    date: "2026-01-08",
    time: "14:00",
    duration: 30,
    type: "phone",
    status: "scheduled",
    reason: "Prescription Renewal",
  },
  {
    id: "apt_004",
    patientId: "pat_004",
    patientName: "Emily Brown",
    date: "2026-01-07",
    time: "11:00",
    duration: 60,
    type: "in-person",
    status: "completed",
    location: "Room 203",
    reason: "Physical Therapy Session",
  },
  {
    id: "apt_005",
    patientId: "pat_005",
    patientName: "David Martinez",
    date: "2026-01-06",
    time: "15:30",
    duration: 30,
    type: "video",
    status: "cancelled",
    reason: "Initial Consultation",
    notes: "Rescheduled by patient",
  },
  {
    id: "apt_006",
    patientId: "pat_001",
    patientName: "John Smith",
    date: "2026-01-09",
    time: "16:00",
    duration: 30,
    type: "in-person",
    status: "scheduled",
    location: "Room 102",
    reason: "Lab Results Review",
  },
  {
    id: "apt_007",
    patientId: "pat_006",
    patientName: "Lisa Anderson",
    date: "2026-01-10",
    time: "09:30",
    duration: 45,
    type: "in-person",
    status: "confirmed",
    location: "Room 101",
    reason: "New Patient Visit",
  },
  {
    id: "apt_008",
    patientId: "pat_007",
    patientName: "Robert Taylor",
    date: "2026-01-05",
    time: "13:00",
    duration: 30,
    type: "phone",
    status: "no-show",
    reason: "Follow-up Call",
  },
];

type ViewMode = "table" | "grid";
type StatusFilter = "all" | "scheduled" | "confirmed" | "completed" | "cancelled" | "no-show";

export default function AppointmentListPreview() {
  const [viewMode, setViewMode] = useState<ViewMode>("table");
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [currentDate, setCurrentDate] = useState(new Date("2026-01-08"));

  const handleView = (id: string) => {
    console.log("View appointment:", id);
  };

  const handleEdit = (id: string) => {
    console.log("Edit appointment:", id);
  };

  const handleCancel = (id: string) => {
    console.log("Cancel appointment:", id);
  };

  const filteredAppointments = sampleAppointments.filter((apt) => {
    const matchesSearch = apt.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      apt.reason.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || apt.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const formatCurrentDate = () => {
    return currentDate.toLocaleDateString("en-US", { 
      weekday: "long", 
      month: "long", 
      day: "numeric", 
      year: "numeric" 
    });
  };

  const navigateDate = (direction: "prev" | "next") => {
    const newDate = new Date(currentDate);
    newDate.setDate(newDate.getDate() + (direction === "next" ? 1 : -1));
    setCurrentDate(newDate);
  };

  const statusOptions: { value: StatusFilter; label: string }[] = [
    { value: "all", label: "All Status" },
    { value: "scheduled", label: "Scheduled" },
    { value: "confirmed", label: "Confirmed" },
    { value: "completed", label: "Completed" },
    { value: "cancelled", label: "Cancelled" },
    { value: "no-show", label: "No Show" },
  ];

  return (
    <div className="h-full w-full bg-background overflow-auto">
      <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Appointments</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Schedule and manage patient appointments
            </p>
          </div>
          <button className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-primary text-primary-foreground rounded-lg font-medium text-sm hover:bg-primary/90 transition-colors">
            <Plus className="w-4 h-4" />
            New Appointment
          </button>
        </div>

        {/* Date Navigation */}
        <div className="flex items-center justify-between bg-card border border-border rounded-xl p-3">
          <button 
            onClick={() => navigateDate("prev")}
            className="p-2 hover:bg-muted rounded-lg transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-primary" />
            <span className="font-medium text-foreground">{formatCurrentDate()}</span>
          </div>
          <button 
            onClick={() => navigateDate("next")}
            className="p-2 hover:bg-muted rounded-lg transition-colors"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
          <div className="flex flex-1 items-center gap-3">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search appointments..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-muted/50 border border-border rounded-lg text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              />
            </div>

            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as StatusFilter)}
              className="px-3 py-2.5 bg-muted/50 border border-border rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
            >
              {statusOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {/* View Toggle */}
          <div className="flex items-center gap-1 p-1 bg-muted/50 border border-border rounded-lg">
            <button
              onClick={() => setViewMode("table")}
              className={`p-2 rounded-md transition-colors ${
                viewMode === "table"
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <List className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode("grid")}
              className={`p-2 rounded-md transition-colors ${
                viewMode === "grid"
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: "Today's Appointments", value: "8", color: "text-blue-600" },
            { label: "Confirmed", value: "5", color: "text-green-600" },
            { label: "Pending", value: "2", color: "text-orange-600" },
            { label: "Cancelled", value: "1", color: "text-red-600" },
          ].map((stat, index) => (
            <div key={index} className="bg-card border border-border rounded-xl p-4">
              <p className="text-sm text-muted-foreground">{stat.label}</p>
              <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Content */}
        {viewMode === "table" ? (
          <AppointmentTable
            appointments={filteredAppointments}
            onView={handleView}
            onEdit={handleEdit}
            onCancel={handleCancel}
          />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredAppointments.map((appointment) => (
              <AppointmentCard
                key={appointment.id}
                appointment={appointment}
                onView={handleView}
                onEdit={handleEdit}
                onCancel={handleCancel}
              />
            ))}
          </div>
        )}

        {/* Empty State */}
        {filteredAppointments.length === 0 && (
          <div className="text-center py-12">
            <Calendar className="w-12 h-12 mx-auto text-muted-foreground/50" />
            <p className="mt-4 text-muted-foreground">No appointments match your filters</p>
            <button 
              onClick={() => { setSearchQuery(""); setStatusFilter("all"); }}
              className="mt-2 text-primary text-sm hover:underline"
            >
              Clear filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
