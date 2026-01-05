import { cn } from "@/lib/utils";
import { User2, Mail, Phone, Calendar, ChevronRight } from "lucide-react";
import type { Patient } from "./PatientTable";

export interface PatientCardProps {
  patient: Patient;
  onView?: (id: string) => void;
  onEdit?: (id: string) => void;
  className?: string;
}

/**
 * PatientCard - Displays a single patient in a refined card format
 * 
 * This component is props-based and exportable.
 */
export function PatientCard({
  patient,
  onView,
  onEdit,
  className,
}: PatientCardProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div
      className={cn(
        "group relative overflow-hidden rounded-xl border border-border bg-card p-5",
        "transition-all duration-300 hover:shadow-lg hover:shadow-primary/5 hover:border-primary/20",
        "hover:-translate-y-0.5",
        className
      )}
    >
      {/* Decorative gradient */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-primary/5 to-transparent rounded-bl-[100px] -z-0" />
      
      {/* Content */}
      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
                {patient.avatar ? (
                  <img
                    src={patient.avatar}
                    alt={`${patient.firstName} ${patient.lastName}`}
                    className="w-full h-full rounded-xl object-cover"
                  />
                ) : (
                  <User2 className="w-6 h-6 text-primary" />
                )}
              </div>
              <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-green-500 ring-2 ring-card flex items-center justify-center">
                <div className="w-2 h-2 rounded-full bg-white" />
              </div>
            </div>
            <div>
              <h3 className="font-semibold text-foreground leading-tight">
                {patient.firstName} {patient.lastName}
              </h3>
              <p className="text-xs text-muted-foreground font-mono mt-0.5">
                {patient.id}
              </p>
            </div>
          </div>
        </div>

        {/* Info Grid */}
        <div className="space-y-2.5">
          <div className="flex items-center gap-3 text-sm">
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-muted/50">
              <Mail className="w-4 h-4 text-muted-foreground" />
            </div>
            <span className="text-muted-foreground truncate flex-1">
              {patient.email}
            </span>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-muted/50">
              <Phone className="w-4 h-4 text-muted-foreground" />
            </div>
            <span className="text-muted-foreground">
              {patient.phone}
            </span>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-muted/50">
              <Calendar className="w-4 h-4 text-muted-foreground" />
            </div>
            <span className="text-muted-foreground">
              {formatDate(patient.dateOfBirth)}
            </span>
          </div>
        </div>

        {/* Actions */}
        {(onView || onEdit) && (
          <div className="flex items-center gap-2 mt-4 pt-4 border-t border-border">
            {onView && (
              <button
                onClick={() => onView(patient.id)}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 px-4 text-sm font-medium rounded-lg bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
              >
                View Profile
                <ChevronRight className="w-4 h-4" />
              </button>
            )}
            {onEdit && (
              <button
                onClick={() => onEdit(patient.id)}
                className="py-2.5 px-4 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-colors"
              >
                Edit
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
