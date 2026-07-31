import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/shared/lib/utils"
import { statusToneClasses } from "@/shared/ui/status-tone"

const badgeVariants = cva(
  "inline-flex items-center rounded-sm border px-1.5 py-0.5 text-xs leading-none font-bold whitespace-nowrap",
  {
    variants: {
      variant: {
        primary: statusToneClasses("primary"),
        neutral: "border-border bg-surface text-ink-muted",
        success: statusToneClasses("success"),
        danger: statusToneClasses("danger"),
        warning: statusToneClasses("warning"),
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
