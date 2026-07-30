import * as React from "react"
import { AppHeader } from "./app-header"
import { BreadcrumbBar } from "./breadcrumb-bar"
import { FullMenuOverlay } from "./full-menu-overlay"
import { PageHeader } from "./page-header"
import { NoticeBox } from "./notice-box"
import { Footer } from "./footer"
import { SideNav } from "./side-nav"
import { cn } from "@/shared/lib/utils"

export interface PageShellProps {
  activeId?: string
  breadcrumb?: string[]
  title?: React.ReactNode
  /** notice items rendered in a NoticeBox at the bottom of the content */
  notice?: React.ReactNode[]
  noticeTitle?: React.ReactNode
  customerName?: string
  /** REQ-CMN-005: 비로그인 상태면 헤더에 [로그인]만 노출. 기본 true */
  loggedIn?: boolean
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
  loggedIn = true,
  bare = false,
  children,
}: PageShellProps) {
  const [menuOpen, setMenuOpen] = React.useState(false)

  return (
    <div className="flex min-h-screen flex-col bg-surface-2">
      <AppHeader
        activeId={activeId}
        customerName={customerName}
        loggedIn={loggedIn}
        onOpenFullMenu={() => setMenuOpen(true)}
      />

      <FullMenuOverlay open={menuOpen} onClose={() => setMenuOpen(false)} />

      <main className="flex-1">
        <div className="mx-auto w-[1280px] px-4 py-10">
          {!bare && <BreadcrumbBar trail={breadcrumb} />}
          <div className="flex">
            {!bare && activeId && <SideNav activeId={activeId} />}
            <div className={cn("min-w-0 flex-1", !bare && activeId && "pl-6")}>
              {!bare && title != null && <PageHeader title={title} />}
              {children}
              {notice && notice.length > 0 && (
                <div className="mt-8">
                  <NoticeBox title={noticeTitle} items={notice} />
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
