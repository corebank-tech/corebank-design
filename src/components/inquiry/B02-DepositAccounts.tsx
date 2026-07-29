import * as React from "react"
import { useNavigate } from "react-router-dom"
import { ChevronDown } from "lucide-react"
import { NoticeBox, NoticeBoxFooter } from "@/components/shell/notice-box"
import { FormSection } from "@/components/ui/form-section"
import { Button } from "@/components/ui/button"
import { DataGrid, type DataGridColumn } from "@/components/query/data-grid"
import { SummaryRow } from "@/components/query/summary-row"
import { formatAccountNo, formatAmount, formatDate, formatDateTime } from "@/lib/format"
import { MOCK_OVERVIEW_ACCOUNTS, type OverviewAccount } from "@/lib/mock/b01-accounts"
import { cn } from "@/lib/utils"

const BASE_TIME = "2026-07-23T08:57:34"

/** REQ-INQR-001·004: 예금/적금 계좌만 대상으로 한 전체계좌조회(B-01)의 부분 화면. */
export function B02DepositAccounts() {
  const navigate = useNavigate()
  const [open, setOpen] = React.useState(true)

  const rows = MOCK_OVERVIEW_ACCOUNTS.filter((a) => a.group === "deposit")
  const groupTotal = rows.reduce((sum, a) => sum + a.balance, 0)

  const columns: DataGridColumn<OverviewAccount>[] = [
    {
      key: "alias",
      header: "계좌명",
      width: 180,
      render: (r) => <span className="text-xs text-ink-faint">{r.alias}</span>,
    },
    {
      key: "accountNo",
      header: "계좌번호",
      width: 160,
      render: (r) => <span className="tabular-nums">{formatAccountNo(r.accountNo)}</span>,
    },
    {
      key: "openedDate",
      header: "신규일",
      align: "center",
      width: 120,
      render: (r) => (
        <span className="text-xs tabular-nums text-ink-faint">{formatDate(r.openedDate)}</span>
      ),
    },
    {
      key: "lastActivityDate",
      header: "만기일",
      align: "center",
      width: 120,
      render: (r) => (
        <span className="text-xs tabular-nums text-ink-faint">{formatDate(r.lastActivityDate)}</span>
      ),
    },
    {
      key: "balance",
      header: "잔액",
      align: "right",
      width: 140,
      sortable: true,
      sortValue: (r) => r.balance,
      render: (r) => formatAmount(r.balance),
    },
    {
      key: "actions",
      header: "업무",
      align: "center",
      width: 100,
      render: (r) => (
        <Button
          variant="secondary"
          size="sm"
          onClick={() => navigate(`/inquiry?account=${r.accountNo}`)}
        >
          조회
        </Button>
      ),
    },
  ]

  return (
    <div className="flex flex-col gap-8">
      <NoticeBox
        items={[
          "예금·적금계좌만 표시됩니다. 입출금계좌는 전체계좌조회에서 확인할 수 있습니다.",
          "그룹을 접어도 총잔액 행은 계속 표시됩니다.",
          "계좌명은 별명이 있는 경우 별명을 우선 표시합니다.",
        ]}
      />

      <FormSection
        title="예금·적금계좌"
        className="mb-0"
        action={
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            className="inline-flex items-center gap-1 text-sm font-bold text-ink-muted hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            {open ? "그룹 접기" : "그룹 펼치기"}
            <ChevronDown
              className={cn("h-4 w-4 transition-transform", open && "rotate-180")}
              aria-hidden="true"
            />
          </button>
        }
      >
        {open && (
          <>
            <p className="mb-2 text-right text-2xs text-ink-muted tabular-nums">
              기준일시 : {formatDateTime(BASE_TIME)}
            </p>
            <DataGrid
              columns={columns}
              rows={rows}
              rowKey={(r) => r.id}
              emptyMessage="보유한 예금·적금 계좌가 없습니다."
            />
          </>
        )}

        <SummaryRow
          className="mt-3"
          items={[
            {
              label: <span className="text-xs font-normal text-ink-faint">예금·적금계좌 총잔액</span>,
              value: <span className="text-h2 font-bold">{formatAmount(groupTotal)}</span>,
              valueColor: "var(--color-primary)",
            },
          ]}
        />
        <p className="mt-1.5 text-2xs text-ink-faint">
          그룹 내 전체 계좌의 잔액 합계이며, 그룹을 접어도 이 행은 유지됩니다(REQ-INQR-006).
        </p>
      </FormSection>

      <NoticeBoxFooter
        items={[
          "계좌 잔액은 조회 시점 기준으로 표시되며 실제 처리 결과와 다를 수 있습니다(REQ-INQR-002).",
          "계좌명은 별명이 등록된 경우 별명을 우선 표시합니다(REQ-ACCT-013).",
          "[조회]는 해당 계좌의 거래내역조회로 이동합니다(REQ-INQR-005).",
          "상품군 그룹은 접기·펼치기가 가능하며 기본 상태는 펼침입니다(REQ-INQR-006).",
        ]}
      />
    </div>
  )
}
