/**
 * Tour Context
 * 
 * Manages the interactive demo/tour state across the application.
 * Provides spotlight tour functionality with step tracking.
 */

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  type ReactNode,
} from "react";
import { useNavigate, useLocation } from "react-router-dom";

export interface TourStep {
  id: string;
  target: string; // CSS selector for the element to highlight
  title: string;
  content: string;
  route?: string; // Navigate to this route before showing step
  placement?: "top" | "bottom" | "left" | "right";
  spotlightPadding?: number;
  action?: () => void; // Action to perform when step is shown
}

interface TourContextValue {
  isActive: boolean;
  currentStep: number;
  totalSteps: number;
  currentStepData: TourStep | null;
  startTour: () => void;
  endTour: () => void;
  nextStep: () => void;
  prevStep: () => void;
  goToStep: (step: number) => void;
  progress: number; // 0-100
}

const TourContext = createContext<TourContextValue | null>(null);

// Tour steps configuration - Professional walkthrough of the app
const TOUR_STEPS: TourStep[] = [
  {
    id: "welcome",
    target: "[data-tour='logo']",
    title: "Welcome to SpecZero! 👋",
    content: "SpecZero transforms your product ideas into production-ready code scaffolds. Let's take a quick tour of the key features.",
    placement: "bottom",
    route: "/",
  },
  {
    id: "plan-tab",
    target: "[data-tour='tab-plan']",
    title: "📋 Plan Tab",
    content: "Start here! Define your product vision, features, and roadmap. This is where your idea takes shape.",
    placement: "bottom",
    route: "/",
  },
  {
    id: "plan-content",
    target: "[data-tour='plan-overview']",
    title: "Product Overview",
    content: "See your product definition rendered beautifully - vision, target users, and key features all in one place.",
    placement: "right",
    route: "/",
    spotlightPadding: 16,
  },
  {
    id: "data-tab",
    target: "[data-tour='tab-data']",
    title: "🗄️ Data Tab",
    content: "Design your database schema and validation rules. Click here to explore the data architecture.",
    placement: "bottom",
    route: "/",
  },
  {
    id: "data-erd",
    target: "[data-tour='schema-viewer']",
    title: "ERD Diagram",
    content: "Visualize your database schema as an interactive Entity-Relationship Diagram. See how models connect to each other.",
    placement: "left",
    route: "/data",
    spotlightPadding: 8,
  },
  {
    id: "data-models",
    target: "[data-tour='model-list']",
    title: "Model Explorer",
    content: "Browse all your data models, their fields, types, and relationships. Click any model to see details.",
    placement: "left",
    route: "/data",
    spotlightPadding: 8,
  },
  {
    id: "designs-tab",
    target: "[data-tour='tab-designs']",
    title: "🎨 Designs Tab",
    content: "Preview your UI components live! This is the 'Mock App' experience - see your designs before writing code.",
    placement: "bottom",
    route: "/data",
  },
  {
    id: "designs-preview",
    target: "[data-tour='preview-frame']",
    title: "Live Preview",
    content: "Your components render in real-time in an isolated iframe. Test different screen sizes with the device toggles.",
    placement: "left",
    route: "/designs",
    spotlightPadding: 8,
  },
  {
    id: "designs-sections",
    target: "[data-tour='section-nav']",
    title: "Section Navigator",
    content: "Browse through different screens and components. Each section represents a feature of your app.",
    placement: "right",
    route: "/designs",
    spotlightPadding: 8,
  },
  {
    id: "export-tab",
    target: "[data-tour='tab-export']",
    title: "📦 Export Tab",
    content: "The grand finale! Export your entire project as a production-ready Next.js scaffold.",
    placement: "bottom",
    route: "/designs",
  },
  {
    id: "export-validation",
    target: "[data-tour='validation-status']",
    title: "Validation Check",
    content: "Before exporting, we validate that all required files are present. Green means you're ready to go!",
    placement: "right",
    route: "/export",
    spotlightPadding: 8,
  },
  {
    id: "export-button",
    target: "[data-tour='export-button']",
    title: "Export Project 🚀",
    content: "One click generates a complete ZIP with code, documentation, and AI prompts for any coding agent to finish the build.",
    placement: "top",
    route: "/export",
    spotlightPadding: 8,
  },
  {
    id: "complete",
    target: "[data-tour='logo']",
    title: "You're All Set! 🎉",
    content: "That's the SpecZero workflow: Plan → Data → Designs → Export. Start building your next project!",
    placement: "bottom",
    route: "/export",
  },
];

const TOUR_STORAGE_KEY = "speczero-tour-completed";

interface TourProviderProps {
  children: ReactNode;
}

export function TourProvider({ children }: TourProviderProps) {
  const [isActive, setIsActive] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const navigate = useNavigate();
  const location = useLocation();

  const totalSteps = TOUR_STEPS.length;
  const currentStepData = isActive ? TOUR_STEPS[currentStep] : null;
  const progress = totalSteps > 0 ? ((currentStep + 1) / totalSteps) * 100 : 0;

  // Navigate to the correct route for the current step
  useEffect(() => {
    if (isActive && currentStepData?.route && location.pathname !== currentStepData.route) {
      navigate(currentStepData.route);
    }
  }, [isActive, currentStepData, location.pathname, navigate]);

  // Run step action if defined
  useEffect(() => {
    if (isActive && currentStepData?.action) {
      // Small delay to allow navigation to complete
      const timer = setTimeout(() => {
        currentStepData.action?.();
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [isActive, currentStepData]);

  const startTour = useCallback(() => {
    setCurrentStep(0);
    setIsActive(true);
  }, []);

  const endTour = useCallback(() => {
    setIsActive(false);
    setCurrentStep(0);
    // Mark tour as completed
    localStorage.setItem(TOUR_STORAGE_KEY, "true");
  }, []);

  const nextStep = useCallback(() => {
    if (currentStep < totalSteps - 1) {
      setCurrentStep((prev) => prev + 1);
    } else {
      endTour();
    }
  }, [currentStep, totalSteps, endTour]);

  const prevStep = useCallback(() => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    }
  }, [currentStep]);

  const goToStep = useCallback((step: number) => {
    if (step >= 0 && step < totalSteps) {
      setCurrentStep(step);
    }
  }, [totalSteps]);

  // Keyboard navigation
  useEffect(() => {
    if (!isActive) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case "Escape":
          endTour();
          break;
        case "ArrowRight":
        case "Enter":
          nextStep();
          break;
        case "ArrowLeft":
          prevStep();
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isActive, nextStep, prevStep, endTour]);

  return (
    <TourContext.Provider
      value={{
        isActive,
        currentStep,
        totalSteps,
        currentStepData,
        startTour,
        endTour,
        nextStep,
        prevStep,
        goToStep,
        progress,
      }}
    >
      {children}
    </TourContext.Provider>
  );
}

export function useTour() {
  const context = useContext(TourContext);
  if (!context) {
    throw new Error("useTour must be used within a TourProvider");
  }
  return context;
}

// Hook to check if tour should auto-start (first visit)
export function useTourAutoStart() {
  const { startTour } = useTour();
  
  useEffect(() => {
    // const hasCompletedTour = localStorage.getItem(TOUR_STORAGE_KEY);
    // Uncomment to enable auto-start on first visit:
    // if (!hasCompletedTour) {
    //   startTour();
    // }
  }, [startTour]);
}

// Reset tour completed state (for testing)
export function resetTourState() {
  localStorage.removeItem(TOUR_STORAGE_KEY);
}
