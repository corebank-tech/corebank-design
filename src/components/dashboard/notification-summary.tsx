import { ChevronRight } from "lucide-react"
import type { NotificationItem } from "@/lib/mock/dashboard"
import { formatDateTime } from "@/lib/format"

export interface NotificationSummaryProps {
  items: NotificationItem[]
  onOpenInbox?: () => void
}

/** 미읽음 알림 요약 리스트. 헤더에서 알림함으로 이동. */
export function NotificationSummary({
  items,
  onOpenInbox,
}: NotificationSummaryProps) {
  return (
    <section
      aria-label="미읽음 알림"
      className="border border-[var(--color-border)]"
    >
      <div className="flex items-center justify-between border-b border-[var(--color-border)] bg-surface px-4 py-2.5">
        <h2 className="text-sm font-bold text-ink">
          미읽음 알림 <span className="text-primary tabular-nums">{items.length}</span>건
        </h2>
        <button
          type="button"
          onClick={onOpenInbox}
          className="inline-flex items-center gap-0.5 text-sm font-bold text-link hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          알림함
          <ChevronRight className="h-4 w-4" aria-hidden="true" />
        </button>
      </div>
      <ul>
        {items.map((item, i) => (
          <li
            key={item.id}
            className={
              "flex items-center gap-3 px-4 py-3" +
              (i > 0 ? " border-t border-[var(--color-border)]" : "")
            }
          >
            <span className="inline-flex w-12 shrink-0 items-center justify-center border border-[var(--color-border-strong)] bg-white px-1 py-0.5 text-xs font-bold text-ink-muted">
              {item.category}
            </span>
            <span className="min-w-0 flex-1 truncate text-sm text-ink">
              {item.title}
            </span>
            <time className="shrink-0 text-xs text-ink-muted tabular-nums">
              {formatDateTime(item.datetime)}
            </time>
          </li>
        ))}
      </ul>
    </section>
  )
}
