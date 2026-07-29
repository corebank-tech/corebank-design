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
