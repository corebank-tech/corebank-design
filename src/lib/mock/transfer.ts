import type { AccountOption } from "@/shared/types/account"

/** Withdrawal accounts available to the signed-in customer. */
export const MOCK_TRANSFER_ACCOUNTS: AccountOption[] = [
  { alias: "자유입출금", accountNo: "110632892336", balance: 12340500, withdrawable: 12000000 },
  { alias: "급여통장", accountNo: "302998112233", balance: 3860000, withdrawable: 3860000 },
  { alias: "비상금통장", accountNo: "255104778910", balance: 1500000, withdrawable: 1500000 },
]

/** Transfer limits for the demo customer, in KRW. */
export const MOCK_TRANSFER_LIMITS = {
  /** 1회 이체한도 */
  perTransfer: 1_000_000,
  /** 1일 이체한도 */
  perDay: 5_000_000,
  /** 당일 이미 사용한 이체금액 */
  usedToday: 500_000,
}

/** Resolved payee name for a confirmed deposit account number. */
export const MOCK_PAYEE_NAME = "김민수"

/** One completed instant-transfer used to fill the result summary grid. */
export interface TransferResultRow {
  processedAt: string
  fromAccountNo: string
  toAccountNo: string
  payeeName: string
  amount: number
  fee: number
  memo: string
}

export const MOCK_TRANSFER_RESULT: TransferResultRow = {
  processedAt: "2026-07-23T08:57:34",
  fromAccountNo: "110632892336",
  toAccountNo: "333330730135",
  payeeName: MOCK_PAYEE_NAME,
  amount: 500_000,
  fee: 0,
  memo: "-",
}
