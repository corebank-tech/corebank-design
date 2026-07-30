import * as React from "react"
import { Routes, Route, Link, useLocation } from "react-router-dom"
import { PageShell } from "@/components/shell/page-shell"
import { EmptyState } from "@/components/query/empty-state"
import { LoginScreen } from "@/components/login-screen"
import { MainDashboard } from "@/components/dashboard/main-dashboard"
import { TransactionInquiryScreen } from "@/components/transaction-inquiry-screen"
import { InstantTransferScreen } from "@/components/transfer/instant-transfer-screen"
import { InstantTransferResultDemo } from "@/components/transfer/instant-transfer/result-demo"
import { ReservedTransferScreen } from "@/components/transfer/reserved-transfer-screen"
import { AutoTransferScreen } from "@/components/transfer/auto-transfer-screen"
import { FeedbackDemo } from "@/components/feedback/feedback-demo"
import { B01AllAccounts } from "@/components/inquiry/B01-AllAccounts"
import { B02DepositAccounts } from "@/components/inquiry/B02-DepositAccounts"
import { D04TransferHistory } from "@/components/inquiry/D04-TransferHistory"
import { E04ReservationList } from "@/components/inquiry/E04-ReservationList"
import { E05ReservationResults } from "@/components/inquiry/E05-ReservationResults"
import { G04AutoTransferList } from "@/components/inquiry/G04-AutoTransferList"
import { G05AutoTransferResults } from "@/components/inquiry/G05-AutoTransferResults"
import { F02NotificationInbox } from "@/components/inquiry/F02-NotificationInbox"
import { B04AccountPassword } from "@/components/account/B04-AccountPassword"
import { B05WithdrawAccounts } from "@/components/account/B05-WithdrawAccounts"
import { B06AccountAlias } from "@/components/account/B06-AccountAlias"
import { B07AccountOrder } from "@/components/account/B07-AccountOrder"
import { cn } from "@/lib/utils"

/**
 * 아직 화면이 구현되지 않은 경로용 플레이스홀더 정의.
 * breadcrumb 은 docs/requirements.md §1 화면목록의 '경로(메뉴)' 열과 일치시킨다(REQ-CMN-004).
 */
interface PlaceholderRoute {
  path: string
  screenId: string
  title: string
  breadcrumb: string[]
  activeId?: string
  loggedIn?: boolean
}

