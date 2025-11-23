import * as React from "react";

import { cn } from "./utils";

export interface TextareaProps extends React.ComponentProps<"textarea"> {
  error?: boolean;
  success?: boolean;
}

function Textarea({ className, error, success, ...props }: TextareaProps) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        // Base styles - Uses tokens that adapt to theme
        "flex field-sizing-content min-h-[88px] w-full rounded-[8px] border px-3 py-2 mt-2 mb-2 text-[14px] outline-none transition-all resize-none",
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
        
        className,
      )}
      {...props}
    />
  );
}

export { Textarea };
