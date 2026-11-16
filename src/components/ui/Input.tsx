import React from "react";
import { cn } from "@/lib/utils";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  leftElement?: React.ReactNode;
  rightElement?: React.ReactNode;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      type = "text",
      label,
      error,
      helperText,
      leftElement,
      rightElement,
      id,
      ...props
    },
    ref
  ) => {
    const reactId = React.useId();
    const generatedId = id || reactId;

    return (
      <div className="w-full space-y-1.5 text-start">
        {label && (
          <label
            htmlFor={generatedId}
            className="block text-xs font-medium text-txt-secondary"
          >
            {label}
            {props.required && <span className="text-semantic-error ml-1">*</span>}
          </label>
        )}
        <div className="relative flex items-center">
          {leftElement && (
            <div className="absolute start-3.5 z-10 text-txt-muted flex items-center pointer-events-none">
              {leftElement}
            </div>
          )}
          <input
            id={generatedId}
            ref={ref}
            type={type}
            aria-invalid={!!error}
            aria-describedby={error ? `${generatedId}-error` : undefined}
            className={cn(
              "glass-input w-full h-11 px-4 text-sm text-white placeholder:text-txt-muted/70 focus:outline-none transition-all",
              leftElement && "ps-10",
              rightElement && "pe-10",
              error && "border-semantic-error/80 focus:border-semantic-error focus:ring-semantic-error/20",
              className
            )}
            {...props}
          />
          {rightElement && (
            <div className="absolute end-3.5 z-10 flex items-center text-txt-muted">
              {rightElement}
            </div>
          )}
        </div>
        {error && (
          <p id={`${generatedId}-error`} className="text-xs text-semantic-error font-medium">
            {error}
          </p>
        )}
        {helperText && !error && (
          <p className="text-xs text-txt-muted">{helperText}</p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";
