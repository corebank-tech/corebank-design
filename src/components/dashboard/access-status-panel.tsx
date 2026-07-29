import type { AccessStatus } from "@/lib/mock/dashboard"
import { formatDateTime } from "@/lib/format"

export interface AccessStatusPanelProps {
  status: AccessStatus
}

/** 우측 접속현황 패널: primary 헤더 + label/value 3행. */
export function AccessStatusPanel({ status }: AccessStatusPanelProps) {
  const rows: { label: string; value: string }[] = [
    { label: "최근 접속일시", value: formatDateTime(status.lastLogin) },
    { label: "현재 접속 IP", value: status.ip },
    { label: "최근 거래일시", value: formatDateTime(status.lastTransaction) },
  ]

  return (
    <section
      className="overflow-hidden border border-[var(--color-border)] bg-white"
      aria-label="접속현황"
    >
      <h2 className="access-status-header bg-primary px-4 py-2.5 text-sm font-bold text-primary-foreground">
        접속현황
      </h2>
      <dl>
        {rows.map((row, i) => (
          <div
            key={row.label}
            className={
              "flex items-stretch" +
              (i > 0 ? " border-t border-[var(--color-border)]" : "")
            }
          >
            <dt className="flex w-[120px] shrink-0 items-center bg-surface px-3 py-2.5 text-sm font-bold text-ink">
              {row.label}
            </dt>
            <dd className="flex min-w-0 flex-1 items-center whitespace-nowrap border-l border-[var(--color-border)] px-3 py-2.5 text-sm text-ink tabular-nums">
              {row.value}
            </dd>
          </div>
        ))}
      </dl>
    </section>
  )
}
