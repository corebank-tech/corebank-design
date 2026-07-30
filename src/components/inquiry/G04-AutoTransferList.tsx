import * as React from "react"
import { NoticeBox, NoticeBoxFooter } from "@/components/shell/notice-box"
import { FormSection } from "@/components/ui/form-section"
import { FormRow } from "@/components/ui/form-row"
import { Select } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Modal } from "@/components/ui/modal"
import { SearchPanel } from "@/components/query/search-panel"
import { RadioRowField } from "@/components/query/fields"
import { GridToolbar } from "@/components/query/grid-toolbar"
import { DataGrid, type DataGridColumn } from "@/components/query/data-grid"
import { Pagination } from "@/components/query/pagination"
import { ConfirmDialog } from "@/components/feedback/confirm-dialog"
import { ErrorDialog } from "@/components/feedback/error-dialog"
import { formatAccountNo, formatAmount, formatDate, formatDateTime, maskName } from "@/lib/format"
import {
  MOCK_AUTO_TRANSFERS,
  type AutoTransferRow,
  type AutoTransferStatus,
  type TransferCycle,
} from "@/lib/mock/g04-auto-transfers"

const TODAY = "2026-07-23"
const BASE_TIME = "2026-07-23T08:57:34"

const STATUS_OPTIONS = [
  { label: "전체", value: "all" },
  { label: "정상", value: "정상" },
  { label: "해지", value: "해지" },
]

const STATUS_BADGE: Record<AutoTransferStatus, "success" | "neutral" | "danger"> = {
  정상: "success",
  종료: "neutral",
  해지: "danger",
}

const CYCLE_LABEL: Record<TransferCycle, string> = { 1: "1개월", 3: "3개월", 6: "6개월" }

const FROM_ACCOUNTS = Array.from(
  new Map(MOCK_AUTO_TRANSFERS.map((r) => [r.fromAccountNo, r.fromAlias])).entries(),
)

/** REQ-AUTO-011: 다음 실행 예정일 전일까지만 해지 가능, 당일은 해지 불가. */
function isTerminable(row: AutoTransferRow): boolean {
  return row.status === "정상" && row.nextExecDate != null && row.nextExecDate > TODAY
}

interface EditForm {
  amount: string
  cycleMonths: TransferCycle
  endDate: string
  memo: string
}

