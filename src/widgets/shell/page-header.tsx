import * as React from "react"
import { Star, Type, Printer } from "lucide-react"
import { cn } from "@/shared/lib/utils"

type PageHeaderProps = {
  title: React.ReactNode
  /** [텍스트 크기 조절] 클릭 시 호출. 생략 시 버튼은 비활성 표시된다. */
  onCycleTextScale?: () => void
  /** 현재 텍스트 확대가 적용된 상태인지(버튼 강조 표시용). */
  textScaleActive?: boolean
}

export function PageHeader({ title, onCycleTextScale, textScaleActive = false }: PageHeaderProps) {
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
        <button
          type="button"
          onClick={onCycleTextScale}
          aria-pressed={textScaleActive}
          className={cn(iconBtn, textScaleActive && "border-primary text-primary")}
          aria-label="텍스트 크기 조절"
        >
          <Type className="h-[18px] w-[18px]" aria-hidden="true" />
        </button>
        <button
          type="button"
          onClick={() => window.print()}
          className={iconBtn}
          aria-label="인쇄"
        >
          <Printer className="h-[18px] w-[18px]" aria-hidden="true" />
        </button>
      </div>
    </div>
  )
}
