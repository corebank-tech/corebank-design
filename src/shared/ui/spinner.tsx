import { Loader2 } from "lucide-react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/shared/lib/utils"

const spinnerVariants = cva("animate-spin", {
  variants: {
    size: {
      sm: "h-4 w-4",
      md: "h-5 w-5",
      lg: "h-9 w-9",
    },
  },
  defaultVariants: { size: "md" },
})

type SpinnerProps = React.HTMLAttributes<SVGSVGElement> &
  VariantProps<typeof spinnerVariants>

/** 로딩 표시 아이콘. `widgets/transfer/result-panel.tsx`의 "처리중" 상태가 첫 사용처다. */
export function Spinner({ className, size, ...props }: SpinnerProps) {
  return (
    <Loader2
      className={cn(spinnerVariants({ size }), className)}
      strokeWidth={2.5}
      aria-hidden="true"
      {...props}
    />
  )
}
