import * as React from "react"
import { Link } from "react-router-dom"
import { Bell, Menu, Moon, Sun } from "lucide-react"
import { NAV } from "@/shared/config/nav"
import { cn } from "@/shared/lib/utils"
import { useTheme } from "@/shared/lib/theme"

type AppHeaderProps = {
  activeId?: string
  customerName?: string
  unreadCount?: number
  /** 세션 잔여시간(초). 상위(SessionProvider)가 1초 단위로 갱신해 전달한다. */
  remainingSeconds?: number
  /** REQ-CMN-005: 비로그인 상태면 [로그인]만 노출 */
  loggedIn?: boolean
  onExtend?: () => void
  onLogout?: () => void
  onOpenFullMenu?: () => void
  onOpenNotifications?: () => void
}

function formatSession(seconds: number) {
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`
}

/**
 * REQ-CMN-001/002/003/005 통합 헤더. utility-bar + gnb + breadcrumb-bar의
 * 유틸 영역을 병합한 흰 배경 sticky 헤더. hover 시 2뎁스 드롭다운을 노출한다.
 */
export function AppHeader({
  activeId,
  customerName = "홍길동",
  unreadCount = 0,
  remainingSeconds = 0,
  loggedIn = true,
  onExtend,
  onLogout,
  onOpenFullMenu,
  onOpenNotifications,
}: AppHeaderProps) {
  const [hoverId, setHoverId] = React.useState<string | null>(null)
  const closeTimer = React.useRef<ReturnType<typeof setTimeout> | null>(null)
  const { theme, toggleTheme } = useTheme()

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
    <header
      className="sticky top-0 z-[var(--z-header)] border-b border-[var(--color-border)] bg-surface-elevated"
      onMouseLeave={scheduleClose}
    >
      <div className="mx-auto flex h-[72px] w-[1280px] items-stretch justify-between px-4">
        <div className="flex items-stretch">
          <Link
            to="/"
            className="flex shrink-0 items-center pr-8 text-[20px] [font-weight:var(--weight-heading)] text-primary"
          >
            CoreBank
          </Link>
          <ul
            className={cn(
              "flex items-stretch gap-[28px]",
              !loggedIn && "hidden",
            )}
          >
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
                      "flex items-center text-[16px] transition-colors",
                      isActive
                        ? "-mb-px border-b-2 border-primary [font-weight:var(--weight-heading)] text-primary"
                        : "[font-weight:var(--weight-label)] text-ink-muted hover:text-primary",
                    )}
                  >
                    {cat.label}
                  </a>
                </li>
              )
            })}
          </ul>
        </div>

        <div className="flex shrink-0 items-center gap-4">
          <button
            type="button"
            onClick={toggleTheme}
            className="inline-flex h-9 w-9 items-center justify-center rounded-full text-ink-muted transition-colors hover:bg-[var(--color-primary-tint)] hover:text-primary focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
            aria-label={
              theme === "dark" ? "라이트 모드로 전환" : "다크 모드로 전환"
            }
            aria-pressed={theme === "dark"}
          >
            {theme === "dark" ? (
              <Sun className="h-5 w-5" aria-hidden="true" />
            ) : (
              <Moon className="h-5 w-5" aria-hidden="true" />
            )}
          </button>

          {loggedIn ? (
            <>
              <button
                type="button"
                onClick={onOpenNotifications}
                className="relative inline-flex h-9 w-9 items-center justify-center rounded-full text-ink-muted hover:bg-[var(--color-primary-tint)] hover:text-primary focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
                aria-label={`알림 ${unreadCount}건`}
              >
                <Bell className="h-5 w-5" aria-hidden="true" />
                {unreadCount > 0 && (
                  <span className="absolute top-0.5 right-0.5 inline-flex min-w-[16px] items-center justify-center rounded-full bg-[var(--color-danger)] px-1 text-[10px] leading-4 font-bold text-white">
                    {unreadCount > 99 ? "99+" : unreadCount}
                  </span>
                )}
              </button>

              <span className="text-sm text-ink">
                <span className="[font-weight:var(--weight-value)]">
                  {customerName}
                </span>{" "}
                님
              </span>

              <span
                className="text-sm text-ink-muted tabular-nums"
                aria-live="off"
              >
                {formatSession(remainingSeconds)}
              </span>

              <button
                type="button"
                onClick={onExtend}
                className="text-sm text-ink-muted transition-colors hover:text-primary focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
              >
                연장
              </button>
              <span
                className="text-[var(--color-border-strong)]"
                aria-hidden="true"
              >
                |
              </span>
              <button
                type="button"
                onClick={onLogout}
                className="text-sm text-ink-muted transition-colors hover:text-primary focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
              >
                로그아웃
              </button>

              <button
                type="button"
                onClick={onOpenFullMenu}
                onMouseEnter={scheduleClose}
                className="inline-flex h-9 w-9 items-center justify-center rounded-[var(--radius)] text-ink-muted transition-colors hover:bg-[var(--color-primary-tint)] hover:text-primary focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
                aria-label="전체메뉴 열기"
              >
                <Menu className="h-5 w-5" aria-hidden="true" />
              </button>
            </>
          ) : (
            <Link
              to="/"
              className="text-sm [font-weight:var(--weight-label)] text-ink-muted transition-colors hover:text-primary"
            >
              로그인
            </Link>
          )}
        </div>
      </div>

      {/* 2-depth hover dropdown */}
      {activeCategory && (
        <div
          className="absolute inset-x-0 top-[72px] z-[var(--z-dropdown)] bg-surface-elevated [box-shadow:var(--shadow-card)]"
          onMouseEnter={() => open(activeCategory.id)}
          onMouseLeave={scheduleClose}
        >
          <div className="mx-auto w-[1280px] px-4 py-6">
            <div className="grid grid-cols-4 gap-x-8 gap-y-6">
              {activeCategory.groups.map((group) => (
                <div key={group.title}>
                  <p className="mb-2 text-[14px] whitespace-nowrap text-ink-faint">
                    {group.title}
                  </p>
                  <ul className="flex flex-col gap-1.5">
                    {group.items.map((item) => (
                      <li key={`${item.screenId}-${item.path}`}>
                        <Link
                          to={item.path}
                          data-screen-id={item.screenId}
                          onClick={() => setHoverId(null)}
                          className="inline-block py-0.5 text-[16px] [font-weight:var(--weight-label)] whitespace-nowrap text-ink hover:text-primary hover:underline"
                        >
                          {item.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
