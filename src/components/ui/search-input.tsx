import * as React from "react";
import { Search } from "lucide-react";
import { cn } from "./utils";

export interface SearchInputProps extends React.ComponentProps<"input"> {
  error?: boolean;
  success?: boolean;
}

function SearchInput({ className, error, success, ...props }: SearchInputProps) {
  return (
    <div className="relative w-full">
      <Search 
        className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-[var(--input-placeholder)] pointer-events-none" 
        aria-hidden="true"
      />
      <input
        type="search"
        data-slot="search-input"
        className={cn(
          // Base styles - Uses tokens that adapt to theme
          "flex h-[44px] w-full min-w-0 rounded-[8px] border pl-10 pr-3 py-2 mt-2 mb-2 text-[14px] outline-none transition-all",
          "bg-[var(--input-background)] border-[var(--input-border)]",
          "text-[var(--input-text)] placeholder:text-[var(--input-placeholder)] placeholder:text-[14px]",
          
          // Hover state
          "hover:border-[var(--input-border-hover)]",
          
          // Focus state - Blue border + ring (icon stays gray)
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
    </div>
  );
}

export { SearchInput };
