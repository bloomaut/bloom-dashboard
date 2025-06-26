// components/ui/progress.tsx
import * as React from "react";
import { cn } from "@/lib/utils";

interface ProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  value: number; // 0 a 100
  max?: number;
  className?: string;
}

const Progress = React.forwardRef<HTMLDivElement, ProgressProps>(({ value, max = 100, className, ...props }, ref) => {
  const percentage = (Math.min(Math.max(value, 0), max) / max) * 100;

  return (
    <div
      role='progressbar'
      aria-valuemin={0}
      aria-valuemax={max}
      aria-valuenow={value}
      className={cn("w-full rounded-full bg-muted h-4 overflow-hidden", className)}
      ref={ref}
      {...props}
    >
      <div className='h-full bg-primary transition-all' style={{ width: `${percentage}%` }} />
    </div>
  );
});

Progress.displayName = "Progress";

export { Progress };
