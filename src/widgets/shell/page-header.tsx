import * as React from "react"
import { Star, Type, Printer } from "lucide-react"
import { cn } from "@/shared/lib/utils"

export interface PageHeaderProps {
  title: React.ReactNode
}

export function PageHeader({ title }: PageHeaderProps) {
  const [favorite, setFavorite] = React.useState(false)

  const iconBtn =
    "inline-flex h-9 w-9 items-center justify-center rounded-[var(--radius)] border border-[var(--color-border)] bg-white text-ink-muted hover:bg-surface hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"

  return (
    <div className="mb-6 flex items-center justify-between gap-4">
      <h1 className="text-page font-bold text-ink text-balance">{title}</h1>
      <div className="flex shrink-0 items-center gap-1.5">
        <button
          type="button"
          onClick={() => setFavorite((v) => !v)}
          aria-pressed={favorite}
          className={cn(iconBtn, favorite && "border-primary text-primary")}
          aria-label={favorite ? "즐겨찾기 해제" : "즐겨찾기 추가"}
        >
          <Star
            className="h-[18px] w-[18px]"
            fill={favorite ? "currentColor" : "none"}
            aria-hidden="true"
          />
        </button>
        <button type="button" className={iconBtn} aria-label="텍스트 크기 조절">
          <Type className="h-[18px] w-[18px]" aria-hidden="true" />
        </button>
        <button type="button" className={iconBtn} aria-label="인쇄">
          <Printer className="h-[18px] w-[18px]" aria-hidden="true" />
        </button>
      </div>
    </div>
  )
}
