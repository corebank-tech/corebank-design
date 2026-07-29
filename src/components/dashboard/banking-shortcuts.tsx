import { ChevronRight } from "lucide-react"

export interface ShortcutLink {
  id: string
  label: string
  href: string
}

export interface BankingShortcutsProps {
  label?: string
  links: ShortcutLink[]
  onSelect?: (id: string) => void
}

const DEFAULT_LINKS: ShortcutLink[] = [
  { id: "products", label: "상품현황", href: "#" },
  { id: "limit", label: "이체한도", href: "#" },
  { id: "reservation", label: "예약이체", href: "#" },
  { id: "auto", label: "자동이체", href: "#" },
]

/** 업무 바로가기: primary-tint 띠 + 좌측 라벨 + 우측 카드형 링크. */
export function BankingShortcuts({
  label = "나의 뱅킹정보",
  links = DEFAULT_LINKS,
  onSelect,
}: BankingShortcutsProps) {
  return (
    <section
      aria-label="업무 바로가기"
      className="flex items-center gap-6 border border-[var(--color-border)] bg-primary-tint px-6 py-5"
    >
      <h2 className="shrink-0 text-base font-bold text-primary">{label}</h2>
      <ul className="grid flex-1 grid-cols-4 gap-3">
        {links.map((link) => (
          <li key={link.id}>
            <a
              href={link.href}
              onClick={(e) => {
                if (onSelect) {
                  e.preventDefault()
                  onSelect(link.id)
                }
              }}
              className="flex items-center justify-between border border-[var(--color-border)] bg-white px-4 py-3 text-sm font-bold text-ink transition-colors hover:border-primary hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              {link.label}
              <ChevronRight className="h-4 w-4 text-ink-faint" aria-hidden="true" />
            </a>
          </li>
        ))}
      </ul>
    </section>
  )
}