export function G04AutoTransferList() {
  const [rows, setRows] = React.useState(MOCK_AUTO_TRANSFERS)
  const [fromAccount, setFromAccount] = React.useState("all")
  const [status, setStatus] = React.useState("all")
  const [pageSize, setPageSize] = React.useState<number | "all">(10)
  const [page, setPage] = React.useState(1)
  const [selectedIds, setSelectedIds] = React.useState<string[]>([])
  const [gridKey, setGridKey] = React.useState(0)
  const [terminateConfirmOpen, setTerminateConfirmOpen] = React.useState(false)
  const [blockedOpen, setBlockedOpen] = React.useState(false)
  const [editTarget, setEditTarget] = React.useState<AutoTransferRow | null>(null)
  const [editForm, setEditForm] = React.useState<EditForm | null>(null)
  const [editConfirmOpen, setEditConfirmOpen] = React.useState(false)

  const filtered = React.useMemo(() => {
    return rows.filter((r) => {
      if (fromAccount !== "all" && r.fromAccountNo !== fromAccount) return false
      if (status !== "all" && r.status !== status) return false
      return true
    })
  }, [rows, fromAccount, status])

  const size = pageSize === "all" ? filtered.length || 1 : pageSize
  const totalPages = Math.max(1, Math.ceil(filtered.length / size))
  const safePage = Math.min(page, totalPages)
  const pageRows = filtered.slice((safePage - 1) * size, safePage * size)

  const selectedRows = rows.filter((r) => selectedIds.includes(r.id))

  const handleReset = () => {
    setFromAccount("all")
    setStatus("all")
    setPage(1)
  }

  const handleTerminateClick = () => {
    if (selectedRows.length === 0) return
    if (selectedRows.some((r) => !isTerminable(r))) {
      setBlockedOpen(true)
      return
    }
    setTerminateConfirmOpen(true)
  }

  const handleConfirmTerminate = () => {
    setRows((prev) =>
      prev.map((r) =>
        selectedIds.includes(r.id)
          ? { ...r, status: "해지" as const, nextExecDate: undefined }
          : r,
      ),
    )
    setTerminateConfirmOpen(false)
    setSelectedIds([])
    setGridKey((k) => k + 1)
  }

  const openEdit = (row: AutoTransferRow) => {
    setEditTarget(row)
    setEditForm({
      amount: String(row.amount),
      cycleMonths: row.cycleMonths,
      endDate: row.endDate,
      memo: row.memo,
    })
  }

  const handleSaveEdit = () => {
    if (!editTarget || !editForm) return
    setRows((prev) =>
      prev.map((r) =>
        r.id === editTarget.id
          ? {
              ...r,
              amount: Number(editForm.amount) || r.amount,
              cycleMonths: editForm.cycleMonths,
              endDate: editForm.endDate,
              memo: editForm.memo,
            }
          : r,
      ),
    )
    setEditConfirmOpen(false)
    setEditTarget(null)
    setEditForm(null)
  }

  const columns: DataGridColumn<AutoTransferRow>[] = [
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
      key: "period",
      header: "이체기간",
      width: 200,
      render: (r) => (
        <span className="tabular-nums">
          {formatDate(r.startDate)} ~ {formatDate(r.endDate)}
        </span>
      ),
    },
    {
      key: "dayOfMonth",
      header: "이체지정일",
      align: "center",
      width: 90,
      render: (r) => `매월 ${r.dayOfMonth}일`,
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
      key: "status",
      header: "상태",
      align: "center",
      width: 80,
      render: (r) => <Badge variant={STATUS_BADGE[r.status]}>{r.status}</Badge>,
    },
    {
      key: "actions",
      header: "변경",
      align: "center",
      width: 90,
      render: (r) =>
        r.status === "정상" ? (
          <Button variant="secondary" size="sm" onClick={() => openEdit(r)}>
            변경
          </Button>
        ) : (
          <span className="text-ink-faint">-</span>
        ),
    },
  ]

  return (
    <div className="flex flex-col">
      <NoticeBox
        className="mb-8"
        items={[
          "정상 상태이고 다음 실행 예정일 전일까지인 건만 해지할 수 있습니다.",
          "출금계좌, 입금계좌, 이체지정일은 변경할 수 없으며 해지 후 재등록해야 합니다.",
          "이체주기를 변경하면 다음 실행 예정일이 직전 실행 예정일 기준으로 다시 계산됩니다.",
        ]}
      />

      <FormSection title="조회조건">
        <SearchPanel onReset={handleReset} onSearch={() => setPage(1)}>
          <FormRow label="출금계좌번호" htmlFor="g04-from">
            <Select
              id="g04-from"
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
          <FormRow label="조회구분">
            <RadioRowField
              name="g04-status"
              options={STATUS_OPTIONS}
              value={status}
              onChange={setStatus}
            />
          </FormRow>
        </SearchPanel>
      </FormSection>

      <FormSection
        title="자동이체 목록"
        className="mb-0"
        action={
          <Button
            variant="danger"
            size="sm"
            disabled={selectedIds.length === 0}
            onClick={handleTerminateClick}
          >
            선택 해지
          </Button>
        }
      >
        <GridToolbar
          totalCount={filtered.length}
          pageSize={pageSize}
          onPageSizeChange={(s) => {
            setPageSize(s)
            setPage(1)
          }}
          baseTimeLabel={formatDateTime(BASE_TIME)}
        />

        <DataGrid
          key={gridKey}
          columns={columns}
          rows={pageRows}
          rowKey={(r) => r.id}
          selectable
          onSelectionChange={setSelectedIds}
          emptyMessage="조회된 자동이체가 없습니다."
        />

        <Pagination page={safePage} totalPages={totalPages} onPageChange={setPage} />
      </FormSection>

      <NoticeBoxFooter
        className="mt-8"
        items={[
          "이체지정일이 해당 월에 없는 경우(29~31일) 그 달의 말일에 실행됩니다(POL-034).",
          "해지는 다음 실행 예정일 전일까지만 가능합니다(REQ-AUTO-011).",
        ]}
      />

      <ConfirmDialog
        open={terminateConfirmOpen}
        onClose={() => setTerminateConfirmOpen(false)}
        onConfirm={handleConfirmTerminate}
        title="자동이체 해지"
        messages={["선택한 자동이체를 해지합니다.", "해지 후에는 이후 회차가 실행되지 않습니다."]}
        confirmLabel="해지하기"
        cancelLabel="닫기"
        items={selectedRows.map((r) => ({
          label: `매월 ${r.dayOfMonth}일`,
          value: `${r.fromAlias} → ${maskName(r.payeeName)} / ${formatAmount(r.amount)}`,
        }))}
      />

      <ErrorDialog
        open={blockedOpen}
        onClose={() => setBlockedOpen(false)}
        title="해지 불가"
        messages={[
          "정상 상태이고 다음 실행 예정일 전일까지인 건만 해지할 수 있습니다.",
          "실행 예정일 당일이거나 이미 종료·해지된 건은 선택에서 제외하세요.",
        ]}
      />

      <Modal
        open={editTarget != null}
        onClose={() => {
          setEditTarget(null)
          setEditForm(null)
        }}
        title="자동이체 변경"
        size="sm"
        footer={
          <>
            <Button
              variant="secondary"
              size="lg"
              className="min-w-[120px]"
              onClick={() => {
                setEditTarget(null)
                setEditForm(null)
              }}
            >
              취소
            </Button>
            <Button
              variant="primary"
              size="lg"
              className="min-w-[120px]"
              onClick={() => setEditConfirmOpen(true)}
            >
              변경하기
            </Button>
          </>
        }
      >
        {editTarget && editForm && (
          <div className="flex flex-col gap-0">
            <FormRow label="출금계좌" labelWidth={110}>
              <span className="text-ink-muted">
                {editTarget.fromAlias} / {formatAccountNo(editTarget.fromAccountNo)}
                <span className="ml-1 text-2xs text-ink-faint">(변경 불가)</span>
              </span>
            </FormRow>
            <FormRow label="입금계좌" labelWidth={110}>
              <span className="text-ink-muted">
                {formatAccountNo(editTarget.toAccountNo)} ({maskName(editTarget.payeeName)})
                <span className="ml-1 text-2xs text-ink-faint">(변경 불가)</span>
              </span>
            </FormRow>
            <FormRow label="이체금액" htmlFor="g04-edit-amount" labelWidth={110}>
              <Input
                id="g04-edit-amount"
                type="number"
                min={1}
                value={editForm.amount}
                onChange={(e) => setEditForm({ ...editForm, amount: e.target.value })}
              />
            </FormRow>
            <FormRow label="이체주기" labelWidth={110}>
              <RadioRowField
                name="g04-edit-cycle"
                options={[
                  { label: "1개월", value: "1" },
                  { label: "3개월", value: "3" },
                  { label: "6개월", value: "6" },
                ]}
                value={String(editForm.cycleMonths)}
                onChange={(v) =>
                  setEditForm({ ...editForm, cycleMonths: Number(v) as TransferCycle })
                }
              />
            </FormRow>
            <FormRow label="이체종료일" htmlFor="g04-edit-end" labelWidth={110}>
              <Input
                id="g04-edit-end"
                type="date"
                value={editForm.endDate}
                onChange={(e) => setEditForm({ ...editForm, endDate: e.target.value })}
              />
            </FormRow>
            <FormRow label="표시내용" htmlFor="g04-edit-memo" labelWidth={110}>
              <Input
                id="g04-edit-memo"
                maxLength={10}
                value={editForm.memo}
                onChange={(e) => setEditForm({ ...editForm, memo: e.target.value })}
              />
            </FormRow>
          </div>
        )}
      </Modal>

      <ConfirmDialog
        open={editConfirmOpen}
        onClose={() => setEditConfirmOpen(false)}
        onConfirm={handleSaveEdit}
        title="자동이체 변경"
        messages={["아래 내용으로 자동이체를 변경합니다."]}
        confirmLabel="변경하기"
        items={
          editForm
            ? [
                { label: "이체금액", value: formatAmount(Number(editForm.amount) || 0) },
                { label: "이체주기", value: CYCLE_LABEL[editForm.cycleMonths] },
                { label: "이체종료일", value: formatDate(editForm.endDate) },
                { label: "표시내용", value: editForm.memo },
              ]
            : []
        }
      />
    </div>
  )
}
