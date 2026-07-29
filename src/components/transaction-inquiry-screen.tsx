import * as React from "react"
import { ChevronDown } from "lucide-react"
import { FormSection } from "@/components/ui/form-section"
import { FormRow } from "@/components/ui/form-row"
import { SearchPanel } from "@/components/query/search-panel"
import {
  AccountSelectField,
  KeywordField,
  PeriodField,
  RadioRowField,
} from "@/components/query/fields"
import { SummaryRow } from "@/components/query/summary-row"
import { GridToolbar } from "@/components/query/grid-toolbar"
import { DataGrid, type DataGridColumn } from "@/components/query/data-grid"
import { Pagination } from "@/components/query/pagination"
import {
  MOCK_ACCOUNTS,
  MOCK_TRANSACTIONS,
  type Transaction,
} from "@/lib/mock/transactions"
import { formatAccountNo, formatAmount, formatDate, formatDateTime } from "@/lib/format"
import { cn } from "@/lib/utils"

const TODAY = "2026-07-23"
const BASE_TIME = "2026-07-23T08:57:34"

const CONTENT_OPTIONS = [
  { label: "전체", value: "all" },
  { label: "입금만", value: "deposit" },
  { label: "출금만", value: "withdraw" },
]

const ORDER_OPTIONS = [
  { label: "최근거래순", value: "recent" },
  { label: "과거거래순", value: "past" },
]

function amountCell(value: number, color: string) {
  if (value === 0) return <span className="text-ink-faint">-</span>
  return <span style={{ color }}>{formatAmount(value, { suffix: false })}</span>
}

