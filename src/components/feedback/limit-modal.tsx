import * as React from "react"
import { Modal } from "@/components/ui/modal"
import { Button } from "@/components/ui/button"
import { formatAmount } from "@/lib/format"

export interface LimitModalProps {
  open: boolean
  onClose: () => void
  /** 1일 이체한도 (KRW). */
  perDay: number
  /** 1회 이체한도 (KRW). */
  perTransfer: number
  /** 당일 이체잔여한도 (KRW). */
  dailyRemaining: number
  /** Opens the limit-change flow. */
  onChangeLimit: () => void
  title?: React.ReactNode
}

/**
 * D-05 이체한도 조회. sm modal with a three-row label/value table (daily limit,
 * per-transfer limit, remaining daily limit) and a limit-change action.
 */
export function LimitModal({
  open,
  onClose,
  perDay,
  perTransfer,
  dailyRemaining,
  onChangeLimit,
  title = "이체한도 조회",
}: LimitModalProps) {
  const rows: { label: string; value: number }[] = [
    { label: "1일 이체한도", value: perDay },
    { label: "1회 이체한도", value: perTransfer },
    { label: "당일 이체잔여한도", value: dailyRemaining },
  ]

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={title}
      size="sm"
      footer={
        <Button
          variant="primary"
          size="lg"
          className="min-w-[140px]"
          onClick={onChangeLimit}
        >
          이체한도 변경
        </Button>
      }
    >
      <table className="w-full border-collapse border-t-2 border-t-[var(--color-navy)] text-sm">
        <tbody>
          {rows.map((row) => (
            <tr key={row.label}>
              <th
                scope="row"
                className="w-[45%] border-b border-r border-[var(--color-border)] bg-surface px-3 py-3 text-left font-bold text-ink"
              >
                {row.label}
              </th>
              <td className="border-b border-[var(--color-border)] bg-white px-3 py-3 text-right tabular-nums text-ink">
                {formatAmount(row.value)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <p className="mt-3 text-sm leading-relaxed text-ink-muted">
        이체한도는 보안매체 등급에 따라 조정할 수 있습니다. 변경 후에는 다음 이체부터 적용됩니다.
      </p>
    </Modal>
  )
}
