# CoreBank 디자인 토큰

> 단일 출처: `src/globals.css`. 이 문서는 그 안의 CSS 변수를 용도·적용 층위 기준으로 정리한 참조표다.
> 모든 컴포넌트는 변수만 참조하며 hex·rgb 리터럴, Tailwind 기본 색상 클래스, 투명도 표기(`text-white/70` 등)를 사용하지 않는다(POL-039).

## 0. 테마 현황

`globals.css`에 `:root`(라이트, 기본값)와 `:root[data-theme="dark"]`(다크 오버라이드) 두 블록이
있다. 전환은 `<html data-theme="dark">` 속성으로 이뤄지며 `src/shared/lib/theme.ts`가 이 속성과
`localStorage("corebank-theme")`를 관리한다. 컴포넌트는 원시 토큰만 참조하므로(POL-039) 다크
오버라이드 블록만으로 대부분 자동 반영된다 — 컴포넌트 코드에 `dark:` 같은 조건부 클래스는 쓰지 않는다.

다크 테마는 `docs/requirements.md`에 근거 조항이 없다. 문서 정정 범위 밖의 사안이라 이 문서는
현재 코드 상태만 기술한다.

## 1. 색상 토큰

### 1.1 브랜드 — 구조색과 상호작용색 분리

| 토큰 | 라이트 | 다크 | 용도 | 적용 층위 |
|---|---|---|---|---|
| `--color-navy` | `#0a2e7d` | `#3c71dd` | 페이지를 바닥에 고정하는 구조색. **DataGrid 상단 룰, FormSection 하단 라인 전용.** 장식(배경·버튼 등)에 쓰지 않는다 | 표 컨테이너 상단 보더, 폼 섹션 하단 보더 |
| `--color-primary` | `#0a60f5` | `#5a95f7` | 버튼·탭·링크 등 상호작용 요소 전용 | 컨트롤 |
| `--color-primary-hover` | `#0846ba` | `#7aa8ff` | primary 요소의 hover 상태 | 컨트롤 |
| `--color-primary-tint` | `#ecf2fe` | `#14203a` | 안내 박스(notice box) 배경 | 업무 블록 |
| `--color-link` | `#0a60f5` | `#7aa8ff` | 본문 내 인라인 텍스트 링크 | 텍스트 |

`--color-accent`/`-hover`(primary와 값이 같아 사문화)와 `--color-primary-soft`(참조 0건)는
제거했다 — 다시 만들지 않는다.

### 1.2 뉴트럴

| 토큰 | 라이트 | 다크 | 용도 | 적용 층위 |
|---|---|---|---|---|
| `--color-surface` | `#f3f5f8` | `#171c27` | 폼 라벨 셀 배경 | 업무 블록 내부 |
| `--color-surface-2` | `#fafbfc` | `#10141c` | **페이지 바탕**(html/body) | 전역 |
| `--color-surface-elevated` | `#ffffff` | `#232b3c` | 버튼·인풋·카드·모달 등 흰 표면. 다크에서 반전된다 | 컨트롤·컨테이너 |
| `--color-border` | `#e1e5ea` | `#545e77` | 기본 보더 (전역 `@layer base { * { border-color } }`) | 전역 |
| `--color-border-strong` | `#c3c9d2` | `#6b7590` | 강조 보더 (체크박스 등 컨트롤 외곽) | 컨트롤 |
| `--color-footer-bg` | `#f9fafb` | `#171c27` | 푸터 배경 | 전면 바 |
| `--color-ink` | `#17202e` | `#eceff4` | 본문 주 텍스트 | 텍스트 |
| `--color-ink-muted` | `#4b5563` | `#a7afbf` | 보조 텍스트 | 텍스트 |
| `--color-ink-faint` | `#6b7280` | `#8f97ab` | 후퇴 라벨, 각주, 메타 텍스트 | 텍스트 |
| `--color-white` | `#ffffff` | `#ffffff`(고정) | 색상 버튼 위 아이콘·텍스트처럼 테마와 무관하게 항상 흰색이어야 하는 값 | 컨트롤 위 콘텐츠 |

페이지 배경(`--color-surface-2`)과 흰 표면(`--color-surface-elevated`)은 서로 다른 토큰이다.
"페이지는 흰색, 카드는 그림자로 띄운다"가 아니라 **"페이지는 옅은 회백색 바탕, 업무 블록은
표면색 없이 1px 보더로만 구분"**이 실제 적용 방식이다(POL-040 참고).

