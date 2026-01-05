import { useParams } from "react-router-dom";
import { Suspense, lazy, useMemo } from "react";
import { EmptyState } from "@/components/shared/EmptyState";
import { FileQuestion, Loader2 } from "lucide-react";

// Dynamically import all section preview files
const sectionPreviews = import.meta.glob("/src/sections/*/[A-Z]*.tsx");

export function SectionPreviewLoader() {
  const { sectionId, screenName } = useParams<{
    sectionId: string;
    screenName: string;
  }>();

  const PreviewComponent = useMemo(() => {
    if (!sectionId || !screenName) return null;

    // Build the expected path
    const previewPath = `/src/sections/${sectionId}/${screenName}.tsx`;

    // Check if the preview exists
    const loader = sectionPreviews[previewPath];
    if (!loader) return null;

    // Create lazy component
    return lazy(loader as () => Promise<{ default: React.ComponentType }>);
  }, [sectionId, screenName]);

  if (!PreviewComponent) {
    return (
      <div className="flex items-center justify-center h-full p-8">
        <EmptyState
          icon={FileQuestion}
          title="Preview not found"
          description={`No preview found for ${sectionId}/${screenName}. Make sure the file exists at src/sections/${sectionId}/${screenName}.tsx`}
        />
      </div>
    );
  }

  return (
    <Suspense
      fallback={
        <div className="flex flex-col items-center justify-center h-full gap-4">
          <div className="relative">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
              <Loader2 className="w-6 h-6 text-primary animate-spin" />
            </div>
          </div>
          <p className="text-sm text-muted-foreground">Loading preview...</p>
        </div>
      }
    >
      <PreviewComponent />
    </Suspense>
  );
}
