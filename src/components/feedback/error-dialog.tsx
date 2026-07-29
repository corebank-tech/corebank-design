import * as React from "react"
import { AlertTriangle } from "lucide-react"
import { Modal } from "@/components/ui/modal"
import { Button } from "@/components/ui/button"

export interface ErrorDialogProps {
  open: boolean
  onClose: () => void
  /** Title bar text. */
  title?: React.ReactNode
  /** What went wrong and how to fix it. One or more lines. */
  messages: React.ReactNode[]
  /** Error code shown for reference, e.g. "E-40312". */
  code?: string
  confirmLabel?: string
  onConfirm?: () => void
}

/**
 * A-92 오류 다이얼로그. Danger-toned modal with a warning icon, a plain-language
 * error message, and a reference error code. Never surfaces stack traces,
 * internal paths, or SQL.
 */
export function ErrorDialog({
  open,
  onClose,
  title = "오류",
  messages,
  code,
  confirmLabel = "확인",
  onConfirm,
}: ErrorDialogProps) {
  return (
    <Modal
      open={open}
      onClose={onClose}
      title={title}
      tone="danger"
      size="sm"
      footer={
        <Button
          variant="danger"
          size="lg"
          className="min-w-[120px]"
          onClick={onConfirm ?? onClose}
        >
          {confirmLabel}
        </Button>
      }
    >
      <div className="flex flex-col items-center">
        <span
          className="mb-4 inline-flex h-14 w-14 items-center justify-center rounded-full bg-[var(--color-danger-tint)] text-[var(--color-danger)]"
          aria-hidden="true"
        >
          <AlertTriangle className="h-7 w-7" strokeWidth={2.25} />
        </span>
        <div className="text-center">
          {messages.map((line, i) => (
            <p key={i} className="text-base leading-relaxed text-ink">
              {line}
            </p>
          ))}
        </div>
        {code && (
          <p className="mt-4 text-sm tabular-nums text-ink-muted">
            오류코드 : {code}
          </p>
        )}
      </div>
    </Modal>
  )
}
