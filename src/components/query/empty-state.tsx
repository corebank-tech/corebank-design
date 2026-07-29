import * as React from "react"
import { cn } from "@/lib/utils"

export interface EmptyStateProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Primary guidance line. Vary per situation. */
  message: React.ReactNode
  /** Optional secondary detail line. */
  description?: React.ReactNode
  /** Optional next-action button, e.g. a <Button>. */
  action?: React.ReactNode
}

export function EmptyState({
  message,
  description,
  action,
  className,
  ...props
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-3 px-4 py-14 text-center",
        className,
      )}
      {...props}
    >
      <span
        className="flex h-11 w-11 items-center justify-center rounded-full border-2 border-[var(--color-border-strong)] text-xl font-bold text-ink-muted"
        aria-hidden="true"
      >
        !
      </span>
      <p className="text-sm font-bold text-ink">{message}</p>
      {description != null && (
        <p className="text-sm text-ink-muted">{description}</p>
      )}
      {action != null && <div className="mt-1">{action}</div>}
    </div>
  )
}
