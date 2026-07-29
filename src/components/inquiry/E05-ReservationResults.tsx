import * as React from "react"
import { NoticeBox, NoticeBoxFooter } from "@/components/shell/notice-box"
import { FormSection } from "@/components/ui/form-section"
import { FormRow } from "@/components/ui/form-row"
import { Badge } from "@/components/ui/badge"
import { SearchPanel } from "@/components/query/search-panel"
import { PeriodField, RadioRowField } from "@/components/query/fields"
import { SummaryRow } from "@/components/query/summary-row"
import { GridToolbar } from "@/components/query/grid-toolbar"
import { DataGrid, type DataGridColumn } from "@/components/query/data-grid"
import { Pagination } from "@/components/query/pagination"
import { formatAccountNo, formatAmount, formatDate, formatDateTime, maskName } from "@/lib/format"
import {
  MOCK_RESERVATION_RESULTS,
  type ReservationResultRow,
  type ReservationResult,
} from "@/lib/mock/e05-reservation-results"

const TODAY = "2026-07-23"
const BASE_TIME = "2026-07-23T08:57:34"

const ORDER_OPTIONS = [
  { label: "최근거래순", value: "recent" },
  { label: "과거거래순", value: "past" },
]

const RESULT_BADGE: Record<ReservationResult, "success" | "danger" | "neutral"> = {
  정상: "success",
  오류: "danger",
  취소: "neutral",
}

export function E05ReservationResults() {
  const [period, setPeriod] = React.useState({ start: "2026-06-23", end: TODAY })
  const [order, setOrder] = React.useState("recent")
  const [pageSize, setPageSize] = React.useState<number | "all">(10)
  const [page, setPage] = React.useState(1)

  const rows = React.useMemo(() => {
    const next = MOCK_RESERVATION_RESULTS.filter(
      (r) => r.transferDate >= period.start && r.transferDate <= period.end,
    )
    return [...next].sort((a, b) =>
      order === "recent"
        ? b.transferDate.localeCompare(a.transferDate)
        : a.transferDate.localeCompare(b.transferDate),
    )
  }, [period, order])

  const normal = rows.filter((r) => r.result === "정상")
  const error = rows.filter((r) => r.result === "오류")
  const canceled = rows.filter((r) => r.result === "취소")
  const sum = (list: ReservationResultRow[]) => list.reduce((s, r) => s + r.amount, 0)

  const size = pageSize === "all" ? rows.length || 1 : pageSize
  const totalPages = Math.max(1, Math.ceil(rows.length / size))
  const safePage = Math.min(page, totalPages)
  const pageRows = rows.slice((safePage - 1) * size, safePage * size)

  const handleReset = () => {
    setPeriod({ start: "2026-06-23", end: TODAY })
    setOrder("recent")
    setPage(1)
  }

  const columns: DataGridColumn<ReservationResultRow>[] = [
    {
      key: "result",
      header: "처리결과",
      align: "center",
      width: 90,
      render: (r) => <Badge variant={RESULT_BADGE[r.result]}>{r.result}</Badge>,
    },
    {
      key: "transferDate",
      header: "이체일자",
      align: "center",
      width: 110,
      sortable: true,
      sortValue: (r) => r.transferDate,
      render: (r) => <span className="tabular-nums">{formatDate(r.transferDate)}</span>,
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
      key: "txId",
      header: "거래번호",
      width: 170,
      render: (r) => (
        <span className="tabular-nums">{r.txId ?? <span className="text-2xs text-ink-faint">-</span>}</span>
      ),
    },
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
          "예약이체는 매일 00:10에 일괄 실행되며 실패 건은 재시도되지 않습니다.",
          "집계 금액은 페이징과 무관하게 조회 조건에 해당하는 전체 건 기준입니다.",
        ]}
      />

      <FormSection title="조회조건">
        <SearchPanel onReset={handleReset} onSearch={() => setPage(1)}>
          <FormRow label="조회기간">
            <PeriodField
              start={period.start}
              end={period.end}
              onChange={setPeriod}
              today={TODAY}
            />
          </FormRow>
          <FormRow label="정렬순서">
            <RadioRowField
              name="e05-order"
              options={ORDER_OPTIONS}
              value={order}
              onChange={setOrder}
            />
          </FormRow>
        </SearchPanel>
      </FormSection>

      <FormSection title="예약이체 처리결과" className="mb-0">
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
            {
              label: "취소처리",
              value: (
                <span>
                  {formatAmount(sum(canceled))}{" "}
                  <span className="text-xs font-normal text-ink-faint">({canceled.length}건)</span>
                </span>
              ),
            },
          ]}
        />
        <p className="mb-3 text-2xs text-ink-faint">
          ※ 취소처리 건은 이체 예정일 전에 취소된 예약이체입니다.
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
          "처리 실패 건은 재시도 없이 실패로 확정되며, 실패 사유는 목록의 실패사유 열에서 확인할 수 있습니다.",
        ]}
      />
    </div>
  )
}
