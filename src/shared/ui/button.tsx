import * as React from "react"
import { cn } from "@/shared/lib/utils"

type Variant = "primary" | "secondary" | "outline" | "ghost" | "danger"
type Size = "sm" | "md" | "lg"

/* disabled 상태는 opacity로 흐리기보다 무채색(surface + border + ink-faint)으로
   전환한다 — 흐린 primary blue는 여전히 눌러도 될 것처럼 보이는 문제가 있었다. */
const variantStyles: Record<Variant, string> = {
  primary:
    "bg-primary text-primary-foreground hover:bg-[var(--color-primary-hover)] border border-primary disabled:border-[var(--color-border)] disabled:bg-surface disabled:text-ink-faint",
  secondary:
    "bg-surface text-ink hover:bg-[var(--color-border)] border border-[var(--color-border-strong)] disabled:text-ink-faint",
  outline:
    "bg-surface-elevated text-primary hover:bg-primary-tint border border-primary disabled:border-[var(--color-border)] disabled:text-ink-faint",
  ghost:
    "bg-transparent text-ink hover:bg-surface border border-transparent disabled:text-ink-faint",
  danger:
    "bg-[var(--color-danger)] text-white hover:opacity-90 border border-[var(--color-danger)] disabled:border-[var(--color-border)] disabled:bg-surface disabled:text-ink-faint",
}

const sizeStyles: Record<Size, string> = {
  sm: "h-8 px-3 text-xs gap-1",
  md: "h-10 px-4 text-sm gap-1.5",
  lg: "h-12 px-6 text-lg gap-2",
}

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant
  size?: Size
  fullWidth?: boolean
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    { className, variant = "primary", size = "md", fullWidth, type, ...props },
    ref,
  ) => {
    return (
      <button
        ref={ref}
        type={type ?? "button"}
        className={cn(
          "inline-flex shrink-0 items-center justify-center rounded-[var(--radius)] font-bold whitespace-nowrap transition-colors",
          "focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 focus-visible:outline-none",
          "disabled:cursor-not-allowed",
          variantStyles[variant],
          sizeStyles[size],
          fullWidth && "w-full",
          className,
        )}
        {...props}
      />
    )
  },
)
Button.displayName = "Button"
