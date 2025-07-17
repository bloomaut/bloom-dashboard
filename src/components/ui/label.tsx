// components/ui/label.tsx
import * as React from "react";
import { cn } from "@/lib/utils";

const Label = React.forwardRef<HTMLLabelElement, React.LabelHTMLAttributes<HTMLLabelElement>>(
  ({ className, ...props }, ref) => {
    return (
      <label className={cn("mb-2 block text-sm font-medium text-muted-foreground", className)} ref={ref} {...props} />
    );
  },
);
Label.displayName = "Label";

export { Label };
