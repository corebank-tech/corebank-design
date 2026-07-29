import * as React from "react"
import { Check, X, Loader2 } from "lucide-react"
import { DataGrid, type DataGridColumn } from "@/components/query/data-grid"
import { cn } from "@/lib/utils"

export type ResultVariant = "success" | "fail" | "pending"

const variantIcon: Record<
  ResultVariant,
  { icon: React.ComponentType<{ className?: string; strokeWidth?: number }>; ring: string; spin?: boolean }
> = {
  success: { icon: Check, ring: "bg-primary-tint text-primary" },
  fail: { icon: X, ring: "bg-[var(--color-danger-tint)] text-[var(--color-danger)]" },
  pending: { icon: Loader2, ring: "bg-surface text-ink-muted", spin: true },
}

export interface ResultPanelProps<Row> {
  variant: ResultVariant
  /** Bold headline, e.g. "이체가 완료되었습니다." */
  message: React.ReactNode
  /** One-line secondary guidance under the headline. */
  description?: React.ReactNode
  /** Column definitions for the single-row summary grid. */
  columns: DataGridColumn<Row>[]
  /** The single summary row rendered in the grid. */
  row: Row
  /** Bottom action button slot, e.g. [이체결과조회] [추가이체]. */
  actions?: React.ReactNode
}

/**
 * D-03 결과 패널. Slots into StepLayout via the step-3 resultSlot: a 72px
 * status icon, a bold result message, one guidance line, a one-row summary
 * grid (reusing DataGrid), and a bottom action slot. This renders the step
 * body only — it never re-creates StepLayout.
 */
export function ResultPanel<Row>({
  variant,
  message,
  description,
  columns,
  row,
  actions,
}: ResultPanelProps<Row>) {
  const { icon: Icon, ring, spin } = variantIcon[variant]

  return (
    <div>
      <div className="flex flex-col items-center py-4 text-center">
        <span
          className={cn(
            "inline-flex h-[72px] w-[72px] items-center justify-center rounded-full",
            ring,
          )}
          aria-hidden="true"
        >
          <Icon
            className={cn("h-9 w-9", spin && "animate-spin")}
            strokeWidth={2.5}
          />
        </span>
        <p className="mt-4 text-xl font-bold text-ink text-balance">{message}</p>
        {description && (
          <p className="mt-2 text-sm leading-relaxed text-ink-muted">
            {description}
          </p>
        )}
      </div>

      <div className="mt-4">
        <DataGrid columns={columns} rows={[row]} />
      </div>

      {actions != null && (
        <div className="mt-6 flex items-center justify-center gap-2">
          {actions}
        </div>
      )}
    </div>
  )
}
