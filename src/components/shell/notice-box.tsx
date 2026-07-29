import * as React from "react"
import { CheckCircle2, ChevronDown, ChevronUp, Info } from "lucide-react"
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
        "rounded-[var(--radius)] border border-border bg-primary-tint p-4",
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

export interface NoticeBoxFooterProps {
  title?: string
  items: React.ReactNode[]
  className?: string
  defaultOpen?: boolean
}

/** 조회·폼 화면 하단에 배치하는 접이식 [알아두세요] 안내 박스. */
export function NoticeBoxFooter({
  title = "알아두세요",
  items,
  className,
  defaultOpen = true,
}: NoticeBoxFooterProps) {
  const [open, setOpen] = React.useState(defaultOpen)
  return (
    <section className={cn("border border-border p-4", className)} aria-label={title}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between"
        aria-expanded={open}
      >
        <span className="flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
          <h2 className="text-base font-bold text-ink">{title}</h2>
        </span>
        {open ? (
          <ChevronUp className="h-4 w-4 shrink-0 text-ink-faint" aria-hidden="true" />
        ) : (
          <ChevronDown className="h-4 w-4 shrink-0 text-ink-faint" aria-hidden="true" />
        )}
      </button>
      {open && (
        <ul className="mt-3 flex flex-col gap-1.5">
          {items.map((item, i) => (
            <li key={i} className="flex gap-1.5 text-xs leading-relaxed text-ink-muted">
              <span aria-hidden="true">-</span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
