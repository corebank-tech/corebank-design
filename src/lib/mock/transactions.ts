import type { AccountOption } from "@/components/query/fields"

export interface Transaction {
  id: string
  /** ISO datetime string. */
  datetime: string
  description: string
  withdraw: number
  deposit: number
  balance: number
  branch: string
}

export const MOCK_ACCOUNTS: AccountOption[] = [
  { alias: "자유입출금", accountNo: "110632892336", balance: 12340500 },
  { alias: "급여통장", accountNo: "302998112233", balance: 3860000 },
  { alias: "비상금통장", accountNo: "255104778910", balance: 1500000 },
]

/** 12 rows, most recent first, for account 110-632-892336. */
export const MOCK_TRANSACTIONS: Transaction[] = [
  { id: "t12", datetime: "2026-07-23T08:41:02", description: "급여", withdraw: 0, deposit: 2_850_000, balance: 12_340_500, branch: "본점영업부" },
  { id: "t11", datetime: "2026-07-22T19:12:47", description: "카드대금 결제", withdraw: 642_000, deposit: 0, balance: 9_490_500, branch: "인터넷뱅킹" },
  { id: "t10", datetime: "2026-07-21T13:05:33", description: "관리비 자동이체", withdraw: 187_400, deposit: 0, balance: 10_132_500, branch: "자동이체" },
  { id: "t09", datetime: "2026-07-20T11:48:10", description: "이자입금", withdraw: 0, deposit: 3_120, balance: 10_319_900, branch: "본점영업부" },
  { id: "t08", datetime: "2026-07-18T09:26:55", description: "ATM 출금", withdraw: 300_000, deposit: 0, balance: 10_316_780, branch: "강남지점" },
  { id: "t07", datetime: "2026-07-16T20:02:14", description: "통신요금", withdraw: 55_900, deposit: 0, balance: 10_616_780, branch: "자동이체" },
  { id: "t06", datetime: "2026-07-14T15:33:41", description: "이체입금 김민수", withdraw: 0, deposit: 500_000, balance: 10_672_680, branch: "인터넷뱅킹" },
  { id: "t05", datetime: "2026-07-11T10:17:08", description: "보험료", withdraw: 128_000, deposit: 0, balance: 10_172_680, branch: "자동이체" },
  { id: "t04", datetime: "2026-07-08T18:44:29", description: "온라인쇼핑 결제", withdraw: 94_300, deposit: 0, balance: 10_300_680, branch: "인터넷뱅킹" },
  { id: "t03", datetime: "2026-07-05T12:00:00", description: "적금 자동이체", withdraw: 500_000, deposit: 0, balance: 10_394_980, branch: "자동이체" },
  { id: "t02", datetime: "2026-07-02T09:10:52", description: "이체입금 이서연", withdraw: 0, deposit: 1_200_000, balance: 10_894_980, branch: "인터넷뱅킹" },
  { id: "t01", datetime: "2026-06-30T08:05:00", description: "이자입금", withdraw: 0, deposit: 2_540, balance: 9_694_980, branch: "본점영업부" },
]
