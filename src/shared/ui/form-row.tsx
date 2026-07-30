import * as React from "react"
import { cn } from "@/shared/lib/utils"

export interface FormRowProps extends React.HTMLAttributes<HTMLDivElement> {
  label: React.ReactNode
  required?: boolean
  htmlFor?: string
  labelWidth?: number
}

/**
 * A single label/field row. Stack multiple FormRow siblings to form a table;
 * borders collapse via first:border-t so the group reads as one bordered block.
 */
export function FormRow({
  label,
  required,
  htmlFor,
  labelWidth = 160,
  className,
  children,
  ...props
}: FormRowProps) {
  return (
    <div
      className={cn(
        "flex border-b border-l border-r first:border-t",
        className,
      )}
      {...props}
    >
      <div
        className="flex shrink-0 items-center border-r bg-surface px-4 py-3"
        style={{ width: labelWidth }}
      >
        <label
          htmlFor={htmlFor}
          className="flex items-center gap-1 text-[14px] font-bold text-ink"
        >
          {required && (
            <span className="whitespace-nowrap text-[13px] font-bold text-[var(--color-danger)]">
              [필수]
            </span>
          )}
          {label}
        </label>
      </div>
      <div className="flex min-w-0 flex-1 flex-wrap items-center gap-2 bg-surface-elevated px-4 py-3">
        {children}
      </div>
    </div>
  )
}
