import React from "react";
import { cn } from "@/lib/utils";

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    {
      className,
      label,
      error,
      helperText,
      id,
      rows = 3,
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
        <textarea
          id={generatedId}
          ref={ref}
          rows={rows}
          aria-invalid={!!error}
          className={cn(
            "glass-input w-full p-3.5 text-sm text-white placeholder:text-txt-muted/70 focus:outline-none resize-y min-h-[90px]",
            error && "border-semantic-error/80 focus:border-semantic-error focus:ring-semantic-error/20",
            className
          )}
          {...props}
        />
        {error && (
          <p className="text-xs text-semantic-error font-medium">{error}</p>
        )}
        {helperText && !error && (
          <p className="text-xs text-txt-muted">{helperText}</p>
        )}
      </div>
    );
  }
);

Textarea.displayName = "Textarea";
