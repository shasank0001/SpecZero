// Patient Types for the Patients Section

export type Gender = "male" | "female" | "other" | "prefer_not_to_say";

export type BloodType = 
  | "A_POSITIVE" 
  | "A_NEGATIVE" 
  | "B_POSITIVE" 
  | "B_NEGATIVE" 
  | "O_POSITIVE" 
  | "O_NEGATIVE" 
  | "AB_POSITIVE" 
  | "AB_NEGATIVE";

export interface Insurance {
  provider: string;
  policyNumber: string;
  groupNumber?: string | null;
}

export interface Patient {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  gender?: Gender;
  bloodType?: BloodType;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  emergencyContact?: string;
  emergencyPhone?: string;
  allergies: string[];
  medications: string[];
  medicalHistory?: string;
  insurance?: Insurance;
  createdAt: string;
  updatedAt: string;
}

export interface PatientListProps {
  patients: Patient[];
  onView: (id: string) => void;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

export interface PatientFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  gender?: Gender;
  bloodType?: BloodType;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  emergencyContact?: string;
  emergencyPhone?: string;
  allergies: string[];
  medications: string[];
  medicalHistory?: string;
  insuranceProvider?: string;
  insurancePolicyNumber?: string;
  insuranceGroupNumber?: string;
}

export interface PatientFilters {
  search: string;
  insuranceProvider: string | "all";
  dateRange: {
    start: string;
    end: string;
  };
}

export interface PatientStats {
  total: number;
  newThisMonth: number;
  activeInsurance: number;
  withAllergies: number;
}

