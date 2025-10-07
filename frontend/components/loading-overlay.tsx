"use client";

import { useLoading } from "@/lib/loading-context";
import { Loader2 } from "lucide-react";

export function LoadingOverlay() {
  const { isLoading, loadingMessage } = useLoading();

  if (!isLoading) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
      <div className="flex flex-col items-center space-y-4">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-sm text-muted-foreground">{loadingMessage}</p>
      </div>
    </div>
  );
}
