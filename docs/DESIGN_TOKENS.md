# CoreBank 디자인 토큰

> 단일 출처: `src/globals.css`. 이 문서는 그 안의 CSS 변수를 용도·적용 층위 기준으로 정리한 참조표다.
> 모든 컴포넌트는 변수만 참조하며 hex·rgb 리터럴, Tailwind 기본 색상 클래스, 투명도 표기(`text-white/70` 등)를 사용하지 않는다(POL-039).

## 0. 테마 현황

과거 Theme A / Theme B 두 벌을 검토한 이력이 있으나, 현재는 **Theme B 단일 테마**로 운영한다.
`globals.css`에는 `:root` 정의 하나만 존재하며 `data-theme` 같은 테마 전환 인프라는 없다.
따라서 이 문서에는 테마 간 대응표를 두지 않는다.

## 1. 색상 토큰

### 1.1 브랜드 — 구조색과 상호작용색 분리

| 토큰 | 값 | 용도 | 적용 층위 |
|---|---|---|---|
| `--color-navy` | `#0a2e7d` | 페이지를 바닥에 고정하는 구조색. **DataGrid 상단 룰, FormSection 하단 라인 전용.** 장식(배경·버튼 등)에 쓰지 않는다 | 표 컨테이너 상단 보더, 폼 섹션 하단 보더 |
| `--color-primary` | `#0f5ae0` | 버튼·탭·링크 등 상호작용 요소 전용 | 컨트롤 |
| `--color-primary-hover` | `#0a45b0` | primary 요소의 hover 상태 | 컨트롤 |
| `--color-primary-soft` | `#5a8cf0` | 브레드크럼 바 강조 | 전면 바 |
| `--color-primary-tint` | `#ecf2fe` | 안내 박스(notice box) 배경 | 업무 블록 |
| `--color-accent` / `--color-accent-hover` | `#0f5ae0` / `#0a45b0` | primary와 동일 계열의 강조 액션 | 컨트롤 |
| `--color-link` | `#0f5ae0` | 본문 내 인라인 텍스트 링크 | 텍스트 |

### 1.2 뉴트럴

| 토큰 | 값 | 용도 | 적용 층위 |
|---|---|---|---|
| `--color-surface` | `#f3f5f8` | 폼 라벨 셀 배경 | 업무 블록 내부 |
| `--color-surface-2` | `#fafbfc` | 페이지 바탕(html/body) | 전역 |
| `--color-border` | `#e1e5ea` | 기본 보더 (전역 `* { border-color }`) | 전역 |
| `--color-border-strong` | `#c3c9d2` | 강조 보더 (체크박스 등 컨트롤 외곽) | 컨트롤 |
| `--color-footer-bg` | `#f9fafb` | 푸터 배경 | 전면 바 |
| `--color-ink` | `#17202e` | 본문 주 텍스트 | 텍스트 |
| `--color-ink-muted` | `#4b5563` | 보조 텍스트 | 텍스트 |
| `--color-ink-faint` | `#8a93a0` | 후퇴 라벨, 각주, 메타 텍스트 | 텍스트 |
| `--color-white` | `#ffffff` | 흰 표면(예외적으로 리터럴 허용) | 카드·모달·페이지 배경 |

### 1.3 피드백 — 기관 톤(저채도)

| 토큰 | 값 | 용도 |
|---|---|---|
| `--color-danger` / `--color-danger-tint` | `#c8322e` / `#fbf0ef` | 오류 텍스트/배경 |
| `--color-success` | `#12703f` | 성공 상태 |
| `--color-warning` | `#a35c00` | 경고 상태 |
| `--color-info` | `#17539e` | 정보성 안내 |

### 1.4 그리드/원장 전용

| 토큰 | 값 | 용도 |
|---|---|---|
| `--color-deposit` | `#17539e` | 입금 금액 표시색 |
| `--color-withdraw` | `#c8322e` | 출금 금액 표시색 |

### 1.5 shadcn 스타일 시맨틱 매핑

`--background`, `--foreground`, `--card`, `--popover`, `--primary`, `--secondary`, `--muted`, `--accent`, `--destructive`, `--border`, `--input`, `--ring` 등은 위 원시 토큰(raw token)을 shadcn 컴포넌트 관례에 맞게 재매핑한 시맨틱 계층이다. 직접 새 값을 정의하지 않고 전부 `var(--color-*)`를 참조한다. 신규 컴포넌트는 원시 토큰(`--color-ink` 등)을 직접 참조해도 되고, shadcn 계열 프리미티브를 쓸 때는 시맨틱 토큰을 참조한다.

## 2. 타이포 — 9단 스케일

| 토큰 | 값 | 용도 |
|---|---|---|
| `--text-page` | 26px | 페이지 타이틀 (1개 화면당 지배 요소 1개 원칙) |
| `--text-h2` | 20px | 섹션 타이틀 |
| `--text-h3` | 17px | 서브 섹션 타이틀 |
| `--text-lg` | 16px | 강조 본문 |
| `--text-md` | 15px | 준본문 |
| `--text-base` | 14px | 기본 본문 (POL-041 밀도 기준) |
| `--text-sm` | 13px | 표 셀 (POL-041) |
| `--text-xs` | 12px | 후퇴 라벨 |
| `--text-2xs` | 11px | 기준일시·각주·메타 — 반드시 이 값을 쓴다 |

화면마다 지배 요소를 하나만 `--text-page`/`--text-h2`로 지정하고, 나머지 라벨은 `--text-xs` + `--color-ink-faint`로 후퇴시킨다.

