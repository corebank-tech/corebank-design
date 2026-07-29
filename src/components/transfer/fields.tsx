import * as React from "react"
import { Input } from "@/components/ui/input"
import { Select } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import {
  formatAccountNo,
  formatAmount,
  formatKoreanAmount,
} from "@/lib/format"
import { cn } from "@/lib/utils"
import type { AccountOption } from "@/shared/types/account"

/* ================================================================== */
/* WithdrawAccountField — 출금계좌 선택                                 */
/* ================================================================== */

export interface WithdrawAccountFieldProps {
  id?: string
  options: AccountOption[]
  value?: string
  onChange?: (accountNo: string) => void
  onSelectAccount?: () => void
  onCheckBalance?: () => void
}

export function WithdrawAccountField({
  id,
  options,
  value,
  onChange,
  onSelectAccount,
  onCheckBalance,
}: WithdrawAccountFieldProps) {
  const selected = options.find((o) => o.accountNo === value)
  return (
    <div className="flex w-full flex-col gap-2">
      <div className="flex items-center gap-2">
        <div className="min-w-0 max-w-md flex-1">
          <Select
            id={id}
            value={value}
            onChange={(e) => onChange?.(e.target.value)}
          >
            {options.map((o) => (
              <option key={o.accountNo} value={o.accountNo}>
                {`${o.alias} / ${formatAccountNo(o.accountNo)}`}
              </option>
            ))}
          </Select>
        </div>
        <Button variant="outline" size="md" onClick={onSelectAccount}>
          계좌선택
        </Button>
        <Button variant="secondary" size="md" onClick={onCheckBalance}>
          잔액조회
        </Button>
      </div>
      {selected && (
        <p className="text-sm text-ink-muted">
          출금가능금액{" "}
          <span className="font-bold tabular-nums text-ink">
            {formatAmount(selected.withdrawable)}
          </span>
        </p>
      )}
    </div>
  )
}

/* ================================================================== */
/* AccountPasswordField — 계좌비밀번호 4자리                            */
/* ================================================================== */

export interface AccountPasswordFieldProps {
  id?: string
  value: string
  onChange: (value: string) => void
  onCheckErrorCount?: () => void
}

export function AccountPasswordField({
  id,
  value,
  onChange,
  onCheckErrorCount,
}: AccountPasswordFieldProps) {
  const refs = React.useRef<Array<HTMLInputElement | null>>([])
  const digits = value.padEnd(4, " ").slice(0, 4).split("")

  const setDigit = (index: number, raw: string) => {
    const digit = raw.replace(/\D/g, "").slice(-1)
    const chars = value.padEnd(4, " ").split("")
    chars[index] = digit || " "
    const next = chars.join("").replace(/\s+$/g, "")
    onChange(next.trimEnd())
    if (digit && index < 3) refs.current[index + 1]?.focus()
  }

  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    if (e.key === "Backspace" && !digits[index]?.trim() && index > 0) {
      refs.current[index - 1]?.focus()
    }
  }

  return (
    <div className="flex w-full items-center gap-2">
      <div className="flex items-center gap-1.5" role="group" aria-label="계좌비밀번호 4자리">
        {[0, 1, 2, 3].map((i) => (
          <Input
            key={i}
            id={i === 0 ? id : undefined}
            ref={(el) => {
              refs.current[i] = el
            }}
            type="password"
            inputMode="numeric"
            maxLength={1}
            aria-label={`계좌비밀번호 ${i + 1}번째 자리`}
            value={digits[i]?.trim() ?? ""}
            onChange={(e) => setDigit(i, e.target.value)}
            onKeyDown={(e) => handleKeyDown(i, e)}
            className="w-11 text-center tracking-widest"
          />
        ))}
      </div>
      <Button variant="secondary" size="md" onClick={onCheckErrorCount}>
        오류횟수 조회
      </Button>
    </div>
  )
}

/* ================================================================== */
/* AccountNumberField — 입금계좌번호 + 계좌확인                         */
/* ================================================================== */

export interface AccountNumberFieldProps {
  id?: string
  value: string
  onChange: (value: string) => void
  onConfirm?: () => void
  /** Resolved payee name once the number is confirmed. */
  holderName?: string
  confirmed?: boolean
}

export function AccountNumberField({
  id,
  value,
  onChange,
  onConfirm,
  holderName,
  confirmed,
}: AccountNumberFieldProps) {
  return (
    <div className="flex w-full flex-col gap-2">
      <div className="flex items-center gap-2">
        <Input
          id={id}
          inputMode="numeric"
          placeholder="- 없이 숫자만 입력"
          value={value}
          onChange={(e) => onChange(e.target.value.replace(/\D/g, ""))}
          className="max-w-xs"
        />
        <Button variant="outline" size="md" onClick={onConfirm}>
          계좌확인
        </Button>
      </div>
      {confirmed && holderName && (
        <p className="text-sm text-ink-muted">
          예금주명{" "}
          <span className="font-bold text-ink">{holderName}</span>
        </p>
      )}
    </div>
  )
}

/* ================================================================== */
/* AmountField — 이체금액                                              */
/* ================================================================== */

const QUICK_AMOUNTS = [
  { label: "100만", value: 1_000_000 },
  { label: "50만", value: 500_000 },
  { label: "10만", value: 100_000 },
  { label: "5만", value: 50_000 },
  { label: "3만", value: 30_000 },
  { label: "1만", value: 10_000 },
] as const

