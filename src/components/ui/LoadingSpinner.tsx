import { cn } from "@/lib/utils";

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function LoadingSpinner({ size = "md", className }: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-6 h-6", 
    lg: "w-8 h-8"
  };

  return (
    <div className={cn("flex items-center justify-center", className)}>
      <div
        className={cn(
          "animate-spin rounded-full border-2 border-muted border-t-primary",
          sizeClasses[size]
        )}
      />
    </div>
  );
}

interface LoadingDotsProps {
  className?: string;
}

export function LoadingDots({ className }: LoadingDotsProps) {
  return (
    <div className={cn("flex space-x-1", className)}>
      <div className="w-2 h-2 bg-primary rounded-full animate-pulse" style={{ animationDelay: '0ms' }} />
      <div className="w-2 h-2 bg-primary rounded-full animate-pulse" style={{ animationDelay: '150ms' }} />
      <div className="w-2 h-2 bg-primary rounded-full animate-pulse" style={{ animationDelay: '300ms' }} />
    </div>
  );
}

interface AILoadingProps {
  text?: string;
  className?: string;
}

export function AILoading({ text = "AI is thinking...", className }: AILoadingProps) {
  return (
    <div className={cn("flex items-center space-x-3 p-4 rounded-lg bg-gradient-hero", className)}>
      <div className="relative">
        <div className="w-8 h-8 rounded-full bg-gradient-primary animate-pulse-soft" />
        <div className="absolute inset-0 w-8 h-8 rounded-full bg-gradient-primary animate-ping opacity-20" />
      </div>
      <div className="flex flex-col">
        <span className="text-sm font-medium">{text}</span>
        <LoadingDots className="mt-1" />
      </div>
    </div>
  );
}