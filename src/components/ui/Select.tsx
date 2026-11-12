import React from "react";
import { cn } from "@/lib/utils";
import { ChevronDown } from "lucide-react";

export interface SelectProps
  extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  helperText?: string;
  options?: { value: string; label: string }[];
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  (
    {
      className,
      label,
      error,
      helperText,
      options,
      children,
      id,
      ...props
    },
    ref
  ) => {
    const generatedId = id || React.useId();

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
          <select
            id={generatedId}
            ref={ref}
            aria-invalid={!!error}
            className={cn(
              "glass-input w-full h-11 px-4 pe-10 text-sm text-white bg-navy-900 focus:outline-none appearance-none cursor-pointer",
              error && "border-semantic-error/80",
              className
            )}
            {...props}
          >
            {options
              ? options.map((opt) => (
                  <option
                    key={opt.value}
                    value={opt.value}
                    className="bg-navy-900 text-white py-2"
                  >
                    {opt.label}
                  </option>
                ))
              : children}
          </select>
          <div className="absolute end-3.5 pointer-events-none text-txt-muted">
            <ChevronDown className="w-4 h-4" />
          </div>
        </div>
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

Select.displayName = "Select";
