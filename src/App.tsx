import * as React from "react"
import { Routes, Route, Link, useLocation } from "react-router-dom"
import { PageShell } from "@/components/shell/page-shell"
import { LoginScreen } from "@/components/login-screen"
import { MainDashboard } from "@/components/dashboard/main-dashboard"
import { ReservationTransferForm } from "@/components/reservation-transfer-form"
import { TransactionInquiryScreen } from "@/components/transaction-inquiry-screen"
import { InstantTransferScreen } from "@/components/transfer/instant-transfer-screen"
import { InstantTransferResultDemo } from "@/components/transfer/instant-transfer/result-demo"
import { FeedbackDemo } from "@/components/feedback/feedback-demo"
import { cn } from "@/lib/utils"

const DEMO_ROUTES = [
  { path: "/", label: "로그인 (A-01)" },
  { path: "/dashboard", label: "메인 대시보드" },
  { path: "/transfer", label: "예약이체 등록" },
  { path: "/instant-transfer", label: "즉시이체 (D-01)" },
  { path: "/result", label: "이체결과 (D-03)" },
  { path: "/inquiry", label: "거래내역조회 (B-03)" },
  { path: "/dialogs", label: "공통 모달" },
] as const

function ThemeToggle() {
  const [theme, setTheme] = React.useState<"bank" | "card">("bank")

  React.useEffect(() => {
    const el = document.documentElement
    if (theme === "card") el.setAttribute("data-theme", "card")
    else el.removeAttribute("data-theme")
  }, [theme])

  return (
    <button
      type="button"
      onClick={() => setTheme((t) => (t === "bank" ? "card" : "bank"))}
      className="rounded-full border border-border px-4 py-1.5 text-sm font-bold text-ink-muted transition-colors hover:bg-surface"
    >
      테마: {theme === "bank" ? "은행" : "카드"}
    </button>
  )
}

function DemoSwitcher() {
  const location = useLocation()
  return (
    <div className="fixed bottom-4 left-1/2 z-[500] -translate-x-1/2">
      <div className="flex items-center gap-1 rounded-full border bg-white p-1 shadow-lg">
        {DEMO_ROUTES.map((r) => (
          <Link
            key={r.path}
            to={r.path}
            className={cn(
              "rounded-full px-4 py-1.5 text-sm font-bold transition-colors",
              location.pathname === r.path
                ? "bg-primary text-primary-foreground"
                : "text-ink-muted hover:bg-surface",
            )}
          >
            {r.label}
          </Link>
        ))}
        <span className="mx-1 h-5 w-px bg-border" aria-hidden />
        <ThemeToggle />
      </div>
    </div>
  )
}

export default function App() {
  return (
    <>
      {/* Demo view switcher (not part of the design system) */}
      <DemoSwitcher />

      <Routes>
        <Route
          path="/"
          element={
            <PageShell activeId="user" bare loggedIn={false}>
              <LoginScreen />
            </PageShell>
          }
        />
        <Route
          path="/dashboard"
          element={
            <PageShell
              activeId="user"
              breadcrumb={["개인", "메인", "대시보드"]}
              title="메인 대시보드"
              customerName="홍길동"
            >
              <MainDashboard customerName="홍길동" />
            </PageShell>
          }
        />
        <Route
          path="/inquiry"
          element={
            <PageShell
              activeId="inquiry"
              breadcrumb={["개인", "조회", "예금", "거래내역조회"]}
              title="거래내역조회"
              customerName="홍길동"
              notice={[
                "거래내역은 최근 1년 이내의 범위에서 조회할 수 있습니다.",
                "조회 기준일시 이후 발생한 거래는 다음 조회 시 반영됩니다.",
                "실제 잔액은 미결제 거래 처리 상태에 따라 달라질 수 있습니다.",
              ]}
            >
              <TransactionInquiryScreen />
            </PageShell>
          }
        />
        <Route
          path="/instant-transfer"
          element={
            <PageShell
              activeId="transfer"
              breadcrumb={["개인", "이체", "당행이체", "즉시이체"]}
              customerName="홍길동"
            >
              <InstantTransferScreen />
            </PageShell>
          }
        />
        <Route
          path="/result"
          element={
            <PageShell
              activeId="transfer"
              breadcrumb={["개인", "이체", "당행이체", "즉시이체"]}
              customerName="홍길동"
            >
              <InstantTransferResultDemo />
            </PageShell>
          }
        />
        <Route
          path="/dialogs"
          element={
            <PageShell
              activeId="user"
              breadcrumb={["개인", "공통", "안내 모달"]}
              title="공통 모달"
              customerName="홍길동"
            >
              <FeedbackDemo />
            </PageShell>
          }
        />
        <Route
          path="/transfer"
          element={
            <PageShell
              activeId="transfer"
              breadcrumb={["개인", "이체", "예약이체", "예약이체 등록"]}
              title="예약이체 등록"
              customerName="홍길동"
              notice={[
                "예약이체는 지정하신 날짜의 영업시간 개시 후 순차적으로 처리됩니다.",
                "출금계좌 잔액이 부족한 경우 예약이체는 자동으로 취소되며, 별도 안내되지 않습니다.",
                "예약이체 취소·변경은 처리 예정일 전 영업일 23시 30분까지 가능합니다.",
                "1일 이체한도 및 1회 이체한도를 초과하는 금액은 예약할 수 없습니다.",
              ]}
            >
              <ReservationTransferForm />
            </PageShell>
          }
        />
      </Routes>
    </>
  )
}
