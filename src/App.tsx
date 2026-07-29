import { Routes, Route, Link, useLocation } from "react-router-dom"
import { PageShell } from "@/components/shell/page-shell"
import { LoginScreen } from "@/components/login-screen"
import { ReservationTransferForm } from "@/components/reservation-transfer-form"
import { cn } from "@/lib/utils"

const DEMO_ROUTES = [
  { path: "/", label: "로그인 (A-01)" },
  { path: "/transfer", label: "예약이체 등록" },
] as const

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
            <PageShell activeId="user" bare customerName="홍길동">
              <LoginScreen />
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
