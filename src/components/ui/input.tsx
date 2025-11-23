import * as React from "react";

import { cn } from "./utils";

export interface InputProps extends React.ComponentProps<"input"> {
  error?: boolean;
  success?: boolean;
}

function Input({ className, type, error, success, ...props }: InputProps) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        // Base styles - Uses tokens that adapt to theme
        "flex h-[44px] w-full min-w-0 rounded-[8px] border px-3 py-2 mt-2 mb-2 text-[14px] outline-none transition-all",
        "bg-[var(--input-background)] border-[var(--input-border)]",
        "text-[var(--input-text)] placeholder:text-[var(--input-placeholder)] placeholder:text-[14px]",
        
        // Hover state
        "hover:border-[var(--input-border-hover)]",
        
        // Focus state - Blue border + ring
        "focus-visible:border-[var(--primary-bg)] focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)] focus-visible:ring-offset-2",
        
        // Disabled state
        "disabled:bg-[var(--disabled-bg)] disabled:border-[var(--input-border)] disabled:text-[var(--disabled-text)] disabled:cursor-not-allowed disabled:opacity-70",
        
        // Error state
        error && "border-[var(--red-alert-300)] focus-visible:border-[var(--red-alert-300)] focus-visible:ring-[var(--red-alert-100)]",
        
        // Success state
        success && "border-[var(--green-alert-300)] focus-visible:border-[var(--green-alert-300)] focus-visible:ring-[var(--green-alert-100)]",
        
        // File input
        "file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-[var(--input-text)]",
        
        className,
      )}
      {...props}
    />
  );
}

export { Input };
