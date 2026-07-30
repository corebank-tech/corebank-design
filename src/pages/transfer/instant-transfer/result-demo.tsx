import * as React from "react"
import { Button } from "@/shared/ui/button"
import { Badge } from "@/shared/ui/badge"
import { InstantTransferStep3 } from "./D03-Result"
import { ResultPanel, type ResultVariant } from "@/widgets/transfer/result-panel"
import type { DataGridColumn } from "@/widgets/query/data-grid"
import {
  MOCK_TRANSFER_RESULT,
  type TransferResultRow,
} from "@/lib/mock/transfer"
import {
  formatAccountNo,
  formatAmount,
  formatDateTime,
  maskName,
} from "@/shared/lib/format"

const STEPS = ["정보입력", "정보확인 및 인증", "완료"]

const VARIANTS: { id: ResultVariant; label: string }[] = [
  { id: "success", label: "정상" },
  { id: "fail", label: "오류" },
  { id: "pending", label: "처리중" },
]

const COPY: Record<
  ResultVariant,
  {
    message: string
    description: string
    badge: React.ReactNode
    footnote: string
  }
> = {
  success: {
    message: "이체가 완료되었습니다.",
    description: "이체결과조회에서 처리 내역을 확인할 수 있습니다.",
    badge: <Badge variant="success">정상</Badge>,
    footnote: "※ 이체 후 출금계좌 잔액은 이체결과조회에서 다시 확인할 수 있습니다.",
  },
  fail: {
    message: "이체가 처리되지 않았습니다.",
    description: "출금계좌 잔액과 이체한도를 확인한 뒤 다시 시도하세요.",
    badge: <Badge variant="danger">오류</Badge>,
    footnote: "※ 실패한 이체는 원장에 반영되지 않으며, 잔액과 거래내역이 변동하지 않습니다.",
  },
  pending: {
    message: "이체를 처리하고 있습니다.",
    description: "잠시 후 이체결과조회에서 최종 처리 상태를 확인하세요.",
    badge: <Badge variant="warning">처리중</Badge>,
    footnote: "※ 처리중 상태는 확정 전 임시 상태이며, 이체결과조회에서 확정 상태를 확인할 수 있습니다.",
  },
}

/**
 * D-03 assembly demo. Renders the step-3 result screen with a ResultPanel in
 * its resultSlot and a toggle across the three transaction states
 * (정상 / 오류 / 처리중). Presentation only — state is local UI toggling.
 */
export function InstantTransferResultDemo() {
  const [variant, setVariant] = React.useState<ResultVariant>("success")
  const copy = COPY[variant]
  const row = MOCK_TRANSFER_RESULT

  const columns: DataGridColumn<TransferResultRow>[] = [
    {
      key: "result",
      header: "결과",
      align: "center",
      width: 80,
      render: () => copy.badge,
    },
    {
      key: "processedAt",
      header: "이체일시",
      align: "center",
      width: 150,
      render: (r) => (
        <span className="tabular-nums">{formatDateTime(r.processedAt)}</span>
      ),
    },
    {
      key: "fromAccountNo",
      header: "출금계좌",
      align: "center",
      render: (r) => (
        <span className="tabular-nums">{formatAccountNo(r.fromAccountNo)}</span>
      ),
    },
    {
      key: "toAccountNo",
      header: "입금계좌",
      align: "center",
      render: (r) => (
        <span className="tabular-nums">{formatAccountNo(r.toAccountNo)}</span>
      ),
    },
    {
      key: "payeeName",
      header: "받는분",
      align: "center",
      width: 90,
      render: (r) => maskName(r.payeeName),
    },
    {
      key: "amount",
      header: "이체금액(원)",
      align: "right",
      width: 130,
      render: (r) => formatAmount(r.amount, { suffix: false }),
    },
    {
      key: "fee",
      header: "수수료(원)",
      align: "right",
      width: 100,
      render: (r) => formatAmount(r.fee, { suffix: false }),
    },
    { key: "memo", header: "받는통장 메모", align: "center", width: 120 },
  ]

  return (
    <div>
      <div className="mb-4 flex items-center gap-2">
        <span className="text-sm font-bold text-ink-muted">결과 상태</span>
        <div className="flex items-center gap-1 rounded-[var(--radius-pill)] border border-[var(--color-border)] bg-surface p-1">
          {VARIANTS.map((v) => (
            <button
              key={v.id}
              type="button"
              onClick={() => setVariant(v.id)}
              aria-pressed={variant === v.id}
              className={
                "rounded-[var(--radius-pill)] px-3 py-1 text-sm font-bold transition-colors " +
                (variant === v.id
                  ? "bg-primary text-primary-foreground"
                  : "text-ink-muted hover:bg-white")
              }
            >
              {v.label}
            </button>
          ))}
        </div>
      </div>

      <InstantTransferStep3
        steps={STEPS}
        onNewTransfer={() => setVariant("success")}
        resultSlot={
          <ResultPanel
            variant={variant}
            message={copy.message}
            description={copy.description}
            highlightValue={formatAmount(row.amount)}
            footnote={copy.footnote}
            columns={columns}
            row={row}
            actions={
              <>
                <Button variant="outline" size="lg" className="min-w-[140px]">
                  이체결과조회
                </Button>
                <Button variant="primary" size="lg" className="min-w-[140px]">
                  추가 이체
                </Button>
              </>
            }
          />
        }
      />
    </div>
  )
}
