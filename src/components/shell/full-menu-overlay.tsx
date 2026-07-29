import * as React from "react"
import { X } from "lucide-react"
import { NAV } from "@/lib/nav"

export interface FullMenuOverlayProps {
  open: boolean
  onClose: () => void
}

export function FullMenuOverlay({ open, onClose }: FullMenuOverlayProps) {
  React.useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
    }
    document.addEventListener("keydown", onKey)
    document.body.style.overflow = "hidden"
    return () => {
      document.removeEventListener("keydown", onKey)
      document.body.style.overflow = ""
    }
  }, [open, onClose])

  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-[300]"
      role="dialog"
      aria-modal="true"
      aria-label="전체메뉴"
    >
      <div
        className="absolute inset-0 bg-ink/50"
        onClick={onClose}
        aria-hidden="true"
      />
      <div className="absolute inset-x-0 top-0 bg-white shadow-lg">
        <div className="mx-auto max-w-[1280px] px-4">
          <div className="flex h-12 items-center justify-between">
            <span className="text-[20px] font-black text-primary">
              전체메뉴
            </span>
            <button
              type="button"
              onClick={onClose}
              className="inline-flex h-9 w-9 items-center justify-center rounded-full text-ink-muted hover:bg-surface hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              aria-label="전체메뉴 닫기"
            >
              <X className="h-5 w-5" aria-hidden="true" />
            </button>
          </div>

          <div className="grid grid-cols-4 gap-6 border-t py-8">
            {NAV.map((cat) => (
              <div key={cat.id}>
                <h3 className="mb-3 border-b-2 border-primary pb-2 text-lg font-bold text-primary">
                  {cat.label}
                </h3>
                <div className="flex flex-col gap-4">
                  {cat.groups.map((group) => (
                    <div key={group.title}>
                      <p className="mb-1 text-xs font-bold text-ink-faint">
                        {group.title}
                      </p>
                      <ul className="flex flex-col gap-1">
                        {group.items.map((item) => (
                          <li key={item.screenId}>
                            <a
                              href="#"
                              data-screen-id={item.screenId}
                              className="inline-block py-0.5 text-sm text-ink-muted hover:text-primary hover:underline"
                            >
                              {item.label}
                            </a>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
