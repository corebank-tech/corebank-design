# Storybook 디자인 시스템 고도화 로드맵 (2026-08-03)

> 목적: 지금 Storybook은 "컴포넌트마다 스토리 하나씩 있다" 수준이다. 공개 디자인 시스템
> (Twilio Paste, GitLab Pajamas, Adobe Spectrum 등)이 갖춘 수준 — 조합 매트릭스, 상태/엣지
> 케이스 커버리지, 자동 문서화, 콘텐츠와 로직의 분리 — 로 끌어올리기 위한 단계별 계획.
> 실행 순서와 각 단계의 완료 기준을 여기 남긴다. 코드 자체가 최신 상태의 보증이고, 이 문서는
> "무엇을 왜 이 순서로 하는지"만 남긴다.

## 레퍼런스로 확인한 기준

- **조합 매트릭스**: variant×size를 개별 스토리로 나열하지 않고, 전체 조합을 한 화면에서
  비교하는 매트릭스 스토리를 별도로 둔다 (Twilio Paste `Button - All Variant` 패턴)
- **상태/엣지 케이스**: GitLab Pajamas Pagination 문서는 "첫/마지막 페이지 disable", "항목이
  적으면 렌더링 안 함", "페이지가 많으면 생략기호(…) 등장", "양끝에서 5페이지 이상 떨어지면
  양쪽에 생략기호 동시 등장" 같은 상태 전이를 명시적으로 스토리·문서화한다
- **Docs**: `argTypes` + `autodocs`로 props 표·사용 예시가 자동 생성되게 한다
- **콘텐츠/로직 분리**: 스토리가 실제 포맷/마스킹 유틸을 거친 fixture를 참조해, "디자인 예시"이자
  "로직이 실제로 맞물려 도는지"의 회귀 확인 역할을 겸하게 한다

## 현재 상태 (2026-08-03 감사 결과)

| 항목 | 상태 |
|---|---|
| addon | `a11y`, `docs`, `chromatic`, `mcp` 4개. `addon-vitest`(interaction test)는 `aria-query` ESM/CJS interop 버그로 SESSION_HANDOFF.md 기준 **의도적으로 제외**된 상태 — play function 도입 전에 이 버그가 해소됐는지 먼저 확인해야 함 |
| Button | variant 5종 × size 3종(cva) — 스토리는 variant별 개별 6개 + size 나열 1개. 15칸 매트릭스 없음 |
| Pagination | 로직상 첫/마지막 블록 disable(`blockStart<=1`/`blockEnd>=totalPages`), `totalPages<=0` 미렌더링, 블록 넘김이 있으나 스토리는 `MultiplePages`/`SinglePage` 2개뿐 |
| Docs | `argTypes` 0건, `.mdx` 0개, `tags:["autodocs"]` 0건, `play` 함수 0건 (103개 스토리 파일 전체) |
| 콘텐츠/로직 분리 | `data-grid.stories.tsx`는 `entities/account`의 `MOCK_OVERVIEW_ACCOUNTS`를 정상 참조. 17개 파일은 계좌번호·이름을 파일 내부에 개별 하드코딩 (아래 §Phase 2 목록) |
| Tailwind | v4 CSS-first 문법(`@import "tailwindcss"`, `@theme inline`) 적용 완료 — **문제 없음, 손댈 것 없음** |
| 레이아웃 정책 | 데스크톱 전용 고정폭 1280px(POL-032), 반응형 브레이크포인트 없음 → **viewport addon은 이 프로젝트에서 가치가 낮다.** 일반적 "베스트 프랙티스"라고 기계적으로 추가하지 않는다 |

## Phase 0 — 파일럿 (Button + Pagination)

패턴을 확정하기 전에 전체로 확산하지 않는다. 대표 컴포넌트 2개로 먼저 검증한다.

- **Button**: 기존 개별 variant 스토리는 유지하되, `AllVariants` 매트릭스 스토리를 추가한다.
  5 variant × 3 size 그리드를 `render`로 한 화면에 배치. `argTypes`에 `variant`/`size`
  `options` + `description`을 채워 Controls에서 조합을 바꿔볼 수 있게 한다 — 이게 이후
  모든 컴포넌트에 적용할 `argTypes` 작성 패턴의 기준이 된다
- **Pagination**: 로직에 이미 존재하는 분기를 스토리로 노출한다
  - `FirstPage` (`page=1`) — 이전 블록 버튼 disabled 확인
  - `LastPage` (`page=totalPages`) — 다음 블록 버튼 disabled 확인
  - `BlockBoundary` — `blockSize`(기본 10) 경계에서 다음 블록으로 넘어가는 케이스
    (예: `totalPages=35`, 초기 `page=10`)
  - `ManyPages` — `totalPages=250` 같이 블록을 여러 번 넘겨야 하는 대량 페이지
  - `NoRender` — `totalPages<=0`일 때 `null`을 반환하는 것을 스토리 설명(`docs.description`)으로
    명시 (렌더 결과가 빈 화면이라 스토리만으로는 안 보이므로 텍스트 설명 필수)