### 1.3 피드백 — 기관 톤(저채도)

| 토큰 | 라이트 | 다크 | 용도 |
|---|---|---|---|
| `--color-danger` | `#d81e18` | `#f2645f` | 오류 텍스트 |
| `--color-danger-tint` | `#fbf0ef` | `#2c1614` | 오류 배경 |
| `--color-danger-hover` | primary-hover와 같은 방식(82% 혼합)으로 어둡게 한 danger | 좌동(85% 혼합, 밝게) | `Button variant="danger"`의 hover |
| `--color-danger-ring` | danger 20%+white 혼합 | danger 30%+surface-elevated 혼합 | 포커스 링 |
| `--color-success` | `#107f46` | `#2eb870` | 성공 상태 텍스트 |
| `--color-success-tint` | `#e7f4ee` | `#12281c` | 성공 상태 배경 |
| `--color-success-ring` | success 20%+white 혼합 | success 30%+surface-elevated 혼합 | 포커스 링 |
| `--color-warning` | `#ad6200` | `#f28f0d` | 경고 상태 텍스트 |
| `--color-warning-tint` | `#fbf3e2` | `#2c2110` | 경고 상태 배경 |
| `--color-warning-ring` | warning 20%+white 혼합 | warning 30%+surface-elevated 혼합 | 포커스 링 |
| `--color-info` | `#1359ae` | `#5597e7` | 정보성 안내 텍스트 |
| `--color-info-tint` | info 10%+white 혼합 | info 16%+surface-elevated 혼합 | 정보성 안내 배경 (Alert `info` variant) |
| `--color-info-border-soft` | info 20%+white 혼합 | info 30%+surface-elevated 혼합 | 정보성 안내 보더 |
| `--color-{primary,success,warning,danger}-border-soft` | 각 색 20% 고정 혼합값 | 테마별 재보정값 | Alert/Badge 테두리 전용. 컴포넌트에서 투명도 표기(`border-x/20`)를 쓰지 않기 위한 사전 계산값(POL-039) |
| `--color-ring-soft` | primary 30%+white 혼합 | primary 35%+surface-elevated 혼합 | 옅은 포커스 링 |
| `--color-skeleton` | border 60%+white 혼합 | border 60%+surface-elevated 혼합 | Skeleton 배경 |

`info`는 이전에 tint·border 토큰이 없어 실제로 쓸 수 없었다. 이번에 채워 Alert의 4개 variant가
전부 성립한다(단, 실 화면에서는 여전히 success·danger만 쓰인다 — info·warning은
`/design-system` 프리미티브 갤러리에서만 확인할 수 있다).

### 1.4 오버레이

뒤 배경이 고정색이 아니어서 실제 반투명이 필요한 곳 전용. 다른 색상 토큰과 달리 예외적으로
rgba를 직접 정의한다.

| 토큰 | 값 | 용도 |
|---|---|---|
| `--color-overlay-scrim` | 라이트 `rgba(23,32,46,.5)` / 다크 `rgba(0,0,0,.72)` | 모달 백드롭, 전체메뉴 레이어 |
| `--color-overlay-white-15` | `rgba(255,255,255,.15)` | 색상 바 위 아이콘버튼 hover |
| `--color-overlay-white-70` | `rgba(255,255,255,.7)` | 색상 바 위 포커스 링 |

### 1.5 그리드/원장 전용

| 토큰 | 라이트 | 다크 | 용도 |
|---|---|---|---|
| `--color-deposit` | `#0c5bbb` | `#3e8bea` | 입금 금액 표시색 |
| `--color-withdraw` | `#d81e18` | `#f2645f` | 출금 금액 표시색 |

### 1.6 shadcn 스타일 시맨틱 매핑

실제로 유틸리티가 쓰는 4개만 남아 있다: `--primary`, `--primary-foreground`, `--border`, `--ring`.
전부 위 원시 토큰(raw token)을 참조하며 직접 새 값을 정의하지 않는다. 나머지 shadcn 관례 변수
(`--background`/`--foreground`/`--card`/`--popover`/`--secondary`/`--muted`/`--accent`/
`--destructive`/`--input` 등 15개)는 정의만 있고 사용처가 0건이라 제거했다 — 신규 shadcn
프리미티브 도입 시 필요한 만큼만 다시 추가한다.

## 2. 타이포 — 9단 스케일

