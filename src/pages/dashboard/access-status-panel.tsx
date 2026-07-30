import type { AccessStatus } from "@/entities/dashboard"
import { formatDateTime } from "@/shared/lib/format"

type AccessStatusPanelProps = {
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
      <h2 className="bg-surface-2 px-4 py-2.5 text-sm font-bold text-ink">
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
            <dd className="flex min-w-0 flex-1 items-center border-l border-[var(--color-border)] px-3 py-2.5 text-xs whitespace-nowrap text-ink-faint tabular-nums">
              {row.value}
            </dd>
          </div>
        ))}
      </dl>
      <p className="border-t border-[var(--color-border)] px-4 py-2 text-2xs text-ink-faint">
        ※ 본인이 아닌 접속 기록이 있으면 즉시 비밀번호를 변경해 주세요.
      </p>
    </section>
  )
}
