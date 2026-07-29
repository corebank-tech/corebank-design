# CoreBank 프론트엔드 — 작업 규약

이 파일은 Claude Code가 매 세션 자동으로 읽는 상시 규약이다.
개별 작업 프롬프트에서 아래 내용을 반복하지 않는다.

## 프로젝트

한국 인터넷뱅킹 시뮬레이션 "CoreBank"의 Phase 1 채널계 프론트엔드.
데스크톱 전용 업무 시스템. 화면 47개, 요구사항 210건.

**요구사항 단일 출처: `docs/requirements.md`**
화면을 구현하기 전에 반드시 해당 화면ID의 대응 요구사항을 읽는다.
요구사항에 없는 기능을 추가하지 않는다. 판단이 필요하면 만들지 말고 질문한다.

## 기술 스택 — 위반 금지

- **Next.js가 아니다.** Vite + React 19 + TypeScript + React Router v7
- `"use client"` / `"use server"` 지시어 금지
- `next/link`, `next/image`, `next/font`, `next/navigation` import 금지
  → 링크는 `react-router-dom`의 `<Link>`, 이미지는 `<img>`
- `app/` 디렉터리, `page.tsx`, `layout.tsx` 파일 규약 금지
- **데이터 페칭 코드 금지.** fetch / axios / TanStack Query 사용 금지.
  모든 컴포넌트는 props를 받는 순수 프레젠테이션 컴포넌트다.
  상태는 최소한만 `useState`, 나머지는 props와 콜백으로 위임한다.
- 더미 데이터는 컴포넌트가 아니라 `src/lib/mock/` 에 분리한다
- 경로 별칭 `@/`

## 레이아웃 — REQ-NFR-012 / POL-032

- **데스크톱 전용.** 반응형 클래스(`sm:` `md:` `lg:` `xl:`) 사용 금지
  (단 `button.tsx` / `modal.tsx` 의 `sm`/`md`/`lg` **size 키는 예외**)
- 콘텐츠 폭 **1280px 고정**. `w-[1280px] mx-auto`
- 뷰포트가 1280px 미만이면 축소하지 않고 **가로 스크롤**을 제공한다
- 표 행 높이 44px / 본문 14px / 표 13px (POL-041)

## 색상 — REQ-NFR-021 / POL-039

- 모든 색상은 `globals.css` 의 CSS 변수로만 참조한다
- **금지**: hex·rgb 리터럴, Tailwind 기본 색상 클래스(`bg-blue-600`, `text-slate-400`),
  **투명도 표기(`text-white/70`, `border-white/25`)도 하드코딩이다**
- 예외: `bg-white` (두 테마 모두 흰 표면)

## 모서리 반경 — POL-040

radius는 장식이 아니라 **포함 관계**를 나타낸다.

| 층위 | 대상 | 토큰 |
|---|---|---|
| 전면 바 | AppHeader, Footer, 전체메뉴 레이어 | **0** |
| 컨테이너 | 모달, 상품 카드 | `--radius-lg` |
| 업무 블록 | 폼 섹션, 조회 결과, 대시보드 패널 | **0** (보더로만 구분) |
| 컨트롤 | Button, Input, Select, Checkbox, Radio | `--radius` |
| 소형 표식 | Badge, 스텝 숫자 | `--radius-sm` |
| 토글 칩 | 상태 토글, 기간 칩, 금액 칩 | `--radius-pill` |
| 표 내부 | DataGrid 셀, FormRow, SummaryRow | **0** |

- 자식에 `rounded-t` / `rounded-b` 를 붙이지 않는다.
  **컨테이너에 `overflow-hidden`** 을 주어 자식을 클리핑한다
- 중첩 시 `안쪽 반경 = 바깥쪽 반경 − 여백`
- **페이지 배경은 흰색이다.** 회색 배경 위에 흰 카드를 띄우는 레이아웃을 쓰지 않는다.
  업무 블록은 그림자 없이 1px 보더로만 구분한다 (POL-041 밀도 기준)

## 재사용 — 재작성 금지

아래는 이미 구현되어 있다. **import 해서 쓴다. 다시 만들지 않는다.**

| 영역 | 위치 |
|---|---|
| 앱 셸 (A-90) | `shell/app-header.tsx`, `page-shell.tsx`, `breadcrumb-bar.tsx`, `footer.tsx`, `full-menu-overlay.tsx`, `notice-box.tsx`, `page-header.tsx` |
| 기본 컴포넌트 | `ui/` — button, input, select, checkbox, radio, badge, alert, skeleton, modal, form-row, form-section |
| 조회 그리드 (A-94) | `query/` — data-grid, search-panel, fields, grid-toolbar, pagination, summary-row, empty-state |
| 스텝 레이아웃 (A-95) | `transfer/step-layout.tsx`, `step-indicator.tsx`, `confirm-summary.tsx`, `fields.tsx`, `result-panel.tsx` |
| 모달 (A-91·92·93) | `feedback/` — confirm-dialog, error-dialog, otp-modal, limit-modal, session-expired-modal |
| 포맷 유틸 | `lib/format.ts` — formatAmount, formatAccountNo, formatDate, formatDateTime, formatKoreanAmount |
| 메뉴 정의 | `lib/nav.ts` — 화면ID·경로 포함 |

## 마이크로카피

- 버튼은 실행 결과를 그대로 쓴다. "확인"이 아니라 "이체하기"
- 한 동작은 흐름 전체에서 같은 단어를 유지한다
- 에러는 무엇이 잘못됐고 어떻게 고치는지를 쓴다. 사과하지 않는다
- 존댓말 평서형, 마침표 있음
- 오류 메시지를 화면에 하드코딩하지 않는다 (REQ-CMN-008)

## 파일 규칙

- 화면 컴포넌트 파일명은 **화면ID를 접두어**로 한다. 예: `D03-TransferResult.tsx`
- 컴포넌트 단위로 파일을 분리하고 props 인터페이스를 export 한다
- 모든 작업 후 `npx tsc --noEmit` 이 통과해야 한다

## 작업 완료 기준

1. `npx tsc --noEmit` 에러 0
2. `next/*` · `"use client"` 0건
3. 반응형 클래스 0건 (size 키 제외)
4. 색상 리터럴 · 기본 색상 클래스 · 투명도 표기 0건
5. 해당 화면의 대응 요구사항 인수기준을 충족
6. 제외항목(`docs/requirements.md` §5)에 해당하는 기능이 없다

## 화면 질감 규칙

- 타이포는 9단 스케일을 쓴다. 기준일시·각주·메타는 반드시 `--text-2xs`(11px)
- 화면마다 지배 요소를 하나만 정하고 나머지 라벨은 `--text-xs` + `--color-ink-faint` 로 후퇴시킨다
- 여백은 3단 리듬: 그룹 내부 4~8px / 블록 사이 12~16px / 섹션 사이 32~40px
- 모든 조회·폼 화면 하단에 `[알아두세요]` 접이식 안내 박스를 넣는다
- 조회 화면 툴바에 `[보고서인쇄] [점자보기] [파일저장] [검색]` 을 배치한다
- 입력 필드 하단에 `※` 단서 조항을 단다
- 실명·계좌번호·이메일은 마스킹한다 (REQ-NFR-005)
- `--color-navy` 는 DataGrid 상단 룰과 FormSection 하단 라인에 쓴다. 장식에 쓰지 않는다
- 안내 문구는 단서와 예외를 괄호로 명시한다. 느낌표·이모지·소비자 앱 어투 금지
- 수치는 반드시 `docs/requirements.md` §2 POL에서 가져온다