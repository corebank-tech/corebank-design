import * as React from "react"
import { Info } from "lucide-react"
import { cn } from "@/lib/utils"

export interface NoticeBoxProps {
  title?: React.ReactNode
  items: React.ReactNode[]
  className?: string
}

export function NoticeBox({
  title = "안내 및 유의사항",
  items,
  className,
}: NoticeBoxProps) {
  return (
    <section
      className={cn(
        "rounded-[var(--radius)] border border-primary/15 bg-primary-tint p-4",
        className,
      )}
      aria-label={typeof title === "string" ? title : "안내"}
    >
      <div className="mb-2 flex items-center gap-2">
        <Info className="h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
        <h2 className="text-sm font-bold text-ink">{title}</h2>
      </div>
      <ul className="flex flex-col gap-1.5 pl-6">
        {items.map((item, i) => (
          <li
            key={i}
            className="relative text-sm leading-relaxed text-ink-muted before:absolute before:-left-3 before:top-[9px] before:h-1 before:w-1 before:rounded-full before:bg-ink-faint"
          >
            {item}
          </li>
        ))}
      </ul>
    </section>
  )
}
