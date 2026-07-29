"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

export interface RadioProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type"> {
  label?: React.ReactNode
}

export const Radio = React.forwardRef<HTMLInputElement, RadioProps>(
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
            type="radio"
            className={cn(
              "peer h-[18px] w-[18px] cursor-pointer appearance-none rounded-full border border-[var(--color-border-strong)] bg-white",
              "checked:border-primary",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40",
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
