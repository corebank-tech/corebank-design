import * as React from "react"
import { createPortal } from "react-dom"
import { X } from "lucide-react"
import { cn } from "@/lib/utils"

type ModalSize = "sm" | "md" | "lg"
type ModalTone = "primary" | "danger"

const sizeWidth: Record<ModalSize, number> = {
  sm: 480,
  md: 640,
  lg: 880,
}

const toneBar: Record<ModalTone, string> = {
  primary: "bg-primary text-primary-foreground",
  danger: "bg-[var(--color-danger)] text-white",
}

export interface ModalProps {
  open: boolean
  onClose: () => void
  title: React.ReactNode
  /** Title bar color. Use "danger" for error dialogs. */
  tone?: ModalTone
  size?: ModalSize
  /** Centered action row pinned to the bottom of the modal. */
  footer?: React.ReactNode
  /** Close when the overlay backdrop is clicked. Defaults to true. */
  closeOnOverlay?: boolean
  /** Close when the Escape key is pressed. Defaults to true. */
  closeOnEsc?: boolean
  /** Hide the title-bar close (X) button. */
  hideCloseButton?: boolean
  children: React.ReactNode
}

/**
 * Shared modal shell: a colored title bar with an optional close button, a
 * white padded body, and a centered footer action row. Rendered in a portal
 * over a translucent black overlay. ESC and overlay clicks close it unless
 * disabled. box-shadow is used only here, on the overlay panel.
 */
export function Modal({
  open,
  onClose,
  title,
  tone = "primary",
  size = "md",
  footer,
  closeOnOverlay = true,
  closeOnEsc = true,
  hideCloseButton = false,
  children,
}: ModalProps) {
  const titleId = React.useId()

  React.useEffect(() => {
    if (!open || !closeOnEsc) return
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
    }
    document.addEventListener("keydown", onKeyDown)
    return () => document.removeEventListener("keydown", onKeyDown)
  }, [open, closeOnEsc, onClose])

  React.useEffect(() => {
    if (!open) return
    const prev = document.body.style.overflow
    document.body.style.overflow = "hidden"
    return () => {
      document.body.style.overflow = prev
    }
  }, [open])

  if (!open || typeof document === "undefined") return null

  return createPortal(
    <div
      className="fixed inset-0 z-[var(--z-modal)] flex items-center justify-center bg-[var(--color-overlay-scrim)] p-6"
      onMouseDown={(e) => {
        if (closeOnOverlay && e.target === e.currentTarget) onClose()
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="flex max-h-[calc(100vh-48px)] w-full flex-col overflow-hidden rounded-[var(--radius-lg)] bg-white [box-shadow:var(--shadow-pop)]"
        style={{ maxWidth: sizeWidth[size] }}
      >
        <div
          className={cn(
            "flex shrink-0 items-center justify-between gap-4 px-6 py-3.5",
            toneBar[tone],
          )}
        >
          <h2 id={titleId} className="text-lg font-bold">
            {title}
          </h2>
          {!hideCloseButton && (
            <button
              type="button"
              onClick={onClose}
              aria-label="닫기"
              className="inline-flex h-7 w-7 items-center justify-center rounded-[var(--radius)] text-current transition-colors hover:bg-[var(--overlay-white-15)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--overlay-white-70)]"
            >
              <X className="h-5 w-5" aria-hidden="true" />
            </button>
          )}
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto bg-white px-6 py-6">
          {children}
        </div>

        {footer != null && (
          <div className="flex shrink-0 items-center justify-center gap-2 border-t border-[var(--color-border)] px-6 py-4">
            {footer}
          </div>
        )}
      </div>
    </div>,
    document.body,
  )
}
