"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { Sidebar } from "@/components/sidebar";
import { TopNav } from "@/components/top-nav";
import { LoadingProvider } from "@/lib/loading-context";
import { LoadingOverlay } from "@/components/loading-overlay";
import { Toaster } from "@/components/ui/sonner";
import { PageTransition } from "@/components/page-transition";
import { ErrorBoundary } from "@/components/error-boundary";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { VisuallyHidden } from "@/components/ui/visually-hidden";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";

interface AppLayoutProps {
  children: React.ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  const pathname = usePathname();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  const toggleMobileSidebar = () => {
    setIsMobileSidebarOpen(!isMobileSidebarOpen);
  };

  // Check if current route is an auth route
  const isAuthRoute = pathname === '/login' || pathname === '/register';

  // If it's an auth route, render the auth layout
  if (isAuthRoute) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-4 sm:p-6 lg:p-8">
        <div className="w-full max-w-sm sm:max-w-md lg:max-w-lg">
          {children}
        </div>
      </div>
    );
  }

  // Otherwise render the normal app layout
  return (
    <LoadingProvider>
      <div className="flex h-screen bg-background">
        {/* Desktop Sidebar - hidden on mobile */}
        <div className="hidden md:flex">
          <Sidebar 
            isCollapsed={isSidebarCollapsed} 
            onToggle={toggleSidebar}
          />
        </div>
        
        {/* Main content area */}
        <div className="flex flex-1 flex-col overflow-hidden">
          <TopNav onMenuClick={toggleMobileSidebar} />
          
          {/* Mobile Sidebar */}
          <Sheet open={isMobileSidebarOpen} onOpenChange={setIsMobileSidebarOpen}>
            <SheetContent side="left" className="w-64 p-0 md:hidden">
              <VisuallyHidden>
                <h2>Navigation Menu</h2>
              </VisuallyHidden>
              <Sidebar 
                isCollapsed={false} 
                onToggle={() => setIsMobileSidebarOpen(false)}
                isMobile={true}
              />
            </SheetContent>
          </Sheet>
          
          <main className="flex-1 overflow-auto p-4 md:p-6">
            <ErrorBoundary>
              <PageTransition>
                {children}
              </PageTransition>
            </ErrorBoundary>
          </main>
        </div>
        
        {/* Loading overlay */}
        <LoadingOverlay />
        
        {/* Toast notifications */}
        <Toaster />
      </div>
    </LoadingProvider>
  );
}
