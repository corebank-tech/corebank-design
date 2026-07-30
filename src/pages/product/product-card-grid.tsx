import * as React from "react"
import { Badge } from "@/shared/ui/badge"
import { Button } from "@/shared/ui/button"
import { Select } from "@/shared/ui/select"
import { EmptyState } from "@/shared/ui/empty-state"
import { formatAmount } from "@/shared/lib/format"
import { cn } from "@/shared/lib/utils"
import type { ProductCard, ProductCategory } from "@/entities/product"

type CategoryFilter = "전체" | ProductCategory
type SortKey = "rate" | "latest"

type ProductCardGridProps = {
  products: ProductCard[]
  onViewDetail?: (id: string) => void
  onJoin?: (id: string) => void
}

const FILTERS: CategoryFilter[] = ["전체", "정기예금", "정기적금"]

/** 상품목록 화면(C-01). 필터·정렬 상태만 내부에서 관리한다. */
export function ProductCardGrid({
  products,
  onViewDetail,
  onJoin,
}: ProductCardGridProps) {
  const [filter, setFilter] = React.useState<CategoryFilter>("전체")
  const [sort, setSort] = React.useState<SortKey>("rate")

  const visible = React.useMemo(() => {
    const filtered =
      filter === "전체"
        ? products
        : products.filter((p) => p.category === filter)
    return [...filtered].sort((a, b) => {
      if (sort === "rate") return b.maxRate - a.maxRate
      return b.updatedAt.localeCompare(a.updatedAt)
    })
  }, [products, filter, sort])

  return (
    <div>
      {/* 필터 칩 + 정렬 */}
      <div className="mb-5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          {FILTERS.map((f) => {
            const active = filter === f
            return (
              <button
                key={f}
                type="button"
                onClick={() => setFilter(f)}
                aria-pressed={active}
                className={cn(
                  "h-9 rounded-[var(--radius-pill)] border px-4 text-sm font-bold transition-colors",
                  active
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-[var(--color-border-strong)] bg-white text-ink-muted hover:bg-surface",
                )}
              >
                {f}
              </button>
            )
          })}
        </div>
        <div className="w-40">
          <Select
            value={sort}
            onChange={(e) => setSort(e.target.value as SortKey)}
            aria-label="정렬 기준"
          >
            <option value="rate">금리순</option>
            <option value="latest">최신순</option>
          </Select>
        </div>
      </div>

      {visible.length === 0 ? (
        <EmptyState
          message="조회된 상품이 없습니다."
          description="다른 상품 유형을 선택해 다시 확인해 주세요."
        />
      ) : (
        <div className="grid grid-cols-3 gap-4">
          {visible.map((p) => (
            <article
              key={p.id}
              className="flex flex-col overflow-hidden rounded-[var(--radius-lg)] bg-white p-5 [box-shadow:var(--shadow-card)]"
            >
              <div className="mb-3">
                <Badge variant={p.category === "정기예금" ? "primary" : "success"}>
                  {p.category}
                </Badge>
              </div>

              <h3 className="text-lg font-bold text-ink">{p.name}</h3>
              <p className="mt-1 text-sm leading-relaxed text-ink-muted">
                {p.summary}
              </p>

              <div className="mt-5 flex items-baseline gap-1">
                <span className="text-[32px] font-bold leading-none tabular-nums text-primary">
                  {p.maxRate.toFixed(2)}
                </span>
                <span className="text-lg font-bold text-primary">%</span>
                <span className="ml-1 text-xs text-ink-faint">(연, 세전)</span>
              </div>
              <p className="mt-1 text-xs text-ink-faint">
                최고 금리 <span className="tabular-nums">(기본금리 {p.baseRate.toFixed(2)}%)</span>
              </p>

              <dl className="mt-5 flex flex-col gap-2 border-t border-[var(--color-border)] pt-4 text-sm">
                <div className="flex items-center justify-between">
                  <dt className="text-ink-muted">가입기간</dt>
                  <dd className="font-bold text-ink">{p.period}</dd>
                </div>
                <div className="flex items-center justify-between">
                  <dt className="text-ink-muted">최소금액</dt>
                  <dd className="font-bold tabular-nums text-ink">
                    {formatAmount(p.minAmount)}
                  </dd>
                </div>
                <div className="flex items-center justify-between">
                  <dt className="text-ink-muted">최대금액</dt>
                  <dd className="font-bold tabular-nums text-ink">
                    {formatAmount(p.maxAmount)}
                  </dd>
                </div>
              </dl>

              <div className="mt-5 flex gap-2">
                <Button
                  variant="outline"
                  fullWidth
                  onClick={() => onViewDetail?.(p.id)}
                >
                  상세보기
                </Button>
                <Button fullWidth onClick={() => onJoin?.(p.id)}>
                  가입하기
                </Button>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  )
}
