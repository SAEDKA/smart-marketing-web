import React from "react";
import { cn } from "@/lib/utils";

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  interactive?: boolean;
}

function CardImpl({ className, interactive = false, children, ...props }: CardProps) {
  return (
    <div
      className={cn(
        interactive ? "glass-card-interactive" : "glass-card",
        "p-6",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

function CardHeaderImpl({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("flex flex-col space-y-1.5 pb-4", className)} {...props}>
      {children}
    </div>
  );
}

function CardTitleImpl({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3
      className={cn("text-lg font-semibold tracking-tight text-white", className)}
      {...props}
    >
      {children}
    </h3>
  );
}

function CardDescriptionImpl({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p className={cn("text-sm text-txt-secondary leading-relaxed", className)} {...props}>
      {children}
    </p>
  );
}

function CardContentImpl({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("pt-2", className)} {...props}>{children}</div>;
}

function CardFooterImpl({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("flex items-center pt-4 border-t border-white/10 mt-4", className)}
      {...props}
    >
      {children}
    </div>
  );
}

// Memoized: these primitives render in long lists/grids across every
// page. With stable props they now skip re-rendering when a parent
// re-renders for an unrelated state change.
export const Card = React.memo(CardImpl);
export const CardHeader = React.memo(CardHeaderImpl);
export const CardTitle = React.memo(CardTitleImpl);
export const CardDescription = React.memo(CardDescriptionImpl);
export const CardContent = React.memo(CardContentImpl);
export const CardFooter = React.memo(CardFooterImpl);
