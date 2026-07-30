import * as React from "react"
import { cn } from "@/shared/lib/utils"

type BadgeVariant = "primary" | "neutral" | "success" | "danger" | "warning"

const variants: Record<BadgeVariant, string> = {
  primary: "bg-primary-tint text-primary border-[var(--color-primary-border)]",
  neutral: "bg-surface text-ink-muted border-[var(--color-border)]",
  success: "bg-[var(--color-success-tint)] text-[var(--color-success)] border-[var(--color-success-border)]",
  danger: "bg-[var(--color-danger-tint)] text-[var(--color-danger)] border-[var(--color-danger-border)]",
  warning: "bg-[var(--color-warning-tint)] text-[var(--color-warning)] border-[var(--color-warning-border)]",
}

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant
}

export function Badge({ className, variant = "primary", ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-[var(--radius-sm)] border px-1.5 py-0.5 text-xs font-bold leading-none",
        variants[variant],
        className,
      )}
      {...props}
    />
  )
}
