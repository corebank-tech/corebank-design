import * as React from "react"
import { Info, CheckCircle2, AlertTriangle, XCircle } from "lucide-react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/shared/lib/utils"

const alertVariants = cva("flex gap-2 rounded-md border p-3 text-sm", {
  variants: {
    variant: {
      info: "border-primary-border-soft bg-primary-tint text-ink",
      success: "border-success-border-soft bg-success-tint text-ink",
      warning: "border-warning-border-soft bg-warning-tint text-ink",
      danger: "border-danger-border-soft bg-danger-tint text-ink",
    },
  },
  defaultVariants: { variant: "info" },
})

const alertIconVariants = cva("mt-0.5 h-4 w-4 shrink-0", {
  variants: {
    variant: {
      info: "text-primary",
      success: "text-success",
      warning: "text-warning",
      danger: "text-danger",
    },
  },
  defaultVariants: { variant: "info" },
})

type AlertVariant = NonNullable<VariantProps<typeof alertVariants>["variant"]>

const ICONS: Record<
  AlertVariant,
  React.ComponentType<{ className?: string }>
> = {
  info: Info,
  success: CheckCircle2,
  warning: AlertTriangle,
  danger: XCircle,
}

type AlertProps = Omit<React.HTMLAttributes<HTMLDivElement>, "title"> & {
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
  const Icon = ICONS[variant]
  return (
    <div
      role="alert"
      className={cn(alertVariants({ variant }), className)}
      {...props}
    >
      <Icon className={alertIconVariants({ variant })} aria-hidden="true" />
      <div className="min-w-0">
        {title != null && <p className="mb-0.5 font-bold">{title}</p>}
        {children != null && <div className="text-ink">{children}</div>}
      </div>
    </div>
  )
}
