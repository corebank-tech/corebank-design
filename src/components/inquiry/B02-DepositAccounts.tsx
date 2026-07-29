import * as React from "react"
import { useNavigate } from "react-router-dom"
import { ChevronDown } from "lucide-react"
import { NoticeBox } from "@/components/shell/notice-box"
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
    { key: "alias", header: "계좌명", width: 180 },
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
      render: (r) => <span className="tabular-nums">{formatDate(r.openedDate)}</span>,
    },
    {
      key: "lastActivityDate",
      header: "만기일",
      align: "center",
      width: 120,
      render: (r) => <span className="tabular-nums">{formatDate(r.lastActivityDate)}</span>,
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
    <div className="flex flex-col gap-6">
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
            <p className="mb-2 text-right text-xs text-ink-muted tabular-nums">
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
          className="mt-2"
          items={[{ label: "예금·적금계좌 총잔액", value: formatAmount(groupTotal) }]}
        />
      </FormSection>
    </div>
  )
}
