"use client"

import * as React from "react"
import { ChevronRight } from "lucide-react"

export interface BreadcrumbBarProps {
  trail?: string[]
  customerName?: string
  /** session length in seconds */
  sessionSeconds?: number
  onExtend?: () => void
  onLogout?: () => void
}

function format(seconds: number) {
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`
}

export function BreadcrumbBar({
  trail = ["개인", "이체", "예약이체", "예약이체 등록"],
  customerName = "홍길동",
  sessionSeconds = 568,
  onExtend,
  onLogout,
}: BreadcrumbBarProps) {
  const [remaining, setRemaining] = React.useState(sessionSeconds)

  React.useEffect(() => {
    const id = setInterval(() => {
      setRemaining((r) => (r > 0 ? r - 1 : 0))
    }, 1000)
    return () => clearInterval(id)
  }, [])

  const handleExtend = () => {
    setRemaining(sessionSeconds)
    onExtend?.()
  }

  return (
    <div className="bg-[var(--color-primary-soft)]">
      <div className="mx-auto flex h-10 max-w-[1200px] items-center justify-between gap-4 px-4">
        <nav aria-label="현재 위치" className="min-w-0">
          <ol className="flex items-center gap-1 text-[13px] text-white/85">
            {trail.map((crumb, i) => {
              const last = i === trail.length - 1
              return (
                <li key={`${crumb}-${i}`} className="flex items-center gap-1">
                  {i > 0 && (
                    <ChevronRight
                      className="h-3.5 w-3.5 text-white/60"
                      aria-hidden="true"
                    />
                  )}
                  <span className={last ? "font-bold text-white" : ""}>
                    {crumb}
                  </span>
                </li>
              )
            })}
          </ol>
        </nav>

        <div className="flex shrink-0 items-center gap-2 text-[13px] text-white/90">
          <span className="font-bold text-white">{customerName} 님</span>
          <span className="text-white/50">|</span>
          <span
            className="tabular-nums font-bold text-white"
            aria-live="off"
          >
            {format(remaining)}
          </span>
          <button
            type="button"
            onClick={handleExtend}
            className="underline underline-offset-2 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
          >
            연장
          </button>
          <span className="text-white/50">|</span>
          <button
            type="button"
            onClick={onLogout}
            className="underline underline-offset-2 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
          >
            로그아웃
          </button>
        </div>
      </div>
    </div>
  )
}
