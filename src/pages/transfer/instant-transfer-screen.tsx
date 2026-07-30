import * as React from "react"
import {
  MOCK_TRANSFER_ACCOUNTS,
  MOCK_TRANSFER_LIMITS,
  MOCK_PAYEE_NAME,
} from "@/lib/mock/transfer"
import {
  formatAccountNo,
  formatAmount,
  formatDateTime,
  maskName,
} from "@/shared/lib/format"
import { InstantTransferStep1 } from "./instant-transfer/step-1-input"
import { InstantTransferStep2 } from "./instant-transfer/step-2-confirm"
import { InstantTransferStep3 } from "./instant-transfer/step-3-result"

export interface InstantTransferForm {
  fromAccount: string
  password: string
  toAccount: string
  toConfirmed: boolean
  amount: number | null
  payeeMemo: string
  myMemo: string
}

const STEPS = ["정보입력", "정보확인 및 인증", "완료"]
const BASE_TIME = "2026-07-23T08:57:34"

const INITIAL_FORM: InstantTransferForm = {
  fromAccount: MOCK_TRANSFER_ACCOUNTS[0].accountNo,
  password: "",
  toAccount: "",
  toConfirmed: false,
  amount: null,
  payeeMemo: "",
  myMemo: "",
}

/**
 * D-01 ~ D-03 assembly. Holds the shared form state and step index; each step
 * is a pure presentation component that receives values and callbacks.
 */
export function InstantTransferScreen() {
  const [step, setStep] = React.useState(1)
  const [form, setForm] = React.useState<InstantTransferForm>(INITIAL_FORM)

  const dailyRemaining =
    MOCK_TRANSFER_LIMITS.perDay - MOCK_TRANSFER_LIMITS.usedToday
  const perTransferLimit = MOCK_TRANSFER_LIMITS.perTransfer
  const effectiveLimit = Math.min(perTransferLimit, dailyRemaining)

  const setField = <K extends keyof InstantTransferForm>(
    key: K,
    value: InstantTransferForm[K],
  ) => setForm((prev) => ({ ...prev, [key]: value }))

  const selectedAccount = MOCK_TRANSFER_ACCOUNTS.find(
    (a) => a.accountNo === form.fromAccount,
  )

  const canSubmit =
    form.password.length === 4 &&
    form.toConfirmed &&
    form.amount != null &&
    form.amount > 0 &&
    form.amount <= effectiveLimit

  if (step === 2) {
    return (
      <InstantTransferStep2
        steps={STEPS}
        scheduledAt={
          <span className="tabular-nums">{formatDateTime(BASE_TIME)}</span>
        }
        fromAccount={
          <span className="tabular-nums">
            {selectedAccount?.alias} {formatAccountNo(form.fromAccount)}
          </span>
        }
        toAccount={
          <span className="tabular-nums">{formatAccountNo(form.toAccount)}</span>
        }
        payeeName={maskName(MOCK_PAYEE_NAME)}
        amount={formatAmount(form.amount ?? 0, { suffix: false })}
        fee={formatAmount(0, { suffix: false })}
        payeeMemo={form.payeeMemo || "-"}
        onPrev={() => setStep(1)}
        onSubmit={() => setStep(3)}
      />
    )
  }

  if (step === 3) {
    return (
      <InstantTransferStep3
        steps={STEPS}
        onNewTransfer={() => {
          setForm(INITIAL_FORM)
          setStep(1)
        }}
      />
    )
  }

  return (
    <InstantTransferStep1
      steps={STEPS}
      accounts={MOCK_TRANSFER_ACCOUNTS}
      form={form}
      onChange={setField}
      perTransferLimit={perTransferLimit}
      dailyRemaining={dailyRemaining}
      payeeName={MOCK_PAYEE_NAME}
      canSubmit={canSubmit}
      onNext={() => setStep(2)}
    />
  )
}