| 토큰 | 값 | 용도 |
|---|---|---|
| `--text-page` | 26px | 페이지 타이틀 (1개 화면당 지배 요소 1개 원칙) |
| `--text-h2` | 20px | 섹션 타이틀 |
| `--text-h3` | 17px | 서브 섹션 타이틀 |
| `--text-lg` | 16px | 강조 본문 |
| `--text-md` | 15px | 준본문 |
| `--text-base` | 14px | 기본 본문 (POL-041 밀도 기준) |
| `--text-sm` | 13px | 표 셀 외 압축 텍스트(모달 본문, Pagination, NoticeBox 등) |
| `--text-xs` | 12px | 후퇴 라벨 |
| `--text-2xs` | 11px | 기준일시·각주·메타 — 반드시 이 값을 쓴다 |

화면마다 지배 요소를 하나만 `--text-page`/`--text-h2`로 지정하고, 나머지 라벨은 `--text-xs` +
`--color-ink-faint`로 후퇴시킨다.

DataGrid·SummaryRow의 표 셀 텍스트는 `--text-sm`을 쓰지 않고 `text-[14px]`로 직접 고정돼
있다(POL-041 2026-07 3차 피드백: 표만 13→14px로 상향하되, 향후 9단 스케일 전체가 다시 바뀌어도
표 크기는 독립적으로 유지하기 위함). `--text-sm`(13px) 자체는 스케일에 남아 다른 압축 텍스트에
쓰인다.

## 3. 간격

전용 간격 토큰은 없다. Tailwind 기본 spacing 스케일(`--spacing: 0.25rem` 배수인 `gap-*`/`p-*`/
`m-*` 유틸리티)을 그대로 쓴다. 과거 있었던 `--space-1`~`--space-12` 리터럴은 `@theme`에
등록되지 않아 참조 0건이었으므로 제거했다 — 다시 만들지 않는다.

적용 원칙(3단 리듬): 그룹 내부 `gap-1`~`gap-2`(4~8px) / 블록 사이 `gap-3`~`gap-4`(12~16px) /
섹션 사이 `mb-8`~`mt-10`(32~40px).

## 4. 모서리 반경(radius) — POL-040

radius는 장식이 아니라 **포함 관계**를 나타낸다. 값을 늘리는 것이 아니라 컴포넌트가 속한 층위를 표현하는 수단이다.

| 토큰 | 값 | 층위 | 대상 | 코드 내 사용처 |
|---|---|---|---|---|
| (없음, `0`) | 0px | 전면 바 | AppHeader, Footer, 전체메뉴 레이어 | 클래스 미부여 |
| `--radius-lg` | 16px | 컨테이너 | 모달, 상품 카드 | `shared/ui/modal.tsx`, `pages/product/product-card-grid.tsx` |
| (없음, `0`) | 0px | 업무 블록 | 폼 섹션, 조회 결과, 대시보드 패널 | 클래스 미부여, 보더로만 구분 |
| `--radius` | 10px | 컨트롤 | Button, Input, Select, Checkbox, Radio | `shared/ui/button.tsx`, `input.tsx`, `select.tsx` |
| `--radius-md` | 10px(`--radius`의 별칭) | 컨트롤 | `rounded-md` 클래스로 참조할 때 | Tailwind `rounded-[var(--radius)]` 임의값 탈출구를 없애기 위한 별칭. `--radius`와 항상 같은 값이다 |
| `--radius-sm` | 6px | 소형 표식 | Badge, 스텝 숫자 | `shared/ui/badge.tsx`, `checkbox.tsx`(외곽선) |
| `--radius-pill` | 999px | 토글 칩 | 상태 토글, 기간 칩, 금액 칩, Chip 컴포넌트 | `shared/ui/chip.tsx` |
| (없음, `0`) | 0px | 표 내부 | DataGrid 셀, FormRow, SummaryRow | 클래스 미부여 |

원형 표식(아바타, IconButton `shape="circle"` 등)은 `rounded-full`(Tailwind 정적 유틸리티)을
쓴다 — 이 스케일에 속하지 않는 별도 케이스다.

### 컨테이너 클리핑 원칙

- 자식 요소에 `rounded-t` / `rounded-b` / `rounded-l` / `rounded-r` 같은 방향별 반경을 **부여하지 않는다.**
- 대신 **컨테이너에 `overflow-hidden`**을 주어 자식(헤더 바, 하단 액션 바 등)을 컨테이너의 반경대로 클리핑한다.
  예: `shared/ui/modal.tsx`는 바깥 컨테이너에 `rounded-[var(--radius-lg)] overflow-hidden`만 주고, 내부 헤더/바디/푸터는 반경을 갖지 않는다.
