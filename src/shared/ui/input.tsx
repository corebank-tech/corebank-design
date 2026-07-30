import * as React from "react"
import { cn } from "@/shared/lib/utils"

export type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  invalid?: boolean
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, invalid, ...props }, ref) => {
    return (
      <input
        ref={ref}
        aria-invalid={invalid || undefined}
        className={cn(
          "h-10 w-full rounded-[var(--radius)] border bg-white px-3 text-base",
          "placeholder:text-ink-faint",
          "focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-[var(--color-ring-soft)] focus-visible:outline-none",
          "disabled:cursor-not-allowed disabled:bg-surface disabled:text-ink-muted",
          invalid
            ? "border-[var(--color-danger)] focus-visible:border-[var(--color-danger)] focus-visible:ring-[var(--color-danger-ring)]"
            : "border-[var(--color-border-strong)]",
          className,
        )}
        {...props}
      />
    )
  },
)
Input.displayName = "Input"
