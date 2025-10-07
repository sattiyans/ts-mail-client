import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  children?: React.ReactNode;
}

export function EmptyState({ 
  icon: Icon, 
  title, 
  description, 
  action, 
  children 
}: EmptyStateProps) {
  return (
    <Card className="border-dashed">
      <CardHeader className="text-center">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-muted">
          <Icon className="h-6 w-6 text-muted-foreground" />
        </div>
        <CardTitle className="text-lg">{title}</CardTitle>
        <CardDescription className="max-w-sm mx-auto">
          {description}
        </CardDescription>
      </CardHeader>
      <CardContent className="text-center">
        {action && (
          <Button onClick={action.onClick} className="mb-4">
            {action.label}
          </Button>
        )}
        {children}
      </CardContent>
    </Card>
  );
}
