import * as React from "react"
import { Button } from "@/components/ui/button"
import { FormSection } from "@/components/ui/form-section"
import { StepLayout } from "@/components/transfer/step-layout"
import { ConfirmSummary } from "@/components/transfer/confirm-summary"

export interface InstantTransferStep2Props {
  steps: string[]
  scheduledAt: React.ReactNode
  fromAccount: React.ReactNode
  toAccount: React.ReactNode
  payeeName: React.ReactNode
  amount: React.ReactNode
  fee: React.ReactNode
  payeeMemo: React.ReactNode
  /** Security-media (OTP/보안카드) input slot. Left empty for now. */
  securitySlot?: React.ReactNode
  onPrev: () => void
  onSubmit: () => void
}

/** D-02 즉시이체 2단계 · 정보확인 및 인증 */
export function InstantTransferStep2({
  steps,
  scheduledAt,
  fromAccount,
  toAccount,
  payeeName,
  amount,
  fee,
  payeeMemo,
  securitySlot,
  onPrev,
  onSubmit,
}: InstantTransferStep2Props) {
  return (
    <StepLayout
      steps={steps}
      currentStep={2}
      title="즉시이체"
      notice={[
        "아래 이체 내용을 확인한 뒤 보안매체로 인증하면 이체가 실행됩니다.",
        "받는분과 이체금액이 맞는지 다시 확인하세요. 이체 후에는 취소할 수 없습니다.",
      ]}
      footer={
        <>
          <Button
            variant="secondary"
            size="lg"
            className="min-w-[120px]"
            onClick={onPrev}
          >
            이전
          </Button>
          <Button
            variant="primary"
            size="lg"
            className="min-w-[160px]"
            onClick={onSubmit}
          >
            이체하기
          </Button>
        </>
      }
    >
      <FormSection title="이체내용 확인">
        <ConfirmSummary
          columns={[
            { label: "이체예정일시", value: scheduledAt },
            { label: "출금계좌", value: fromAccount },
            { label: "입금계좌", value: toAccount },
            { label: "받는분", value: payeeName },
            { label: "이체금액(원)", value: amount, emphasis: true },
            { label: "수수료(원)", value: fee },
            { label: "받는통장 메모", value: payeeMemo },
          ]}
        />
      </FormSection>

      <FormSection title="보안매체 정보입력">
        {securitySlot ?? (
          <div className="flex min-h-[96px] items-center justify-center border border-dashed border-[var(--color-border-strong)] bg-surface px-4 py-8 text-sm text-ink-muted">
            보안매체 입력 영역
          </div>
        )}
      </FormSection>
    </StepLayout>
  )
}
