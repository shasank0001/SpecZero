import { useEffect, useMemo, useState } from "react";
import { cn } from "@/lib/utils";
import {
  loadSections,
  getSectionStatus,
  type SectionInfo,
  type ScreenInfo,
  type SectionStatusType,
} from "@/lib/section-navigator-loader";
import {
  ChevronRight,
  FolderOpen,
  FileCode2,
  CheckCircle2,
  Clock,
  Circle,
  Layers,
} from "lucide-react";

export interface SectionNavProps {
  selectedSection?: string;
  selectedScreen?: string;
  onSelectScreen: (sectionId: string, screenName: string) => void;
  className?: string;
}

const STATUS_CONFIG: Record<SectionStatusType, { icon: React.ReactNode; color: string }> = {
  complete: { 
    icon: <CheckCircle2 className="w-3.5 h-3.5" />, 
    color: "text-green-500" 
  },
  "in-progress": { 
    icon: <Clock className="w-3.5 h-3.5" />, 
    color: "text-amber-500" 
  },
  pending: { 
    icon: <Circle className="w-3.5 h-3.5" />, 
    color: "text-muted-foreground/50" 
  },
};

/**
 * SectionNav - Navigation sidebar for sections and screens
 */
export function SectionNav({
  selectedSection,
  selectedScreen,
  onSelectScreen,
  className,
}: SectionNavProps) {
  const sections = useMemo(() => loadSections(), []);

  if (sections.length === 0) {
    return (
      <div className={cn("flex flex-col items-center justify-center p-6 text-center", className)}>
        <div className="w-12 h-12 rounded-xl bg-muted/50 flex items-center justify-center mb-3">
          <Layers className="w-6 h-6 text-muted-foreground/50" />
        </div>
        <p className="text-sm font-medium text-muted-foreground mb-1">
          No sections found
        </p>
        <p className="text-xs text-muted-foreground/70">
          Create sections in{" "}
          <code className="px-1.5 py-0.5 bg-muted rounded text-[10px] font-mono">
            src/sections/
          </code>
        </p>
      </div>
    );
  }

  return (
    <nav className={cn("p-3 space-y-1", className)}>
      {sections.map((section) => (
        <SectionItem
          key={section.id}
          section={section}
          isSelected={selectedSection === section.id}
          selectedScreen={selectedSection === section.id ? selectedScreen : undefined}
          onSelectScreen={onSelectScreen}
        />
      ))}
    </nav>
  );
}

interface SectionItemProps {
  section: SectionInfo;
  isSelected: boolean;
  selectedScreen?: string;
  onSelectScreen: (sectionId: string, screenName: string) => void;
}

function SectionItem({
  section,
  isSelected,
  selectedScreen,
  onSelectScreen,
}: SectionItemProps) {
  const [isExpanded, setIsExpanded] = useState(isSelected);
  const status = getSectionStatus(section);
  const statusConfig = STATUS_CONFIG[status];
  const hasScreens = section.screens.length > 0;

  // Expand when selected
  useEffect(() => {
    if (isSelected && !isExpanded) {
      setIsExpanded(true);
    }
  }, [isSelected, isExpanded]);

  const handleClick = () => {
    if (hasScreens) {
      setIsExpanded(!isExpanded);
      // Auto-select first screen when expanding
      if (!isExpanded && section.screens.length > 0) {
        onSelectScreen(section.id, section.screens[0].name);
      }
    }
  };

  return (
    <div className="space-y-0.5">
      {/* Section Header */}
      <button
        onClick={handleClick}
        className={cn(
          "w-full flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200",
          isSelected
            ? "bg-primary/10 text-primary"
            : "text-foreground hover:bg-muted"
        )}
      >
        <FolderOpen className={cn(
          "w-4 h-4 shrink-0 transition-colors",
          isSelected ? "text-primary" : "text-muted-foreground"
        )} />
        <span className="flex-1 text-left truncate">{section.name}</span>
        <span className={statusConfig.color}>{statusConfig.icon}</span>
        {hasScreens && (
          <ChevronRight
            className={cn(
              "w-4 h-4 text-muted-foreground transition-transform duration-200",
              isExpanded && "rotate-90"
            )}
          />
        )}
      </button>

      {/* Screen List */}
      {isExpanded && hasScreens && (
        <div className="ml-3 pl-3 border-l-2 border-border space-y-0.5 animate-in fade-in slide-in-from-top-1 duration-200">
          {section.screens.map((screen) => (
            <ScreenItem
              key={screen.name}
              screen={screen}
              sectionId={section.id}
              isSelected={selectedScreen === screen.name}
              onSelect={onSelectScreen}
            />
          ))}
        </div>
      )}
    </div>
  );
}

interface ScreenItemProps {
  screen: ScreenInfo;
  sectionId: string;
  isSelected: boolean;
  onSelect: (sectionId: string, screenName: string) => void;
}

function ScreenItem({
  screen,
  sectionId,
  isSelected,
  onSelect,
}: ScreenItemProps) {
  return (
    <button
      onClick={() => onSelect(sectionId, screen.name)}
      className={cn(
        "w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-all duration-200",
        isSelected
          ? "bg-primary text-primary-foreground shadow-sm"
          : "text-muted-foreground hover:bg-muted hover:text-foreground"
      )}
    >
      <FileCode2 className="w-4 h-4 shrink-0" />
      <span className="truncate">{screen.name}</span>
    </button>
  );
}