const PLACEHOLDER_ROUTES: PlaceholderRoute[] = [
  // A — 공통(로그인/회원가입)
  { path: "/signup/1", screenId: "A-02", title: "회원가입 1단계 - 약관동의", breadcrumb: ["홈", "로그인", "회원가입"], loggedIn: false },
  { path: "/signup/2", screenId: "A-03", title: "회원가입 2단계 - 본인확인", breadcrumb: ["홈", "로그인", "회원가입"], loggedIn: false },
  { path: "/signup/3", screenId: "A-04", title: "회원가입 3단계 - 정보입력", breadcrumb: ["홈", "로그인", "회원가입"], loggedIn: false },
  { path: "/signup/4", screenId: "A-05", title: "회원가입 4단계 - 입력확인", breadcrumb: ["홈", "로그인", "회원가입"], loggedIn: false },
  { path: "/signup/5", screenId: "A-06", title: "회원가입 5단계 - 가입완료", breadcrumb: ["홈", "로그인", "회원가입"], loggedIn: false },
  { path: "/find-id", screenId: "A-07", title: "아이디 찾기", breadcrumb: ["홈", "로그인", "아이디 찾기"], loggedIn: false },
  { path: "/reset-password", screenId: "A-08", title: "비밀번호 재설정", breadcrumb: ["홈", "로그인", "비밀번호 재설정"], loggedIn: false },
  { path: "/logout", screenId: "A-10", title: "로그아웃 완료", breadcrumb: ["홈", "로그아웃"], loggedIn: false },

  // C — 수신(금융상품)
  { path: "/products", screenId: "C-01", title: "상품몰 - 상품목록", breadcrumb: ["금융상품", "예금·적금", "상품목록"], activeId: "product" },
  { path: "/products/:productId", screenId: "C-02", title: "상품 상세", breadcrumb: ["금융상품", "예금·적금", "상품상세"], activeId: "product" },
  { path: "/product/:productId/join/1", screenId: "C-03", title: "상품가입 1단계 - 약관동의", breadcrumb: ["금융상품", "가입"], activeId: "product" },
  { path: "/product/:productId/join/2", screenId: "C-04", title: "상품가입 2단계 - 정보입력", breadcrumb: ["금융상품", "가입"], activeId: "product" },
  { path: "/product/:productId/join/3", screenId: "C-05", title: "상품가입 3단계 - 확인/인증", breadcrumb: ["금융상품", "가입"], activeId: "product" },
  { path: "/product/:productId/join/4", screenId: "C-06", title: "상품가입 4단계 - 완료", breadcrumb: ["금융상품", "가입"], activeId: "product" },

  // D — 이체(즉시이체)
  { path: "/user/transfer-limit", screenId: "D-05", title: "이체한도 조회/변경", breadcrumb: ["사용자관리", "이체한도관리"], activeId: "user" },

  // F — 공통(마이페이지)
  { path: "/user/profile", screenId: "F-01", title: "고객정보 조회/변경", breadcrumb: ["사용자관리", "고객정보관리"], activeId: "user" },
  { path: "/user/password", screenId: "F-01", title: "고객정보 조회/변경", breadcrumb: ["사용자관리", "고객정보관리"], activeId: "user" },
]

/** 개발용 라우트 목록 — 파트(A~G)별 화면ID 그룹. 디자인 시스템에 포함되지 않는다. */
interface DevRoute {
  screenId: string
  label: string
  path: string
}

const DEV_ROUTES: DevRoute[] = [
  { screenId: "A-01", label: "로그인", path: "/" },
  { screenId: "A-02", label: "회원가입 1단계", path: "/signup/1" },
  { screenId: "A-03", label: "회원가입 2단계", path: "/signup/2" },
  { screenId: "A-04", label: "회원가입 3단계", path: "/signup/3" },
  { screenId: "A-05", label: "회원가입 4단계", path: "/signup/4" },
  { screenId: "A-06", label: "회원가입 5단계", path: "/signup/5" },
  { screenId: "A-07", label: "아이디 찾기", path: "/find-id" },
  { screenId: "A-08", label: "비밀번호 재설정", path: "/reset-password" },
  { screenId: "A-09", label: "메인 대시보드", path: "/dashboard" },
  { screenId: "A-10", label: "로그아웃 완료", path: "/logout" },
  { screenId: "A-91~93", label: "공통 모달", path: "/dialogs" },

  { screenId: "B-01", label: "전체계좌조회", path: "/accounts" },
  { screenId: "B-02", label: "예금/적금 계좌조회", path: "/accounts/deposits" },
  { screenId: "B-03", label: "거래내역조회", path: "/inquiry" },
  { screenId: "B-04", label: "계좌비밀번호 변경", path: "/user/accounts/password" },
  { screenId: "B-05", label: "출금계좌관리", path: "/user/accounts/withdrawal" },
  { screenId: "B-06", label: "계좌별명 관리", path: "/user/accounts/alias" },
  { screenId: "B-07", label: "계좌순서 변경", path: "/user/accounts/order" },

  { screenId: "C-01", label: "상품목록", path: "/products" },
  { screenId: "C-02", label: "상품상세", path: "/products/P001" },
  { screenId: "C-03", label: "상품가입 1단계", path: "/product/P001/join/1" },
  { screenId: "C-04", label: "상품가입 2단계", path: "/product/P001/join/2" },
  { screenId: "C-05", label: "상품가입 3단계", path: "/product/P001/join/3" },
  { screenId: "C-06", label: "상품가입 4단계", path: "/product/P001/join/4" },

  { screenId: "D-01", label: "즉시이체", path: "/instant-transfer" },
  { screenId: "D-03", label: "즉시이체 결과(데모)", path: "/result" },
  { screenId: "D-04", label: "이체결과조회", path: "/transfer/history" },
  { screenId: "D-05", label: "이체한도 조회/변경", path: "/user/transfer-limit" },

  { screenId: "E-01", label: "예약이체 등록", path: "/transfer/reservation/new" },
  { screenId: "E-04", label: "예약이체 조회/취소", path: "/transfer/reservation" },
  { screenId: "E-05", label: "예약이체 처리결과 조회", path: "/transfer/reservation/history" },

  { screenId: "F-01", label: "고객정보 관리", path: "/user/profile" },
  { screenId: "F-01", label: "비밀번호 변경", path: "/user/password" },
  { screenId: "F-02", label: "알림함", path: "/notifications" },

  { screenId: "G-01", label: "자동이체 등록", path: "/transfer/auto/new" },
  { screenId: "G-04", label: "자동이체 조회/변경/해지", path: "/transfer/auto" },
  { screenId: "G-05", label: "자동이체 결과조회", path: "/transfer/auto/history" },
]

