import * as React from "react"
import { cn } from "@/lib/utils"

type Variant = "primary" | "secondary" | "outline" | "ghost" | "danger"
type Size = "sm" | "md" | "lg"

const variantStyles: Record<Variant, string> = {
  primary:
    "bg-primary text-primary-foreground hover:bg-[var(--color-primary-hover)] border border-primary",
  secondary:
    "bg-surface text-ink hover:bg-[var(--color-border)] border border-[var(--color-border-strong)]",
  outline:
    "bg-white text-primary hover:bg-primary-tint border border-primary",
  ghost: "bg-transparent text-ink hover:bg-surface border border-transparent",
  danger:
    "bg-[var(--color-danger)] text-white hover:opacity-90 border border-[var(--color-danger)]",
}

const sizeStyles: Record<Size, string> = {
  sm: "h-8 px-3 text-xs gap-1",
  md: "h-10 px-4 text-sm gap-1.5",
  lg: "h-12 px-6 text-lg gap-2",
}

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
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
          "inline-flex shrink-0 items-center justify-center whitespace-nowrap rounded-[var(--radius)] font-bold transition-colors",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1",
          "disabled:cursor-not-allowed disabled:opacity-50",
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
