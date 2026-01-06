import { Suspense, lazy } from "react";
import { EmptyState } from "@/components/shared/EmptyState";
import { LayoutTemplate, Loader2 } from "lucide-react";

// Dynamically import shell preview
const ShellPreview = lazy(() =>
  import("@/shell/ShellPreview").catch(() => ({
    default: () => (
      <div className="flex items-center justify-center min-h-screen p-8">
        <EmptyState
          icon={LayoutTemplate}
          title="No shell preview"
          description="Generate shell components using the design-shell command in your AI agent."
          command="/design-shell"
        />
      </div>
    ),
  }))
);

export default function ShellPreviewRoute() {
  return (
    <Suspense
      fallback={
        <div className="flex flex-col items-center justify-center min-h-screen gap-4">
          <div className="relative">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
              <Loader2 className="w-6 h-6 text-primary animate-spin" />
            </div>
          </div>
          <p className="text-sm text-muted-foreground">Loading shell preview...</p>
        </div>
      }
    >
      <ShellPreview />
    </Suspense>
  );
}
