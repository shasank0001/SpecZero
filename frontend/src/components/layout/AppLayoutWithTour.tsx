/**
 * Tour Wrapper Component
 * 
 * Wraps the main app layout with tour functionality.
 * Must be rendered inside a Router context.
 */

import { TourProvider, TourSpotlight } from "@/components/tour";
import { AppLayout } from "./AppLayout";

export function AppLayoutWithTour() {
  return (
    <TourProvider>
      <AppLayout />
      <TourSpotlight />
    </TourProvider>
  );
}
