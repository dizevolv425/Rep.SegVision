"use client";

import * as React from "react";
import * as TogglePrimitive from "@radix-ui/react-toggle@1.1.2";
import { cva, type VariantProps } from "class-variance-authority@0.7.1";

import { cn } from "./utils";

const toggleVariants = cva(
  "inline-flex items-center justify-center gap-2 rounded-md text-sm font-medium hover:bg-[var(--neutral-subtle)] hover:text-[var(--neutral-text)] disabled:pointer-events-none disabled:opacity-50 data-[state=on]:bg-[var(--primary-bg)] data-[state=on]:text-[var(--primary-text-on)] data-[state=on]:hover:bg-[var(--primary-bg-hover)] [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 [&_svg]:shrink-0 focus-visible:ring-[var(--focus-ring)]/50 focus-visible:ring-[3px] outline-none transition-[color,background-color,box-shadow] whitespace-nowrap",
  {
    variants: {
      variant: {
        default: "bg-transparent text-[var(--neutral-text)]",
        outline:
          "border border-[var(--neutral-border)] bg-transparent hover:bg-[var(--neutral-subtle)] hover:text-[var(--neutral-text)] data-[state=on]:border-[var(--primary-border)]",
      },
      size: {
        default: "h-9 px-2 min-w-9",
        sm: "h-8 px-1.5 min-w-8",
        lg: "h-10 px-2.5 min-w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

function Toggle({
  className,
  variant,
  size,
  ...props
}: React.ComponentProps<typeof TogglePrimitive.Root> &
  VariantProps<typeof toggleVariants>) {
  return (
    <TogglePrimitive.Root
      data-slot="toggle"
      className={cn(toggleVariants({ variant, size, className }))}
      {...props}
    />
  );
}

export { Toggle, toggleVariants };
