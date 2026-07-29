import * as React from "react"
import { cn } from "@/lib/utils"

export interface SummaryItem {
  label: React.ReactNode
  value: React.ReactNode
  /** Right-align + tabular-nums for numeric values. Defaults to true. */
  numeric?: boolean
  /** Optional value color token, e.g. "var(--color-deposit)". */
  valueColor?: string
}

export interface SummaryRowProps extends React.HTMLAttributes<HTMLDivElement> {
  items: SummaryItem[]
  /** Label cell width in px. */
  labelWidth?: number
}

/**
 * Aggregate summary strip: repeating [label cell | value cell] pairs laid out
 * as a single bordered table row. Borders collapse via -ml-px overlap.
 */
export function SummaryRow({
  items,
  labelWidth = 120,
  className,
  ...props
}: SummaryRowProps) {
  return (
    <div
      className={cn(
        "flex flex-wrap border-t border-l border-[var(--color-border)]",
        className,
      )}
      {...props}
    >
      {items.map((item, i) => (
        <div key={i} className="flex min-w-0 flex-1">
          <div
            className="flex shrink-0 items-center border-b border-r bg-surface px-3 py-2.5 text-sm font-bold text-ink"
            style={{ width: labelWidth }}
          >
            {item.label}
          </div>
          <div
            className={cn(
              "flex min-w-0 flex-1 items-center border-b border-r bg-white px-3 py-2.5 text-sm text-ink",
              (item.numeric ?? true) && "justify-end tabular-nums font-bold",
            )}
            style={item.valueColor ? { color: item.valueColor } : undefined}
          >
            {item.value}
          </div>
        </div>
      ))}
    </div>
  )
}
