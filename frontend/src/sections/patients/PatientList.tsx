/**
 * PatientList Preview Wrapper
 * 
 * This file is NOT exported - it's used only for local preview.
 * It imports sample data and passes it to the props-based components.
 */
import { useState } from "react";
import { PatientTable } from "./components/PatientTable";
import { PatientCard } from "./components/PatientCard";
import { LayoutGrid, List, Plus, Search, SlidersHorizontal } from "lucide-react";
import type { Patient } from "./components/PatientTable";

// Sample data for preview
const samplePatients: Patient[] = [
  {
    id: "pat_001",
    firstName: "John",
    lastName: "Smith",
    email: "john.smith@email.com",
    phone: "(555) 123-4567",
    dateOfBirth: "1985-03-15",
    createdAt: "2024-01-10T10:30:00Z",
  },
  {
    id: "pat_002",
    firstName: "Sarah",
    lastName: "Johnson",
    email: "sarah.j@email.com",
    phone: "(555) 234-5678",
    dateOfBirth: "1990-07-22",
    createdAt: "2024-01-12T14:45:00Z",
  },
  {
    id: "pat_003",
    firstName: "Michael",
    lastName: "Williams",
    email: "m.williams@email.com",
    phone: "(555) 345-6789",
    dateOfBirth: "1978-11-08",
    createdAt: "2024-01-15T09:15:00Z",
  },
  {
    id: "pat_004",
    firstName: "Emily",
    lastName: "Brown",
    email: "emily.brown@email.com",
    phone: "(555) 456-7890",
    dateOfBirth: "1995-05-30",
    createdAt: "2024-01-18T16:20:00Z",
  },
  {
    id: "pat_005",
    firstName: "David",
    lastName: "Martinez",
    email: "d.martinez@email.com",
    phone: "(555) 567-8901",
    dateOfBirth: "1982-09-12",
    createdAt: "2024-01-20T11:00:00Z",
  },
];

type ViewMode = "table" | "grid";

export default function PatientListPreview() {
  const [viewMode, setViewMode] = useState<ViewMode>("table");
  const [searchQuery, setSearchQuery] = useState("");

  const handleView = (id: string) => {
    console.log("View patient:", id);
  };

  const handleEdit = (id: string) => {
    console.log("Edit patient:", id);
  };

  const handleDelete = (id: string) => {
    console.log("Delete patient:", id);
  };

  const filteredPatients = samplePatients.filter(
    (patient) =>
      patient.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      patient.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      patient.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="h-full w-full bg-background overflow-auto">
      <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Patients</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Manage and view all patient records
            </p>
          </div>
          <button className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-primary text-primary-foreground rounded-lg font-medium text-sm hover:bg-primary/90 transition-colors">
            <Plus className="w-4 h-4" />
            Add Patient
          </button>
        </div>

        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search patients..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 text-sm bg-muted/50 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
            />
          </div>

          {/* Filters */}
          <button className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-muted-foreground hover:text-foreground border border-border rounded-lg hover:bg-muted transition-colors">
            <SlidersHorizontal className="w-4 h-4" />
            Filters
          </button>

          {/* View Toggle */}
          <div className="inline-flex items-center p-1 bg-muted/50 rounded-lg">
            <button
              onClick={() => setViewMode("table")}
              className={`p-2 rounded-md transition-colors ${
                viewMode === "table"
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
              title="Table view"
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
              title="Grid view"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Results Count */}
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <p>
            Showing <span className="font-medium text-foreground">{filteredPatients.length}</span>{" "}
            of <span className="font-medium text-foreground">{samplePatients.length}</span> patients
          </p>
        </div>

        {/* Content */}
        {viewMode === "table" ? (
          <PatientTable
            patients={filteredPatients}
            onView={handleView}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {filteredPatients.map((patient, index) => (
              <div
                key={patient.id}
                className="animate-in fade-in slide-in-from-bottom-2"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <PatientCard
                  patient={patient}
                  onView={handleView}
                  onEdit={handleEdit}
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
