export interface NavItem {
  label: string
  /** 요구사항정의서 화면목록 기준 화면ID (추적성 대조용) */
  screenId: string
}

export interface NavGroup {
  title: string
  items: NavItem[]
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
        items: [
          { label: "전체계좌조회", screenId: "B-01" },
          { label: "예금/적금 계좌조회", screenId: "B-02" },
          { label: "거래내역조회", screenId: "B-03" },
        ],
      },
    ],
  },
  {
    id: "transfer",
    label: "이체",
    groups: [
      {
        title: "즉시이체",
        items: [
          { label: "당행이체", screenId: "D-01" },
          { label: "이체결과조회", screenId: "D-04" },
        ],
      },
      {
        title: "예약이체",
        items: [
          { label: "예약이체 등록", screenId: "E-01" },
          { label: "예약이체 조회/취소", screenId: "E-04" },
          { label: "예약이체 처리결과 조회", screenId: "E-05" },
        ],
      },
      {
        title: "자동이체",
        items: [
          { label: "자동이체 등록", screenId: "G-01" },
          { label: "자동이체 조회/변경/해지", screenId: "G-04" },
          { label: "자동이체결과 조회", screenId: "G-05" },
        ],
      },
    ],
  },
  {
    id: "product",
    label: "금융상품",
    groups: [
      {
        title: "예금/적금",
        items: [
          { label: "상품목록", screenId: "C-01" },
          { label: "상품상세", screenId: "C-02" },
        ],
      },
    ],
  },
  {
    id: "user",
    label: "사용자관리",
    groups: [
      {
        title: "개인정보",
        items: [
          { label: "고객정보 관리", screenId: "F-01" },
          { label: "비밀번호 변경", screenId: "F-01" },
        ],
      },
      {
        title: "계좌관리",
        items: [
          { label: "계좌비밀번호 변경", screenId: "B-04" },
          { label: "출금계좌관리", screenId: "B-05" },
          { label: "계좌별명 관리", screenId: "B-06" },
          { label: "계좌순서 변경", screenId: "B-07" },
        ],
      },
      {
        title: "이체설정",
        items: [{ label: "이체한도 관리", screenId: "D-05" }],
      },
    ],
  },
]
