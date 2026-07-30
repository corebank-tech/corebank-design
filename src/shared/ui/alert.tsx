import * as React from "react"
import { Info, CheckCircle2, AlertTriangle, XCircle } from "lucide-react"
import { cn } from "@/shared/lib/utils"

type AlertVariant = "info" | "success" | "warning" | "danger"

const config: Record<
  AlertVariant,
  { wrap: string; icon: React.ComponentType<{ className?: string }> }
> = {
  info: {
    wrap: "bg-primary-tint border-primary-border-soft text-ink",
    icon: Info,
  },
  success: {
    wrap: "bg-success-tint border-success-border-soft text-ink",
    icon: CheckCircle2,
  },
  warning: {
    wrap: "bg-warning-tint border-warning-border-soft text-ink",
    icon: AlertTriangle,
  },
  danger: {
    wrap: "bg-[var(--color-danger-tint)] border-danger-border-soft text-ink",
    icon: XCircle,
  },
}

const iconColor: Record<AlertVariant, string> = {
  info: "text-primary",
  success: "text-[var(--color-success)]",
  warning: "text-[var(--color-warning)]",
  danger: "text-[var(--color-danger)]",
}

export interface AlertProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "title"> {
  variant?: AlertVariant
  title?: React.ReactNode
}

export function Alert({
  className,
  variant = "info",
  title,
  children,
  ...props
}: AlertProps) {
  const { wrap, icon: Icon } = config[variant]
  return (
    <div
      role="alert"
      className={cn(
        "flex gap-2 rounded-[var(--radius)] border p-3 text-sm",
        wrap,
        className,
      )}
      {...props}
    >
      <Icon className={cn("mt-0.5 h-4 w-4 shrink-0", iconColor[variant])} aria-hidden="true" />
      <div className="min-w-0">
        {title != null && <p className="mb-0.5 font-bold">{title}</p>}
        {children != null && <div className="text-ink">{children}</div>}
      </div>
    </div>
  )
}
