import React from "react";
import { cn } from "@/lib/utils";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?:
    | "default"
    | "violet"
    | "cyan"
    | "mint"
    | "success"
    | "warning"
    | "error"
    | "outline";
  size?: "sm" | "md";
}

function BadgeImpl({
  className,
  variant = "default",
  size = "md",
  children,
  ...props
}: BadgeProps) {
  const sizeStyles = {
    sm: "px-2 py-0.5 text-[11px]",
    md: "px-2.5 py-1 text-xs",
  };

  const variantStyles = {
    default:
      "bg-white/10 text-white border-white/15",
    violet:
      "bg-accent-violet/15 text-accent-violet border-accent-violet/30",
    cyan:
      "bg-accent-cyan/15 text-accent-cyan border-accent-cyan/30",
    mint:
      "bg-accent-mint/15 text-accent-mint border-accent-mint/30",
    success:
      "bg-semantic-success/15 text-semantic-success border-semantic-success/30",
    warning:
      "bg-semantic-warning/15 text-semantic-warning border-semantic-warning/30",
    error:
      "bg-semantic-error/15 text-semantic-error border-semantic-error/30",
    outline:
      "bg-transparent text-txt-secondary border-white/20",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 font-medium rounded-full border backdrop-blur-md select-none",
        sizeStyles[size],
        variantStyles[variant],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}

export const Badge = React.memo(BadgeImpl);
