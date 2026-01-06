import { useState, useMemo, useRef, useCallback, useEffect } from "react";
import { cn } from "@/lib/utils";
import {
  SectionNav,
  IframePreview,
  InspectorPanel,
  DesignTokensViewer,
} from "@/components/designs";
import { Smartphone, Tablet, Monitor, GripVertical, ChevronUp, ChevronDown } from "lucide-react";
import { EmptyState } from "@/components/shared/EmptyState";
import { loadSections } from "@/lib/section-navigator-loader";
import { useSearchParams } from "react-router-dom";
import {
  LayoutTemplate,
  Layers,
  Palette,
  FolderOpen,
  Sparkles,
  Play,
} from "lucide-react";

type DesignTab = "shell" | "sections" | "tokens";

const MIN_WIDTH_PERCENT = 25;
const DEFAULT_WIDTH_PERCENT = 100;

export default function DesignsPage() {
  // State
  const [activeTab, setActiveTab] = useState<DesignTab>("sections");
  const [selectedSection, setSelectedSection] = useState<string | undefined>();
  const [selectedScreen, setSelectedScreen] = useState<string | undefined>();
  const [widthPercent, setWidthPercent] = useState(DEFAULT_WIDTH_PERCENT);
  const [inspectorCollapsed, setInspectorCollapsed] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);
  const [searchParams, setSearchParams] = useSearchParams();

  // Load sections
  const sections = useMemo(() => loadSections(), []);

  // Support deep-linking from Plan/Roadmap: /designs?section=patients&screen=PatientList
  useEffect(() => {
    const sectionFromUrl = searchParams.get("section") ?? undefined;
    const screenFromUrl = searchParams.get("screen") ?? undefined;

    if (!sectionFromUrl) return;

    const section = sections.find((s) => s.id === sectionFromUrl);
    if (!section) return;

    setActiveTab("sections");
    setSelectedSection(section.id);

    const resolvedScreen =
      screenFromUrl && section.screens.some((sc) => sc.name === screenFromUrl)
        ? screenFromUrl
        : section.screens[0]?.name;

    if (resolvedScreen) {
      setSelectedScreen(resolvedScreen);
      setSearchParams({ section: section.id, screen: resolvedScreen }, { replace: true });
    } else {
      setSearchParams({ section: section.id }, { replace: true });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sections]);

  // Get preview URL
  const previewUrl = useMemo(() => {
    if (activeTab === "shell") {
      return "/preview/shell";
    }
    if (activeTab === "sections" && selectedSection && selectedScreen) {
      return `/preview/sections/${selectedSection}/${selectedScreen}`;
    }
    return null;
  }, [activeTab, selectedSection, selectedScreen]);

  // Get current section data
  const currentSection = useMemo(() => {
    if (!selectedSection) return null;
    return sections.find((s) => s.id === selectedSection);
  }, [sections, selectedSection]);

  // Handle screen selection
  const handleSelectScreen = (sectionId: string, screenName: string) => {
    setSelectedSection(sectionId);
    setSelectedScreen(screenName);
    setSearchParams({ section: sectionId, screen: screenName }, { replace: true });
  };

  // Handle resize drag (like design-os)
  const handleMouseDown = useCallback(() => {
    isDragging.current = true;

    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging.current || !containerRef.current) return;

      const containerRect = containerRef.current.getBoundingClientRect();
      const containerWidth = containerRect.width;
      const containerCenter = containerRect.left + containerWidth / 2;

      // Calculate distance from center
      const distanceFromCenter = Math.abs(e.clientX - containerCenter);
      const maxDistance = containerWidth / 2;

      // Convert to percentage
      let newWidthPercent = (distanceFromCenter / maxDistance) * 100;

      // Clamp between min width and 100%
      newWidthPercent = Math.max(MIN_WIDTH_PERCENT, Math.min(100, newWidthPercent));

      setWidthPercent(newWidthPercent);
    };

    const handleMouseUp = () => {
      isDragging.current = false;
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    document.body.style.cursor = 'ew-resize';
    document.body.style.userSelect = 'none';
  }, []);

  // Tab definitions
  const tabs: { id: DesignTab; label: string; icon: React.ReactNode }[] = [
    { id: "shell", label: "Shell", icon: <LayoutTemplate className="w-4 h-4" /> },
    { id: "sections", label: "Sections", icon: <Layers className="w-4 h-4" /> },
    { id: "tokens", label: "Tokens", icon: <Palette className="w-4 h-4" /> },
  ];

  const previewWidth = `${widthPercent}%`;

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] -m-6">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-background/95 backdrop-blur-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h1 className="text-xl font-semibold text-foreground">Designs</h1>
            <p className="text-sm text-muted-foreground">
              Preview components and design tokens
            </p>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-1 p-1 rounded-xl bg-muted/50 border border-border">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200",
                activeTab === tab.id
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {tab.icon}
              <span className="hidden sm:inline">{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Tokens Tab - Full Width */}
        {activeTab === "tokens" && (
          <div className="flex-1 overflow-auto">
            <DesignTokensViewer />
          </div>
        )}

        {/* Shell Tab */}
        {activeTab === "shell" && (
          <>
            {/* Preview Area */}
            <div className="flex-1 flex flex-col overflow-hidden">
              {/* Preview Controls */}
              <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-muted/20 shrink-0">
                {/* Device size presets */}
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setWidthPercent(30)}
                    className={cn(
                      "p-2 rounded-lg transition-colors",
                      widthPercent <= 40
                        ? "bg-primary/10 text-primary"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted"
                    )}
                    title="Mobile (30%)"
                  >
                    <Smartphone className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setWidthPercent(60)}
                    className={cn(
                      "p-2 rounded-lg transition-colors",
                      widthPercent > 40 && widthPercent <= 70
                        ? "bg-primary/10 text-primary"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted"
                    )}
                    title="Tablet (60%)"
                  >
                    <Tablet className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setWidthPercent(100)}
                    className={cn(
                      "p-2 rounded-lg transition-colors",
                      widthPercent > 70
                        ? "bg-primary/10 text-primary"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted"
                    )}
                    title="Desktop (100%)"
                  >
                    <Monitor className="w-4 h-4" />
                  </button>
                </div>
                <span className="text-xs text-muted-foreground font-mono">
                  {Math.round(widthPercent)}%
                </span>
              </div>

              {/* Preview with resizable container */}
              <div
                ref={containerRef}
                className="flex-1 overflow-hidden flex items-stretch justify-center p-4 bg-muted/30"
              >
                {/* Left resize handle */}
                <div
                  className="w-4 flex items-center justify-center cursor-ew-resize group shrink-0"
                  onMouseDown={handleMouseDown}
                >
                  <div className="w-1 h-16 rounded-full bg-border group-hover:bg-primary/50 transition-colors flex items-center justify-center">
                    <GripVertical className="w-3 h-3 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </div>

                {/* Preview container */}
                <div
                  className="bg-background rounded-lg shadow-xl border border-border overflow-hidden"
                  style={{ width: previewWidth, minWidth: '320px', maxWidth: '100%' }}
                >
                  <IframePreview
                    src="/preview/shell"
                    title="Shell Preview"
                    className="w-full h-full"
                    showControls={false}
                  />
                </div>

                {/* Right resize handle */}
                <div
                  className="w-4 flex items-center justify-center cursor-ew-resize group shrink-0"
                  onMouseDown={handleMouseDown}
                >
                  <div className="w-1 h-16 rounded-full bg-border group-hover:bg-primary/50 transition-colors flex items-center justify-center">
                    <GripVertical className="w-3 h-3 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </div>
              </div>
            </div>

            {/* Inspector */}
            <aside className="w-80 border-l border-border bg-card overflow-auto">
              <InspectorPanel screenName="Shell" sectionId="shell" />
            </aside>
          </>
        )}

        {/* Sections Tab */}
        {activeTab === "sections" && (
          <>
            {/* Section Navigation */}
            <aside className="w-64 border-r border-border bg-card overflow-auto" data-tour="section-nav">
              <div className="px-4 py-4 border-b border-border">
                <h3 className="font-semibold text-foreground flex items-center gap-2">
                  <FolderOpen className="w-4 h-4 text-primary" />
                  Sections
                </h3>
                <p className="text-xs text-muted-foreground mt-1">
                  {sections.length} section{sections.length !== 1 ? "s" : ""} available
                </p>
              </div>
              <SectionNav
                selectedSection={selectedSection}
                selectedScreen={selectedScreen}
                onSelectScreen={handleSelectScreen}
              />
            </aside>

            {/* Preview Area + Inspector */}
            <div className="flex-1 flex flex-col overflow-hidden" data-tour="preview-frame">
              {previewUrl ? (
                <>
                  {/* Preview Controls */}
                  <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-muted/20 shrink-0">
                    <div className="flex items-center gap-3">
                      {/* Device size presets */}
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => setWidthPercent(30)}
                          className={cn(
                            "p-2 rounded-lg transition-colors",
                            widthPercent <= 40
                              ? "bg-primary/10 text-primary"
                              : "text-muted-foreground hover:text-foreground hover:bg-muted"
                          )}
                          title="Mobile (30%)"
                        >
                          <Smartphone className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setWidthPercent(60)}
                          className={cn(
                            "p-2 rounded-lg transition-colors",
                            widthPercent > 40 && widthPercent <= 70
                              ? "bg-primary/10 text-primary"
                              : "text-muted-foreground hover:text-foreground hover:bg-muted"
                          )}
                          title="Tablet (60%)"
                        >
                          <Tablet className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setWidthPercent(100)}
                          className={cn(
                            "p-2 rounded-lg transition-colors",
                            widthPercent > 70
                              ? "bg-primary/10 text-primary"
                              : "text-muted-foreground hover:text-foreground hover:bg-muted"
                          )}
                          title="Desktop (100%)"
                        >
                          <Monitor className="w-4 h-4" />
                        </button>
                      </div>
                      <div className="h-4 w-px bg-border" />
                      <div className="flex items-center gap-2">
                        <Play className="w-3.5 h-3.5 text-green-500" />
                        <span className="text-xs text-muted-foreground">
                          {selectedSection}/{selectedScreen}
                        </span>
                      </div>
                    </div>
                    <span className="text-xs text-muted-foreground font-mono">
                      {Math.round(widthPercent)}%
                    </span>
                  </div>

                  {/* Preview with resizable container */}
                  <div
                    ref={containerRef}
                    className="flex-1 overflow-hidden flex items-stretch justify-center p-4 bg-muted/30"
                  >
                    {/* Left resize handle */}
                    <div
                      className="w-4 flex items-center justify-center cursor-ew-resize group shrink-0"
                      onMouseDown={handleMouseDown}
                    >
                      <div className="w-1 h-16 rounded-full bg-border group-hover:bg-primary/50 transition-colors flex items-center justify-center">
                        <GripVertical className="w-3 h-3 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                    </div>

                    {/* Preview container */}
                    <div
                      className="bg-background rounded-lg shadow-xl border border-border overflow-hidden"
                      style={{ width: previewWidth, minWidth: '320px', maxWidth: '100%' }}
                    >
                      <IframePreview
                        src={previewUrl}
                        title={`${selectedSection}/${selectedScreen}`}
                        className="w-full h-full"
                        showControls={false}
                      />
                    </div>

                    {/* Right resize handle */}
                    <div
                      className="w-4 flex items-center justify-center cursor-ew-resize group shrink-0"
                      onMouseDown={handleMouseDown}
                    >
                      <div className="w-1 h-16 rounded-full bg-border group-hover:bg-primary/50 transition-colors flex items-center justify-center">
                        <GripVertical className="w-3 h-3 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                    </div>
                  </div>

                  {/* Collapsible Inspector - Below Preview */}
                  <div className="border-t border-border bg-background shrink-0">
                    <button
                      onClick={() => setInspectorCollapsed(!inspectorCollapsed)}
                      className="w-full flex items-center justify-between px-4 py-2 hover:bg-muted/50 transition-colors"
                    >
                      <span className="text-sm font-medium text-muted-foreground">Inspector</span>
                      {inspectorCollapsed ? (
                        <ChevronUp className="w-4 h-4 text-muted-foreground" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-muted-foreground" />
                      )}
                    </button>
                    {!inspectorCollapsed && (
                      <div className="max-h-64 overflow-auto">
                        <InspectorPanel
                          screenName={selectedScreen}
                          sectionId={selectedSection}
                          sampleData={currentSection ? { section: currentSection } : undefined}
                        />
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <div className="flex-1 flex items-center justify-center">
                  <EmptyState
                    icon={Layers}
                    title="Select a screen"
                    description="Choose a section and screen from the sidebar to preview your components live"
                  />
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
