import * as React from "react"
import { cn } from "@/lib/utils"

export interface ConfirmSummaryColumn {
  /** Header cell label, e.g. "이체금액(원)". */
  label: React.ReactNode
  /** Value cell content. */
  value: React.ReactNode
  /** Render the value bold and larger (use for the amount column). */
  emphasis?: boolean
}

export interface ConfirmSummaryProps
  extends React.HTMLAttributes<HTMLDivElement> {
  columns: ConfirmSummaryColumn[]
}

/**
 * Horizontal review table for confirmation steps: one header row over one value
 * row, framed with a danger-colored 1px border to flag "review before submit".
 * The emphasized column renders its value bold and larger.
 */
export function ConfirmSummary({
  columns,
  className,
  ...props
}: ConfirmSummaryProps) {
  return (
    <div
      className={cn("border border-[var(--color-danger)]", className)}
      {...props}
    >
      <table className="w-full border-collapse text-sm">
        <thead>
          <tr>
            {columns.map((col, i) => (
              <th
                key={i}
                scope="col"
                className="border-b border-[var(--color-danger)]/40 bg-[var(--color-danger-tint)] px-3 py-2.5 text-center text-xs font-bold text-ink whitespace-nowrap [&:not(:first-child)]:border-l [&:not(:first-child)]:border-[var(--color-border)]"
              >
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          <tr>
            {columns.map((col, i) => (
              <td
                key={i}
                className={cn(
                  "bg-white px-3 py-3 text-center align-middle text-ink whitespace-nowrap [&:not(:first-child)]:border-l [&:not(:first-child)]:border-[var(--color-border)]",
                  col.emphasis
                    ? "text-lg font-bold tabular-nums text-ink"
                    : "text-sm",
                )}
              >
                {col.value}
              </td>
            ))}
          </tr>
        </tbody>
      </table>
    </div>
  )
}
