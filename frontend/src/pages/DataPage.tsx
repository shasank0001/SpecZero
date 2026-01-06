/**
 * Data Page
 * 
 * Comprehensive data visualization featuring:
 * - Prisma schema ERD diagram with Mermaid
 * - Interactive model exploration
 * - Zod validators viewer with syntax highlighting
 * 
 * Aesthetic: Technical elegance with clear visual hierarchy
 */

import { useState, useEffect } from "react";
import { Database, Shield, AlertCircle, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { EmptyState } from "@/components/shared/EmptyState";
import {
  SchemaViewer,
  SchemaViewerSkeleton,
  ValidatorViewer,
  ValidatorViewerSkeleton,
} from "@/components/data";
import type { ValidatorSchema } from "@/components/data";
import { loadPrismaSchema } from "@/lib/schema-loader";
import { loadValidators } from "@/lib/validators-loader";
import { parseValidators } from "@/lib/validator-parser";
import type { PrismaModel } from "@/types/schema";

type DataTab = "schema" | "validators";

export default function DataPage() {
  const [activeTab, setActiveTab] = useState<DataTab>("schema");
  const [models, setModels] = useState<PrismaModel[]>([]);
  const [validators, setValidators] = useState<{
    schemas: ValidatorSchema[];
    rawContent: string;
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Load Prisma schema
        const schemaData = loadPrismaSchema();
        if (schemaData) {
          setModels(schemaData.models);
        }

        // Load validators
        const validatorData = loadValidators();
        if (validatorData) {
          const parsedSchemas = parseValidators(validatorData.rawContent);
          setValidators({
            schemas: parsedSchemas,
            rawContent: validatorData.rawContent,
          });
        }
      } catch (err) {
        console.error("Error loading data:", err);
        setError(
          err instanceof Error ? err.message : "Failed to load schema data"
        );
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const tabs: { id: DataTab; label: string; icon: typeof Database; count?: number }[] = [
    { id: "schema", label: "Schema", icon: Database, count: models.length },
    { id: "validators", label: "Validators", icon: Shield, count: validators?.schemas.length },
  ];

  // Loading state
  if (loading) {
    return (
      <div className="flex flex-col h-[calc(100vh-8rem)]">
        <TabBar tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} loading />
        <div className="flex-1">
          {activeTab === "schema" ? (
            <SchemaViewerSkeleton className="h-full" />
          ) : (
            <ValidatorViewerSkeleton className="h-full" />
          )}
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-8rem)] p-8">
        <Card className="max-w-md">
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-destructive/10">
                <AlertCircle className="h-7 w-7 text-destructive" />
              </div>
              <h2 className="text-lg font-semibold mb-2">Error Loading Data</h2>
              <p className="text-sm text-muted-foreground mb-4">{error}</p>
              <Button onClick={() => window.location.reload()} variant="outline">
                Try Again
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Check if we have any data at all
  const hasData = models.length > 0 || (validators && validators.schemas.length > 0);

  if (!hasData) {
    return (
      <div className="flex flex-col h-[calc(100vh-8rem)]">
        <TabBar tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />
        <div className="flex-1 flex items-center justify-center p-8">
          <div className="max-w-md w-full">
            <EmptyState
              icon={Sparkles}
              title="Design Your Data Architecture"
              description="Run the AI prompt command to generate your database schema and Zod validators"
              command="/architect-database"
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)]">
      {/* Tab Navigation */}
      <TabBar tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />

      {/* Tab Content */}
      <div className="flex-1 overflow-hidden">
        {activeTab === "schema" && (
          <>
            {models.length > 0 ? (
              <div data-tour="schema-viewer" className="h-full">
                <SchemaViewer models={models} className="h-full" />
              </div>
            ) : (
              <div className="flex items-center justify-center h-full p-8">
                <EmptyState
                  icon={Database}
                  title="No database schema yet"
                  description="Run the architect-database command to generate your Prisma schema"
                  command="/architect-database"
                />
              </div>
            )}
          </>
        )}

        {activeTab === "validators" && (
          <>
            {validators && validators.schemas.length > 0 ? (
              <ValidatorViewer
                schemas={validators.schemas}
                rawContent={validators.rawContent}
                className="h-full"
              />
            ) : (
              <div className="flex items-center justify-center h-full p-8">
                <EmptyState
                  icon={Shield}
                  title="No validators yet"
                  description="Validators are generated alongside your database schema"
                  command="/architect-database"
                />
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

/**
 * Tab Bar Component
 */
interface TabBarProps {
  tabs: { id: DataTab; label: string; icon: typeof Database; count?: number }[];
  activeTab: DataTab;
  onTabChange: (tab: DataTab) => void;
  loading?: boolean;
}

function TabBar({ tabs, activeTab, onTabChange, loading }: TabBarProps) {
  return (
    <div className="flex items-center gap-1 px-2 py-2 border-b bg-gradient-to-r from-muted/40 via-muted/20 to-transparent">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;

        return (
          <Button
            key={tab.id}
            variant={isActive ? "secondary" : "ghost"}
            size="sm"
            className={cn(
              "gap-2 transition-all duration-200",
              isActive && "bg-background shadow-sm border border-border/50"
            )}
            onClick={() => onTabChange(tab.id)}
          >
            <Icon className="h-4 w-4" />
            <span>{tab.label}</span>
            {!loading && tab.count !== undefined && tab.count > 0 && (
              <span
                className={cn(
                  "ml-1 px-1.5 py-0.5 text-[10px] font-semibold rounded-full",
                  isActive
                    ? "bg-primary/10 text-primary"
                    : "bg-muted text-muted-foreground"
                )}
              >
                {tab.count}
              </span>
            )}
          </Button>
        );
      })}
    </div>
  );
}