**완료 기준**: `pnpm check` 통과 + `pnpm storybook`으로 두 컴포넌트 모두 브라우저 확인.

## Phase 1 — Docs 인프라

- `.storybook/preview.tsx`에 전역 `tags: ["autodocs"]` 추가 여부 결정 (전체 103개 스토리에
  자동 Docs 탭이 생기는 것의 득실 확인 — 빌드 시간 영향 포함)
- Phase 0에서 확정한 `argTypes` 작성 패턴을 `CLAUDE.md`의 "재사용" 표에 있는 기본 컴포넌트
  15종(button/input/select/checkbox/radio/badge/alert/skeleton/modal/form-row/form-section/
  chip/icon-button/divider/spinner)에 우선 확산

**완료 기준**: 15종 컴포넌트 모두 Docs 탭에서 props 표가 실제 JSDoc 설명과 함께 렌더됨.

**실행 결과 (2026-08-03, 최종 QA에서 정정)**: 처음엔 `.storybook/main.ts`에
`docs: { autodocs: true }`를 추가하는 방식으로 구현했는데, **Storybook v10.5.5에는 그런 옵션이
없다** — `DocsOptions` 타입에서 이미 빠진 필드라 조용히 무시되고, `tsc`도 이걸 못 잡는다
(구조적 타이핑 때문에 초과 프로퍼티 검사가 안 걸림). 그 결과 최종 QA 전까지 Docs 탭이 스토리
0개에 생성되고 있었다 — `argTypes`/Controls는 정상 동작해서 겉보기엔 문제가 없어 보였다.
최종 QA가 `storybook-static/index.json`을 직접 까봐서 발견했다. 올바른 방법은
`.storybook/preview.tsx`의 `Preview` 객체에 `tags: ["autodocs"]`를 넣는 것 — 이렇게 고치고
`pnpm build-storybook` 후 `index.json`에서 docs entry 103개(스토리 파일당 1개)가 실제로
생성되는 것을 확인했다. `main.ts`의 무의미했던 `docs: { autodocs: true }`는 제거했다.

## Phase 2 — 콘텐츠 하드코딩 정리 (17개 파일)

계좌번호는 REQ-CMN-017에 따라 마스킹하지 않는 게 정책이라 "마스킹 누락"은 문제가 아니다.
진짜 문제는 **같은 값의 단일 출처화**다 — 동일한 계좌번호·이름이 여러 스토리 파일에 각자
다른 값으로 박혀 있으면, 포맷 규칙이 바뀌었을 때 놓치는 파일이 생긴다.

대상 파일:

```
src/pages/auth/a05-confirm.stories.tsx
src/pages/auth/a06-complete.stories.tsx
src/pages/product/c05-confirm-auth.stories.tsx
src/pages/product/c06-complete.stories.tsx
src/pages/transfer/auto/g02-confirm.stories.tsx
src/pages/transfer/auto/g03-complete.stories.tsx
src/pages/transfer/instant-transfer/d02-confirm.stories.tsx
src/pages/transfer/reserved/e02-confirm.stories.tsx
src/pages/transfer/reserved/e03-complete.stories.tsx
src/shared/ui/collapsible-section.stories.tsx
src/shared/ui/confirm-dialog.stories.tsx
src/shared/ui/confirm-summary.stories.tsx
src/shared/ui/input.stories.tsx
src/shared/ui/step-layout.stories.tsx
src/widgets/shell/app-header.stories.tsx
src/widgets/transfer/result-panel.stories.tsx
src/widgets/transfer/transfer-fields.stories.tsx
```

- 각 도메인 `entities/*` 에 이미 있는 mock 상수(`MOCK_OVERVIEW_ACCOUNTS` 패턴)를 재사용할 수
  있는 파일은 그것을 import한다
- 도메인 엔티티가 없는 범용 컴포넌트(`shared/ui/input.stories.tsx` 등)는 그 자리에서 스토리
  전용 fixture 상수를 모듈 상단에 선언한다 (새 전역 fixture 모듈을 만들지 않는다 — 아직 2곳
  이상에서 공유해야 할 필요가 확인되지 않았다)

**완료 기준**: 17개 파일 모두 값이 fixture/mock 참조로 바뀌고, `pnpm check` 통과.

**실행 결과 (2026-08-03)**: 실제로 다 읽어보니 17개 중 2개(`a05-confirm`·`c06-complete`)는
이미 named local fixture라 원래는 손대지 않으려 했으나, QA agent가 `a05-confirm`의
email/password가 `entities/auth`의 `MOCK_MEMBERS[0]`와 이름·생년월일·아이디는 일치하면서
이메일·비밀번호만 다른 **드리프트**를 잡아냈고, `c06-complete`도 `entities/product`의
`MOCK_JOIN_PRODUCTS.P001`과 4개 필드가 중복돼 있었다 — 둘 다 해당 entities mock을 import하는
방식으로 추가 수정. 나머지 15개는 entities import 또는 로컬 named const로 정리, 5개
(`d02`/`e02`/`e03`/`g02`/`g03`confirm/complete)는 이미 `MOCK_PAYEE_NAME`을 쓰고 있었고
수취인 계좌번호(`TO_ACCOUNT_NO` 리터럴)만 `MOCK_PAYEE_ACCOUNTS[0].accountNo`로 교체했다.
`pnpm check` 통과, QA 2회(1차 + 드리프트 수정 후 재검증) 통과.

