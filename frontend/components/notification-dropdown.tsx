"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Bell, Check, X, Mail, Send, AlertCircle, CheckCircle, Clock } from "lucide-react";
import { cn } from "@/lib/utils";

interface Notification {
  id: string;
  type: 'success' | 'warning' | 'info' | 'error';
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  action?: {
    label: string;
    onClick: () => void;
  };
}

const mockNotifications: Notification[] = [
  {
    id: '1',
    type: 'success',
    title: 'Campaign Sent Successfully',
    message: 'Your "Holiday Sale" campaign has been delivered to 1,250 recipients.',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
    read: false,
    action: {
      label: 'View Campaign',
      onClick: () => console.log('View campaign')
    }
  },
  {
    id: '2',
    type: 'warning',
    title: 'Domain Verification Pending',
    message: 'Your domain "newsletter.example.com" needs DNS verification.',
    timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000), // 5 hours ago
    read: false,
    action: {
      label: 'Verify Domain',
      onClick: () => console.log('Verify domain')
    }
  },
  {
    id: '3',
    type: 'info',
    title: 'New Subscriber',
    message: 'You have 15 new subscribers in the last 24 hours.',
    timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
    read: true,
    action: {
      label: 'View Subscribers',
      onClick: () => console.log('View subscribers')
    }
  },
  {
    id: '4',
    type: 'error',
    title: 'Email Delivery Failed',
    message: '5 emails failed to deliver due to invalid email addresses.',
    timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
    read: true,
    action: {
      label: 'Review Failed',
      onClick: () => console.log('Review failed emails')
    }
  },
  {
    id: '5',
    type: 'success',
    title: 'Template Created',
    message: 'Your "Welcome Series" template has been saved successfully.',
    timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
    read: true
  }
];

const getNotificationIcon = (type: Notification['type']) => {
  switch (type) {
    case 'success':
      return <CheckCircle className="h-4 w-4 text-green-500" />;
    case 'warning':
      return <AlertCircle className="h-4 w-4 text-yellow-500" />;
    case 'error':
      return <AlertCircle className="h-4 w-4 text-red-500" />;
    case 'info':
    default:
      return <Mail className="h-4 w-4 text-blue-500" />;
  }
};

const formatTimestamp = (timestamp: Date) => {
  const now = new Date();
  const diffInMinutes = Math.floor((now.getTime() - timestamp.getTime()) / (1000 * 60));
  
  if (diffInMinutes < 60) {
    return `${diffInMinutes}m ago`;
  } else if (diffInMinutes < 1440) {
    return `${Math.floor(diffInMinutes / 60)}h ago`;
  } else {
    return `${Math.floor(diffInMinutes / 1440)}d ago`;
  }
};

export function NotificationDropdown() {
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);
  const [isOpen, setIsOpen] = useState(false);

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(n => ({ ...n, read: true }))
    );
  };

  const removeNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="h-9 w-9 relative">
          <Bell className="h-4 w-4" />
          {unreadCount > 0 && (
            <Badge 
              variant="destructive" 
              className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center text-xs"
            >
              {unreadCount > 9 ? '9+' : unreadCount}
            </Badge>
          )}
          <span className="sr-only">Notifications</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80 p-0">
        <div className="p-4 pb-2">
          <div className="flex items-center justify-between">
            <DropdownMenuLabel className="font-semibold text-sm">Notifications</DropdownMenuLabel>
            {unreadCount > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={markAllAsRead}
                className="h-6 px-2 text-xs"
              >
                Mark all read
              </Button>
            )}
          </div>
        </div>
        
        <Separator />
        
        <ScrollArea className="h-80">
          {notifications.length === 0 ? (
            <div className="p-4 text-center text-muted-foreground">
              <Bell className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">No notifications</p>
            </div>
          ) : (
            <div className="p-2">
              {notifications.map((notification, index) => (
                <div key={notification.id}>
                  <div
                    className={cn(
                      "flex items-start space-x-3 p-3 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer group",
                      !notification.read && "bg-blue-50 dark:bg-blue-950/20"
                    )}
                    onClick={() => markAsRead(notification.id)}
                  >
                    <div className="flex-shrink-0 mt-0.5">
                      {getNotificationIcon(notification.type)}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <p className={cn(
                            "text-sm font-medium",
                            !notification.read && "font-semibold"
                          )}>
                            {notification.title}
                          </p>
                          <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                            {notification.message}
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">
                            {formatTimestamp(notification.timestamp)}
                          </p>
                        </div>
                        
                        <div className="flex items-center space-x-1 ml-2">
                          {!notification.read && (
                            <div className="h-2 w-2 bg-blue-500 rounded-full flex-shrink-0" />
                          )}
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={(e) => {
                              e.stopPropagation();
                              removeNotification(notification.id);
                            }}
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                      
                      {notification.action && (
                        <Button
                          variant="outline"
                          size="sm"
                          className="mt-2 h-6 px-2 text-xs"
                          onClick={(e) => {
                            e.stopPropagation();
                            notification.action?.onClick();
                          }}
                        >
                          {notification.action.label}
                        </Button>
                      )}
                    </div>
                  </div>
                  
                  {index < notifications.length - 1 && (
                    <Separator className="my-1" />
                  )}
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
        
        {notifications.length > 0 && (
          <>
            <Separator />
            <div className="p-2">
              <Button variant="ghost" className="w-full h-8 text-xs">
                View all notifications
              </Button>
            </div>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
