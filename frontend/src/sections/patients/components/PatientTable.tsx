import { cn } from "@/lib/utils";
import { Eye, Pencil, Trash2, User2 } from "lucide-react";

export interface Patient {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  createdAt: string;
  avatar?: string;
}

export interface PatientTableProps {
  patients: Patient[];
  onView?: (id: string) => void;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
  className?: string;
}

/**
 * PatientTable - Displays a list of patients in a refined table format
 * 
 * This component is props-based and exportable.
 * It does NOT import any data files directly.
 */
export function PatientTable({
  patients,
  onView,
  onEdit,
  onDelete,
  className,
}: PatientTableProps) {
  if (patients.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="w-16 h-16 rounded-2xl bg-muted/50 flex items-center justify-center mb-4">
          <User2 className="w-8 h-8 text-muted-foreground/50" />
        </div>
        <p className="text-muted-foreground font-medium">No patients found</p>
        <p className="text-sm text-muted-foreground/70 mt-1">
          Add your first patient to get started
        </p>
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className={cn("overflow-hidden rounded-xl border border-border bg-card", className)}>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border bg-muted/30">
              <th className="text-left px-5 py-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Patient
              </th>
              <th className="text-left px-5 py-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Contact
              </th>
              <th className="text-left px-5 py-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Date of Birth
              </th>
              <th className="text-left px-5 py-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Added
              </th>
              <th className="w-16 px-5 py-4" />
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {patients.map((patient, index) => (
              <tr
                key={patient.id}
                className={cn(
                  "group transition-colors hover:bg-muted/20",
                  "animate-in fade-in slide-in-from-bottom-2"
                )}
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <td className="px-5 py-4">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center ring-2 ring-background">
                        {patient.avatar ? (
                          <img
                            src={patient.avatar}
                            alt={`${patient.firstName} ${patient.lastName}`}
                            className="w-full h-full rounded-full object-cover"
                          />
                        ) : (
                          <span className="text-sm font-semibold text-primary">
                            {patient.firstName.charAt(0)}
                            {patient.lastName.charAt(0)}
                          </span>
                        )}
                      </div>
                      <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-green-500 ring-2 ring-background" />
                    </div>
                    <div>
                      <p className="font-medium text-foreground">
                        {patient.firstName} {patient.lastName}
                      </p>
                      <p className="text-xs text-muted-foreground font-mono">
                        {patient.id}
                      </p>
                    </div>
                  </div>
                </td>
                <td className="px-5 py-4">
                  <div className="space-y-1">
                    <p className="text-sm text-foreground">{patient.email}</p>
                    <p className="text-xs text-muted-foreground">{patient.phone}</p>
                  </div>
                </td>
                <td className="px-5 py-4">
                  <span className="text-sm text-muted-foreground">
                    {formatDate(patient.dateOfBirth)}
                  </span>
                </td>
                <td className="px-5 py-4">
                  <span className="text-sm text-muted-foreground">
                    {formatDate(patient.createdAt)}
                  </span>
                </td>
                <td className="px-5 py-4">
                  <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    {onView && (
                      <button
                        onClick={() => onView(patient.id)}
                        className="p-2 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                        title="View patient"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    )}
                    {onEdit && (
                      <button
                        onClick={() => onEdit(patient.id)}
                        className="p-2 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                        title="Edit patient"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                    )}
                    {onDelete && (
                      <button
                        onClick={() => onDelete(patient.id)}
                        className="p-2 rounded-lg hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors"
                        title="Delete patient"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
