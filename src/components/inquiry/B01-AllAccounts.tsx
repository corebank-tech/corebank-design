import * as React from "react"
import { useNavigate } from "react-router-dom"
import { NoticeBox, NoticeBoxFooter } from "@/components/shell/notice-box"
import { FormSection } from "@/components/ui/form-section"
import { Button } from "@/components/ui/button"
import { DataGrid, type DataGridColumn } from "@/components/query/data-grid"
import { SummaryRow } from "@/components/query/summary-row"
import { formatAccountNo, formatAmount, formatDate, formatDateTime } from "@/lib/format"
import { MOCK_OVERVIEW_ACCOUNTS, type AccountGroupId, type OverviewAccount } from "@/lib/mock/b01-accounts"

const BASE_TIME = "2026-07-23T08:57:34"

const GROUP_LABELS: Record<AccountGroupId, string> = {
  checking: "입출금계좌",
  deposit: "예금·적금계좌",
}

/** REQ-INQR-004: 계좌명, 계좌번호, 신규일, 최근거래일(예적금은 만기일), 잔액, 업무. */
function buildColumns(
  group: AccountGroupId,
  onInquire: (accountNo: string) => void,
  onTransfer: (accountNo: string) => void,
): DataGridColumn<OverviewAccount>[] {
  return [
    { key: "alias", header: "계좌명", width: 180 },
    {
      key: "accountNo",
      header: "계좌번호",
      width: 160,
      render: (r) => (
        <span className="tabular-nums">{formatAccountNo(r.accountNo)}</span>
      ),
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
      header: group === "deposit" ? "만기일" : "최근거래일",
      align: "center",
      width: 120,
      render: (r) => (
        <span className="tabular-nums">{formatDate(r.lastActivityDate)}</span>
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
      width: 140,
      render: (r) => (
        <div className="flex items-center justify-center gap-1.5">
          <Button variant="secondary" size="sm" onClick={() => onInquire(r.accountNo)}>
            조회
          </Button>
          {r.isWithdrawalAccount && (
            <Button variant="outline" size="sm" onClick={() => onTransfer(r.accountNo)}>
              이체
            </Button>
          )}
        </div>
      ),
    },
  ]
}

const GROUP_ORDER: AccountGroupId[] = ["checking", "deposit"]

export function B01AllAccounts() {
  const navigate = useNavigate()

  const handleInquire = (accountNo: string) => {
    navigate(`/inquiry?account=${accountNo}`)
  }
  const handleTransfer = (accountNo: string) => {
    navigate(`/instant-transfer?from=${accountNo}`)
  }

  const grandTotal = MOCK_OVERVIEW_ACCOUNTS.reduce((sum, a) => sum + a.balance, 0)

  return (
    <div className="flex flex-col gap-8">
      <NoticeBox
        items={[
          "계좌 잔액은 조회 시점 기준으로 표시되며 실제 거래 처리 결과와 다를 수 있습니다.",
          "예금·적금계좌는 최근거래일 대신 만기일이 표시됩니다.",
          "[이체]는 출금계좌로 등록된 입출금계좌에만 노출됩니다.",
        ]}
      />

      {GROUP_ORDER.map((group) => {
        const rows = MOCK_OVERVIEW_ACCOUNTS.filter((a) => a.group === group)
        const groupTotal = rows.reduce((sum, a) => sum + a.balance, 0)
        return (
          <FormSection key={group} title={GROUP_LABELS[group]} className="mb-0">
            <p className="mb-2 text-right text-2xs text-ink-muted tabular-nums">
              기준일시 : {formatDateTime(BASE_TIME)}
            </p>
            <DataGrid
              columns={buildColumns(group, handleInquire, handleTransfer)}
              rows={rows}
              rowKey={(r) => r.id}
              emptyMessage="보유한 계좌가 없습니다."
            />
            <SummaryRow
              className="mt-3"
              items={[
                { label: `${GROUP_LABELS[group]} 총잔액`, value: formatAmount(groupTotal) },
              ]}
            />
          </FormSection>
        )
      })}

      <div>
        <SummaryRow
          items={[
            {
              label: <span className="text-xs font-normal text-ink-faint">총자산</span>,
              value: <span className="text-page font-bold">{formatAmount(grandTotal)}</span>,
              valueColor: "var(--color-primary)",
            },
          ]}
        />
        <p className="mt-1.5 text-right text-2xs text-ink-faint">
          대출 상품을 제공하지 않는 Phase 1 특성상 총자산은 수신 계좌 잔액 합계로 산출됩니다.
        </p>
      </div>

      <NoticeBoxFooter
        items={[
          "계좌 잔액은 조회 시점 기준으로 표시되며, 그룹별 총잔액과 총자산도 같은 시점의 잔액 합계로 집계됩니다(REQ-INQR-002·003).",
          "계좌명은 별명이 등록된 경우 별명을 우선 표시합니다(REQ-ACCT-013).",
          "[이체]는 출금계좌로 등록된 입출금계좌에만 노출됩니다(REQ-INQR-005).",
        ]}
      />
    </div>
  )
}
