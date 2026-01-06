/**
 * AppointmentCard Component
 * 
 * Displays a single appointment in card format.
 * This is a props-based component for export.
 */
import { Calendar, Clock, MapPin, MoreVertical, Video, Phone, Building } from "lucide-react";

export interface Appointment {
  id: string;
  patientId: string;
  patientName: string;
  patientAvatar?: string;
  date: string;
  time: string;
  duration: number; // in minutes
  type: "in-person" | "video" | "phone";
  status: "scheduled" | "confirmed" | "completed" | "cancelled" | "no-show";
  location?: string;
  notes?: string;
  reason: string;
}

export interface AppointmentCardProps {
  appointment: Appointment;
  onView: (id: string) => void;
  onEdit: (id: string) => void;
  onCancel: (id: string) => void;
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

export function AppointmentCard({ appointment, onView, onCancel }: AppointmentCardProps) {
  const TypeIcon = typeIcons[appointment.type];
  
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

  return (
    <div className="bg-card border border-border rounded-xl p-4 hover:shadow-md transition-all duration-200 hover:border-primary/20">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          {/* Patient Avatar */}
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center text-sm font-medium text-primary">
            {appointment.patientAvatar ? (
              <img src={appointment.patientAvatar} alt="" className="w-full h-full rounded-full object-cover" />
            ) : (
              appointment.patientName.split(" ").map(n => n[0]).join("")
            )}
          </div>
          <div>
            <h3 className="font-medium text-foreground">{appointment.patientName}</h3>
            <p className="text-sm text-muted-foreground">{appointment.reason}</p>
          </div>
        </div>
        
        {/* Status & Actions */}
        <div className="flex items-center gap-2">
          <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${statusColors[appointment.status]}`}>
            {appointment.status}
          </span>
          <button 
            onClick={() => onView(appointment.id)}
            className="p-1.5 rounded-lg hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
          >
            <MoreVertical className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Appointment Details */}
      <div className="mt-4 grid grid-cols-2 gap-3">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Calendar className="w-4 h-4" />
          <span>{formatDate(appointment.date)}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Clock className="w-4 h-4" />
          <span>{formatTime(appointment.time)} ({appointment.duration}min)</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <TypeIcon className="w-4 h-4" />
          <span className="capitalize">{appointment.type.replace("-", " ")}</span>
        </div>
        {appointment.location && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <MapPin className="w-4 h-4" />
            <span className="truncate">{appointment.location}</span>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="mt-4 pt-3 border-t border-border flex items-center gap-2">
        <button 
          onClick={() => onView(appointment.id)}
          className="flex-1 px-3 py-2 text-sm font-medium text-foreground bg-muted hover:bg-muted/80 rounded-lg transition-colors"
        >
          View Details
        </button>
        {appointment.status === "scheduled" && (
          <button 
            onClick={() => onCancel(appointment.id)}
            className="px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
          >
            Cancel
          </button>
        )}
      </div>
    </div>
  );
}
