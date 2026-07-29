"use client"

import * as React from "react"
import { Menu } from "lucide-react"
import { NAV } from "@/lib/nav"
import { cn } from "@/lib/utils"

export interface GnbProps {
  activeId?: string
  onOpenFullMenu?: () => void
}

export function Gnb({ activeId, onOpenFullMenu }: GnbProps) {
  const [hoverId, setHoverId] = React.useState<string | null>(null)
  const closeTimer = React.useRef<ReturnType<typeof setTimeout> | null>(null)

  const open = (id: string) => {
    if (closeTimer.current) clearTimeout(closeTimer.current)
    setHoverId(id)
  }
  const scheduleClose = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current)
    closeTimer.current = setTimeout(() => setHoverId(null), 120)
  }

  const activeCategory = NAV.find((c) => c.id === hoverId)

  return (
    <nav
      className="relative z-[100] bg-primary"
      aria-label="주 메뉴"
      onMouseLeave={scheduleClose}
    >
      <div className="mx-auto flex h-12 max-w-[1200px] items-stretch px-4">
        <ul className="flex flex-1 items-stretch">
          {NAV.map((cat) => {
            const isActive = cat.id === activeId
            return (
              <li key={cat.id} className="flex items-stretch">
                <a
                  href="#"
                  onMouseEnter={() => open(cat.id)}
                  onFocus={() => open(cat.id)}
                  aria-current={isActive ? "page" : undefined}
                  className={cn(
                    "flex h-full items-center px-6 text-[15px] font-bold transition-colors",
                    isActive
                      ? "bg-white text-primary"
                      : "text-white hover:bg-white/12",
                    hoverId === cat.id && !isActive && "bg-white/12",
                  )}
                >
                  {cat.label}
                </a>
              </li>
            )
          })}
        </ul>
        <button
          type="button"
          onClick={onOpenFullMenu}
          onMouseEnter={scheduleClose}
          className="flex w-12 shrink-0 items-center justify-center bg-accent text-white transition-colors hover:bg-[var(--color-accent-hover)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-inset"
          aria-label="전체메뉴 열기"
        >
          <Menu className="h-6 w-6" aria-hidden="true" />
        </button>
      </div>

      {/* 2-depth dropdown panel */}
      {activeCategory && (
        <div
          className="absolute inset-x-0 top-12 z-[200] border-b border-[var(--color-border)] bg-white shadow-[0_8px_20px_-8px_rgba(27,36,48,0.25)]"
          onMouseEnter={() => open(activeCategory.id)}
          onMouseLeave={scheduleClose}
        >
          <div className="mx-auto max-w-[1200px] px-4 py-6">
            <div className="grid grid-cols-2 gap-x-8 gap-y-6 md:grid-cols-3">
              {activeCategory.groups.map((group) => (
                <div key={group.title}>
                  <p className="mb-2 border-b border-primary/20 pb-1 text-sm font-bold text-primary">
                    {group.title}
                  </p>
                  <ul className="flex flex-col gap-1.5">
                    {group.items.map((item) => (
                      <li key={item}>
                        <a
                          href="#"
                          className="inline-block py-0.5 text-sm text-ink-muted hover:text-primary hover:underline"
                        >
                          {item}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </nav>
  )
}
