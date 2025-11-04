"use client";

import { ReactNode } from "react";
import ErrorBoundary from "../components/ErrorBoundary";

export function ClientErrorBoundary({ children }: { children: ReactNode }) {
  return (
    <ErrorBoundary
      onError={(error: Error, errorInfo: { componentStack: string }) => {
        console.error("Application Error:", error);
        console.error("Error Info:", errorInfo);
        // TODO: Send to logging service (e.g., Sentry, LogRocket)
      }}
    >
      {children}
    </ErrorBoundary>
  );
}
