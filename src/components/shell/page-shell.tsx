import * as React from "react"
import { UtilityBar } from "./utility-bar"
import { Gnb } from "./gnb"
import { BreadcrumbBar } from "./breadcrumb-bar"
import { FullMenuOverlay } from "./full-menu-overlay"
import { PageHeader } from "./page-header"
import { NoticeBox } from "./notice-box"
import { Footer } from "./footer"

export interface PageShellProps {
  activeId?: string
  breadcrumb?: string[]
  title?: React.ReactNode
  /** notice items rendered in a NoticeBox at the bottom of the content */
  notice?: React.ReactNode[]
  noticeTitle?: React.ReactNode
  customerName?: string
  /** hide breadcrumb + page header (e.g. login) */
  bare?: boolean
  children: React.ReactNode
}

export function PageShell({
  activeId,
  breadcrumb = ["개인", "이체", "예약이체", "예약이체 등록"],
  title,
  notice,
  noticeTitle,
  customerName = "홍길동",
  bare = false,
  children,
}: PageShellProps) {
  const [menuOpen, setMenuOpen] = React.useState(false)

  return (
    <div className="flex min-h-screen flex-col bg-surface-2">
      <header className="sticky top-0 z-[100]">
        <UtilityBar customerName={customerName} unreadCount={3} />
        <Gnb activeId={activeId} onOpenFullMenu={() => setMenuOpen(true)} />
        {!bare && (
          <BreadcrumbBar trail={breadcrumb} customerName={customerName} />
        )}
      </header>

      <FullMenuOverlay open={menuOpen} onClose={() => setMenuOpen(false)} />

      <main className="flex-1">
        <div className="mx-auto w-full max-w-[1280px] px-4 py-8">
          {!bare && title != null && <PageHeader title={title} />}
          {children}
          {notice && notice.length > 0 && (
            <div className="mt-8">
              <NoticeBox title={noticeTitle} items={notice} />
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  )
}
