"use client";

import { useState, useEffect } from "react";
import { AnimatePresence } from "framer-motion";
import { LoadingScreen } from "./LoadingScreen";

interface ClientWrapperProps {
  children: React.ReactNode;
}

export function ClientWrapper({ children }: ClientWrapperProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [mounted, setMounted] = useState(false);

  // Only show loading screen on client
  useEffect(() => {
    setMounted(true);
  }, []);

  const handleComplete = () => {
    setIsLoading(false);
  };

  if (!mounted) {
    // SSR: render children immediately, no loading screen
    return <>{children}</>;
  }

  return (
    <>
      <AnimatePresence mode="wait">
        {isLoading && (
          <LoadingScreen
            key="loading"
            isLoading={isLoading}
            onComplete={handleComplete}
          />
        )}
      </AnimatePresence>

      {/* Hide content until loading completes, then reveal */}
      <div
        style={{
          visibility: isLoading ? "hidden" : "visible",
          opacity: isLoading ? 0 : 1,
          transition: "opacity 0.3s ease",
        }}
      >
        {children}
      </div>
    </>
  );
}
