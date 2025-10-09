"use client";

import { AppLayout } from "@/components/app-layout";
import { ProtectedRoute } from "@/components/protected-route";

export default function AppPagesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProtectedRoute>
      <AppLayout>{children}</AppLayout>
    </ProtectedRoute>
  );
}
