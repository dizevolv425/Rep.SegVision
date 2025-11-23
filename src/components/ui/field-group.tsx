import * as React from "react";
import { cn } from "./utils";

export interface FieldGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  label?: string;
  required?: boolean;
  error?: string;
  help?: string;
  success?: string;
  density?: "default" | "dense";
  children: React.ReactNode;
}

/**
 * FieldGroup - Component wrapper para campos de formulário
 * 
 * Espaçamentos:
 * - Label → Control: 4px
 * - Control → Assist: 6px (space/075)
 * - Entre FieldGroups: 12px (space/150)
 */
function FieldGroup({
  label,
  required = false,
  error,
  help,
  success,
  density = "default",
  className,
  children,
  ...props
}: FieldGroupProps) {
  const assistText = error || success || help;
  const assistColor = error 
    ? "text-[var(--red-alert-400)]"
    : success
    ? "text-[var(--green-alert-300)]"
    : "text-[var(--gray-300)]";

  return (
    <div
      className={cn(
        "flex flex-col w-full",
        density === "default" ? "gap-1" : "gap-1",
        className
      )}
      {...props}
    >
      {/* Label */}
      {label && (
        <label className="flex items-center gap-1 text-sm text-[var(--neutral-text)]">
          {label}
          {required && (
            <span className="text-[var(--red-alert-300)]" aria-label="required">
              *
            </span>
          )}
        </label>
      )}

      {/* Control (Input/Select/Textarea/etc.) */}
      <div className="w-full">
        {React.cloneElement(children as React.ReactElement, {
          error: !!error,
          success: !!success && !error,
        })}
      </div>

      {/* Assist (Help/Error/Success) */}
      {assistText && (
        <div className={cn("min-h-[16px] text-xs", assistColor)}>
          {assistText}
        </div>
      )}
    </div>
  );
}

export { FieldGroup };
