"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  LayoutDashboard,
  Globe,
  FileText,
  Send,
  BarChart3,
  Settings,
  Mail,
  ChevronLeft,
  ChevronRight,
  User,
  LogOut,
  HelpCircle,
} from "lucide-react";

const navigation = [
  {
    name: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    name: "Domains",
    href: "/domains",
    icon: Globe,
  },
  {
    name: "Templates",
    href: "/templates",
    icon: FileText,
  },
  {
    name: "Campaigns",
    href: "/campaigns",
    icon: Send,
  },
  {
    name: "Analytics",
    href: "/analytics",
    icon: BarChart3,
  },
  {
    name: "Settings",
    href: "/settings",
    icon: Settings,
  },
];

interface SidebarProps {
  className?: string;
  isCollapsed?: boolean;
  onToggle?: () => void;
  isMobile?: boolean;
}

export function Sidebar({ className, isCollapsed = false, onToggle, isMobile = false }: SidebarProps) {
  const pathname = usePathname();

  return (
    <div className={cn(
      "flex h-full flex-col bg-background border-r border-border transition-all duration-300 ease-in-out",
      isMobile ? "w-full" : isCollapsed ? "w-16" : "w-64",
      className
    )}
    style={!isMobile ? {
      width: isCollapsed ? '64px' : '256px',
      minWidth: isCollapsed ? '64px' : '256px',
      maxWidth: isCollapsed ? '64px' : '256px',
    } : undefined}>
      {/* Logo Section */}
      <div className={cn(
        "flex h-16 items-center border-b border-border",
        isMobile ? "justify-between px-4" : isCollapsed ? "justify-center px-2" : "justify-between px-4"
      )}>
        {isMobile ? (
          // Mobile state: Logo + text + close button
          <>
            <div className="flex items-center space-x-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-black dark:bg-white">
                <Mail className="h-4 w-4 text-white dark:text-black" />
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-semibold text-foreground">TS Mail</span>
                <span className="text-xs text-muted-foreground">Client</span>
              </div>
            </div>
            
            {onToggle && (
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 hover:bg-muted"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  onToggle();
                }}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
            )}
          </>
        ) : isCollapsed ? (
          // Collapsed state: Just the logo, no arrow
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-black dark:bg-white cursor-pointer hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors"
               onClick={(e) => {
                 e.preventDefault();
                 e.stopPropagation();
                 if (onToggle) onToggle();
               }}
               title="TS Mail Client">
            <Mail className="h-4 w-4 text-white dark:text-black" />
          </div>
        ) : (
          // Expanded state: Logo + text + collapse button
          <>
            <div className="flex items-center space-x-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-black dark:bg-white">
                <Mail className="h-4 w-4 text-white dark:text-black" />
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-semibold text-foreground">TS Mail</span>
                <span className="text-xs text-muted-foreground">Client</span>
              </div>
            </div>
            
            {onToggle && (
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 hover:bg-muted"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  onToggle();
                }}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
            )}
          </>
        )}
      </div>

      {/* Navigation */}
      <nav className={cn(
        "flex-1 space-y-1",
        isMobile ? "p-3" : isCollapsed ? "p-2" : "p-3"
      )}>
        {navigation.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link key={item.name} href={item.href}>
              <Button
                variant="ghost"
                className={cn(
                  "h-9 font-medium transition-all duration-200",
                  isActive 
                    ? "bg-accent text-accent-foreground shadow-sm" 
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/50",
                  isMobile 
                    ? "w-full justify-start px-3" 
                    : isCollapsed 
                      ? "w-full justify-center px-0" 
                      : "w-full justify-start px-3"
                )}
                title={!isMobile && isCollapsed ? item.name : undefined}
                onClick={isMobile && onToggle ? onToggle : undefined}
              >
                <item.icon className="h-4 w-4 flex-shrink-0" />
                {(!isMobile && !isCollapsed) || isMobile ? (
                  <span className="ml-3 truncate">{item.name}</span>
                ) : null}
              </Button>
            </Link>
          );
        })}
      </nav>

      {/* User Section */}
      <div className={cn(
        "border-t border-border",
        isMobile ? "p-3" : isCollapsed ? "p-2" : "p-3"
      )}>
        <div className={cn(
          "flex items-center rounded-lg p-2 hover:bg-muted/50 transition-colors cursor-pointer",
          isMobile ? "justify-between" : isCollapsed ? "justify-center" : "space-x-3"
        )}>
          <Avatar className="h-8 w-8">
            <AvatarImage src="/avatars/01.png" alt="User" />
            <AvatarFallback className="bg-muted text-muted-foreground text-xs">
              <User className="h-4 w-4" />
            </AvatarFallback>
          </Avatar>
          
          {(!isMobile && !isCollapsed) || isMobile ? (
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <div className="flex flex-col min-w-0">
                  <span className="text-sm font-medium text-foreground truncate">
                    John Doe
                  </span>
                  <span className="text-xs text-muted-foreground truncate">
                    john@example.com
                  </span>
                </div>
                {!isMobile && (
                  <div className="flex items-center space-x-1">
                    <Button variant="ghost" size="icon" className="h-6 w-6">
                      <HelpCircle className="h-3 w-3" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-6 w-6">
                      <LogOut className="h-3 w-3" />
                    </Button>
                  </div>
                )}
              </div>
            </div>
          ) : null}
        </div>
      </div>

      {/* Footer */}
      {!isCollapsed && (
        <div className="border-t border-border p-3">
          <div className="text-xs text-muted-foreground space-y-1">
            <p className="font-medium">TS Mail Client</p>
            <p>v1.0.0 • Phase 4 Complete</p>
          </div>
        </div>
      )}
    </div>
  );
}