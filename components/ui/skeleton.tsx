import { cn } from "@/lib/utils"

export function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "animate-pulse rounded-[var(--radius)] bg-[var(--color-border)]/60",
        className,
      )}
      {...props}
    />
  )
}
