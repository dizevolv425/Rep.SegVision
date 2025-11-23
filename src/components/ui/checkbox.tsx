"use client";

import * as React from "react";
import * as CheckboxPrimitive from "@radix-ui/react-checkbox@1.1.4";
import { CheckIcon } from "lucide-react@0.487.0";

import { cn } from "./utils";

function Checkbox({
  className,
  ...props
}: React.ComponentProps<typeof CheckboxPrimitive.Root>) {
  return (
    <CheckboxPrimitive.Root
      data-slot="checkbox"
      className={cn(
        // Base styles
        "peer size-4 shrink-0 rounded-[4px] border shadow-xs outline-none transition-all",
        "bg-[var(--gray-50)] border-[var(--gray-200)]",
        
        // Dark mode base
        "dark:bg-[#19215A] dark:border-[#3B4580]",
        
        // Hover
        "hover:border-[var(--gray-300)]",
        "dark:hover:border-[#5A6BB8]",
        
        // Checked state
        "data-[state=checked]:bg-[var(--blue-primary-300)] data-[state=checked]:border-[var(--blue-primary-300)] data-[state=checked]:text-[var(--white-100)]",
        "dark:data-[state=checked]:bg-[var(--blue-primary-200)] dark:data-[state=checked]:border-[var(--blue-primary-200)]",
        
        // Focus state
        "focus-visible:border-[var(--blue-primary-300)] focus-visible:ring-2 focus-visible:ring-[var(--blue-primary-100)] focus-visible:ring-offset-2",
        
        // Disabled
        "disabled:cursor-not-allowed disabled:opacity-50",
        
        className,
      )}
      {...props}
    >
      <CheckboxPrimitive.Indicator
        data-slot="checkbox-indicator"
        className="flex items-center justify-center text-current transition-none"
      >
        <CheckIcon className="size-3.5" />
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  );
}

export { Checkbox };