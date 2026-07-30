import { Link, useLocation } from "react-router-dom"
import { NAV } from "@/lib/nav"
import { cn } from "@/shared/lib/utils"

export interface SideNavProps {
  /** Current top-level NAV category id, e.g. "inquiry". */
  activeId: string
}

/**
 * Section-local left navigation. Shows the sub-menu tree for the current
 * top-level category (AppHeader's hover mega-menu switches between
 * categories; this switches between screens within one category).
 */
export function SideNav({ activeId }: SideNavProps) {
  const category = NAV.find((c) => c.id === activeId)
  const { pathname } = useLocation()

  if (!category) return null

  return (
    <nav
      className="sticky top-[88px] flex w-[200px] shrink-0 flex-col gap-5 self-start border-r border-[var(--color-border)] pr-6"
      aria-label={`${category.label} 메뉴`}
    >
      <h2 className="text-h3 font-bold text-ink">{category.label}</h2>
      {category.groups.map((group) => (
        <div key={group.title} className="flex flex-col gap-1">
          <p className="text-xs text-ink-faint">{group.title}</p>
          <ul className="flex flex-col gap-0.5">
            {group.items.map((item) => {
              const active = pathname === item.path
              return (
                <li key={`${item.screenId}-${item.path}`}>
                  <Link
                    to={item.path}
                    data-screen-id={item.screenId}
                    className={cn(
                      "block whitespace-nowrap px-2 py-1.5 text-sm transition-colors",
                      active
                        ? "bg-primary-tint font-bold text-primary"
                        : "text-ink-muted hover:bg-surface hover:text-ink",
                    )}
                  >
                    {item.label}
                  </Link>
                </li>
              )
            })}
          </ul>
        </div>
      ))}
    </nav>
  )
}
