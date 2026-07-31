# 세션 핸드오프 — 디자인 시스템 정리 & Figma 연동 (2026-07-31)

다음 세션(컨텍스트 클리어 후) 시작 시 참고할 상태 스냅샷. 최신 상태의 보증은 코드 자체가
하고, 이 문서는 "무엇을 했고 무엇이 남았는지"만 요약한다.

## 완료된 작업

### 1. 코드 디자인 시스템 컴포넌트 통합 (`docs/COMPONENT_INVENTORY.md` §1, §8 참조)
- `CollapsibleSection`, `LabelValueRow`, `Panel`/`PanelHeader`, `QueryPageLayout` 신설 —
  화면마다 따로 구현되던 접이식 패널·라벨/값 행·대시보드 패널 셸·조회/폼 화면 골격(14개 화면)을
  공용 컴포넌트로 승격
- `status-tone.ts` — Badge/Alert/ResultPanel이 각자 정의하던 info/success/warning/danger 색상
  클래스를 단일 출처로 통합
- `useDisclosure` 훅 — 접이식 UI의 열림 상태 로직 통합
- 기존 화면의 시각적 결과물은 그대로 유지, 마크업 구조만 정리

### 2. 타이포/색상 토큰 축소 (`docs/DESIGN_TOKENS.md` 참조, 2026-07 4~5차 피드백)
- 타이포: 9단 → 6단(`2xs`/`xs`/`base`/`lg`/`h2`/`page`). `h3`·`md`·`sm`을 인접 단계에 흡수 —
  인접 단계 1px 차이는 사용자가 구분 못하고 개발자도 헷갈린다는 이유
- 색상: 39 → 31개. 미사용 6개 삭제(`success-ring`/`warning-ring`/`danger-hover`/`info`/
  `info-tint`/`info-border-soft`), `withdraw`→`danger` 통합(hex 완전 동일), `primary-hover`
  삭제(hover는 색상마다 토큰을 만들지 않고 `hover:opacity-90`을 공통 적용 — atomic 원칙)
- `globals.css`, `CLAUDE.md`, 내부 토큰 갤러리(`/design-system`), `DESIGN_TOKENS.md`,
  `COMPONENT_INVENTORY.md` 전부 동기화 완료

### 3. Figma 디자인 시스템
- 파일: https://www.figma.com/design/lh6gOorAaR6rANIEjazzWo/CoreBank-Design-System
  (팀: **"김다연's Starter team"** — `whoami`의 다른 두 팀 "졸업 프로젝트"·"CoreBank"는 Education
  플랜이 만료돼 파일 생성·편집이 전면 차단됨. 이 개인 Starter 팀만 예외)
- 완료: 변수 101개(Color/Light·Dark 각 39, Spacing 6, Radius 5, Typography 12), Text 스타일
  12개, Effect 스타일 4개, Cover 페이지, Foundations 페이지의 Colors 섹션(라이트+다크 스와치
  전량, 시각 확인 완료)과 Typography 섹션(생성됨, 스크린샷 미확인)
- 미완료: Foundations의 Spacing/Radius 시각 문서, 컴포넌트 8종(Button/Input/Select/Checkbox/
  Radio/Badge/Chip/Alert) — **Figma Starter 플랜의 MCP 월 호출량(View석 기준 월 6회)을 소진해
  중단**. 대신 사람이 손으로 옮길 수 있는 핸드오프 문서로 대체:
  https://claude.ai/code/artifact/6dc8ab21-c65e-45e0-a437-dd62ba21c18e
- ⚠️ **이 Figma 파운데이션과 핸드오프 문서는 토큰 축소 전(9단/39색) 기준으로 만들어졌다.**
  MCP 호출량이 회복되거나 플랜을 업그레이드하면, 위 §1·§2 축소분을 반영해 다시 만들어야 한다 —
  지금 상태로 컴포넌트를 이어 만들면 안 씀직한 옛 토큰이 다시 섞여 들어간다.
- Figma MCP 재시도 시 참고: `create_new_file`은 `planKey`가 필요하고, `whoami`로 얻은 plan 중
  Full/Dev 등급이 아니면(또는 Education 만료면) `Invalid planKey` 오류가 난다. 재시도로는
  풀리지 않고 팀 쪽 실제 조치(인증·업그레이드·다른 팀 사용)가 필요하다.

### 4. Storybook 설치 및 기본 컴포넌트 스토리

- `storybook@latest init`로 설치(Vite+React 프레임워크 자동 감지). 보일러플레이트
  예시 스토리(`src/stories/`)는 삭제했다
- `.storybook/preview.tsx`: `globals.css`를 import해 Tailwind 토큰이 적용되게 하고,
  프로젝트의 `data-theme` 다크모드 토글(`src/shared/lib/theme.ts`와 동일한 메커니즘)을
  툴바의 Light/Dark 글로벌로 노출하는 데코레이터를 추가했다
- `@storybook/addon-vitest`(스토리를 vitest 브라우저 테스트로 실행하는 애드온)는 **뺐다** —
  기본 설치 시 `vite.config.ts`에 자동으로 추가됐으나, 현재 버전 조합에서
  `aria-query` ESM/CJS interop 버그로 모든 스토리 테스트가 즉시 실패해 `pnpm test`
  (따라서 `pnpm check`)가 깨졌다. interaction test(play function)를 실제로 쓸 계획이
  생기면 그때 재검토한다 — 지금은 `@storybook/addon-a11y`/`addon-docs`/`addon-mcp`/
  `@chromatic-com/storybook`만 남겼다
