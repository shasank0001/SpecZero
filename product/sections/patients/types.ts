export interface Patient {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string | null;
  dateOfBirth: string | null;
  address: string | null;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface PatientListProps {
  patients: Patient[];
  onView: (id: string) => void;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

export interface PatientDetailProps {
  patient: Patient;
  onEdit: () => void;
  onBack: () => void;
}

export interface PatientFormProps {
  patient?: Patient;
  onSubmit: (data: Omit<Patient, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onCancel: () => void;
  isLoading?: boolean;
}
