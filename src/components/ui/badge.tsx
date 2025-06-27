// components/ui/badge.tsx
import * as React from "react";
import { cn } from "@/lib/utils";

type BadgeVariants = "default" | "secondary" | "destructive" | "outline";

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariants;
  className?: string;
}

const variantClasses: Record<BadgeVariants, string> = {
  default: "bg-primary text-primary-foreground",
  secondary: "bg-secondary text-secondary-foreground",
  destructive: "bg-destructive text-destructive-foreground",
  outline: "border border-input bg-transparent text-muted-foreground",
};

const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(({ variant = "default", className, ...props }, ref) => {
  return (
    <span
      ref={ref}
      className={cn(
        "inline-flex items-center rounded-full px-2 py-1 text-xs font-semibold",
        variantClasses[variant],
        className,
      )}
      {...props}
    />
  );
});

Badge.displayName = "Badge";

export { Badge };
