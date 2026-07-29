import type { AccessStatus } from "@/lib/mock/dashboard"
import { formatDateTime } from "@/lib/format"

export interface AccessStatusPanelProps {
  status: AccessStatus
}

/** 우측 접속현황 패널: primary 헤더 + label/value 3행. */
export function AccessStatusPanel({ status }: AccessStatusPanelProps) {
  const rows: { label: string; value: string; numeric?: boolean }[] = [
    { label: "최근 접속일시", value: formatDateTime(status.lastLogin), numeric: true },
    { label: "현재 접속 IP", value: status.ip, numeric: true },
    { label: "최근 거래일시", value: formatDateTime(status.lastTransaction), numeric: true },
  ]

  return (
    <section className="border border-[var(--color-border)]" aria-label="접속현황">
      <h2 className="bg-primary px-4 py-2.5 text-sm font-bold text-primary-foreground">
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
            <dt className="flex w-[104px] shrink-0 items-center bg-surface px-3 py-2.5 text-sm font-bold text-ink">
              {row.label}
            </dt>
            <dd className="flex min-w-0 flex-1 items-center border-l border-[var(--color-border)] px-3 py-2.5 text-sm text-ink tabular-nums">
              {row.value}
            </dd>
          </div>
        ))}
      </dl>
    </section>
  )
}
