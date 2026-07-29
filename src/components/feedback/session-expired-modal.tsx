import * as React from "react"
import { Clock } from "lucide-react"
import { Modal } from "@/components/ui/modal"
import { Button } from "@/components/ui/button"

export interface SessionExpiredModalProps {
  open: boolean
  /** Sends the user back to the login screen. */
  onRelogin: () => void
  title?: React.ReactNode
  message?: React.ReactNode
}

/**
 * A-11 세션 만료. A non-dismissible modal (no overlay/ESC close, no X) that
 * blocks the screen after an idle timeout and offers a single path back to
 * login.
 */
export function SessionExpiredModal({
  open,
  onRelogin,
  title = "세션 만료",
  message = "장시간 조작이 없어 자동 로그아웃되었습니다.",
}: SessionExpiredModalProps) {
  return (
    <Modal
      open={open}
      onClose={onRelogin}
      title={title}
      size="sm"
      closeOnOverlay={false}
      closeOnEsc={false}
      hideCloseButton
      footer={
        <Button
          variant="primary"
          size="lg"
          className="min-w-[140px]"
          onClick={onRelogin}
        >
          다시 로그인
        </Button>
      }
    >
      <div className="flex flex-col items-center text-center">
        <span
          className="mb-4 inline-flex h-14 w-14 items-center justify-center rounded-full bg-surface text-ink-muted"
          aria-hidden="true"
        >
          <Clock className="h-7 w-7" strokeWidth={2.25} />
        </span>
        <p className="text-base leading-relaxed text-ink">{message}</p>
        <p className="mt-2 text-sm leading-relaxed text-ink-muted">
          보안을 위해 다시 로그인한 뒤 이용하세요.
        </p>
      </div>
    </Modal>
  )
}
