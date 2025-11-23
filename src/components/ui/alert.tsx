import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority@0.7.1";

import { cn } from "./utils";

const alertVariants = cva(
  "relative w-full rounded-lg border px-4 py-3 text-sm grid has-[>svg]:grid-cols-[calc(var(--spacing)*4)_1fr] grid-cols-[0_1fr] has-[>svg]:gap-x-3 gap-y-0.5 items-start [&>svg]:size-4 [&>svg]:translate-y-0.5 [&>svg]:text-current",
  {
    variants: {
      variant: {
        default: "bg-card text-card-foreground",
        destructive:
          "text-destructive bg-card [&>svg]:text-current *:data-[slot=alert-description]:text-destructive/90",
        caution:
          "bg-[var(--yellow-alert-50)] border-[var(--yellow-alert-200)] text-[var(--neutral-text)] [&>svg]:text-[var(--yellow-alert-400)]",
        warning:
          "bg-[var(--orange-alert-50)] border-[var(--orange-alert-200)] text-[var(--neutral-text)] [&>svg]:text-[var(--orange-alert-400)]",
        danger:
          "bg-[var(--red-alert-50)] border-[var(--red-alert-200)] text-[var(--neutral-text)] [&>svg]:text-[var(--red-alert-400)]",
        success:
          "bg-[var(--green-alert-50)] border-[var(--green-alert-200)] text-[var(--neutral-text)] [&>svg]:text-[var(--green-alert-300)]",
        info:
          "bg-[var(--turquoise-alert-50)] border-[var(--turquoise-alert-200)] text-[var(--neutral-text)] [&>svg]:text-[var(--turquoise-alert-300)]",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

function Alert({
  className,
  variant,
  ...props
}: React.ComponentProps<"div"> & VariantProps<typeof alertVariants>) {
  return (
    <div
      data-slot="alert"
      role="alert"
      className={cn(alertVariants({ variant }), className)}
      {...props}
    />
  );
}

function AlertTitle({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="alert-title"
      className={cn(
        "col-start-2 line-clamp-1 min-h-4 font-medium tracking-tight",
        className,
      )}
      {...props}
    />
  );
}

function AlertDescription({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="alert-description"
      className={cn(
        "text-muted-foreground col-start-2 grid justify-items-start gap-1 text-sm [&_p]:leading-relaxed",
        className,
      )}
      {...props}
    />
  );
}

export { Alert, AlertTitle, AlertDescription };
