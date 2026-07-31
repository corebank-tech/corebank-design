import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/shared/lib/utils"

/* disabled 상태는 opacity로 흐리기보다 무채색(surface + border + ink-faint)으로
   전환한다 — 흐린 primary blue는 여전히 눌러도 될 것처럼 보이는 문제가 있었다. */
const buttonVariants = cva(
  "inline-flex shrink-0 items-center justify-center rounded-md font-bold whitespace-nowrap transition-colors focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 focus-visible:outline-none disabled:cursor-not-allowed",
  {
    variants: {
      variant: {
        primary:
          "border border-primary bg-primary text-primary-foreground hover:bg-primary-hover disabled:border-border disabled:bg-surface disabled:text-ink-faint",
        secondary:
          "border border-border-strong bg-surface text-ink hover:bg-border disabled:text-ink-faint",
        outline:
          "border border-primary bg-surface-elevated text-primary hover:bg-primary-tint disabled:border-border disabled:text-ink-faint",
        ghost:
          "border border-transparent bg-transparent text-ink hover:bg-surface disabled:text-ink-faint",
        danger:
          "border border-danger bg-danger text-white hover:opacity-90 disabled:border-border disabled:bg-surface disabled:text-ink-faint",
      },
      size: {
        sm: "h-8 gap-1 px-3 text-xs",
        md: "h-10 gap-1.5 px-4 text-sm",
        lg: "h-12 gap-2 px-6 text-lg",
      },
      fullWidth: {
        true: "w-full",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  },
)

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof buttonVariants>

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, fullWidth, type, ...props }, ref) => {
    return (
      <button
        ref={ref}
        type={type ?? "button"}
        className={cn(buttonVariants({ variant, size, fullWidth }), className)}
        {...props}
      />
    )
  },
)
Button.displayName = "Button"
