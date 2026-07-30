import * as React from "react"
import { Button } from "@/shared/ui/button"
import { FormSection } from "@/shared/ui/form-section"
import { FormRow } from "@/shared/ui/form-row"
import { StepLayout } from "@/widgets/transfer/step-layout"
import {
  WithdrawAccountField,
  AccountPasswordField,
  AccountNumberField,
  AmountField,
  MemoField,
  TransferDateField,
  TransferCycleField,
  DayOfMonthField,
  TransferEndDateField,
} from "@/widgets/transfer/transfer-fields"
import { NoticeBoxFooter } from "@/shared/ui/notice-box"
import { maskName } from "@/shared/lib/format"
import type { AccountOption } from "@/shared/types/account"
import type { AutoTransferForm } from "../auto-transfer-screen"

/** Muted, de-emphasized field label — reserves visual weight for 이체금액. */
function FieldLabel({ children }: { children: React.ReactNode }) {
  return <span className="text-xs text-ink-faint">{children}</span>
}

type AutoTransferStep1Props = {
  steps: string[]
  accounts: AccountOption[]
  form: AutoTransferForm
  onChange: <K extends keyof AutoTransferForm>(
    key: K,
    value: AutoTransferForm[K],
  ) => void
  today: string
  perTransferLimit: number
  payeeName: string
  duplicate: boolean
  canSubmit: boolean
  onNext: () => void
}

/** G-01 자동이체 등록 1단계 · 정보입력 */
export function AutoTransferStep1({
  steps,
  accounts,
  form,
  onChange,
  today,
  perTransferLimit,
  payeeName,
  duplicate,
  canSubmit,
  onNext,
}: AutoTransferStep1Props) {
  return (
    <>
    <StepLayout
      steps={steps}
      currentStep={1}
      title="자동이체"
      notice={[
        "당행 계좌 간 이체만 가능하며, 이체주기에 따라 지정일에 반복 실행됩니다.",
        "이체주기는 1개월·3개월·6개월 중에서만 선택할 수 있으며, 휴일이라도 지정일에 그대로 실행됩니다.",
        "이체 시작일은 내일부터 1년 이내, 종료일은 시작일로부터 최대 60개월 이내에서 지정할 수 있습니다.",
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
          <FormRow label={<FieldLabel>출금계좌</FieldLabel>} required htmlFor="at-from">
            <WithdrawAccountField
              id="at-from"
              options={accounts}
              value={form.fromAccount}
              onChange={(v) => onChange("fromAccount", v)}
            />
          </FormRow>
          <FormRow label={<FieldLabel>계좌비밀번호</FieldLabel>} required htmlFor="at-pw">
            <AccountPasswordField
              id="at-pw"
              value={form.password}
              onChange={(v) => onChange("password", v)}
            />
          </FormRow>
        </div>
      </FormSection>

      <FormSection title="입금정보">
        <div>
          <FormRow label={<FieldLabel>입금계좌번호</FieldLabel>} required htmlFor="at-to">
            <AccountNumberField
              id="at-to"
              value={form.toAccount}
              onChange={(v) => {
                onChange("toAccount", v)
                onChange("toConfirmed", false)
              }}
              onConfirm={() => onChange("toConfirmed", form.toAccount.length >= 10)}
              confirmed={form.toConfirmed}
              holderName={maskName(payeeName)}
            />
          </FormRow>
          <FormRow label="이체금액" required htmlFor="at-amount">
            <div className="flex w-full flex-col gap-1">
              <AmountField
                id="at-amount"
                value={form.amount}
                onChange={(v) => onChange("amount", v)}
                perTransferLimit={perTransferLimit}
                dailyRemaining={perTransferLimit}
                showDailyLimit={false}
              />
              <p className="text-2xs text-ink-muted">
                ※ 1회 이체한도 범위 내에서 1원 이상의 정수만 입력할 수 있으며, 0원과 소수는 입력할 수 없습니다. 잔액과 1일 이체한도는 각 회차 실행 시점에 검증됩니다.
              </p>
            </div>
          </FormRow>
          <FormRow label={<FieldLabel>받는분 통장 표시내용</FieldLabel>} htmlFor="at-memo-payee">
            <div className="flex w-full flex-col gap-1">
              <MemoField
                id="at-memo-payee"
                value={form.payeeMemo}
                onChange={(v) => onChange("payeeMemo", v)}
                placeholder="받는분 통장에 표시 (7자 이내)"
              />
              <p className="text-2xs text-ink-muted">
                ※ 미입력 시 받는 분 표시내용은 본인 예금주명, 내 표시내용은 상대방 예금주명이 기본 적용됩니다.
              </p>
            </div>
          </FormRow>
          <FormRow label={<FieldLabel>내 통장 표시내용</FieldLabel>} htmlFor="at-memo-mine">
            <MemoField
              id="at-memo-mine"
              value={form.myMemo}
              onChange={(v) => onChange("myMemo", v)}
              placeholder="내 통장에 표시 (7자 이내)"
            />
          </FormRow>
        </div>
      </FormSection>

      <FormSection title="이체주기">
        <div>
          <FormRow label={<FieldLabel>이체주기</FieldLabel>} required htmlFor="at-cycle">
            <TransferCycleField
              id="at-cycle"
              value={form.cycleMonths}
              onChange={(v) => onChange("cycleMonths", v)}
            />
          </FormRow>
          <FormRow label={<FieldLabel>이체지정일</FieldLabel>} required htmlFor="at-day">
            <DayOfMonthField
              id="at-day"
              value={form.dayOfMonth}
              onChange={(v) => onChange("dayOfMonth", v)}
            />
          </FormRow>
          <FormRow label={<FieldLabel>이체 시작일</FieldLabel>} required htmlFor="at-start">
            <TransferDateField
              id="at-start"
              value={form.startDate}
              onChange={(v) => onChange("startDate", v)}
              today={today}
              rangeLabel="이체 시작일"
            />
          </FormRow>
          <FormRow label={<FieldLabel>이체 종료일</FieldLabel>} required htmlFor="at-end">
            {form.startDate ? (
              <TransferEndDateField
                id="at-end"
                value={form.endDate}
                onChange={(v) => onChange("endDate", v)}
                startDate={form.startDate}
              />
            ) : (
              <p className="text-sm text-ink-muted">이체 시작일을 먼저 선택하세요.</p>
            )}
          </FormRow>
        </div>
      </FormSection>

      {duplicate && (
        <p role="alert" className="text-sm font-bold text-[var(--color-danger)]">
          출금계좌·입금계좌·이체지정일이 모두 같은 자동이체가 이미 정상 등록되어 있습니다. 자동이체 조회/변경/해지에서 기존 등록 건을 확인하세요.
        </p>
      )}
    </StepLayout>

    <NoticeBoxFooter
      className="mt-8"
      items={[
        "자동이체는 당행 계좌 간, 이체주기에 따라 반복 실행되는 이체입니다. 1회만 실행되는 이체는 예약이체에서 등록하세요.",
        "출금계좌와 입금계좌가 동일하면 이체할 수 없습니다.",
        "잔액과 1일 이체한도는 등록 시점이 아닌 각 회차 실행 시점에 검증됩니다.",
        "출금계좌·입금계좌·이체지정일은 등록 후 변경할 수 없으며, 변경하려면 해지 후 다시 등록해야 합니다.",
        "이체 실행 전 계좌비밀번호와 OTP 인증이 필요합니다.",
      ]}
    />
    </>
  )
}
