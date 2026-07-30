import * as React from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Input } from "@/shared/ui/input"
import { Select } from "@/shared/ui/select"
import { Radio } from "@/shared/ui/radio"
import { formatAccountNo, formatAmount } from "@/shared/lib/format"
import { cn } from "@/shared/lib/utils"
import type { AccountOption } from "@/shared/types/account"

/* ------------------------------------------------------------------ */
/* AccountSelectField                                                  */
/* ------------------------------------------------------------------ */

export interface AccountSelectFieldProps {
  id?: string
  options: AccountOption[]
  value?: string
  onChange?: (accountNo: string) => void
}

export function AccountSelectField({
  id,
  options,
  value,
  onChange,
}: AccountSelectFieldProps) {
  return (
    <Select
      id={id}
      className="max-w-md"
      value={value}
      onChange={(e) => onChange?.(e.target.value)}
    >
      {options.map((o) => (
        <option key={o.accountNo} value={o.accountNo}>
          {`${o.alias} / ${formatAccountNo(o.accountNo)} / ${formatAmount(o.balance)}`}
        </option>
      ))}
    </Select>
  )
}

/* ------------------------------------------------------------------ */
/* PeriodField                                                         */
/* ------------------------------------------------------------------ */

/** REQ-INQR-009: 조회기간 프리셋(오늘·1주일·1개월·3개월·6개월·1년). */
const PERIOD_CHIPS = [
  { id: "today", label: "오늘", days: 0 },
  { id: "1w", label: "1주일", days: 7 },
  { id: "1m", label: "1개월", days: 30 },
  { id: "3m", label: "3개월", days: 90 },
  { id: "6m", label: "6개월", days: 182 },
  { id: "1y", label: "1년", days: 365 },
] as const

const MAX_RANGE_DAYS = 365

function parseISO(value: string): Date {
  const [y, m, d] = value.split("-").map(Number)
  return new Date(y, (m ?? 1) - 1, d ?? 1)
}

function toISO(date: Date): string {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, "0")
  const d = String(date.getDate()).padStart(2, "0")
  return `${y}-${m}-${d}`
}

function daysBetween(startISO: string, endISO: string): number {
  const ms = parseISO(endISO).getTime() - parseISO(startISO).getTime()
  return Math.round(ms / 86_400_000)
}

export interface PeriodFieldProps {
  start: string
  end: string
  onChange: (range: { start: string; end: string }) => void
  /** Anchor "today" for chip presets, ISO yyyy-mm-dd. */
  today: string
}

export function PeriodField({ start, end, onChange, today }: PeriodFieldProps) {
  const applyChip = (days: number) => {
    const endDate = parseISO(today)
    const startDate = parseISO(today)
    startDate.setDate(startDate.getDate() - days)
    onChange({ start: toISO(startDate), end: toISO(endDate) })
  }

  const stepEnd = (unit: "year" | "month", delta: number) => {
    const d = parseISO(end)
    if (unit === "year") d.setFullYear(d.getFullYear() + delta)
    else d.setMonth(d.getMonth() + delta)
    onChange({ start, end: toISO(d) })
  }

  const activeChip = React.useMemo(() => {
    if (end !== today) return null
    const span = daysBetween(start, end)
    return PERIOD_CHIPS.find((c) => c.days === span)?.id ?? null
  }, [start, end, today])

  const overLimit = daysBetween(start, end) > MAX_RANGE_DAYS
  const reversed = daysBetween(start, end) < 0

  const stepperGroup =
    "inline-flex items-stretch overflow-hidden rounded-[var(--radius)] border border-[var(--color-border-strong)]"
  const stepper =
    "inline-flex h-8 w-7 items-center justify-center bg-white text-ink-muted hover:bg-surface focus-visible:z-10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring"

  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex flex-wrap gap-1">
          {PERIOD_CHIPS.map((chip) => {
            const active = activeChip === chip.id
            return (
              <button
                key={chip.id}
                type="button"
                onClick={() => applyChip(chip.days)}
                aria-pressed={active}
                className={cn(
                  "h-8 rounded-[var(--radius-pill)] border px-3 text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                  active
                    ? "border-ink bg-ink font-bold text-white"
                    : "border-[var(--color-border-strong)] bg-white text-ink hover:bg-surface",
                )}
              >
                {chip.label}
              </button>
            )
          })}
        </div>

        <div className="flex items-center gap-1.5">
          <Input
            type="date"
            aria-label="조회 시작일"
            value={start}
            invalid={overLimit || reversed}
            onChange={(e) => onChange({ start: e.target.value, end })}
            className="w-[150px]"
          />
          <span className="text-ink-muted" aria-hidden="true">
            ~
          </span>
          <Input
            type="date"
            aria-label="조회 종료일"
            value={end}
            invalid={overLimit || reversed}
            onChange={(e) => onChange({ start, end: e.target.value })}
            className="w-[150px]"
          />
        </div>

        <div className="flex items-center gap-1.5">
          <div className={stepperGroup}>
            <button
              type="button"
              className={stepper}
              onClick={() => stepEnd("year", -1)}
              aria-label="종료일 1년 전"
            >
              <ChevronLeft className="h-4 w-4" aria-hidden="true" />
            </button>
            <span className="flex items-center border-x border-[var(--color-border-strong)] bg-surface px-2 text-xs font-bold text-ink">
              년
            </span>
            <button
              type="button"
              className={stepper}
              onClick={() => stepEnd("year", 1)}
              aria-label="종료일 1년 후"
            >
              <ChevronRight className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>
          <div className={stepperGroup}>
            <button
              type="button"
              className={stepper}
              onClick={() => stepEnd("month", -1)}
              aria-label="종료일 1개월 전"
            >
              <ChevronLeft className="h-4 w-4" aria-hidden="true" />
            </button>
            <span className="flex items-center border-x border-[var(--color-border-strong)] bg-surface px-2 text-xs font-bold text-ink">
              월
            </span>
            <button
              type="button"
              className={stepper}
              onClick={() => stepEnd("month", 1)}
              aria-label="종료일 1개월 후"
            >
              <ChevronRight className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>

      {reversed ? (
        <p className="text-xs font-bold text-[var(--color-danger)]">
          종료일이 시작일보다 빠릅니다. 시작일과 종료일을 다시 선택하세요.
        </p>
      ) : overLimit ? (
        <p className="text-xs font-bold text-[var(--color-danger)]">
          조회 기간은 최대 1년까지 선택할 수 있습니다. 기간을 다시 선택하세요.
        </p>
      ) : null}
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* RadioRowField                                                       */
/* ------------------------------------------------------------------ */

export interface RadioRowOption {
  label: string
  value: string
}

export interface RadioRowFieldProps {
  name: string
  options: RadioRowOption[]
  value: string
  onChange: (value: string) => void
}

export function RadioRowField({
  name,
  options,
  value,
  onChange,
}: RadioRowFieldProps) {
  return (
    <div className="flex flex-wrap items-center gap-4">
      {options.map((o) => (
        <Radio
          key={o.value}
          name={name}
          label={o.label}
          value={o.value}
          checked={value === o.value}
          onChange={() => onChange(o.value)}
        />
      ))}
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* KeywordField                                                        */
/* ------------------------------------------------------------------ */

export interface KeywordFieldProps {
  id?: string
  value: string
  onChange: (value: string) => void
  placeholder?: string
}

export function KeywordField({
  id,
  value,
  onChange,
  placeholder = "적요 내용을 입력하세요",
}: KeywordFieldProps) {
  return (
    <Input
      id={id}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="max-w-xs"
    />
  )
}
