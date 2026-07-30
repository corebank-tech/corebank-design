import { cn } from "@/shared/lib/utils"

export function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "animate-pulse rounded-[var(--radius)] bg-[var(--color-skeleton)]",
        className,
      )}
      {...props}
    />
  )
}
