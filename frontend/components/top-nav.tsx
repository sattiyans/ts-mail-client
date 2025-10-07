"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ThemeToggle } from "@/components/theme-toggle";
import { NotificationDropdown } from "@/components/notification-dropdown";
import {
  LayoutDashboard,
  Globe,
  FileText,
  Send,
  BarChart3,
  Settings,
  Mail,
  Menu,
  Search,
  User,
  LogOut,
  HelpCircle,
} from "lucide-react";

export function TopNav({ onMenuClick }: { onMenuClick?: () => void }) {
  const pathname = usePathname();
  const pageTitle = pathname.split("/").pop() || "Dashboard";

  const getPageTitle = (path: string) => {
    const titles: { [key: string]: string } = {
      dashboard: "Dashboard",
      domains: "Domains",
      templates: "Templates",
      campaigns: "Campaigns",
      analytics: "Analytics",
      settings: "Settings",
      profile: "Profile",
    };
    return titles[path] || path.charAt(0).toUpperCase() + path.slice(1);
  };

  return (
    <header className="sticky top-0 z-40 flex h-16 items-center justify-between border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-4 md:px-6">
      {/* Mobile Menu */}
      <Button
        variant="ghost"
        size="icon"
        className="shrink-0 md:hidden"
        onClick={onMenuClick}
      >
        <Menu className="h-5 w-5" />
        <span className="sr-only">Toggle navigation menu</span>
      </Button>

      {/* Page Title */}
      <div className="flex items-center space-x-4 flex-1">
        <h1 className="text-lg md:text-xl font-semibold text-foreground truncate">
          {getPageTitle(pageTitle)}
        </h1>
      </div>

      {/* Right Side Actions */}
      <div className="flex items-center space-x-1 md:space-x-2">
        {/* Search - Hidden on mobile */}
        <Button variant="ghost" size="icon" className="h-9 w-9 hidden md:flex">
          <Search className="h-4 w-4" />
          <span className="sr-only">Search</span>
        </Button>

        {/* Theme Toggle */}
        <ThemeToggle />

        {/* Notifications */}
        <NotificationDropdown />

        {/* User Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-9 w-9 rounded-full">
              <Avatar className="h-8 w-8">
                <AvatarImage src="/avatars/01.png" alt="User" />
                <AvatarFallback className="bg-muted text-muted-foreground">
                  <User className="h-4 w-4" />
                </AvatarFallback>
              </Avatar>
              <span className="sr-only">User menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">John Doe</p>
                <p className="text-xs leading-none text-muted-foreground">
                  john@example.com
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/profile" className="flex items-center">
                <User className="mr-2 h-4 w-4" />
                <span>Profile</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <HelpCircle className="mr-2 h-4 w-4" />
              <span>Help & Support</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <LogOut className="mr-2 h-4 w-4" />
              <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}