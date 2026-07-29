"use client"

import * as React from "react"
import { PageShell } from "@/components/shell/page-shell"
import { LoginScreen } from "@/components/login-screen"
import { ReservationTransferForm } from "@/components/reservation-transfer-form"
import { cn } from "@/lib/utils"

type View = "login" | "dashboard"

export default function Page() {
  const [view, setView] = React.useState<View>("login")

  return (
    <>
      {/* Demo view switcher (not part of the design system) */}
      <div className="fixed bottom-4 left-1/2 z-[500] -translate-x-1/2">
        <div className="flex items-center gap-1 rounded-full border bg-white p-1 shadow-lg">
          {(
            [
              { id: "login", label: "로그인 (A-01)" },
              { id: "dashboard", label: "예약이체 등록" },
            ] as const
          ).map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setView(t.id)}
              className={cn(
                "rounded-full px-4 py-1.5 text-sm font-bold transition-colors",
                view === t.id
                  ? "bg-primary text-primary-foreground"
                  : "text-ink-muted hover:bg-surface",
              )}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {view === "login" ? (
        <PageShell activeId="user" bare customerName="홍길동">
          <LoginScreen />
        </PageShell>
      ) : (
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
      )}
    </>
  )
}
