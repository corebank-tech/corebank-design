import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/shared/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-sm border px-1.5 py-0.5 text-xs leading-none font-bold whitespace-nowrap",
  {
    variants: {
      variant: {
        primary: "border-primary-border-soft bg-primary-tint text-primary",
        neutral: "border-border bg-surface text-ink-muted",
        success: "border-success-border-soft bg-success-tint text-success",
        danger: "border-danger-border-soft bg-danger-tint text-danger",
        warning: "border-warning-border-soft bg-warning-tint text-warning",
      },
    },
    defaultVariants: {
      variant: "primary",
    },
  },
)

export type BadgeVariant = NonNullable<
  VariantProps<typeof badgeVariants>["variant"]
>

type BadgeProps = React.HTMLAttributes<HTMLSpanElement> &
  VariantProps<typeof badgeVariants>

export function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <span className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}