const DEV_PARTS = ["A", "B", "C", "D", "E", "F", "G"] as const

function DevNav() {
  const location = useLocation()
  const [open, setOpen] = React.useState(false)

  return (
    <div className="fixed bottom-4 right-4 z-[500]">
      {open && (
        <div className="mb-2 max-h-[70vh] w-[720px] overflow-y-auto rounded-lg border bg-white p-4 shadow-lg">
          <div className="grid grid-cols-4 gap-x-6 gap-y-4">
            {DEV_PARTS.map((part) => {
              const routes = DEV_ROUTES.filter((r) => r.screenId.startsWith(part))
              if (routes.length === 0) return null
              return (
                <div key={part}>
                  <p className="mb-1.5 text-[13px] font-bold text-ink-faint">
                    {part}
                  </p>
                  <ul className="flex flex-col gap-1">
                    {routes.map((r) => (
                      <li key={`${r.screenId}-${r.path}`}>
                        <Link
                          to={r.path}
                          onClick={() => setOpen(false)}
                          className={cn(
                            "block text-[13px] leading-snug",
                            location.pathname === r.path
                              ? "font-bold text-primary"
                              : "text-ink-muted hover:text-primary",
                          )}
                        >
                          {r.screenId} {r.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              )
            })}
          </div>
        </div>
      )}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="rounded-full border bg-white px-4 py-1.5 text-sm font-bold text-ink-muted shadow-lg hover:bg-surface"
      >
        개발 메뉴
      </button>
    </div>
  )
}

export default function App() {
  return (
    <>
      {/* Dev-only route switcher (not part of the design system) */}
      <DevNav />

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
          path="/transfer/reservation/new"
          element={
            <PageShell
              activeId="transfer"
              breadcrumb={["이체", "예약이체", "예약이체 등록"]}
              customerName="홍길동"
            >
              <ReservedTransferScreen />
            </PageShell>
          }
        />
        <Route
          path="/transfer/auto/new"
          element={
            <PageShell
              activeId="transfer"
              breadcrumb={["이체", "자동이체", "자동이체 등록"]}
              customerName="홍길동"
            >
              <AutoTransferScreen />
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
          path="/accounts"
          element={
            <PageShell
              activeId="inquiry"
              breadcrumb={["조회", "계좌조회", "전체계좌"]}
              title="전체계좌조회"
              customerName="홍길동"
            >
              <B01AllAccounts />
            </PageShell>
          }
        />
        <Route
          path="/accounts/deposits"
          element={
            <PageShell
              activeId="inquiry"
              breadcrumb={["조회", "계좌조회", "예금·적금"]}
              title="예금/적금 계좌조회"
              customerName="홍길동"
            >
              <B02DepositAccounts />
            </PageShell>
          }
        />
        <Route
          path="/transfer/history"
          element={
            <PageShell
              activeId="transfer"
              breadcrumb={["이체", "즉시이체", "이체결과조회"]}
              title="이체결과조회"
              customerName="홍길동"
            >
              <D04TransferHistory />
            </PageShell>
          }
        />
        <Route
          path="/transfer/reservation"
          element={
            <PageShell
              activeId="transfer"
              breadcrumb={["이체", "예약이체", "예약이체등록 조회·취소"]}
              title="예약이체 조회/취소"
              customerName="홍길동"
            >
              <E04ReservationList />
            </PageShell>
          }
        />
        <Route
          path="/transfer/reservation/history"
          element={
            <PageShell
              activeId="transfer"
              breadcrumb={["이체", "예약이체", "예약이체 처리결과 조회"]}
              title="예약이체 처리결과 조회"
              customerName="홍길동"
            >
              <E05ReservationResults />
            </PageShell>
          }
        />
        <Route
          path="/transfer/auto"
          element={
            <PageShell
              activeId="transfer"
              breadcrumb={["이체", "자동이체", "자동이체 조회·변경·해지"]}
              title="자동이체 조회/변경/해지"
              customerName="홍길동"
            >
              <G04AutoTransferList />
            </PageShell>
          }
        />
        <Route
          path="/transfer/auto/history"
          element={
            <PageShell
              activeId="transfer"
              breadcrumb={["이체", "자동이체", "자동이체결과 조회"]}
              title="자동이체 결과조회"
              customerName="홍길동"
            >
              <G05AutoTransferResults />
            </PageShell>
          }
        />
        <Route
          path="/user/accounts/password"
          element={
            <PageShell
              activeId="user"
              breadcrumb={["사용자관리", "계좌관리", "계좌비밀번호"]}
              title="계좌비밀번호 변경"
              customerName="홍길동"
            >
              <B04AccountPassword />
            </PageShell>
          }
        />
        <Route
          path="/user/accounts/withdrawal"
          element={
            <PageShell
              activeId="user"
              breadcrumb={["사용자관리", "계좌관리", "출금계좌관리"]}
              title="출금계좌관리"
              customerName="홍길동"
            >
              <B05WithdrawAccounts />
            </PageShell>
          }
        />
        <Route
          path="/user/accounts/alias"
          element={
            <PageShell
              activeId="user"
              breadcrumb={["사용자관리", "계좌관리", "계좌별명관리"]}
              title="계좌별명 관리"
              customerName="홍길동"
            >
              <B06AccountAlias />
            </PageShell>
          }
        />
        <Route
          path="/user/accounts/order"
          element={
            <PageShell
              activeId="user"
              breadcrumb={["사용자관리", "계좌관리", "계좌순서변경"]}
              title="계좌순서 변경"
              customerName="홍길동"
            >
              <B07AccountOrder />
            </PageShell>
          }
        />
        <Route
          path="/notifications"
          element={
            <PageShell
              breadcrumb={["헤더", "알림"]}
              title="알림함"
              customerName="홍길동"
            >
              <F02NotificationInbox />
            </PageShell>
          }
        />

        {PLACEHOLDER_ROUTES.map((r) => (
          <Route
            key={`${r.screenId}-${r.path}`}
            path={r.path}
            element={
              <PageShell
                activeId={r.activeId}
                breadcrumb={r.breadcrumb}
                title={r.title}
                customerName="홍길동"
                loggedIn={r.loggedIn ?? true}
              >
                <EmptyState
                  message="준비 중인 화면입니다."
                  description={`화면ID: ${r.screenId}`}
                />
              </PageShell>
            }
          />
        ))}
      </Routes>
    </>
  )
}
