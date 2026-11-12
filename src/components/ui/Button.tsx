import React from "react";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "destructive";
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "primary",
      size = "md",
      isLoading = false,
      disabled,
      leftIcon,
      rightIcon,
      children,
      ...props
    },
    ref
  ) => {
    const baseStyles =
      "inline-flex items-center justify-center font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-violet focus-visible:ring-offset-2 focus-visible:ring-offset-navy-950 disabled:opacity-50 disabled:cursor-not-allowed select-none";

    const sizeStyles = {
      sm: "h-9 px-3.5 text-xs rounded-[11px] gap-1.5",
      md: "h-11 px-5 text-sm rounded-[13px] gap-2",
      lg: "h-12 px-6 text-base rounded-[15px] gap-2.5",
    };

    const variantStyles = {
      primary:
        "glass-button-primary",
      secondary:
        "glass-button-secondary",
      outline:
        "bg-transparent text-white border border-white/20 hover:border-accent-violet hover:bg-white/5",
      ghost:
        "bg-transparent text-txt-secondary hover:text-white hover:bg-white/5 rounded-[12px]",
      destructive:
        "bg-semantic-error/20 text-semantic-error border border-semantic-error/40 hover:bg-semantic-error/30",
    };

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(baseStyles, sizeStyles[size], variantStyles[variant], className)}
        {...props}
      >
        {isLoading ? (
          <Loader2 className="w-4 h-4 animate-spin shrink-0" />
        ) : (
          leftIcon && <span className="shrink-0">{leftIcon}</span>
        )}
        <span>{children}</span>
        {!isLoading && rightIcon && <span className="shrink-0">{rightIcon}</span>}
      </button>
    );
  }
);

Button.displayName = "Button";
