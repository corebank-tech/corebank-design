"use client"

import { Bell } from "lucide-react"

export interface UtilityBarProps {
  customerName?: string
  unreadCount?: number
}

export function UtilityBar({
  customerName = "홍길동",
  unreadCount = 3,
}: UtilityBarProps) {
  return (
    <div className="h-12 border-b bg-white">
      <div className="mx-auto flex h-full max-w-[1200px] items-center justify-between px-4">
        <a
          href="#"
          className="text-[20px] font-black tracking-tight text-primary"
        >
          Core<span className="text-accent">Bank</span>
        </a>
        <div className="flex items-center gap-4">
          <button
            type="button"
            className="relative inline-flex h-8 w-8 items-center justify-center rounded-full text-ink-muted hover:bg-surface hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            aria-label={`알림 ${unreadCount}건`}
          >
            <Bell className="h-5 w-5" aria-hidden="true" />
            {unreadCount > 0 && (
              <span className="absolute right-0.5 top-0.5 inline-flex min-w-[16px] items-center justify-center rounded-full bg-[var(--color-danger)] px-1 text-[10px] font-bold leading-4 text-white">
                {unreadCount > 99 ? "99+" : unreadCount}
              </span>
            )}
          </button>
          <span className="text-sm text-ink">
            <span className="font-bold text-ink">{customerName}</span> 님
          </span>
        </div>
      </div>
    </div>
  )
}
