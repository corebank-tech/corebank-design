# CoreBank 프론트엔드 — 작업 규약

이 파일은 Claude Code가 매 세션 자동으로 읽는 상시 규약이다.
개별 작업 프롬프트에서 아래 내용을 반복하지 않는다.

## 우선순위

코드 규약은 [frontend-fundamentals 가이드](https://frontend-fundamentals.com/code-quality/code/)를 따른다.
이 문서의 규칙이 가이드와 충돌하면 **가이드가 우선**한다.
단, 레이아웃·색상·모서리 반경·화면 질감 규칙은 이 프로젝트 고유 정책이며 가이드보다 우선한다.

## 프로젝트

한국 인터넷뱅킹 시뮬레이션 "CoreBank"의 채널계 프론트엔드.
데스크톱 전용 업무 시스템. 화면 47개, 요구사항 212건.
1차 프론트엔드 코드는 2차에서도 그대로 재사용되며 고도화된다 — 백엔드 계정계만 별도로 고도화된다.
즉 지금 정하는 규약이 이후 화면 마이그레이션과 실 API 연동의 기준이 된다.

**요구사항 단일 출처: `docs/requirements.md`**
화면을 구현하기 전에 반드시 해당 화면ID의 대응 요구사항을 읽는다.
요구사항에 없는 기능을 추가하지 않는다. 판단이 필요하면 만들지 말고 질문한다.

## 기술 스택 — 위반 금지

- **Next.js가 아니다.** Vite + React 19 + TypeScript + React Router v7
- `"use client"` / `"use server"` 지시어 금지
- `next/link`, `next/image`, `next/font`, `next/navigation` import 금지
  → 링크는 `react-router-dom`의 `<Link>`, 이미지는 `<img>`
- Next.js **app router** 디렉터리 규약(`page.tsx`, `layout.tsx` 파일명 규약) 금지.
  FSD-lite의 `src/app` 레이어와는 무관하다 — 아래 "FSD-lite 구조" 참고
- 서버 상태는 **TanStack Query**, HTTP 통신은 `src/shared/api/custom-fetch.ts`의 `customFetch`로 한다.
  화면은 fetch/axios를 직접 쓰지 않고 entities 레이어의 래퍼 훅을 통해 서버 상태를 쓴다
- 클래스 병합은 `cn()`(`src/shared/lib/utils.ts`), variant는 `cva`
- 폼·검증은 React Hook Form + Zod, 클라이언트 상태는 Zustand, 날짜 처리는 date-fns
- 경로 별칭 `@/`

## 네이밍

| 대상 | 규칙 | 예시 |
|---|---|---|
| 변수 / 함수 | `camelCase` | `parseTransferFilters` |
| 컴포넌트 / 타입 | `PascalCase` | `TransferHistoryPage` |
| 모듈 상수 | `UPPER_SNAKE_CASE` | `TRANSFER_STATUS_OPTIONS` |
| 커스텀 훅 | `use` 접두사 | `useGetAccounts` |
| 이벤트 핸들러 | `handle + 대상 + 동작` | `handleModalClose` |
| 핸들러 prop | `on` 접두사 | `onClose` |
| 불리언 | `is`, `has`, `can`, `should` 접두사 | `isLoading`, `hasNextPage` |

- 파일명은 `kebab-case`. 화면 컴포넌트는 화면ID를 소문자로 접두한다 — 아래 "파일 규칙" 참고
- 컴포넌트 props 타입은 컴포넌트 상단에 `type Props = { ... }`로 선언한다
- 컴포넌트 전용 `Props` 타입은 export하지 않는다
- 의미가 불명확한 `data`, `value`, `item`, `handleClick` 같은 이름은 쓰지 않는다

## TypeScript

- `interface` 대신 `type`을 쓴다. `interface`는 선언 병합이 실제로 필요할 때만 예외로 허용한다
- 배열 타입은 `Array<T>` 대신 `T[]`
- 타입 전용 import는 `type` modifier를 쓴다
- 객체·옵션 배열의 타입 검증에는 `satisfies`를 우선 쓴다
- `any`를 쓰지 않는다

## 함수와 컴포넌트

- 컴포넌트는 선언형 `function`으로 작성한다
- 컴포넌트 내부 함수, 커스텀 훅, 유틸 함수는 화살표 함수로 작성한다
- 모듈은 named export를 쓴다. default export는 라이브러리가 요구할 때만 허용한다
- 조건 중첩보다 early return을 쓴다
- 사용하지 않는 함수·옵션·파라미터는 제거한다

## 상수

- 반복되거나 의미가 있는 숫자·문자열은 모듈 상단 상수로 선언한다 (`UPPER_SNAKE_CASE`)
- 시간·거리·개수처럼 단위가 있는 값은 이름에 단위를 포함한다
- 큰 숫자는 숫자 구분자 `_`를 쓴다 (`const MAX_TRANSFER_AMOUNT = 10_000_000`)

## Import와 공개 API

- import는 `@/...` 절대경로만 쓴다
- 각 슬라이스는 `index.ts`를 외부 공개 API로 쓴다. 다른 슬라이스에서는 내부 파일을 직접 import하지 않는다
- 같은 슬라이스 내부에서는 `index.ts`를 거치지 않는다
- 값은 `export`, 타입은 `export type`으로 구분한다

## FSD-lite 구조

```
src/
├── app/       # 라우터·프로바이더·전역 설정
├── pages/     # URL 단위 화면
├── widgets/   # 독립적인 화면 블록
├── features/  # 사용자 액션·유스케이스
├── entities/  # 도메인 모델·도메인 API·도메인 UI
└── shared/
    ├── api/   # customFetch, query-client, session-events
    ├── config/
    ├── lib/
    └── ui/    # shadcn/ui 기반 범용 컴포넌트
```

의존성은 `app → pages → widgets → features → entities → shared` 방향만 허용한다.
하위 레이어에서 상위 레이어를 import하지 않는다. 같은 레이어의 다른 슬라이스를 직접 import하지 않는다.
`atoms`/`molecules`/`organisms` 폴더는 만들지 않는다.

- URL 단위 화면은 `pages`, 독립적인 화면 블록은 `widgets`, 사용자 액션·유스케이스는 `features`에 둔다
- 도메인 모델·도메인 API·도메인 UI는 `entities`에 둔다
- 도메인과 무관한 UI·유틸·설정은 `shared`에 둔다. shadcn/ui 기반 범용 UI는 `shared/ui`,
  도메인 데이터를 표현하는 UI는 `entities`, 사용자 액션이 포함된 UI는 `features`

`src/lib`는 더 이상 없다. 예전에 여기 있던 목업·유틸은 각 `entities/*`와 `shared/config`로 옮겼다.
새 코드에서 `src/lib`를 다시 만들지 않는다.

## API와 TanStack Query

- Orval이 생성한 코드(`src/shared/api/generated/`)는 화면에서 직접 쓰지 않는다.
  각 `entities/*/api`의 얇은 래퍼 훅을 통해 쓴다
- query key는 함수 또는 query options로 관리하고, 조회·prefetch·invalidate에서 동일한 key를 재사용한다
  ```ts
  export const accountKeys = {
    all: () => ["accounts"] as const,
    list: (filters: AccountFilters) => [...accountKeys.all(), "list", filters] as const,
    detail: (accountNo: string) => [...accountKeys.all(), "detail", accountNo] as const,
  }
  ```
- API 응답 변환은 UI 컴포넌트 내부에서 하지 않는다
- `src/shared/api/query-client.ts`의 QueryClient 기본값은 뱅킹 앱의 보안 요구에서 나온 것이다 — 바꾸지 않는다:
  `refetchOnWindowFocus: false` / `refetchInterval: false`는 사용자 조작 없는 백그라운드 재조회가
  서버 세션을 갱신해 POL-001의 10분 자동 로그아웃을 무력화하는 것을 막기 위함이다
- **멱등키 재시도 함정**: `mutations.retry`는 `0`으로 고정돼 있다. 자동 재시도가 매번 새
  `Idempotency-Key`를 만들면 서버가 같은 요청을 별개 거래로 처리한다 (REQ-CMN-014). 재제출 UI가
  필요한 곳(이체 확인 화면 등)은 `withIdempotencyKey()`로 키를 1회 생성해 고정한다
- 오류 메시지는 서버가 준 `ApiError.message`를 그대로 쓴다. 화면에 code→message 표를 만들지 않는다
  (REQ-CMN-008)

## URL Query Parameter

- URL 쿼리 파라미터는 React Router의 `useSearchParams`를 쓴다
- 쿼리 문자열을 직접 조합하지 않는다
- 기존 `URLSearchParams`를 복사한 뒤 필요한 값만 수정한다

## 커스텀 훅

- 공통 훅은 `shared/lib/hooks`, 도메인 훅은 해당 `entities`, 사용자 액션 훅은 해당 `features`에 둔다
- 훅 이름은 `use`로 시작한다
- 훅은 외부에서 실제 사용하는 값만 반환한다
- 하나의 훅에서 조회·mutation·라우팅·모달·폼 상태를 모두 관리하지 않는다

## 레이아웃 — REQ-NFR-012 / POL-032

- **데스크톱 전용.** 반응형 클래스(`sm:` `md:` `lg:` `xl:`) 사용 금지
  (단 `button.tsx` / `modal.tsx` 의 `sm`/`md`/`lg` **size 키는 예외**)
- 콘텐츠 폭 **1280px 고정**. `w-[1280px] mx-auto`
- 뷰포트가 1280px 미만이면 축소하지 않고 **가로 스크롤**을 제공한다
- 표 행 높이 42px / 본문 14px / 표 14px (POL-041 — 2026-07 디자인 피드백 3차로 표만 13→14px 상향)

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
| 앱 셸 (A-90) | `src/widgets/shell/` — app-header, breadcrumb-bar, footer, full-menu-overlay, page-header, side-nav / `src/app/page-shell.tsx` |
| 기본 컴포넌트 | `src/shared/ui/` — button, input, select, checkbox, radio, badge, alert, skeleton, modal, form-row, form-section, chip, icon-button, divider, spinner |
| 조회 그리드 (A-94) | `src/widgets/query/` — search-panel, search-fields, grid-toolbar / `src/shared/ui/` — data-grid, empty-state, pagination, summary-row, grid-search-modal, text-view-modal |
| 스텝 레이아웃 (A-95) | `src/widgets/transfer/` — transfer-fields, result-panel / `src/shared/ui/` — step-layout, step-indicator, confirm-summary |
| 모달 (A-91·92·93) | `src/shared/ui/` — alert-dialog, confirm-dialog, error-dialog / `src/entities/auth/ui/` — otp-modal, session-expired-modal / `src/entities/transfer/ui/` — limit-modal |
| 안내 박스 | `src/shared/ui/notice-box.tsx` — NoticeBox, NoticeBoxFooter |
| 약관동의 블록 | `src/widgets/terms-agreement.tsx` — 회원가입(A-02)·상품가입(C-03) 공용 |
| 포맷 유틸 | `src/shared/lib/format.ts` — formatAmount, formatAccountNo, formatDate, formatDateTime, formatKoreanAmount, maskBirthDate, maskName, maskEmail, maskAccountNo, formatPhone, maskPhone, maskUserId |
| 날짜 유틸 | `src/shared/lib/date.ts` — date-fns 래핑. 화면에서 date-fns를 직접 import하지 않는다 |
| 숫자 입력 필터 | `src/shared/lib/input-filter.ts` — `onlyDigits` |
| CSV 내보내기 | `src/shared/lib/csv.ts` — `downloadCsv` (REQ-INQR-015) |
| 카운트다운 훅 | `src/shared/lib/hooks/use-countdown.ts` |
| 테마 전환 | `src/shared/lib/theme.ts` |
| 클래스 병합 | `src/shared/lib/utils.ts` — `cn()` |
| 메뉴 정의 | `src/shared/config/nav.ts` — 화면ID·경로 포함 |
| 정책 수치 단일 출처 | `src/shared/config/policy.ts` — `docs/requirements.md` §2 POL 상수. 화면에 숫자를 직접 다시 적지 않는다 |
| mock 기준시각 | `src/shared/config/mock-clock.ts` — `MOCK_NOW`, `MOCK_TODAY` |
| 고객센터 정보 | `src/shared/config/contact.ts` — `CUSTOMER_CENTER_PHONE`, `CUSTOMER_CENTER_HOURS` |
| 상태 배지 매핑 | `src/entities/{transfer,transaction,product}/lib/status-badge.ts` — 상태값 → Badge variant |
| 도메인 데이터 | `src/entities/{account,transfer,product,auth,customer,notification,transaction,dashboard}` — 각 슬라이스 `index.ts`가 공개 API |
| HTTP·세션 | `src/shared/api/` — custom-fetch, query-client, api-error, session-events |
| Mock 서버 | `src/mocks/` — MSW 핸들러 예시 1세트(`handlers/account.ts`). 나머지 도메인은 `entities/*/api`의 정적 mock을 그대로 쓴다 |

`src/shared/ui`의 기본 컴포넌트 15종은 각각 옆에 `*.stories.tsx`가 있다. `pnpm storybook`으로
확인한다. 기본 컴포넌트를 새로 추가하거나 variant를 바꾸면 스토리도 같이 갱신한다 — 나머지
`shared/ui`(data-grid 등 도메인 데이터가 필요한 컴포넌트)의 스토리는 아직 없다.

화면(`pages`) 단위 스토리는 `.storybook/decorators/page-providers.tsx`의
`WithGuestPage`/`WithAuthenticatedPage`로 `src/main.tsx`와 동일한 프로바이더 조합
(QueryClient·Router·Session·Notifications)을 재현한다 — `src/pages/a01-login.stories.tsx`,
`src/pages/dashboard/a09-main-dashboard.stories.tsx`가 예시다. 아직 이 2개뿐이다
(`docs/SESSION_HANDOFF.md` 참고).

## 마이크로카피

- 버튼은 실행 결과를 그대로 쓴다. "확인"이 아니라 "이체하기"
- 한 동작은 흐름 전체에서 같은 단어를 유지한다
- 에러는 무엇이 잘못됐고 어떻게 고치는지를 쓴다. 사과하지 않는다
- 존댓말 평서형, 마침표 있음
- 오류 메시지를 화면에 하드코딩하지 않는다 (REQ-CMN-008)

## 파일 규칙

- 파일명은 kebab-case. 화면 컴포넌트는 화면ID를 소문자로 접두한다. 예: `d03-transfer-result.tsx`
  (컴포넌트명은 `D03TransferResult`처럼 PascalCase로 유지 — requirements.md 화면ID 추적성 확보)
- 컴포넌트 단위로 파일을 분리한다. Props 타입은 export하지 않는다 — 다른 파일이 실제로 쓰는 타입만 export한다
- 모든 작업 후 `pnpm check` (typecheck + lint + format:check + test) 가 통과해야 한다

## 작업 완료 기준

1. `pnpm check` 통과 (`tsc --noEmit` 에러 0 / `eslint` error 0 — warning은 마이그레이션 완료 전까지 허용 / `prettier --check` 통과 / `vitest` 통과)
2. `next/*` · `"use client"` 0건
3. 반응형 클래스 0건 (size 키 제외)
4. 색상 리터럴 · 기본 색상 클래스 · 투명도 표기 0건
5. 해당 화면의 대응 요구사항 인수기준을 충족
6. 제외항목(`docs/requirements.md` §5)에 해당하는 기능이 없다

## 화면 질감 규칙

- 타이포는 6단 스케일을 쓴다(2xs/xs/base/lg/h2/page — 2026-07 5차 피드백: 인접 단계 1px 차이는
  사용자가 구분 못하고 개발 시에도 헷갈린다는 지적에 따라 h3·md·sm을 흡수). 기준일시·각주·메타는
  반드시 `--text-2xs`(11px)
- hover 등 상호작용 상태는 색상마다 별도 토큰(`--color-x-hover`)을 만들지 않는다.
  `hover:opacity-90`처럼 하나의 계산 방식을 모든 색에 공통 적용한다(atomic — 상태는 토큰이 아니라
  변형으로 표현한다)
- 화면마다 지배 요소를 하나만 정하고 나머지 라벨은 `--text-xs` + `--color-ink-faint` 로 후퇴시킨다
- 여백은 3단 리듬: 그룹 내부 4~8px / 블록 사이 12~16px / 섹션 사이 32~40px
- 모든 조회·폼 화면 하단에 `[알아두세요]` 접이식 안내 박스를 넣는다
- 조회 화면 툴바에 `[보고서인쇄] [점자보기] [파일저장] [검색]` 을 배치한다
- 입력 필드 하단에 `※` 단서 조항을 단다
- 성명은 가운데 1자, 이메일은 로컬파트 4번째 문자 이후를 마스킹한다 (REQ-CMN-018). 계좌번호는 화면에 마스킹하지 않는다 — 하이픈 포함 전체 12자리를 표시한다(REQ-CMN-017). 계좌번호 마스킹은 CSV 파일 저장 시에만 적용한다(REQ-INQR-015)
- `--color-navy` 는 DataGrid 상단 룰과 FormSection 하단 라인에 쓴다. 장식에 쓰지 않는다
- 안내 문구는 단서와 예외를 괄호로 명시한다. 느낌표·이모지·소비자 앱 어투 금지
- 수치는 반드시 `docs/requirements.md` §2 POL에서 가져온다

## 남은 마이그레이션

FSD-lite 전환(`src/lib` 해체, 화면 파일 41개 kebab-case 리네임, `interface`→`type` 127건,
컴포넌트 전용 Props export 해제 71건, 레이어 위반 8건 수정)과 하드코딩 정리(값의 단일 출처화,
토큰 레이어 완성, `cva` 도입 및 공통 프리미티브 추출, 상대경로 import 전량 정리, `react-hooks`/
`react-refresh` 경고 해소 후 lint 규칙 error 승격)는 완료했다. `pnpm check`는 error 0 /
warning 2(아래 boundaries 예외 1건)를 유지한다. 남은 항목:

- `entities/account`(`b05-withdrawal-accounts.ts`) → `entities/transfer` 참조 1건은 의도적으로
  남겨뒀다. 출금계좌 삭제 가능 여부가 예약이체·자동이체 등록 여부에 의존하는 도메인 규칙이라
  엔티티 간 참조가 불가피했다. `eslint.config.js`의 `boundaries/dependencies`가 warn으로
  가시화하고 있다 — 실제 문제가 되면(순환 참조 등) 그때 `features` 레이어로 재구성한다
- `openapi.yaml` 작성 및 Orval 코드젠 활성화 (REQ-NFR-013) — 백엔드 계약 확정 대기
- REQ-NFR-020 docker-compose 배포 구성 (Dockerfile, nginx.conf, 런타임 환경변수 주입 방식 결정)
