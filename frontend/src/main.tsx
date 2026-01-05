import React from "react";
import ReactDOM from "react-dom/client";
import { Router } from "@/lib/router";
import { ToastProvider, ErrorBoundary } from "@/components/shared";
import "@/index.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ErrorBoundary>
      <ToastProvider>
        <Router />
      </ToastProvider>
    </ErrorBoundary>
  </React.StrictMode>
);
