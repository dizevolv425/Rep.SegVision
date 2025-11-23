import * as React from "react";
import { Slot } from "@radix-ui/react-slot@1.1.2";
import { cva, type VariantProps } from "class-variance-authority@0.7.1";

import { cn } from "./utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)] focus-visible:ring-offset-2",
  {
    variants: {
      variant: {
        default: "bg-[var(--primary-bg)] text-[var(--white-100)] hover:bg-[var(--primary-bg-hover)] active:bg-[var(--primary-bg-press)] data-[size=icon]:hover:shadow-md data-[size=icon]:hover:scale-105",
        destructive:
          "bg-[var(--red-alert-200)] text-[var(--white-100)] hover:bg-[var(--red-alert-300)] active:bg-[var(--red-alert-400)] data-[size=icon]:hover:shadow-md data-[size=icon]:hover:scale-105",
        outline:
          "border-[1.5px] border-[var(--foreground)] bg-transparent text-[var(--neutral-text)] hover:border-[var(--primary-bg)] hover:text-[var(--primary-bg)] hover:bg-[var(--neutral-subtle)] active:border-[var(--primary-bg-press)] active:text-[var(--primary-bg-press)] dark:border-white dark:text-white dark:hover:bg-[var(--primary-bg)] dark:hover:border-[var(--primary-bg)] dark:hover:text-white dark:active:bg-[var(--primary-bg-press)] dark:active:border-[var(--primary-bg-press)] data-[size=icon]:hover:shadow-sm data-[size=icon]:hover:scale-105",
        secondary:
          "bg-[var(--neutral-subtle)] text-[var(--neutral-text)] hover:bg-[var(--muted)] hover:opacity-90 active:bg-[var(--border)] data-[size=icon]:hover:shadow-sm data-[size=icon]:hover:scale-105",
        ghost:
          "text-[var(--neutral-text)] hover:bg-[var(--neutral-subtle)] hover:text-[var(--primary-bg)] active:bg-[var(--muted)] data-[size=icon]:hover:bg-[var(--neutral-subtle)] data-[size=icon]:hover:shadow-sm data-[size=icon]:hover:scale-105",
        link: "text-[var(--primary-bg)] underline-offset-4 hover:underline hover:text-[var(--primary-bg-hover)]",
      },
      size: {
        default: "h-9 px-4 py-2 has-[>svg]:px-3",
        sm: "h-8 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5",
        lg: "h-10 rounded-md px-6 has-[>svg]:px-4",
        icon: "size-9 rounded-md",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

const Button = React.forwardRef<
  HTMLButtonElement,
  React.ComponentProps<"button"> &
    VariantProps<typeof buttonVariants> & {
      asChild?: boolean;
    }
>(({ className, variant, size, asChild = false, ...props }, ref) => {
  const Comp = asChild ? Slot : "button";

  return (
    <Comp
      data-slot="button"
      data-size={size}
      className={cn(buttonVariants({ variant, size, className }))}
      ref={ref}
      {...props}
    />
  );
});

Button.displayName = "Button";

export { Button, buttonVariants };
