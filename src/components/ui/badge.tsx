import * as React from "react";
import { Slot } from "@radix-ui/react-slot@1.1.2";
import { cva, type VariantProps } from "class-variance-authority@0.7.1";

import { cn } from "./utils";

const badgeVariants = cva(
  "inline-flex items-center justify-center w-fit whitespace-nowrap shrink-0 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--blue-primary-100)] focus-visible:ring-offset-2 overflow-hidden disabled:bg-[var(--gray-50)] disabled:border-[var(--gray-100)] disabled:text-[var(--gray-300)]",
  {
    variants: {
      variant: {
        light: "",
        medium: "",
        heavy: "",
      },
      tone: {
        // Core tones
        primary: "",
        success: "",
        caution: "",   // → yellow
        warning: "",   // → orange
        danger: "",
        info: "",
        neutral: "",
        yellow: "",    // alias para caution
        
        // Semantic mappings
        paid: "",      // → success
        pending: "",   // → caution (yellow, não orange!)
        overdue: "",   // → danger
        active: "",    // → success
        suspended: "", // → neutral
        canceled: "",  // → danger
        processing: "", // → info
        new: "",       // → danger (alertas novos são críticos)
        open: "",      // → danger
        in_review: "", // → info
        resolved: "",  // → success
        connected: "", // → success
        disconnected: "", // → neutral
        failure: "",   // → danger
        testing: "",   // → info
        attention: "", // → caution/yellow
        observation: "", // → caution/yellow
        maintenance: "", // → caution/yellow
        latency: "",   // → caution/yellow
      },
      size: {
        s: "h-[18px] rounded-[9px] px-3 text-[11px] leading-[16px]",
        m: "h-[22px] rounded-[11px] px-3 text-[12px] leading-[16px]",
        l: "h-[26px] rounded-[13px] px-3 text-[13px] leading-[16px]",
      },
    },
    compoundVariants: [
      // ============================================
      // LIGHT VARIANT (fundo claro + borda + texto no tom)
      // Uso: Categorização, tags, metadados
      // ============================================
      {
        variant: "light",
        tone: "danger",
        className: "bg-[var(--red-alert-50)] border border-[var(--red-alert-300)] text-[var(--red-alert-300)] [&>svg]:text-[var(--red-alert-300)]",
      },
      {
        variant: "light",
        tone: "success",
        className: "bg-[var(--green-alert-50)] border border-[var(--green-alert-400)] text-[var(--green-alert-400)] [&>svg]:text-[var(--green-alert-400)]",
      },
      {
        variant: "light",
        tone: "info",
        className: "bg-[var(--turquoise-alert-50)] border border-[var(--turquoise-alert-400)] text-[var(--turquoise-alert-400)] [&>svg]:text-[var(--turquoise-alert-400)]",
      },
      {
        variant: "light",
        tone: "caution",
        className: "bg-[var(--yellow-alert-50)] border border-[var(--yellow-alert-400)] text-[var(--yellow-alert-500)] [&>svg]:text-[var(--yellow-alert-500)] dark:bg-[var(--yellow-alert-400)] dark:bg-opacity-20 dark:border-[var(--yellow-alert-400)] dark:text-[var(--yellow-alert-400)] [&>svg]:dark:text-[var(--yellow-alert-400)]",
      },
      {
        variant: "light",
        tone: "yellow",
        className: "bg-[var(--yellow-alert-50)] border border-[var(--yellow-alert-400)] text-[var(--yellow-alert-500)] [&>svg]:text-[var(--yellow-alert-500)] dark:bg-[var(--yellow-alert-400)] dark:bg-opacity-20 dark:border-[var(--yellow-alert-400)] dark:text-[var(--yellow-alert-400)] [&>svg]:dark:text-[var(--yellow-alert-400)]",
      },
      {
        variant: "light",
        tone: "warning",
        className: "bg-[var(--orange-alert-50)] border border-[var(--orange-alert-400)] text-[var(--orange-alert-400)] [&>svg]:text-[var(--orange-alert-400)]",
      },
      {
        variant: "light",
        tone: "neutral",
        className: "bg-[var(--gray-50)] border border-[var(--gray-300)] text-[var(--gray-300)] [&>svg]:text-[var(--gray-300)]",
      },
      {
        variant: "light",
        tone: "primary",
        className: "bg-[var(--turquoise-alert-50)] border border-[var(--turquoise-alert-400)] text-[var(--turquoise-alert-400)] [&>svg]:text-[var(--turquoise-alert-400)] dark:bg-[var(--turquoise-alert-400)] dark:bg-opacity-20 dark:border-[var(--turquoise-alert-400)] dark:text-[var(--turquoise-alert-200)] [&>svg]:dark:text-[var(--turquoise-alert-200)]",
      },
      // Light semantic mappings
      {
        variant: "light",
        tone: "paid",
        className: "bg-[var(--green-alert-50)] border border-[var(--green-alert-400)] text-[var(--green-alert-400)] [&>svg]:text-[var(--green-alert-400)]",
      },
      {
        variant: "light",
        tone: "pending",
        className: "bg-[var(--yellow-alert-50)] border border-[var(--yellow-alert-400)] text-[var(--yellow-alert-400)] [&>svg]:text-[var(--yellow-alert-400)]",
      },
      {
        variant: "light",
        tone: "overdue",
        className: "bg-[var(--red-alert-50)] border border-[var(--red-alert-300)] text-[var(--red-alert-300)] [&>svg]:text-[var(--red-alert-300)]",
      },
      {
        variant: "light",
        tone: "active",
        className: "bg-[var(--green-alert-50)] border border-[var(--green-alert-400)] text-[var(--green-alert-400)] [&>svg]:text-[var(--green-alert-400)]",
      },
      {
        variant: "light",
        tone: "new",
        className: "bg-[var(--red-alert-50)] border border-[var(--red-alert-300)] text-[var(--red-alert-300)] [&>svg]:text-[var(--red-alert-300)]",
      },
      {
        variant: "light",
        tone: "suspended",
        className: "bg-[var(--gray-50)] border border-[var(--gray-300)] text-[var(--gray-300)] [&>svg]:text-[var(--gray-300)]",
      },
      {
        variant: "light",
        tone: "canceled",
        className: "bg-[var(--red-alert-50)] border border-[var(--red-alert-300)] text-[var(--red-alert-300)] [&>svg]:text-[var(--red-alert-300)]",
      },
      {
        variant: "light",
        tone: "processing",
        className: "bg-[var(--turquoise-alert-50)] border border-[var(--turquoise-alert-400)] text-[var(--turquoise-alert-400)] [&>svg]:text-[var(--turquoise-alert-400)]",
      },
      {
        variant: "light",
        tone: "open",
        className: "bg-[var(--red-alert-50)] border border-[var(--red-alert-300)] text-[var(--red-alert-300)] [&>svg]:text-[var(--red-alert-300)]",
      },
      {
        variant: "light",
        tone: "in_review",
        className: "bg-[var(--turquoise-alert-50)] border border-[var(--turquoise-alert-400)] text-[var(--turquoise-alert-400)] [&>svg]:text-[var(--turquoise-alert-400)]",
      },
      {
        variant: "light",
        tone: "resolved",
        className: "bg-[var(--green-alert-50)] border border-[var(--green-alert-400)] text-[var(--green-alert-400)] [&>svg]:text-[var(--green-alert-400)]",
      },
      {
        variant: "light",
        tone: "connected",
        className: "bg-[var(--green-alert-50)] border border-[var(--green-alert-400)] text-[var(--green-alert-400)] [&>svg]:text-[var(--green-alert-400)]",
      },
      {
        variant: "light",
        tone: "disconnected",
        className: "bg-[var(--gray-50)] border border-[var(--gray-300)] text-[var(--gray-300)] [&>svg]:text-[var(--gray-300)]",
      },
      {
        variant: "light",
        tone: "failure",
        className: "bg-[var(--red-alert-50)] border border-[var(--red-alert-300)] text-[var(--red-alert-300)] [&>svg]:text-[var(--red-alert-300)]",
      },
      {
        variant: "light",
        tone: "testing",
        className: "bg-[var(--turquoise-alert-50)] border border-[var(--turquoise-alert-400)] text-[var(--turquoise-alert-400)] [&>svg]:text-[var(--turquoise-alert-400)]",
      },
      {
        variant: "light",
        tone: "attention",
        className: "bg-[var(--yellow-alert-50)] border border-[var(--yellow-alert-400)] text-[var(--yellow-alert-400)] [&>svg]:text-[var(--yellow-alert-400)]",
      },
      {
        variant: "light",
        tone: "observation",
        className: "bg-[var(--yellow-alert-50)] border border-[var(--yellow-alert-400)] text-[var(--yellow-alert-400)] [&>svg]:text-[var(--yellow-alert-400)]",
      },
      {
        variant: "light",
        tone: "maintenance",
        className: "bg-[var(--yellow-alert-50)] border border-[var(--yellow-alert-400)] text-[var(--yellow-alert-400)] [&>svg]:text-[var(--yellow-alert-400)]",
      },
      {
        variant: "light",
        tone: "latency",
        className: "bg-[var(--yellow-alert-50)] border border-[var(--yellow-alert-400)] text-[var(--yellow-alert-400)] [&>svg]:text-[var(--yellow-alert-400)]",
      },

      // ============================================
      // MEDIUM VARIANT (fundo médio + texto escuro no tom)
      // Uso: Status intermediários, não urgentes
      // ============================================
      {
        variant: "medium",
        tone: "danger",
        className: "bg-[var(--red-alert-100)] border-0 text-[var(--red-alert-400)] [&>svg]:text-[var(--red-alert-400)] dark:bg-[var(--red-alert-300)] dark:text-white [&>svg]:dark:text-white",
      },
      {
        variant: "medium",
        tone: "success",
        className: "bg-[var(--green-alert-200)] border-0 text-[var(--green-alert-500)] [&>svg]:text-[var(--green-alert-500)] dark:bg-[var(--green-alert-400)] dark:text-white [&>svg]:dark:text-white",
      },
      {
        variant: "medium",
        tone: "info",
        className: "bg-[var(--turquoise-alert-200)] border-0 text-[var(--turquoise-alert-400)] [&>svg]:text-[var(--turquoise-alert-400)] dark:bg-[var(--turquoise-alert-400)] dark:text-white [&>svg]:dark:text-white",
      },
      {
        variant: "medium",
        tone: "caution",
        className: "bg-[var(--yellow-alert-200)] border-0 text-[var(--yellow-alert-500)] [&>svg]:text-[var(--yellow-alert-500)] dark:bg-[var(--yellow-alert-400)] dark:text-[var(--gray-400)] [&>svg]:dark:text-[var(--gray-400)]",
      },
      {
        variant: "medium",
        tone: "yellow",
        className: "bg-[var(--yellow-alert-200)] border-0 text-[var(--yellow-alert-500)] [&>svg]:text-[var(--yellow-alert-500)] dark:bg-[var(--yellow-alert-400)] dark:text-[var(--gray-400)] [&>svg]:dark:text-[var(--gray-400)]",
      },
      {
        variant: "medium",
        tone: "warning",
        className: "bg-[var(--orange-alert-200)] border-0 text-[var(--orange-alert-400)] [&>svg]:text-[var(--orange-alert-400)] dark:bg-[var(--orange-alert-400)] dark:text-white [&>svg]:dark:text-white",
      },
      {
        variant: "medium",
        tone: "neutral",
        className: "bg-[var(--gray-200)] border-0 text-[var(--gray-400)] [&>svg]:text-[var(--gray-400)] dark:bg-[var(--gray-300)] dark:text-white [&>svg]:dark:text-white",
      },
      {
        variant: "medium",
        tone: "primary",
        className: "bg-[var(--blue-primary-100)] border-0 text-[var(--blue-primary-300)] [&>svg]:text-[var(--blue-primary-300)] dark:bg-[var(--blue-primary-200)] dark:text-white [&>svg]:dark:text-white",
      },
      // Medium semantic mappings
      {
        variant: "medium",
        tone: "paid",
        className: "bg-[var(--green-alert-200)] border-0 text-[var(--green-alert-500)] [&>svg]:text-[var(--green-alert-500)] dark:bg-[var(--green-alert-400)] dark:text-white [&>svg]:dark:text-white",
      },
      {
        variant: "medium",
        tone: "pending",
        className: "bg-[var(--yellow-alert-200)] border-0 text-[var(--yellow-alert-500)] [&>svg]:text-[var(--yellow-alert-500)] dark:bg-[var(--yellow-alert-400)] dark:text-[var(--gray-400)] [&>svg]:dark:text-[var(--gray-400)]",
      },
      {
        variant: "medium",
        tone: "overdue",
        className: "bg-[var(--red-alert-100)] border-0 text-[var(--red-alert-400)] [&>svg]:text-[var(--red-alert-400)] dark:bg-[var(--red-alert-300)] dark:text-white [&>svg]:dark:text-white",
      },
      {
        variant: "medium",
        tone: "active",
        className: "bg-[var(--green-alert-200)] border-0 text-[var(--green-alert-500)] [&>svg]:text-[var(--green-alert-500)] dark:bg-[var(--green-alert-400)] dark:text-white [&>svg]:dark:text-white",
      },
      {
        variant: "medium",
        tone: "new",
        className: "bg-[var(--red-alert-100)] border-0 text-[var(--red-alert-400)] [&>svg]:text-[var(--red-alert-400)] dark:bg-[var(--red-alert-300)] dark:text-white [&>svg]:dark:text-white",
      },
      {
        variant: "medium",
        tone: "suspended",
        className: "bg-[var(--gray-200)] border-0 text-[var(--gray-400)] [&>svg]:text-[var(--gray-400)] dark:bg-[var(--gray-300)] dark:text-white [&>svg]:dark:text-white",
      },
      {
        variant: "medium",
        tone: "canceled",
        className: "bg-[var(--red-alert-100)] border-0 text-[var(--red-alert-400)] [&>svg]:text-[var(--red-alert-400)] dark:bg-[var(--red-alert-300)] dark:text-white [&>svg]:dark:text-white",
      },
      {
        variant: "medium",
        tone: "processing",
        className: "bg-[var(--turquoise-alert-200)] border-0 text-[var(--turquoise-alert-400)] [&>svg]:text-[var(--turquoise-alert-400)] dark:bg-[var(--turquoise-alert-400)] dark:text-white [&>svg]:dark:text-white",
      },
      {
        variant: "medium",
        tone: "open",
        className: "bg-[var(--red-alert-100)] border-0 text-[var(--red-alert-400)] [&>svg]:text-[var(--red-alert-400)] dark:bg-[var(--red-alert-300)] dark:text-white [&>svg]:dark:text-white",
      },
      {
        variant: "medium",
        tone: "in_review",
        className: "bg-[var(--turquoise-alert-200)] border-0 text-[var(--turquoise-alert-400)] [&>svg]:text-[var(--turquoise-alert-400)] dark:bg-[var(--turquoise-alert-400)] dark:text-white [&>svg]:dark:text-white",
      },
      {
        variant: "medium",
        tone: "resolved",
        className: "bg-[var(--green-alert-200)] border-0 text-[var(--green-alert-500)] [&>svg]:text-[var(--green-alert-500)] dark:bg-[var(--green-alert-400)] dark:text-white [&>svg]:dark:text-white",
      },
      {
        variant: "medium",
        tone: "connected",
        className: "bg-[var(--green-alert-200)] border-0 text-[var(--green-alert-500)] [&>svg]:text-[var(--green-alert-500)] dark:bg-[var(--green-alert-400)] dark:text-white [&>svg]:dark:text-white",
      },
      {
        variant: "medium",
        tone: "disconnected",
        className: "bg-[var(--gray-200)] border-0 text-[var(--gray-400)] [&>svg]:text-[var(--gray-400)] dark:bg-[var(--gray-300)] dark:text-white [&>svg]:dark:text-white",
      },
      {
        variant: "medium",
        tone: "failure",
        className: "bg-[var(--red-alert-100)] border-0 text-[var(--red-alert-400)] [&>svg]:text-[var(--red-alert-400)] dark:bg-[var(--red-alert-300)] dark:text-white [&>svg]:dark:text-white",
      },
      {
        variant: "medium",
        tone: "testing",
        className: "bg-[var(--turquoise-alert-200)] border-0 text-[var(--turquoise-alert-400)] [&>svg]:text-[var(--turquoise-alert-400)] dark:bg-[var(--turquoise-alert-400)] dark:text-white [&>svg]:dark:text-white",
      },
      {
        variant: "medium",
        tone: "attention",
        className: "bg-[var(--yellow-alert-200)] border-0 text-[var(--yellow-alert-500)] [&>svg]:text-[var(--yellow-alert-500)] dark:bg-[var(--yellow-alert-400)] dark:text-[var(--gray-400)] [&>svg]:dark:text-[var(--gray-400)]",
      },
      {
        variant: "medium",
        tone: "observation",
        className: "bg-[var(--yellow-alert-200)] border-0 text-[var(--yellow-alert-500)] [&>svg]:text-[var(--yellow-alert-500)] dark:bg-[var(--yellow-alert-400)] dark:text-[var(--gray-400)] [&>svg]:dark:text-[var(--gray-400)]",
      },
      {
        variant: "medium",
        tone: "maintenance",
        className: "bg-[var(--yellow-alert-200)] border-0 text-[var(--yellow-alert-500)] [&>svg]:text-[var(--yellow-alert-500)] dark:bg-[var(--yellow-alert-400)] dark:text-[var(--gray-400)] [&>svg]:dark:text-[var(--gray-400)]",
      },
      {
        variant: "medium",
        tone: "latency",
        className: "bg-[var(--yellow-alert-200)] border-0 text-[var(--yellow-alert-500)] [&>svg]:text-[var(--yellow-alert-500)] dark:bg-[var(--yellow-alert-400)] dark:text-[var(--gray-400)] [&>svg]:dark:text-[var(--gray-400)]",
      },

      // ============================================
      // HEAVY VARIANT (fundo escuro + texto branco)
      // Uso: Alertas críticos, status urgentes
      // ============================================
      {
        variant: "heavy",
        tone: "danger",
        className: "bg-[var(--red-alert-300)] border-0 text-[var(--white-100)] [&>svg]:text-[var(--white-100)]",
      },
      {
        variant: "heavy",
        tone: "success",
        className: "bg-[var(--green-alert-400)] border-0 text-[var(--white-100)] [&>svg]:text-[var(--white-100)]",
      },
      {
        variant: "heavy",
        tone: "info",
        className: "bg-[var(--turquoise-alert-400)] border-0 text-[var(--white-100)] [&>svg]:text-[var(--white-100)]",
      },
      {
        variant: "heavy",
        tone: "caution",
        className: "bg-[var(--yellow-alert-400)] border-0 text-[var(--white-100)] [&>svg]:text-[var(--white-100)]",
      },
      {
        variant: "heavy",
        tone: "yellow",
        className: "bg-[var(--yellow-alert-400)] border-0 text-[var(--white-100)] [&>svg]:text-[var(--white-100)]",
      },
      {
        variant: "heavy",
        tone: "warning",
        className: "bg-[var(--orange-alert-400)] border-0 text-[var(--white-100)] [&>svg]:text-[var(--white-100)]",
      },
      {
        variant: "heavy",
        tone: "neutral",
        className: "bg-[var(--gray-300)] border-0 text-[var(--white-100)] [&>svg]:text-[var(--white-100)]",
      },
      {
        variant: "heavy",
        tone: "primary",
        className: "bg-[var(--blue-primary-300)] border-0 text-[var(--white-100)] [&>svg]:text-[var(--white-100)]",
      },
      // Heavy semantic mappings
      {
        variant: "heavy",
        tone: "paid",
        className: "bg-[var(--green-alert-400)] border-0 text-[var(--white-100)] [&>svg]:text-[var(--white-100)]",
      },
      {
        variant: "heavy",
        tone: "pending",
        className: "bg-[var(--yellow-alert-400)] border-0 text-[var(--white-100)] [&>svg]:text-[var(--white-100)]",
      },
      {
        variant: "heavy",
        tone: "overdue",
        className: "bg-[var(--red-alert-300)] border-0 text-[var(--white-100)] [&>svg]:text-[var(--white-100)]",
      },
      {
        variant: "heavy",
        tone: "active",
        className: "bg-[var(--green-alert-400)] border-0 text-[var(--white-100)] [&>svg]:text-[var(--white-100)]",
      },
      {
        variant: "heavy",
        tone: "new",
        className: "bg-[var(--red-alert-300)] border-0 text-[var(--white-100)] [&>svg]:text-[var(--white-100)]",
      },
      {
        variant: "heavy",
        tone: "suspended",
        className: "bg-[var(--gray-300)] border-0 text-[var(--white-100)] [&>svg]:text-[var(--white-100)]",
      },
      {
        variant: "heavy",
        tone: "canceled",
        className: "bg-[var(--red-alert-300)] border-0 text-[var(--white-100)] [&>svg]:text-[var(--white-100)]",
      },
      {
        variant: "heavy",
        tone: "processing",
        className: "bg-[var(--turquoise-alert-400)] border-0 text-[var(--white-100)] [&>svg]:text-[var(--white-100)]",
      },
      {
        variant: "heavy",
        tone: "open",
        className: "bg-[var(--red-alert-300)] border-0 text-[var(--white-100)] [&>svg]:text-[var(--white-100)]",
      },
      {
        variant: "heavy",
        tone: "in_review",
        className: "bg-[var(--turquoise-alert-400)] border-0 text-[var(--white-100)] [&>svg]:text-[var(--white-100)]",
      },
      {
        variant: "heavy",
        tone: "resolved",
        className: "bg-[var(--green-alert-400)] border-0 text-[var(--white-100)] [&>svg]:text-[var(--white-100)]",
      },
      {
        variant: "heavy",
        tone: "connected",
        className: "bg-[var(--green-alert-400)] border-0 text-[var(--white-100)] [&>svg]:text-[var(--white-100)]",
      },
      {
        variant: "heavy",
        tone: "disconnected",
        className: "bg-[var(--gray-300)] border-0 text-[var(--white-100)] [&>svg]:text-[var(--white-100)]",
      },
      {
        variant: "heavy",
        tone: "failure",
        className: "bg-[var(--red-alert-300)] border-0 text-[var(--white-100)] [&>svg]:text-[var(--white-100)]",
      },
      {
        variant: "heavy",
        tone: "testing",
        className: "bg-[var(--turquoise-alert-400)] border-0 text-[var(--white-100)] [&>svg]:text-[var(--white-100)]",
      },
      {
        variant: "heavy",
        tone: "attention",
        className: "bg-[var(--yellow-alert-400)] border-0 text-[var(--white-100)] [&>svg]:text-[var(--white-100)]",
      },
      {
        variant: "heavy",
        tone: "observation",
        className: "bg-[var(--yellow-alert-400)] border-0 text-[var(--white-100)] [&>svg]:text-[var(--white-100)]",
      },
      {
        variant: "heavy",
        tone: "maintenance",
        className: "bg-[var(--yellow-alert-400)] border-0 text-[var(--white-100)] [&>svg]:text-[var(--white-100)]",
      },
      {
        variant: "heavy",
        tone: "latency",
        className: "bg-[var(--yellow-alert-400)] border-0 text-[var(--white-100)] [&>svg]:text-[var(--white-100)]",
      },
      
      // Size-specific gap adjustments
      {
        size: "s",
        className: "gap-1.5",
      },
      {
        size: "m",
        className: "gap-1.5",
      },
      {
        size: "l",
        className: "gap-2",
      },
    ],
    defaultVariants: {
      variant: "medium",
      tone: "neutral",
      size: "m",
    },
  },
);

const iconSizeClasses = {
  s: "size-3",
  m: "size-3.5",
  l: "size-4",
};

export interface BadgeProps
  extends React.ComponentProps<"span">,
    VariantProps<typeof badgeVariants> {
  asChild?: boolean;
  withIcon?: boolean;
  icon?: React.ReactNode;
}

function Badge({
  className,
  variant,
  tone,
  size = "m",
  asChild = false,
  withIcon = false,
  icon,
  children,
  ...props
}: BadgeProps) {
  const Comp = asChild ? Slot : "span";

  return (
    <Comp
      data-slot="badge"
      className={cn(badgeVariants({ variant, tone, size }), "font-medium", className)}
      {...props}
    >
      {(withIcon || icon) && icon && (
        <span className={cn("shrink-0", iconSizeClasses[size || "m"])}>
          {icon}
        </span>
      )}
      <span className="truncate">{children}</span>
    </Comp>
  );
}

export { Badge, badgeVariants };