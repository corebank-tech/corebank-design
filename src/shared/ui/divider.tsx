import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/shared/lib/utils"

/** 헤더·툴바·푸터에서 각자 만들던 `|` 구분자 span을 하나로 모은 것이다. */
const dividerVariants = cva("", {
  variants: {
    tone: {
      "border-strong": "text-border-strong",
      "ink-faint": "text-ink-faint",
      "footer-divider": "text-footer-divider",
    },
  },
  defaultVariants: { tone: "border-strong" },
})

type DividerProps = React.HTMLAttributes<HTMLSpanElement> &
  VariantProps<typeof dividerVariants>

export function Divider({ className, tone, ...props }: DividerProps) {
  return (
    <span
      aria-hidden="true"
      className={cn(dividerVariants({ tone }), className)}
      {...props}
    >
      |
    </span>
  )
}
