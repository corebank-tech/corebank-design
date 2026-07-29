import * as React from "react"
import { Check } from "lucide-react"
import { cn } from "@/lib/utils"

export interface CheckboxProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type"> {
  label?: React.ReactNode
}

export const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, label, id, ...props }, ref) => {
    const autoId = React.useId()
    const inputId = id ?? autoId
    return (
      <label
        htmlFor={inputId}
        className="inline-flex cursor-pointer select-none items-center gap-2 text-base"
      >
        <span className="relative inline-flex h-[18px] w-[18px] items-center justify-center">
          <input
            ref={ref}
            id={inputId}
            type="checkbox"
            className={cn(
              "peer h-[18px] w-[18px] cursor-pointer appearance-none rounded-[2px] border border-[var(--color-border-strong)] bg-white",
              "checked:border-primary checked:bg-primary",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40",
              className,
            )}
            {...props}
          />
          <Check
            className="pointer-events-none absolute h-3 w-3 text-white opacity-0 peer-checked:opacity-100"
            strokeWidth={3}
            aria-hidden="true"
          />
        </span>
        {label != null && <span className="text-ink">{label}</span>}
      </label>
    )
  },
)
Checkbox.displayName = "Checkbox"