- CLAUDE.md "재사용" 표의 기본 컴포넌트 15종(button/input/select/checkbox/radio/badge/
  alert/skeleton/modal/form-row/form-section/chip/icon-button/divider/spinner) 전부에
  `*.stories.tsx`를 작성했다. Storybook 실행(`pnpm storybook`) 후 브라우저로 Button
  variant, Modal 열기/닫기, Light/Dark 전환을 실제로 확인 완료
- `pnpm check` 전부 통과 상태 유지(eslint.config.js에 스토리 파일의 CSF `export default`
  허용 예외, `.storybook/**`의 `react-refresh/only-export-components` 예외 추가)

### 5. 화면(Page) 스토리 공용 하네스 + 대표 화면 2개

`src/pages/*.tsx`를 mock 데이터와 함께 통째로 스토리로 등록해 "화면 디자인 카탈로그"로
쓰는 것이 목표였다. 47개 화면 전부가 아니라 **공용 하네스를 설계하고 대표 화면 2개로
검증**하는 것으로 범위를 좁혔다(사용자 확인함).

- `.storybook/decorators/page-providers.tsx` — 실제 `src/main.tsx`의 프로바이더 조합
  (`QueryClientProvider` → `MemoryRouter` → `SessionProvider` → `NotificationsProvider`)을
  그대로 재현한다. 인증 우회를 따로 만들지 않고 `SessionProvider`의 실제 `login()`을
  `MOCK_MEMBERS[0]` 자격증명으로 호출해 인증 상태를 만든다("코드가 곧 진실").
  - `WithGuestPage`: 로그인 전 화면(A01 로그인, 아이디찾기 등)용. 로그인하지 않은 상태 그대로
  - `WithAuthenticatedPage`: `RequireAuth`로 보호되는 화면용. 마운트 시 자동 로그인 — 실제
    라우트는 이 상태로만 도달 가능하므로 그 상태를 재현한다
  - `.storybook/`는 FSD 레이어 밖이라 `@/` 별칭을 자유롭게 쓴다. 반대로 `src/pages/*.stories.tsx`에서
    이 데코레이터를 불러올 때는 상대경로(`../../.storybook/...`)가 필요해서, eslint.config.js에
    `src/**/*.stories.tsx` 전용 예외(`@typescript-eslint/no-restricted-imports`,
    `boundaries/dependencies` off)를 추가했다 — 스토리는 `dist` 빌드에 포함되지 않는 dev 전용
    파일이라 FSD 레이어 방향·절대경로 규칙의 실질적 영향이 없다는 판단
- 검증한 대표 화면 2개(둘 다 브라우저로 라이트/다크 확인 완료):
  - `src/pages/a01-login.stories.tsx` — `WithGuestPage` + `PageShell bare`(실제 `/` 라우트와 동일)
  - `src/pages/dashboard/a09-main-dashboard.stories.tsx` — `WithAuthenticatedPage` +
    `PageShell breadcrumb/title`(실제 `/dashboard` 라우트와 동일). `Default`/`EmptyAccounts`
    두 변형으로 props override 패턴(`accounts={[]}`)도 함께 보여준다
- 각 스토리는 `App.tsx`의 실제 라우트 엘리먼트(`<PageShell ...><Page /></PageShell>`)를
  그대로 옮겨 적어 화면 전체(헤더·브레드크럼·사이드내비 포함)를 보여준다 — 페이지 컴포넌트
  단독 렌더가 아니다

## 다음 단계

**나머지 45개 화면의 스토리는 아직 없다.** §5의 두 예시가 패턴이다 — 각 화면마다
1) `App.tsx`에서 해당 라우트의 `PageShell` props(breadcrumb/title/activeId/notice)를 그대로
복사하고, 2) 인증 여부에 따라 `WithGuestPage`/`WithAuthenticatedPage`를 고르면 된다.
알려진 한계: 하네스의 `MemoryRouter`는 `initialEntries={["/"]}`로 고정돼 있어 URL 파라미터
(`:productId`)나 쿼리스트링(`?account=...`)을 읽는 화면(C-02 상품상세, 대시보드에서 넘어오는
조회·이체 화면 등)은 그대로 쓰면 안 된다 — 그런 화면을 다룰 때 `initialEntries`를 파라미터화하는
확장이 먼저 필요하다.

**아직 스토리가 없는 `src/shared/ui` 컴포넌트**(위 §1에서 신설한 것 포함): data-grid,
empty-state, pagination, summary-row, alert-dialog, confirm-dialog, error-dialog,
grid-search-modal, text-view-modal, step-layout, step-indicator, confirm-summary,
collapsible-section, label-value-row, panel, query-page-layout — 도메인 데이터나 복잡한
상태(선택·정렬·페이징)를 mock으로 채워야 해서 기본 컴포넌트보다 손이 더 간다.

Chromatic(시각 회귀 SaaS)은 무료 티어에 스냅샷 제한이 있다는 점만 참고 — Storybook 자체는
완전 무료, 사용량 제한 없음(로컬/CI에서 도는 정적 빌드 도구).

## 참고

- 저장소: `/Users/danhan/Documents/GitHub/corebank-design`
- 이 세션 종료 시점에 `pnpm check`(typecheck+lint+format+test) 전부 통과 상태
- 프로젝트 상시 규약은 `CLAUDE.md`, 요구사항 단일 출처는 `docs/requirements.md` — 이번 세션에서
  변경한 내용은 전부 그 두 문서와 `docs/DESIGN_TOKENS.md`/`docs/COMPONENT_INVENTORY.md`에 이미
  반영돼 있다. 이 문서는 "왜 지금 이 상태인지"에 대한 서술적 요약일 뿐, 규약의 단일 출처가
  아니다 — 내용이 위 문서들과 어긋나면 그쪽을 믿는다.