export interface AmountFieldProps {
  id?: string
  /** Amount in KRW, or null when empty. */
  value: number | null
  onChange: (value: number | null) => void
  /** 1회 이체한도 */
  perTransferLimit: number
  /** 1일 잔여한도 */
  dailyRemaining: number
  /** Amount applied by the 전액 chip (e.g. withdrawable balance). */
  fullAmount?: number
}

export function AmountField({
  id,
  value,
  onChange,
  perTransferLimit,
  dailyRemaining,
  fullAmount,
}: AmountFieldProps) {
  const limit = Math.min(perTransferLimit, dailyRemaining)
  const overLimit = value != null && value > limit
  const overPer = value != null && value > perTransferLimit

  return (
    <div className="flex w-full flex-col gap-2">
      <div className="flex items-center gap-2">
        <Input
          id={id}
          inputMode="numeric"
          placeholder="0"
          invalid={overLimit}
          value={value == null ? "" : value.toLocaleString("ko-KR")}
          onChange={(e) => {
            const digits = e.target.value.replace(/\D/g, "")
            onChange(digits ? Number(digits) : null)
          }}
          className="max-w-xs text-right tabular-nums"
        />
        <span className="shrink-0 text-sm text-ink-muted">원</span>
        {value != null && value > 0 && (
          <span className="text-sm font-bold text-primary">
            {formatKoreanAmount(value)}
          </span>
        )}
      </div>

      <div className="flex flex-wrap items-center gap-1">
        {QUICK_AMOUNTS.map((chip) => (
          <button
            key={chip.label}
            type="button"
            onClick={() => onChange(Math.min((value ?? 0) + chip.value, limit))}
            className="h-8 rounded-[var(--radius-pill)] border border-[var(--color-border-strong)] bg-white px-3 text-sm text-ink transition-colors hover:bg-surface focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            {chip.label}
          </button>
        ))}
        {fullAmount != null && (
          <button
            type="button"
            onClick={() => onChange(fullAmount)}
            className="h-8 rounded-[var(--radius-pill)] border border-primary bg-primary-tint px-3 text-sm font-bold text-primary transition-colors hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            전액
          </button>
        )}
        <button
          type="button"
          onClick={() => onChange(null)}
          className="h-8 rounded-[var(--radius-pill)] border border-[var(--color-border-strong)] bg-surface px-3 text-sm text-ink-muted transition-colors hover:bg-[var(--color-border)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          정정
        </button>
      </div>

      <p className="text-xs text-ink-muted tabular-nums">
        1회 한도 {formatAmount(perTransferLimit)} · 1일 잔여한도{" "}
        {formatAmount(dailyRemaining)}
      </p>

      {overLimit && (
        <p className="text-xs font-bold text-[var(--color-danger)]">
          {overPer
            ? `1회 이체한도 ${formatAmount(perTransferLimit)}를 초과했습니다. 금액을 낮춰 다시 입력하세요.`
            : `1일 잔여한도 ${formatAmount(dailyRemaining)}를 초과했습니다. 금액을 낮춰 다시 입력하세요.`}
        </p>
      )}
    </div>
  )
}

/* ================================================================== */
/* MemoField — 통장 표시내용 (받는분 / 나)                              */
/* ================================================================== */

export interface MemoFieldProps {
  id?: string
  value: string
  onChange: (value: string) => void
  placeholder?: string
  maxLength?: number
}

export function MemoField({
  id,
  value,
  onChange,
  placeholder,
  maxLength = 7,
}: MemoFieldProps) {
  return (
    <div className="flex w-full items-center gap-2">
      <Input
        id={id}
        value={value}
        maxLength={maxLength}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value.slice(0, maxLength))}
        className="max-w-xs"
      />
      <span className="shrink-0 text-xs text-ink-muted tabular-nums">
        {value.length}/{maxLength}
      </span>
    </div>
  )
}

/* ================================================================== */
/* TransferDateField — 예약일 (D+1 ~ D+365)                            */
/* ================================================================== */

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

function addDays(iso: string, days: number): string {
  const d = parseISO(iso)
  d.setDate(d.getDate() + days)
  return toISO(d)
}

function daysBetween(startISO: string, endISO: string): number {
  const ms = parseISO(endISO).getTime() - parseISO(startISO).getTime()
  return Math.round(ms / 86_400_000)
}

export interface TransferDateFieldProps {
  id?: string
  value: string
  onChange: (value: string) => void
  /** Anchor "today", ISO yyyy-mm-dd. */
  today: string
  minDays?: number
  maxDays?: number
}

export function TransferDateField({
  id,
  value,
  onChange,
  today,
  minDays = 1,
  maxDays = 365,
}: TransferDateFieldProps) {
  const min = addDays(today, minDays)
  const max = addDays(today, maxDays)
  const span = value ? daysBetween(today, value) : null
  const outOfRange = span != null && (span < minDays || span > maxDays)

  return (
    <div className="flex w-full flex-col gap-2">
      <Input
        id={id}
        type="date"
        value={value}
        min={min}
        max={max}
        invalid={outOfRange}
        onChange={(e) => onChange(e.target.value)}
        className="w-[180px]"
      />
      {outOfRange && (
        <p className="text-xs font-bold text-[var(--color-danger)]">
          예약일은 내일부터 1년 이내({min.replace(/-/g, ".")} ~{" "}
          {max.replace(/-/g, ".")})에서 선택하세요.
        </p>
      )}
    </div>
  )
}
