import type { TermItem } from "@/components/product/terms-agreement"
import type { ProductCard } from "@/components/product/product-card-grid"
import type { ProductDetailData } from "@/components/product/product-detail"

/**
 * 상품가입·회원가입 약관동의 항목.
 * required=true 인 항목이 모두 체크되어야 다음 단계로 넘어갈 수 있다.
 */
export const MOCK_JOIN_TERMS: TermItem[] = [
  {
    id: "term-service",
    required: true,
    title: "예금거래 기본약관",
    question: "예금거래 기본약관을 확인하였으며 이에 동의합니다.",
    body: "제1조(적용범위) 이 약관은 CoreBank와 예금주 사이의 예금거래에 적용됩니다.\n제2조(실명거래) 예금주는 실명으로 거래하여야 하며, 실명확인 절차에 협조하여야 합니다.\n제3조(입금) 예금주가 창구 또는 전자적 장치를 통해 입금한 자금은 은행이 확인한 시점에 예금으로 성립합니다.\n제4조(지급) 은행은 예금주의 지급청구에 따라 예금을 지급하며, 지급 시 본인 여부를 확인합니다.\n제5조(이자) 이자는 약정한 이율과 방식에 따라 계산하여 지급합니다.",
  },
  {
    id: "term-deposit-detail",
    required: true,
    title: "예금상품 상세약관",
    question: "가입하려는 예금상품의 상세약관을 확인하였으며 이에 동의합니다.",
    body: "제1조(상품내용) 이 약관은 정기예금 및 정기적금 상품의 가입기간, 이율, 이자지급방식에 관한 사항을 정합니다.\n제2조(가입기간) 가입기간은 상품별로 정한 범위 내에서 선택할 수 있습니다.\n제3조(중도해지) 만기 전 해지 시 중도해지이율이 적용되며, 약정이율보다 낮은 이율이 적용됩니다.\n제4조(자동해지) 만기일에 별도 지시가 없으면 원리금은 지정한 출금계좌로 입금됩니다.",
  },
  {
    id: "term-privacy",
    required: true,
    title: "개인정보 수집·이용 동의",
    question: "개인정보의 수집 및 이용 목적을 확인하였으며 이에 동의합니다.",
    body: "1. 수집항목: 성명, 생년월일, 연락처, 계좌정보\n2. 수집·이용 목적: 예금상품 가입 및 계약 이행, 본인확인, 금융거래 관련 안내\n3. 보유·이용 기간: 거래 종료 후 관련 법령에서 정한 기간까지 보관합니다.\n4. 동의를 거부할 권리가 있으나, 거부 시 상품 가입이 제한됩니다.",
  },
  {
    id: "term-marketing",
    required: false,
    title: "마케팅 정보 수신 동의",
    question: "상품·이벤트 안내를 위한 마케팅 정보 수신에 동의합니다.",
    body: "1. 수신내용: 신규 상품, 금리 우대, 이벤트 등 혜택 안내\n2. 수신방법: 문자메시지, 전자우편, 앱 알림\n3. 이 동의는 선택사항이며, 동의하지 않아도 상품 가입에는 영향이 없습니다.\n4. 수신 동의는 언제든지 철회할 수 있습니다.",
  },
]

/** 상품목록(C-01)에 노출되는 정기예금·정기적금 카드. */
export const MOCK_PRODUCTS: ProductCard[] = [
  {
    id: "P001",
    category: "정기예금",
    name: "코어 정기예금",
    summary: "여윳돈을 안전하게 굴리는 기본 정기예금입니다.",
    maxRate: 3.85,
    period: "6개월 ~ 36개월",
    minAmount: 100_000,
    updatedAt: "2026-07-20",
  },
  {
    id: "P002",
    category: "정기적금",
    name: "코어 자유적금",
    summary: "매달 원하는 금액을 자유롭게 납입하는 적금입니다.",
    maxRate: 4.20,
    period: "12개월 ~ 36개월",
    minAmount: 10_000,
    updatedAt: "2026-07-25",
  },
  {
    id: "P003",
    category: "정기예금",
    name: "코어 목돈예금",
    summary: "목돈을 장기간 예치할수록 금리가 높아지는 예금입니다.",
    maxRate: 4.05,
    period: "12개월 ~ 60개월",
    minAmount: 1_000_000,
    updatedAt: "2026-07-18",
  },
  {
    id: "P004",
    category: "정기적금",
    name: "코어 정기적금",
    summary: "매달 같은 금액을 납입해 만기에 목돈을 만드는 적금입니다.",
    maxRate: 4.35,
    period: "6개월 ~ 24개월",
    minAmount: 50_000,
    updatedAt: "2026-07-22",
  },
  {
    id: "P005",
    category: "정기예금",
    name: "코어 단기예금",
    summary: "짧은 기간 자금을 예치하기 좋은 단기 정기예금입니다.",
    maxRate: 3.40,
    period: "1개월 ~ 12개월",
    minAmount: 500_000,
    updatedAt: "2026-07-15",
  },
  {
    id: "P006",
    category: "정기적금",
    name: "코어 목표적금",
    summary: "목표 금액을 정해 꾸준히 모으는 정기적금입니다.",
    maxRate: 4.50,
    period: "12개월 ~ 36개월",
    minAmount: 30_000,
    updatedAt: "2026-07-28",
  },
]

/** 상품상세(C-02) 데이터. 상품목록의 id 와 대응한다. */
export const MOCK_PRODUCT_DETAIL: ProductDetailData = {
  id: "P001",
  category: "정기예금",
  name: "코어 정기예금",
  summary: "여윳돈을 안전하게 굴리는 기본 정기예금입니다.",
  maxRate: 3.85,
  period: "6개월 ~ 36개월",
  minAmount: 100_000,
  maxAmount: 500_000_000,
  interestMethod: "만기일시지급식",
  guide: [
    { label: "가입대상", value: "실명의 개인 및 개인사업자 (1인 1계좌)" },
    { label: "가입기간", value: "6개월 이상 36개월 이하 (월 단위 선택)" },
    { label: "가입금액", value: "최소 100,000원 이상, 최대 5억원 이하" },
    { label: "이자지급시기", value: "만기일에 원금과 이자를 함께 지급합니다." },
    { label: "중도해지", value: "만기 전 해지 시 중도해지이율이 적용됩니다." },
  ],
  rates: [
    { period: "6개월", baseRate: 3.10, primeRate: 0.25, maxRate: 3.35 },
    { period: "12개월", baseRate: 3.45, primeRate: 0.30, maxRate: 3.75 },
    { period: "24개월", baseRate: 3.55, primeRate: 0.30, maxRate: 3.85 },
    { period: "36개월", baseRate: 3.60, primeRate: 0.25, maxRate: 3.85 },
  ],
  notices: [
    "이 상품의 금리는 가입일 기준으로 확정되며, 가입 후 시장금리 변동과 무관하게 유지됩니다.",
    "우대금리는 조건 충족 여부에 따라 적용되며, 조건 미충족 시 기본금리만 적용됩니다.",
    "만기 전 중도해지 시 약정이율보다 낮은 중도해지이율이 적용되어 이자가 줄어듭니다.",
    "세금은 관련 세법에 따라 부과되며, 표시된 금리는 세전 기준입니다.",
  ],
}