## 3. 간격 — 3단 리듬

| 토큰 | 값 | 리듬 층위 |
|---|---|---|
| `--space-1` | 4px | 그룹 내부(하한) |
| `--space-2` | 8px | 그룹 내부(상한) |
| `--space-3` | 12px | 블록 사이(하한) |
| `--space-4` | 16px | 블록 사이(상한) |
| `--space-5` | 20px | (보조) |
| `--space-6` | 24px | (보조) |
| `--space-8` | 32px | 섹션 사이(하한) |
| `--space-10` | 40px | 섹션 사이(상한) |
| `--space-12` | 48px | (보조) |

적용 원칙: 그룹 내부 4~8px / 블록 사이 12~16px / 섹션 사이 32~40px.

## 4. 모서리 반경(radius) — POL-040

radius는 장식이 아니라 **포함 관계**를 나타낸다. 값을 늘리는 것이 아니라 컴포넌트가 속한 층위를 표현하는 수단이다.

| 토큰 | 값 | 층위 | 대상 | 코드 내 사용처 |
|---|---|---|---|---|
| (없음, `0`) | 0px | 전면 바 | AppHeader, Footer, 전체메뉴 레이어 | 클래스 미부여 |
| `--radius-lg` | 16px | 컨테이너 | 모달, 상품 카드 | `shared/ui/modal.tsx`, `pages/product/product-card-grid.tsx`, `pages/product/product-detail.tsx` |
| (없음, `0`) | 0px | 업무 블록 | 폼 섹션, 조회 결과, 대시보드 패널 | 클래스 미부여, 보더로만 구분 |
| `--radius` | 10px | 컨트롤 | Button, Input, Select, Checkbox, Radio | `shared/ui/button.tsx`, `input.tsx`, `select.tsx` |
| `--radius-sm` | 6px | 소형 표식 | Badge, 스텝 숫자 | `shared/ui/badge.tsx`, `checkbox.tsx`(외곽선) |
| `--radius-pill` | 999px | 토글 칩 | 상태 토글, 기간 칩, 금액 칩 | `widgets/query/search-fields.tsx`, `widgets/transfer/transfer-fields.tsx` |
| (없음, `0`) | 0px | 표 내부 | DataGrid 셀, FormRow, SummaryRow | 클래스 미부여 |

### 컨테이너 클리핑 원칙

- 자식 요소에 `rounded-t` / `rounded-b` / `rounded-l` / `rounded-r` 같은 방향별 반경을 **부여하지 않는다.**
- 대신 **컨테이너에 `overflow-hidden`**을 주어 자식(헤더 바, 하단 액션 바 등)을 컨테이너의 반경대로 클리핑한다.
  예: `shared/ui/modal.tsx`는 바깥 컨테이너에 `rounded-[var(--radius-lg)] overflow-hidden`만 주고, 내부 헤더/바디/푸터는 반경을 갖지 않는다.
- 중첩 시 **안쪽 반경 = 바깥쪽 반경 − 여백**. 예: `--radius-lg`(16px) 컨테이너 안에 8px 여백을 두고 앉는 카드는 8px 반경을 쓴다(고정 토큰이 없으면 임의 계산값을 인라인으로 쓰지 않고, 여백을 조정해 기존 토큰에 맞춘다).
- 페이지 배경은 흰색이다. 회색 배경 위에 흰 카드를 띄우는 레이아웃(그림자로 뜨는 카드형 대시보드)을 쓰지 않는다. 업무 블록은 그림자 없이 1px 보더로만 구분한다.

## 5. 그림자(elevation)

| 토큰 | 값 | 용도 |
|---|---|---|
| `--shadow-card` | `0 1px 2px rgba(25,31,40,.03), 0 4px 16px rgba(25,31,40,.06)` | 옅은 카드 부상감(상품 카드 등) |
| `--shadow-pop` | `0 8px 32px rgba(25,31,40,.14)` | 모달·전체메뉴 레이어처럼 페이지 위에 뜨는 레이어 |

업무 블록(폼 섹션, 조회 결과, 대시보드 패널)에는 그림자를 쓰지 않는다. 그림자는 "페이지 위에 진짜로 떠 있는" 레이어(모달, 오버레이)에만 한정한다.

## 6. 굵기(weight)

색이 아니라 굵기로 위계를 만든다(피드백 색상을 장식적으로 남용하지 않기 위함).

| 토큰 | 값 | 용도 |
|---|---|---|
| `--weight-label` | 500 | 라벨 텍스트 |
| `--weight-value` | 700 | 값/수치 텍스트 |
| `--weight-heading` | 700 | 헤딩 |

## 7. 기타 전역 토큰

| 토큰 | 값 | 용도 |
|---|---|---|
| `--font-sans` | `"Pretendard Variable", Pretendard, -apple-system, sans-serif` | 전역 폰트 |
| `--z-header` | 100 | 헤더 |
| `--z-dropdown` | 200 | GNB 드롭다운 |
| `--z-overlay` | 300 | 전체메뉴 레이어 |
| `--z-modal` | 400 | 모달 |
| `--z-toast` | 500 | 토스트/알림 |

## 8. 참조

- 토큰 관리 방식(REQ-NFR-021 / POL-039): CSS 변수 단일 정의. 색상 리터럴 직접 기술 금지.
- radius 스케일 정의(POL-040): sm 6px / base 10px / lg 16px / pill 999px.
- 데이터 표시 밀도(POL-041): 표 행 높이 44px / 본문 14px / 표 13px.
