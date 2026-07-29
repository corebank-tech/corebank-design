import * as React from "react"
import { NoticeBox, NoticeBoxFooter } from "@/components/shell/notice-box"
import { FormSection } from "@/components/ui/form-section"
import { FormRow } from "@/components/ui/form-row"
import { Select } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { SearchPanel } from "@/components/query/search-panel"
import { PeriodField } from "@/components/query/fields"
import { SummaryRow } from "@/components/query/summary-row"
import { GridToolbar } from "@/components/query/grid-toolbar"
import { DataGrid, type DataGridColumn } from "@/components/query/data-grid"
import { Pagination } from "@/components/query/pagination"
import { formatAccountNo, formatAmount, formatDate, formatDateTime, maskName } from "@/lib/format"
import {
  MOCK_AUTO_TRANSFER_RESULTS,
  type AutoTransferResultRow,
  type AutoTransferResult,
} from "@/lib/mock/g05-auto-transfer-results"

const TODAY = "2026-07-23"
const BASE_TIME = "2026-07-23T08:57:34"

const CYCLE_LABEL: Record<number, string> = { 1: "1개월", 3: "3개월", 6: "6개월" }

const RESULT_BADGE: Record<AutoTransferResult, "success" | "danger"> = {
  정상: "success",
  오류: "danger",
}

const FROM_ACCOUNTS = Array.from(
  new Map(MOCK_AUTO_TRANSFER_RESULTS.map((r) => [r.fromAccountNo, r.fromAlias])).entries(),
)

export function G05AutoTransferResults() {
  const [fromAccount, setFromAccount] = React.useState("all")
  const [period, setPeriod] = React.useState({ start: "2026-06-23", end: TODAY })
  const [pageSize, setPageSize] = React.useState<number | "all">(10)
  const [page, setPage] = React.useState(1)

  const rows = React.useMemo(() => {
    return MOCK_AUTO_TRANSFER_RESULTS.filter((r) => {
      const d = r.processedAt.slice(0, 10)
      if (d < period.start || d > period.end) return false
      if (fromAccount !== "all" && r.fromAccountNo !== fromAccount) return false
      return true
    }).sort((a, b) => b.processedAt.localeCompare(a.processedAt))
  }, [fromAccount, period])

  const normal = rows.filter((r) => r.result === "정상")
  const error = rows.filter((r) => r.result === "오류")
  const sum = (list: AutoTransferResultRow[]) => list.reduce((s, r) => s + r.amount, 0)

  const size = pageSize === "all" ? rows.length || 1 : pageSize
  const totalPages = Math.max(1, Math.ceil(rows.length / size))
  const safePage = Math.min(page, totalPages)
  const pageRows = rows.slice((safePage - 1) * size, safePage * size)

  const handleReset = () => {
    setFromAccount("all")
    setPeriod({ start: "2026-06-23", end: TODAY })
    setPage(1)
  }

  const columns: DataGridColumn<AutoTransferResultRow>[] = [
    {
      key: "result",
      header: "처리결과",
      align: "center",
      width: 90,
      render: (r) => <Badge variant={RESULT_BADGE[r.result]}>{r.result}</Badge>,
    },
    {
      key: "processedAt",
      header: "처리일시",
      width: 150,
      sortable: true,
      sortValue: (r) => r.processedAt,
      render: (r) => <span className="tabular-nums">{formatDateTime(r.processedAt)}</span>,
    },
    {
      key: "fromAccountNo",
      header: "출금계좌",
      width: 170,
      render: (r) => (
        <span>
          {r.fromAlias} <span className="text-ink-faint">/</span>{" "}
          <span className="tabular-nums">{formatAccountNo(r.fromAccountNo)}</span>
        </span>
      ),
    },
    {
      key: "toAccountNo",
      header: "입금계좌",
      width: 150,
      render: (r) => <span className="tabular-nums">{formatAccountNo(r.toAccountNo)}</span>,
    },
    {
      key: "payeeName",
      header: "예금주",
      align: "center",
      width: 90,
      render: (r) => maskName(r.payeeName),
    },
    {
      key: "amount",
      header: "이체금액",
      align: "right",
      width: 120,
      render: (r) => formatAmount(r.amount),
    },
    {
      key: "cycleMonths",
      header: "이체주기",
      align: "center",
      width: 90,
      render: (r) => CYCLE_LABEL[r.cycleMonths],
    },
    { key: "memo", header: "표시내용", align: "left" },
    {
      key: "failReason",
      header: "실패사유",
      align: "left",
      render: (r) => r.failReason ?? <span className="text-2xs text-ink-faint">-</span>,
    },
  ]

  return (
    <div className="flex flex-col">
      <NoticeBox
        className="mb-8"
        items={[
          "회차 처리결과는 이체 처리상태(정상/오류)를 그대로 사용합니다.",
          "실행 실패 건은 재시도되지 않으며 다음 회차부터 정상 진행됩니다.",
        ]}
      />

      <FormSection title="조회조건">
        <SearchPanel onReset={handleReset} onSearch={() => setPage(1)}>
          <FormRow label="출금계좌번호" htmlFor="g05-from">
            <Select
              id="g05-from"
              className="max-w-md"
              value={fromAccount}
              onChange={(e) => setFromAccount(e.target.value)}
            >
              <option value="all">전체</option>
              {FROM_ACCOUNTS.map(([accountNo, alias]) => (
                <option key={accountNo} value={accountNo}>
                  {`${alias} / ${formatAccountNo(accountNo)}`}
                </option>
              ))}
            </Select>
          </FormRow>
          <FormRow label="조회기간">
            <PeriodField
              start={period.start}
              end={period.end}
              onChange={setPeriod}
              today={TODAY}
            />
          </FormRow>
        </SearchPanel>
      </FormSection>

      <FormSection title="자동이체 결과" className="mb-0">
        <SummaryRow
          className="mb-3"
          items={[
            {
              label: "정상처리",
              value: (
                <span className="text-page font-bold">
                  {formatAmount(sum(normal))}{" "}
                  <span className="text-xs font-normal text-ink-faint">({normal.length}건)</span>
                </span>
              ),
              valueColor: "var(--color-success)",
            },
            {
              label: "오류처리",
              value: (
                <span>
                  {formatAmount(sum(error))}{" "}
                  <span className="text-xs font-normal text-ink-faint">({error.length}건)</span>
                </span>
              ),
              valueColor: "var(--color-withdraw)",
            },
          ]}
        />
        <p className="mb-3 text-2xs text-ink-faint">
          ※ 집계 금액은 페이징과 무관하게 조회 조건에 해당하는 전체 건 기준입니다.
        </p>

        <GridToolbar
          periodLabel={`${formatDate(period.start)} ~ ${formatDate(period.end)}`}
          totalCount={rows.length}
          pageSize={pageSize}
          onPageSizeChange={(s) => {
            setPageSize(s)
            setPage(1)
          }}
          baseTimeLabel={formatDateTime(BASE_TIME)}
        />

        <DataGrid
          columns={columns}
          rows={pageRows}
          rowKey={(r) => r.id}
          emptyMessage="조회 결과가 없습니다."
        />

        <Pagination page={safePage} totalPages={totalPages} onPageChange={setPage} />
      </FormSection>

      <NoticeBoxFooter
        className="mt-8"
        items={[
          "자동이체 회차 실행 실패는 해당 회차만 오류로 처리되며 이후 회차 실행에는 영향을 주지 않습니다(POL-038).",
        ]}
      />
    </div>
  )
}