- 중첩 시 **안쪽 반경 = 바깥쪽 반경 − 여백**. 예: `--radius-lg`(16px) 컨테이너 안에 8px 여백을 두고 앉는 카드는 8px 반경을 쓴다(고정 토큰이 없으면 임의 계산값을 인라인으로 쓰지 않고, 여백을 조정해 기존 토큰에 맞춘다).
- 업무 블록(폼 섹션, 조회 결과, 대시보드 패널)은 표면색·그림자 없이 1px 보더로만 구분한다.

## 5. 그림자(elevation)

| 토큰 | 라이트 | 다크 | 용도 |
|---|---|---|---|
| `--shadow-card` | `0 1px 2px rgba(25,31,40,.03), 0 4px 16px rgba(25,31,40,.06)` | `0 1px 2px rgba(0,0,0,.24), 0 4px 16px rgba(0,0,0,.32)` | 옅은 카드 부상감(상품 카드 등) |
| `--shadow-pop` | `0 8px 32px rgba(25,31,40,.14)` | `0 8px 32px rgba(0,0,0,.48)` | 모달·전체메뉴 레이어처럼 페이지 위에 뜨는 레이어 |

다크에서는 라이트와 같은 낮은 알파값을 쓰면 어두운 배경 위에서 그림자가 사실상 보이지 않는다.
순검정 기반으로 알파를 크게 올려 별도 재정의한다.

업무 블록(폼 섹션, 조회 결과, 대시보드 패널)에는 그림자를 쓰지 않는다. 그림자는 "페이지 위에 진짜로 떠 있는" 레이어(모달, 오버레이)에만 한정한다.

## 6. 굵기(weight)

색이 아니라 굵기로 위계를 만든다(피드백 색상을 장식적으로 남용하지 않기 위함).

| 토큰 | 값 | 용도 |
|---|---|---|
| `--weight-label`(→ `font-label`) | 500 | 라벨 텍스트 |
| `--weight-value`(→ `font-value`) | 700 | 값/수치 텍스트 |
| `--weight-heading`(→ `font-heading`) | 700 | 헤딩 |

## 7. 자간(tracking)

인증코드·계좌번호 등 숫자 입력 필드 전용. 이름은 em 값을 그대로 딴 것이다.

| 토큰 | 값 |
|---|---|
| `--tracking-1` | 0.1em |
| `--tracking-15` | 0.15em |
| `--tracking-2` | 0.2em |
| `--tracking-3` | 0.3em |
| `--tracking-4` | 0.4em |

## 8. 푸터 시맨틱 토큰

푸터는 밝은 배경 위 어두운 텍스트로 고정돼 있어(다크 테마에서도 반전되지 않음) 별도 시맨틱
계층을 둔다. 전부 뉴트럴 원시 토큰을 재매핑한 값이다.

| 토큰 | 참조 |
|---|---|
| `--color-footer-fg` | `--color-ink-muted` |
| `--color-footer-fg-strong` | `--color-ink` |
| `--color-footer-fg-faint` | `--color-ink-faint` |
| `--color-footer-divider` | `--color-border` |
| `--color-footer-hover-bg` | `--color-surface` |

## 9. 기타 전역 토큰

| 토큰 | 값 | 용도 |
|---|---|---|
| `--font-sans` | `"Pretendard Variable", Pretendard, -apple-system, sans-serif` | 전역 폰트 |
| `--z-header`(→ `z-header`) | 100 | 헤더 |
| `--z-dropdown`(→ `z-dropdown`) | 200 | GNB 드롭다운 |
| `--z-overlay`(→ `z-overlay`) | 300 | 전체메뉴 레이어 |
| `--z-modal`(→ `z-modal`) | 400 | 모달 |
| `--z-toast`(→ `z-toast`) | 500 | 토스트/알림 |

## 10. 실물 확인

토큰이 실제로 어떻게 렌더링되는지는 `/design-system` 라우트의 "토큰" 탭에서 라이트/다크
전환과 함께 확인한다 — 이 문서는 참조표고, 최신 상태의 보증은 그 화면(코드)이 한다.

## 11. 참조

- 토큰 관리 방식(REQ-NFR-021 / POL-039): CSS 변수 단일 정의. 색상 리터럴 직접 기술 금지.
- radius 스케일 정의(POL-040): sm 6px / base·md 10px / lg 16px / pill 999px.
- 데이터 표시 밀도(POL-041): 표 행 높이 44px / 본문 14px / 표 14px.
