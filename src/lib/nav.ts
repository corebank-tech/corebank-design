export interface NavGroup {
  title: string
  items: string[]
}

export interface NavCategory {
  id: string
  label: string
  groups: NavGroup[]
}

export const NAV: NavCategory[] = [
  {
    id: "inquiry",
    label: "조회",
    groups: [
      {
        title: "계좌조회",
        items: ["잔액조회", "거래내역조회", "통합계좌조회", "예금상세조회"],
      },
      {
        title: "이체결과",
        items: ["이체결과조회", "자동이체조회", "예약이체조회"],
      },
      {
        title: "증명서/명세",
        items: ["잔액증명서", "거래명세서", "이자내역조회"],
      },
    ],
  },
  {
    id: "transfer",
    label: "이체",
    groups: [
      {
        title: "즉시이체",
        items: ["계좌이체", "다건이체", "본인계좌이체"],
      },
      {
        title: "예약이체",
        items: ["예약이체 등록", "예약이체 조회/해지"],
      },
      {
        title: "자동이체",
        items: ["자동이체 등록", "자동이체 관리", "출금이체 동의"],
      },
    ],
  },
  {
    id: "product",
    label: "금융상품",
    groups: [
      {
        title: "예금/적금",
        items: ["정기예금 가입", "정기적금 가입", "입출금통장 개설"],
      },
    ],
  },
  {
    id: "user",
    label: "사용자관리",
    groups: [
      {
        title: "개인정보",
        items: ["기본정보 관리", "연락처 관리", "주소 관리"],
      },
      {
        title: "보안설정",
        items: ["비밀번호 변경", "이체한도 관리", "간편비밀번호"],
      },
      {
        title: "인증/기기",
        items: ["인증서 관리", "이용기기 관리", "로그인 이력"],
      },
    ],
  },
]