export function TransactionInquiryScreen() {
  const [account, setAccount] = React.useState(MOCK_ACCOUNTS[0].accountNo)
  const [period, setPeriod] = React.useState({ start: "2026-06-23", end: TODAY })
  const [content, setContent] = React.useState("all")
  const [order, setOrder] = React.useState("recent")
  const [keyword, setKeyword] = React.useState("")
  const [accountOpen, setAccountOpen] = React.useState(true)
  const [pageSize, setPageSize] = React.useState<number | "all">(10)
  const [page, setPage] = React.useState(1)

  const selectedAccount =
    MOCK_ACCOUNTS.find((a) => a.accountNo === account) ?? MOCK_ACCOUNTS[0]

  // Presentation-only filtering/ordering over the mock rows.
  const rows = React.useMemo(() => {
    const trimmedKeyword = keyword.trim()
    let next = MOCK_TRANSACTIONS.filter((t) => {
      if (content === "deposit" && t.deposit <= 0) return false
      if (content === "withdraw" && t.withdraw <= 0) return false
      if (trimmedKeyword && !t.description.includes(trimmedKeyword)) return false
      return true
    })
    next = [...next].sort((a, b) =>
      order === "recent"
        ? b.datetime.localeCompare(a.datetime)
        : a.datetime.localeCompare(b.datetime),
    )
    return next
  }, [content, order, keyword])

  const depositSum = rows.reduce((s, t) => s + t.deposit, 0)
  const depositCount = rows.filter((t) => t.deposit > 0).length
  const withdrawSum = rows.reduce((s, t) => s + t.withdraw, 0)
  const withdrawCount = rows.filter((t) => t.withdraw > 0).length

  const size = pageSize === "all" ? rows.length || 1 : pageSize
  const totalPages = Math.max(1, Math.ceil(rows.length / size))
  const safePage = Math.min(page, totalPages)
  const pageRows = rows.slice((safePage - 1) * size, safePage * size)

  const columns: DataGridColumn<Transaction>[] = [
    {
      key: "datetime",
      header: "거래일시",
      width: 160,
      sortable: true,
      sortValue: (r) => r.datetime,
      render: (r) => (
        <span className="tabular-nums">{formatDateTime(r.datetime)}</span>
      ),
    },
    { key: "description", header: "적요", align: "left" },
    {
      key: "withdraw",
      header: "출금금액",
      align: "right",
      width: 130,
      sortable: true,
      sortValue: (r) => r.withdraw,
      render: (r) => amountCell(r.withdraw, "var(--color-withdraw)"),
    },
    {
      key: "deposit",
      header: "입금금액",
      align: "right",
      width: 130,
      sortable: true,
      sortValue: (r) => r.deposit,
      render: (r) => amountCell(r.deposit, "var(--color-deposit)"),
    },
    {
      key: "balance",
      header: "거래후잔액",
      align: "right",
      width: 140,
      render: (r) => formatAmount(r.balance, { suffix: false }),
    },
    { key: "branch", header: "거래점", align: "center", width: 110 },
  ]

  const handleReset = () => {
    setAccount(MOCK_ACCOUNTS[0].accountNo)
    setPeriod({ start: "2026-06-23", end: TODAY })
    setContent("all")
    setOrder("recent")
    setKeyword("")
    setPage(1)
  }

  return (
    <div>
      <FormSection title="조회조건">
        <SearchPanel onReset={handleReset} onSearch={() => setPage(1)}>
          <FormRow label="조회계좌번호" htmlFor="inq-account">
            <AccountSelectField
              id="inq-account"
              options={MOCK_ACCOUNTS}
              value={account}
              onChange={setAccount}
            />
          </FormRow>
          <FormRow label="조회기간">
            <PeriodField
              start={period.start}
              end={period.end}
              onChange={setPeriod}
              today={TODAY}
            />
          </FormRow>
          <FormRow label="조회내용">
            <RadioRowField
              name="inq-content"
              options={CONTENT_OPTIONS}
              value={content}
              onChange={setContent}
            />
          </FormRow>
          <FormRow label="적요검색" htmlFor="inq-keyword">
            <KeywordField id="inq-keyword" value={keyword} onChange={setKeyword} />
          </FormRow>
          <FormRow label="조회결과순서">
            <RadioRowField
              name="inq-order"
              options={ORDER_OPTIONS}
              value={order}
              onChange={setOrder}
            />
          </FormRow>
        </SearchPanel>
      </FormSection>

      {/* Collapsible account info panel */}
      <div className="mb-6 border border-[var(--color-border)]">
        <button
          type="button"
          onClick={() => setAccountOpen((v) => !v)}
          aria-expanded={accountOpen}
          className="flex w-full items-center justify-between bg-surface px-4 py-2.5 text-sm font-bold text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <span>계좌정보</span>
          <ChevronDown
            className={cn(
              "h-4 w-4 text-ink-muted transition-transform",
              accountOpen && "rotate-180",
            )}
            aria-hidden="true"
          />
        </button>
        {accountOpen && (
          <dl className="grid grid-cols-4 divide-x divide-[var(--color-border)] border-t border-[var(--color-border)]">
            {[
              { term: "계좌명", desc: selectedAccount.alias, numeric: false },
              {
                term: "계좌번호",
                desc: formatAccountNo(selectedAccount.accountNo),
                numeric: true,
              },
              {
                term: "잔액",
                desc: formatAmount(selectedAccount.balance),
                numeric: true,
              },
              {
                term: "출금가능금액",
                desc: formatAmount(selectedAccount.withdrawable),
                numeric: true,
              },
            ].map((item) => (
              <div key={item.term} className="flex flex-col gap-1 px-4 py-3">
                <dt className="text-xs text-ink-muted">{item.term}</dt>
                <dd
                  className={cn(
                    "text-sm font-bold text-ink",
                    item.numeric && "tabular-nums",
                  )}
                >
                  {item.desc}
                </dd>
              </div>
            ))}
          </dl>
        )}
      </div>

      <FormSection title="거래내역">
        <SummaryRow
          className="mb-3"
          items={[
            {
              label: "입금합계",
              value: (
                <span>
                  {formatAmount(depositSum)}{" "}
                  <span className="text-xs font-normal text-ink-muted">
                    ({depositCount}건)
                  </span>
                </span>
              ),
              valueColor: "var(--color-deposit)",
            },
            {
              label: "출금합계",
              value: (
                <span>
                  {formatAmount(withdrawSum)}{" "}
                  <span className="text-xs font-normal text-ink-muted">
                    ({withdrawCount}건)
                  </span>
                </span>
              ),
              valueColor: "var(--color-withdraw)",
            },
          ]}
        />

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

        <Pagination
          page={safePage}
          totalPages={totalPages}
          onPageChange={setPage}
        />
      </FormSection>
    </div>
  )
}
