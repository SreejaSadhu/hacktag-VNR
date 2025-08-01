import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface CTAButtonProps {
  children: ReactNode;
  variant?: "primary" | "secondary" | "outline";
  size?: "sm" | "default" | "lg";
  className?: string;
  onClick?: () => void;
  href?: string;
  disabled?: boolean;
}

export function CTAButton({
  children,
  variant = "primary",
  size = "default",
  className,
  onClick,
  href,
  disabled,
  ...props
}: CTAButtonProps) {
  const baseClasses = "transition-all duration-300 font-medium relative overflow-hidden group";
  
  const variantClasses = {
    primary: "bg-gradient-primary hover:opacity-90 text-primary-foreground shadow-soft hover:shadow-medium hover:-translate-y-0.5",
    secondary: "bg-gradient-secondary hover:opacity-90 text-secondary-foreground shadow-soft hover:shadow-medium hover:-translate-y-0.5",
    outline: "border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground bg-transparent"
  };

  if (href) {
    return (
      <a href={href} className="inline-block">
        <Button
          className={cn(baseClasses, variantClasses[variant], className)}
          size={size}
          disabled={disabled}
          {...props}
        >
          {children}
          <div className="absolute inset-0 bg-white/20 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300" />
        </Button>
      </a>
    );
  }

  return (
    <Button
      onClick={onClick}
      className={cn(baseClasses, variantClasses[variant], className)}
      size={size}
      disabled={disabled}
      {...props}
    >
      {children}
      <div className="absolute inset-0 bg-white/20 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300" />
    </Button>
  );
}