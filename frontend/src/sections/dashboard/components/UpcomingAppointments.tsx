/**
 * UpcomingAppointments Component
 * 
 * Displays a list of upcoming appointments.
 * This is a props-based component for export.
 */
import { Calendar, Clock, Video, Phone, Building, ChevronRight } from "lucide-react";

export interface UpcomingAppointment {
  id: string;
  patientName: string;
  patientAvatar?: string;
  date: string;
  time: string;
  type: "in-person" | "video" | "phone";
  reason: string;
}

export interface UpcomingAppointmentsProps {
  appointments: UpcomingAppointment[];
  onViewAppointment?: (id: string) => void;
  onViewAll?: () => void;
}

const typeIcons = {
  "in-person": Building,
  video: Video,
  phone: Phone,
};

export function UpcomingAppointments({ appointments, onViewAppointment, onViewAll }: UpcomingAppointmentsProps) {
  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(":");
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? "PM" : "AM";
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    if (date.toDateString() === today.toDateString()) return "Today";
    if (date.toDateString() === tomorrow.toDateString()) return "Tomorrow";
    return date.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });
  };

  return (
    <div className="bg-card border border-border rounded-xl overflow-hidden">
      <div className="flex items-center justify-between px-5 py-4 border-b border-border">
        <h3 className="font-semibold text-foreground">Upcoming Appointments</h3>
        {onViewAll && (
          <button 
            onClick={onViewAll}
            className="text-sm text-primary hover:underline"
          >
            View all
          </button>
        )}
      </div>
      <div className="divide-y divide-border">
        {appointments.slice(0, 5).map((apt) => {
          const TypeIcon = typeIcons[apt.type];
          return (
            <div 
              key={apt.id} 
              className="px-5 py-4 hover:bg-muted/30 transition-colors cursor-pointer group"
              onClick={() => onViewAppointment?.(apt.id)}
            >
              <div className="flex items-center gap-4">
                {/* Patient Avatar */}
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center text-sm font-medium text-primary shrink-0">
                  {apt.patientAvatar ? (
                    <img src={apt.patientAvatar} alt="" className="w-full h-full rounded-full object-cover" />
                  ) : (
                    apt.patientName.split(" ").map(n => n[0]).join("")
                  )}
                </div>
                
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-foreground">{apt.patientName}</p>
                  <p className="text-sm text-muted-foreground truncate">{apt.reason}</p>
                </div>
                
                <div className="text-right shrink-0">
                  <p className="text-sm font-medium text-foreground">{formatDate(apt.date)}</p>
                  <div className="flex items-center gap-1 justify-end text-sm text-muted-foreground">
                    <Clock className="w-3 h-3" />
                    <span>{formatTime(apt.time)}</span>
                  </div>
                </div>
                
                <div className="flex items-center gap-2 shrink-0">
                  <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center">
                    <TypeIcon className="w-4 h-4 text-muted-foreground" />
                  </div>
                  <ChevronRight className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </div>
            </div>
          );
        })}
      </div>
      {appointments.length === 0 && (
        <div className="px-5 py-12 text-center">
          <Calendar className="w-10 h-10 mx-auto text-muted-foreground/50" />
          <p className="mt-3 text-sm text-muted-foreground">No upcoming appointments</p>
        </div>
      )}
    </div>
  );
}