## Phase 3 — addon 보강 (선행 조건 있음)

- `interactions`/play function: `addon-vitest`가 SESSION_HANDOFF.md 기준 `aria-query`
  ESM/CJS interop 버그로 제외된 상태. **이 버그가 업스트림에서 해소됐는지 먼저 확인**한
  뒤에만 재도입한다 — 확인 없이 추가하면 `pnpm check`(vitest)가 다시 깨진다
- `viewport`/`backgrounds` addon: 데스크톱 전용 고정폭·흰 배경 정책상 우선순위 낮음. 다크모드는
  이미 `preview.tsx`의 커스텀 decorator로 커버되고 있어 backgrounds addon 없이도 충분

**완료 기준**: 이 Phase는 선행 조건(업스트림 버그 해소)이 걸려 있어 착수 시점을 별도로
재확인한 뒤 진행한다.

**실행 결과 (2026-08-03)**: 업스트림 상태를 확인했다 — `node_modules`에 `aria-query@5.3.0`과
`aria-query@5.3.2`가 동시에 설치되는 구조가 여전하고(5.3.x의 CJS/ESM 이중 배포 문제가 계속
보고됨), `@storybook/addon-vitest` 관련 GitHub 이슈도 이 interop 문제가 해소됐다는 공식
확인이 없다. Playwright 브라우저 바이너리 설치까지 필요한 무거운 변경이라 불확실한 상태에서
설치해 `pnpm check`를 깨뜨릴 위험이 실익보다 크다고 판단해 **재도입하지 않기로 결정**했다.
viewport/backgrounds addon도 원래 판단대로 추가하지 않는다. 코드 변경 없음 — 다음에 이
Phase를 다시 열 때는 `@storybook/addon-vitest` 최신 릴리스 노트에서 aria-query interop 수정
여부부터 확인한다.

## Phase 4 — 전체 확산 (103개 파일)

Phase 0~2에서 확정한 패턴(매트릭스 스토리, 엣지 케이스 스토리, `argTypes`, fixture 참조)을
나머지 컴포넌트·화면 스토리로 확산한다. 우선순위는 `CLAUDE.md` "재사용" 표 등장 빈도 순 —
`DataGrid`/`StepLayout`/`Modal` 계열처럼 여러 화면에서 조립되는 컴포넌트를 먼저, 화면
(`pages/*`) 스토리는 마지막.

**실행 결과 (2026-08-03)**: 남은 75개 파일을 6개 그룹(shared/ui 14, widgets 11, entities-ui+auth
화면 11, account+inquiry 화면 12, dashboard+design-system+mypage 11, product+transfer 화면 16)으로
나눠 병렬 처리했다. 실제로 변경이 필요했던 건 9개뿐이었다 — 나머지 66개는 이미 Phase 2 이전
커밋(`45fe77a`, `7a5727a`)에서 entities mock을 쓰고 있었거나, 매트릭스/argTypes를 붙일 의미 있는
enum prop이 없는 순수 레이아웃 컴포넌트였다. 억지로 손대지 않고 스킵했다.

변경한 9개: `label-value-row`/`panel.stories.tsx`(entities/dashboard의 `MOCK_ACCESS_STATUS`),
`query-page-layout`/`summary-row.stories.tsx`(총잔액 매직넘버 `17_700_500` → `MOCK_OVERVIEW_ACCOUNTS`
checking 그룹 reduce 합산 — QA에서 직접 검산해 실제로 일치함을 확인), `search-panel`/
`grid-toolbar.stories.tsx`(entities/transfer·mock-clock 참조), `result-panel`/
`transfer-fields.stories.tsx`(entities/transfer의 `MOCK_PAYEE_ACCOUNTS[0]` 참조 + result-panel에
누락돼 있던 `variant` argTypes 추가), `banking-shortcuts.stories.tsx`(코드 중복은 `a09-main-dashboard.tsx`의
`DEFAULT_SHORTCUTS`를 export하려 했으나 `react-refresh/only-export-components` 린트 규칙과 충돌해
공유 상수화를 포기하고 출처를 명시하는 주석만 추가). `pnpm check` 통과, QA 통과.

---

## 진행 방식

Phase 0부터 순서대로, 각 Phase 완료 후 다음 Phase 착수 여부를 확인받는다. 한 번에 전체를
고치지 않는다 — 103개 파일 규모라 패턴이 틀리면 되돌릴 범위가 크다.
