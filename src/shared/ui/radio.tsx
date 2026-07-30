import * as React from "react"
import { cn } from "@/shared/lib/utils"

export type RadioProps = Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  "type"
> & {
  label?: React.ReactNode
}

export const Radio = React.forwardRef<HTMLInputElement, RadioProps>(
  ({ className, label, id, ...props }, ref) => {
    const autoId = React.useId()
    const inputId = id ?? autoId
    return (
      <label
        htmlFor={inputId}
        className="inline-flex cursor-pointer items-center gap-2 text-base select-none"
      >
        <span className="relative inline-flex h-[18px] w-[18px] items-center justify-center">
          <input
            ref={ref}
            id={inputId}
            type="radio"
            className={cn(
              "peer h-[18px] w-[18px] cursor-pointer appearance-none rounded-full border border-[var(--color-border-strong)] bg-white",
              "checked:border-primary",
              "focus-visible:ring-2 focus-visible:ring-[var(--color-ring-soft)] focus-visible:outline-none",
              className,
            )}
            {...props}
          />
          <span className="pointer-events-none absolute h-2 w-2 rounded-full bg-primary opacity-0 peer-checked:opacity-100" />
        </span>
        {label != null && <span className="text-ink">{label}</span>}
      </label>
    )
  },
)
Radio.displayName = "Radio"
