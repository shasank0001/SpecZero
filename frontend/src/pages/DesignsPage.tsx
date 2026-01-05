import { useState, useMemo } from "react";
import { cn } from "@/lib/utils";
import {
  SectionNav,
  IframePreview,
  PreviewControls,
  InspectorPanel,
  DesignTokensViewer,
  type DeviceSize,
  DEVICE_SIZES,
} from "@/components/designs";
import { EmptyState } from "@/components/shared/EmptyState";
import { loadSections } from "@/lib/section-navigator-loader";
import {
  LayoutTemplate,
  Layers,
  Palette,
  FolderOpen,
  Sparkles,
  Play,
} from "lucide-react";

type DesignTab = "shell" | "sections" | "tokens";

export default function DesignsPage() {
  // State
  const [activeTab, setActiveTab] = useState<DesignTab>("sections");
  const [selectedSection, setSelectedSection] = useState<string | undefined>();
  const [selectedScreen, setSelectedScreen] = useState<string | undefined>();
  const [deviceSize, setDeviceSize] = useState<DeviceSize>("desktop");

  // Load sections
  const sections = useMemo(() => loadSections(), []);

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
  };

  // Tab definitions
  const tabs: { id: DesignTab; label: string; icon: React.ReactNode }[] = [
    { id: "shell", label: "Shell", icon: <LayoutTemplate className="w-4 h-4" /> },
    { id: "sections", label: "Sections", icon: <Layers className="w-4 h-4" /> },
    { id: "tokens", label: "Tokens", icon: <Palette className="w-4 h-4" /> },
  ];

  // Get device dimensions for display
  const dimensions = deviceSize !== "full" ? DEVICE_SIZES[deviceSize] : null;

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
            <div className="flex-1 flex flex-col">
              {/* Preview Controls */}
              <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-muted/20">
                <PreviewControls
                  deviceSize={deviceSize}
                  onDeviceSizeChange={setDeviceSize}
                />
                {dimensions && (
                  <span className="text-xs text-muted-foreground font-mono">
                    {dimensions.width} × {dimensions.height}
                  </span>
                )}
              </div>

              {/* Preview */}
              <div className="flex-1 flex items-center justify-center p-4 overflow-auto bg-[repeating-conic-gradient(#f8fafc_0%_25%,#f1f5f9_0%_50%)] dark:bg-[repeating-conic-gradient(#1e293b_0%_25%,#0f172a_0%_50%)] bg-[length:20px_20px]">
                <div
                  className={cn(
                    "bg-background overflow-hidden transition-all duration-300",
                    deviceSize === "full"
                      ? "w-full h-full"
                      : "shadow-2xl shadow-black/10 dark:shadow-black/30 rounded-xl border border-border"
                  )}
                  style={
                    deviceSize === "full"
                      ? undefined
                      : {
                          width: DEVICE_SIZES[deviceSize].width,
                          height: DEVICE_SIZES[deviceSize].height,
                        }
                  }
                >
                  <IframePreview
                    src="/preview/shell"
                    title="Shell Preview"
                    width={deviceSize === "full" ? "100%" : DEVICE_SIZES[deviceSize].width}
                    height={deviceSize === "full" ? "100%" : DEVICE_SIZES[deviceSize].height}
                    showControls={deviceSize !== "full"}
                  />
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
            <aside className="w-64 border-r border-border bg-card overflow-auto">
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

            {/* Preview Area */}
            <div className="flex-1 flex flex-col">
              {previewUrl ? (
                <>
                  {/* Preview Controls */}
                  <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-muted/20">
                    <div className="flex items-center gap-3">
                      <PreviewControls
                        deviceSize={deviceSize}
                        onDeviceSizeChange={setDeviceSize}
                      />
                      <div className="h-4 w-px bg-border" />
                      <div className="flex items-center gap-2">
                        <Play className="w-3.5 h-3.5 text-green-500" />
                        <span className="text-xs text-muted-foreground">
                          {selectedSection}/{selectedScreen}
                        </span>
                      </div>
                    </div>
                    {dimensions && (
                      <span className="text-xs text-muted-foreground font-mono">
                        {dimensions.width} × {dimensions.height}
                      </span>
                    )}
                  </div>

                  {/* Preview */}
                  <div className="flex-1 flex items-center justify-center p-4 overflow-auto bg-[repeating-conic-gradient(#f8fafc_0%_25%,#f1f5f9_0%_50%)] dark:bg-[repeating-conic-gradient(#1e293b_0%_25%,#0f172a_0%_50%)] bg-[length:20px_20px]">
                    <div
                      className={cn(
                        "bg-background overflow-hidden transition-all duration-300",
                        deviceSize === "full"
                          ? "w-full h-full"
                          : "shadow-2xl shadow-black/10 dark:shadow-black/30 rounded-xl border border-border"
                      )}
                      style={
                        deviceSize === "full"
                          ? undefined
                          : {
                              width: DEVICE_SIZES[deviceSize].width,
                              height: DEVICE_SIZES[deviceSize].height,
                            }
                      }
                    >
                      <IframePreview
                        src={previewUrl}
                        title={`${selectedSection}/${selectedScreen}`}
                        width={deviceSize === "full" ? "100%" : DEVICE_SIZES[deviceSize].width}
                        height={deviceSize === "full" ? "100%" : DEVICE_SIZES[deviceSize].height}
                        showControls={deviceSize !== "full"}
                      />
                    </div>
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

            {/* Inspector */}
            <aside className="w-80 border-l border-border bg-card overflow-auto">
              <InspectorPanel
                screenName={selectedScreen}
                sectionId={selectedSection}
                sampleData={currentSection ? { section: currentSection } : undefined}
              />
            </aside>
          </>
        )}
      </div>
    </div>
  );
}
