import * as React from "react"
import { Button } from "@/components/ui/button"
import { FormSection } from "@/components/ui/form-section"
import { FormRow } from "@/components/ui/form-row"
import { StepLayout } from "@/components/transfer/step-layout"
import {
  WithdrawAccountField,
  AccountPasswordField,
  AccountNumberField,
  AmountField,
  MemoField,
} from "@/components/transfer/fields"
import type { AccountOption } from "@/shared/types/account"
import type { InstantTransferForm } from "../instant-transfer-screen"

export interface InstantTransferStep1Props {
  steps: string[]
  accounts: AccountOption[]
  form: InstantTransferForm
  onChange: <K extends keyof InstantTransferForm>(
    key: K,
    value: InstantTransferForm[K],
  ) => void
  perTransferLimit: number
  dailyRemaining: number
  payeeName: string
  canSubmit: boolean
  onNext: () => void
}

/** D-01 즉시이체 1단계 · 정보입력 */
export function InstantTransferStep1({
  steps,
  accounts,
  form,
  onChange,
  perTransferLimit,
  dailyRemaining,
  payeeName,
  canSubmit,
  onNext,
}: InstantTransferStep1Props) {
  const selected = accounts.find((a) => a.accountNo === form.fromAccount)

  return (
    <StepLayout
      steps={steps}
      currentStep={1}
      title="즉시이체"
      notice={[
        "당행 계좌 간 이체만 가능하며, 입금은 즉시 반영됩니다.",
        "입금계좌번호를 정확히 입력한 뒤 계좌확인으로 예금주명을 확인하세요.",
        "이체한도를 초과하는 금액은 이체할 수 없습니다.",
      ]}
      footer={
        <Button
          variant="primary"
          size="lg"
          className="min-w-[160px]"
          disabled={!canSubmit}
          onClick={onNext}
        >
          다음
        </Button>
      }
    >
      <FormSection title="출금정보">
        <div>
          <FormRow label="출금계좌" required htmlFor="it-from">
            <WithdrawAccountField
              id="it-from"
              options={accounts}
              value={form.fromAccount}
              onChange={(v) => onChange("fromAccount", v)}
            />
          </FormRow>
          <FormRow label="계좌비밀번호" required htmlFor="it-pw">
            <AccountPasswordField
              id="it-pw"
              value={form.password}
              onChange={(v) => onChange("password", v)}
            />
          </FormRow>
        </div>
      </FormSection>

      <FormSection title="입금정보">
        <div>
          <FormRow label="입금계좌번호" required htmlFor="it-to">
            <AccountNumberField
              id="it-to"
              value={form.toAccount}
              onChange={(v) => {
                onChange("toAccount", v)
                onChange("toConfirmed", false)
              }}
              onConfirm={() => onChange("toConfirmed", form.toAccount.length >= 10)}
              confirmed={form.toConfirmed}
              holderName={payeeName}
            />
          </FormRow>
          <FormRow label="이체금액" required htmlFor="it-amount">
            <AmountField
              id="it-amount"
              value={form.amount}
              onChange={(v) => onChange("amount", v)}
              perTransferLimit={perTransferLimit}
              dailyRemaining={dailyRemaining}
              fullAmount={selected?.withdrawable}
            />
          </FormRow>
          <FormRow label="받는분 통장 표시내용" htmlFor="it-memo-payee">
            <MemoField
              id="it-memo-payee"
              value={form.payeeMemo}
              onChange={(v) => onChange("payeeMemo", v)}
              placeholder="받는분 통장에 표시 (7자 이내)"
            />
          </FormRow>
          <FormRow label="내 통장 표시내용" htmlFor="it-memo-mine">
            <MemoField
              id="it-memo-mine"
              value={form.myMemo}
              onChange={(v) => onChange("myMemo", v)}
              placeholder="내 통장에 표시 (7자 이내)"
            />
          </FormRow>
        </div>
      </FormSection>
    </StepLayout>
  )
}
