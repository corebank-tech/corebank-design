import * as React from "react"
import { Modal } from "@/shared/ui/modal"
import { Button } from "@/shared/ui/button"
import { Input } from "@/shared/ui/input"
import { cn } from "@/shared/lib/utils"

const OTP_TTL_SECONDS = 180
const MAX_ATTEMPTS = 5

export interface OtpModalProps {
  open: boolean
  onClose: () => void
  /** Called with the entered code when verification succeeds. */
  onConfirm: (code: string) => void
  title?: React.ReactNode
  /** One-line guidance shown above the issue button. */
  guide?: React.ReactNode
}

function generateOtp(): string {
  return String(Math.floor(100000 + Math.random() * 900000))
}

function formatClock(total: number): string {
  const m = Math.floor(total / 60)
  const s = total % 60
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`
}

/**
 * A-93 OTP 인증 모달 (Mock). Issues a 6-digit code that is displayed on screen
 * (unlike a real token) with a 180-second countdown. The user re-enters the
 * code to confirm; mismatches are reported inline with an attempt counter.
 */
export function OtpModal({
  open,
  onClose,
  onConfirm,
  title = "OTP 인증",
  guide = "OTP를 발급한 뒤 화면에 표시된 6자리 번호를 입력하세요.",
}: OtpModalProps) {
  const [issued, setIssued] = React.useState<string | null>(null)
  const [remaining, setRemaining] = React.useState(OTP_TTL_SECONDS)
  const [value, setValue] = React.useState("")
  const [attempts, setAttempts] = React.useState(0)
  const [error, setError] = React.useState<string | null>(null)

  const expired = issued != null && remaining <= 0

  const reset = React.useCallback(() => {
    setIssued(null)
    setRemaining(OTP_TTL_SECONDS)
    setValue("")
    setAttempts(0)
    setError(null)
  }, [])

  // Reset internal state whenever the modal is closed.
  React.useEffect(() => {
    if (!open) reset()
  }, [open, reset])

  // Countdown tick while a live code is displayed.
  React.useEffect(() => {
    if (!open || issued == null || remaining <= 0) return
    const id = window.setInterval(() => {
      setRemaining((prev) => (prev <= 1 ? 0 : prev - 1))
    }, 1000)
    return () => window.clearInterval(id)
  }, [open, issued, remaining])

  const issue = () => {
    setIssued(generateOtp())
    setRemaining(OTP_TTL_SECONDS)
    setValue("")
    setError(null)
  }

  const confirm = () => {
    if (issued == null) {
      setError("OTP를 먼저 발급하세요.")
      return
    }
    if (expired) {
      setError("OTP 유효시간이 지났습니다. 재발급 후 다시 입력하세요.")
      return
    }
    if (value.length !== 6) {
      setError("OTP 6자리를 모두 입력하세요.")
      return
    }
    if (value !== issued) {
      const next = attempts + 1
      setAttempts(next)
      setValue("")
      setError(`OTP 번호가 올바르지 않습니다. (${next}/${MAX_ATTEMPTS}회)`)
      return
    }
    onConfirm(value)
  }

  const attemptsExhausted = attempts >= MAX_ATTEMPTS

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={title}
      size="sm"
      footer={
        <>
          <Button
            variant="secondary"
            size="lg"
            className="min-w-[120px]"
            onClick={onClose}
          >
            취소
          </Button>
          <Button
            variant="primary"
            size="lg"
            className="min-w-[120px]"
            onClick={attemptsExhausted ? onClose : confirm}
            disabled={attemptsExhausted ? false : issued == null || expired}
          >
            확인
          </Button>
        </>
      }
    >
      <p className="mb-4 text-sm leading-relaxed text-ink-muted">{guide}</p>

      <div className="mb-4 flex items-center justify-between gap-3 rounded-[var(--radius)] border border-[var(--color-border)] bg-surface px-4 py-3">
        {issued == null ? (
          <>
            <span className="text-sm text-ink-muted">
              발급된 OTP가 없습니다.
            </span>
            <Button variant="outline" size="sm" onClick={issue}>
              OTP 발급
            </Button>
          </>
        ) : (
          <>
            <span
              className={cn(
                "text-3xl font-bold tabular-nums tracking-[0.2em]",
                expired ? "text-ink-faint line-through" : "text-primary",
              )}
              aria-label="발급된 OTP 번호"
            >
              {issued}
            </span>
            <div className="flex flex-col items-end gap-1">
              <span
                className={cn(
                  "text-sm font-bold tabular-nums",
                  expired ? "text-ink-faint" : "text-ink",
                )}
              >
                {formatClock(remaining)}
              </span>
              {expired && !attemptsExhausted && (
                <Button variant="outline" size="sm" onClick={issue}>
                  재발급
                </Button>
              )}
            </div>
          </>
        )}
      </div>

      <Input
        inputMode="numeric"
        maxLength={6}
        placeholder="OTP 6자리"
        value={value}
        invalid={error != null}
        disabled={issued == null || expired || attemptsExhausted}
        onChange={(e) => {
          setValue(e.target.value.replace(/\D/g, "").slice(0, 6))
          if (error) setError(null)
        }}
        className="text-center text-lg tracking-[0.4em] tabular-nums"
        aria-label="OTP 입력"
      />

      {error && (
        <p
          role="alert"
          className="mt-2 text-sm font-bold text-[var(--color-danger)]"
        >
          {error}
        </p>
      )}
      {attemptsExhausted && (
        <p className="mt-2 text-sm text-ink-muted">
          입력 횟수를 초과했습니다. 처음부터 다시 진행하세요.
        </p>
      )}
    </Modal>
  )
}
