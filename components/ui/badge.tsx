import * as React from "react"
import { cn } from "@/lib/utils"

type BadgeVariant = "primary" | "neutral" | "success" | "danger" | "warning"

const variants: Record<BadgeVariant, string> = {
  primary: "bg-primary-tint text-primary border-primary/20",
  neutral: "bg-surface text-ink-muted border-[var(--color-border)]",
  success: "bg-[#e7f4ee] text-[var(--color-success)] border-[var(--color-success)]/20",
  danger: "bg-[var(--color-danger-tint)] text-[var(--color-danger)] border-[var(--color-danger)]/20",
  warning: "bg-[#fbf3e2] text-[var(--color-warning)] border-[var(--color-warning)]/20",
}

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant
}

export function Badge({ className, variant = "primary", ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-[2px] border px-1.5 py-0.5 text-xs-t font-bold leading-none",
        variants[variant],
        className,
      )}
      {...props}
    />
  )
}
