/**
 * AppointmentTable Component
 * 
 * Displays appointments in a table format with sorting and filtering.
 * This is a props-based component for export.
 */
import { Calendar, Video, Phone, Building, ChevronUp, ChevronDown } from "lucide-react";
import type { Appointment } from "./AppointmentCard";

export interface AppointmentTableProps {
  appointments: Appointment[];
  onView: (id: string) => void;
  onEdit: (id: string) => void;
  onCancel: (id: string) => void;
  sortField?: string;
  sortDirection?: "asc" | "desc";
  onSort?: (field: string) => void;
}

const statusColors = {
  scheduled: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  confirmed: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  completed: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400",
  cancelled: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
  "no-show": "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400",
};

const typeIcons = {
  "in-person": Building,
  video: Video,
  phone: Phone,
};

export function AppointmentTable({ 
  appointments, 
  onView, 
  onEdit, 
  onCancel,
  sortField,
  sortDirection,
  onSort 
}: AppointmentTableProps) {
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });
  };

  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(":");
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? "PM" : "AM";
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  const SortIcon = ({ field }: { field: string }) => {
    if (sortField !== field) return null;
    return sortDirection === "asc" ? (
      <ChevronUp className="w-4 h-4" />
    ) : (
      <ChevronDown className="w-4 h-4" />
    );
  };

  return (
    <div className="bg-card border border-border rounded-xl overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border bg-muted/50">
              <th 
                className="px-4 py-3 text-left text-sm font-medium text-muted-foreground cursor-pointer hover:text-foreground"
                onClick={() => onSort?.("patientName")}
              >
                <div className="flex items-center gap-1">
                  Patient
                  <SortIcon field="patientName" />
                </div>
              </th>
              <th 
                className="px-4 py-3 text-left text-sm font-medium text-muted-foreground cursor-pointer hover:text-foreground"
                onClick={() => onSort?.("date")}
              >
                <div className="flex items-center gap-1">
                  Date & Time
                  <SortIcon field="date" />
                </div>
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                Type
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                Reason
              </th>
              <th 
                className="px-4 py-3 text-left text-sm font-medium text-muted-foreground cursor-pointer hover:text-foreground"
                onClick={() => onSort?.("status")}
              >
                <div className="flex items-center gap-1">
                  Status
                  <SortIcon field="status" />
                </div>
              </th>
              <th className="px-4 py-3 text-right text-sm font-medium text-muted-foreground">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {appointments.map((appointment, index) => {
              const TypeIcon = typeIcons[appointment.type];
              return (
                <tr 
                  key={appointment.id}
                  className={`border-b border-border last:border-0 hover:bg-muted/30 transition-colors ${
                    index % 2 === 0 ? "bg-background" : "bg-muted/10"
                  }`}
                >
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center text-xs font-medium text-primary">
                        {appointment.patientName.split(" ").map(n => n[0]).join("")}
                      </div>
                      <span className="font-medium text-foreground">{appointment.patientName}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-col">
                      <span className="text-sm text-foreground">{formatDate(appointment.date)}</span>
                      <span className="text-xs text-muted-foreground">{formatTime(appointment.time)} ({appointment.duration}min)</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <TypeIcon className="w-4 h-4" />
                      <span className="capitalize">{appointment.type.replace("-", " ")}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-sm text-muted-foreground">{appointment.reason}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${statusColors[appointment.status]}`}>
                      {appointment.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => onView(appointment.id)}
                        className="px-3 py-1.5 text-xs font-medium text-foreground hover:bg-muted rounded-md transition-colors"
                      >
                        View
                      </button>
                      <button
                        onClick={() => onEdit(appointment.id)}
                        className="px-3 py-1.5 text-xs font-medium text-primary hover:bg-primary/10 rounded-md transition-colors"
                      >
                        Edit
                      </button>
                      {appointment.status === "scheduled" && (
                        <button
                          onClick={() => onCancel(appointment.id)}
                          className="px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md transition-colors"
                        >
                          Cancel
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      
      {appointments.length === 0 && (
        <div className="px-4 py-12 text-center">
          <Calendar className="w-12 h-12 mx-auto text-muted-foreground/50" />
          <p className="mt-4 text-sm text-muted-foreground">No appointments found</p>
        </div>
      )}
    </div>
  );
}
