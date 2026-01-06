import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import { Suspense, lazy } from "react";
import { AppLayoutWithTour } from "@/components/layout/AppLayoutWithTour";
import PlanPage from "@/pages/PlanPage";
import DataPage from "@/pages/DataPage";
import DesignsPage from "@/pages/DesignsPage";
import ExportPage from "@/pages/ExportPage";
import DemoPage from "@/pages/DemoPage";
import { PreviewLayout } from "@/components/preview/PreviewLayout";
import { SectionPreviewLoader } from "@/components/preview/SectionPreviewLoader";

// Lazy load the shell preview
const ShellPreviewRoute = lazy(() => import("@/components/preview/ShellPreviewRoute"));

// Loading fallback for preview routes
function PreviewLoading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="flex flex-col items-center gap-3">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        <p className="text-sm text-muted-foreground">Loading preview...</p>
      </div>
    </div>
  );
}

const router = createBrowserRouter([
  // Main application routes
  {
    path: "/",
    element: <AppLayoutWithTour />,
    children: [
      {
        index: true,
        element: <PlanPage />,
      },
      {
        path: "data",
        element: <DataPage />,
      },
      {
        path: "designs",
        element: <DesignsPage />,
      },
      {
        path: "export",
        element: <ExportPage />,
      },
      {
        path: "demo",
        element: <DemoPage />,
      },
    ],
  },
  // Preview routes (for iframe embedding)
  {
    path: "/preview",
    element: <PreviewLayout />,
    children: [
      {
        path: "shell",
        element: (
          <Suspense fallback={<PreviewLoading />}>
            <ShellPreviewRoute />
          </Suspense>
        ),
      },
      {
        path: "sections/:sectionId/:screenName",
        element: <SectionPreviewLoader />,
      },
    ],
  },
]);

export function Router() {
  return <RouterProvider router={router} />;
}
