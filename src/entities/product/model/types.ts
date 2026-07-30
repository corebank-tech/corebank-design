import type { AccountOption } from "@/shared/types/account"

/** 취급 상품은 정기예금·정기적금 2종뿐이다(POL-029). */
export type ProductCategory = "정기예금" | "정기적금"

/**
 * 상품가입·회원가입 약관동의 항목.
 * required=true 인 항목이 모두 체크되어야 다음 단계로 넘어갈 수 있다.
 */
export type TermItem = {
  id: string
  /** 필수 동의 항목 여부. */
  required: boolean
  title: string
  /** 항목 하단에 노출되는 동의 질문 문구. */
  question: string
  /** [보기] 모달에 표시되는 약관 전문. */
  body: string
}

/** 상품목록(C-01)에 노출되는 정기예금·정기적금 카드. */
export type ProductCard = {
  id: string
  category: ProductCategory
  name: string
  summary: string
  /** 최고 금리 (연, 세전, %). */
  maxRate: number
  /** 기본 금리 (연, 세전, %). */
  baseRate: number
  /** 가입기간 표기 문자열. */
  period: string
  /** 최소 가입금액 (원). */
  minAmount: number
  /** 가입금액 상한 (원). */
  maxAmount: number
  /** 최신순 정렬 기준일 (YYYY-MM-DD). */
  updatedAt: string
}

export type ProductGuideItem = {
  label: string
  value: string
}

export type ProductRateRow = {
  period: string
  /** 기본금리 (%). */
  baseRate: number
  /** 우대금리 (%). */
  primeRate: number
  /** 최고금리 (%). */
  maxRate: number
}

/** 상품상세(C-02) 데이터. 상품목록(C-01)의 id 별로 조회한다. */
export type ProductDetailData = {
  id: string
  category: ProductCategory
  name: string
  summary: string
  /** 최고 금리 (연, 세전, %). */
  maxRate: number
  period: string
  minAmount: number
  maxAmount: number
  interestMethod: string
  guide: ProductGuideItem[]
  rates: ProductRateRow[]
  notices: string[]
}

export type ProductJoinMaster = {
  id: string
  category: ProductCategory
  name: string
  /** 적용금리, 연 세전 %. Phase 1 데모용 고정값(POL-030). */
  rate: number
  minTermMonths: number
  maxTermMonths: number
  minAmount: number
  maxAmount: number
  /** 가입 완료 화면에 노출할 신규계좌번호(모의), 12자리. */
  mockNewAccountNo: string
}

export type JoinWithdrawAccount = AccountOption & {
  /** 계좌비밀번호 인증용 모의 값(4자리). */
  mockPassword: string
}
