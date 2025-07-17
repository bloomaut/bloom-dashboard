// components/ui/avatar.tsx
import * as React from "react";
import { cn } from "@/lib/utils";

type AvatarSizes = "sm" | "md" | "lg";

interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: AvatarSizes;
  className?: string;
}

const sizeClasses: Record<AvatarSizes, string> = {
  sm: "w-8 h-8 text-sm",
  md: "w-12 h-12 text-base",
  lg: "w-16 h-16 text-lg",
};

const Avatar = React.forwardRef<HTMLDivElement, AvatarProps>(({ size = "md", className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "relative inline-flex overflow-hidden rounded-full bg-muted text-muted-foreground justify-center items-center font-medium select-none",
      sizeClasses[size],
      className,
    )}
    {...props}
  />
));
Avatar.displayName = "Avatar";

interface AvatarImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {}

const AvatarImage = React.forwardRef<HTMLImageElement, AvatarImageProps>(({ className, ...props }, ref) => (
  <img ref={ref} className={cn("aspect-square w-full object-cover", className)} {...props} />
));
AvatarImage.displayName = "AvatarImage";

interface AvatarFallbackProps extends React.HTMLAttributes<HTMLSpanElement> {}

const AvatarFallback = React.forwardRef<HTMLSpanElement, AvatarFallbackProps>(({ className, ...props }, ref) => (
  <span
    ref={ref}
    className={cn("absolute inset-0 flex items-center justify-center bg-muted text-muted-foreground", className)}
    {...props}
  />
));
AvatarFallback.displayName = "AvatarFallback";

export { Avatar, AvatarImage, AvatarFallback };
