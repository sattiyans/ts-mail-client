"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";

interface PageTransitionProps {
  children: React.ReactNode;
}

export function PageTransition({ children }: PageTransitionProps) {
  const pathname = usePathname();
  const [isTransitioning, setIsTransitioning] = useState(false);
  const firstRenderRef = useRef(true);

  useEffect(() => {
    // Skip animation on first render to avoid initial flicker
    if (firstRenderRef.current) {
      firstRenderRef.current = false;
      return;
    }
    setIsTransitioning(true);
    const timer = setTimeout(() => setIsTransitioning(false), 120);
    return () => clearTimeout(timer);
  }, [pathname]);

  return (
    <div
      className={`transition-transform duration-120 ease-out will-change-transform ${
        isTransitioning ? "translate-y-1" : "translate-y-0"
      }`}
    >
      {children}
    </div>
  );
}
