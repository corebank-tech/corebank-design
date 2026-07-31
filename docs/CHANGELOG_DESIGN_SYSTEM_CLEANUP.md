# 하드코딩 정리 · 공통 컴포넌트 추출 · 디자인 시스템 구축 (2026-07)

> 커밋: `94a5ef9` (145 files changed, +2496/-1459) — `git show 94a5ef9`로 전체 diff 확인 가능.

## 배경

47개 화면을 빠르게 구현하며 디자인을 코드에서 직접 반복 조정한 결과, 정책 수준 규율(색상
리터럴 0건, 반응형 클래스 0건 등)은 지켜졌지만 그 아래 값의 출처가 흩어지고 토큰 레이어가
절반만 배선되는 드리프트가 쌓였다. 목표는 **다음 개발자가 복붙이 아니라 import로 화면을
늘릴 수 있는 상태**로 만드는 것.

**작업 기준**: 디테일 수치는 코드가 정답으로 보고 문서를 코드에 맞췄다. 단 업무 규칙
(`docs/requirements.md` §2 POL)은 계속 단일 출처로 유지했고, 코드와 어긋나는 업무 규칙은
자동 정정하지 않고 [부록](#부록--판단이-필요한-업무-규칙-충돌)으로 남겼다. 기존 공통
컴포넌트의 공개 API(props·variant 어휘)는 전부 불변 — 예외로 승인받은 시각 변경은 아래
보더 색상 버그 수정 1건뿐이다.

## 1. 값의 단일 출처화

흩어져 있던 값을 모듈로 뽑아냈다. 렌더 결과는 바뀌지 않는다.

| 신규 모듈 | 해소한 중복 |
|---|---|
| `shared/config/policy.ts` | POL 수치(한도·유효시간·조회기간 등) 다중 중복 |
| `shared/config/mock-clock.ts` | mock 기준시각 13개 파일 중복(화면 간 기준일시 어긋남 문제 포함) |
| `shared/config/contact.ts` | 고객센터 전화번호·운영시간 — `footer.tsx` ↔ `error-dialog.tsx` 중복 |
| `shared/lib/date.ts` | `parseISO`/`toISO`/`addDays`/`daysBetween`/`addMonths` 3개 파일 중복(date-fns 래핑) |
| `shared/lib/input-filter.ts` | `onlyDigits` 7곳 중복 |
| `shared/lib/hooks/use-countdown.ts` | 카운트다운 + `formatClock` 4곳 중복 |
| `entities/{transfer,transaction,product}/lib/status-badge.ts` | 상태값 → Badge variant 매핑 6곳 중복 |

## 2. 토큰 레이어 완성 (`src/globals.css`)

- `@theme inline`에 누락됐던 토큰을 정확한 네임스페이스로 노출해 `[var(--color-*)]` 같은
  대괄호 탈출구 210곳을 정식 유틸리티 클래스로 전환 (`shadow-card`, `font-label`,
  `z-overlay`, `tracking-2` 등)
- 9단 타이포 스케일과 4단 radius 스케일을 봉인(`--text-*: initial` 등 후 명시 재선언) —
  Tailwind 기본 스케일 클래스(`text-xl` 등)가 컴파일되지 않게 해 리뷰가 아니라 컴파일러가
  스케일을 지키게 함. line-height를 Tailwind 기본값과 동일하게 재선언해 봉인 전후 렌더
  결과는 그대로 유지
- 사문화 토큰 제거: `--space-*` 9개(참조 0건), shadcn 시맨틱 19개 중 미사용 15개,
  `--color-accent`/`-hover`(primary와 값 동일), `--color-primary-soft`
- 비어 있던 시맨틱 채움: `info`의 tint·border(전에는 없어서 실제로 못 썼다),
  `success`/`warning`의 ring, `danger`의 hover
- 다크 테마에 `--shadow-card`/`--shadow-pop` 대응값 추가(이전엔 부재로 사실상 안 보이던 곳)

### 보더 색상 버그 수정 — 유일한 의도적 시각 변경

`* { border-color: var(--color-border) }`가 어떤 `@layer`에도 없어 CSS 캐스케이드 레이어
규칙상 이 선언이 다른 모든 layered `border-*` 유틸리티를 무조건 이기고 있었다. 결과적으로
**32곳의 의도한 보더색이 렌더링되지 않고 있었다**(`border-strong` 19곳, `danger` 6곳,
`navy` 5곳 — POL-040이 명시한 DataGrid 상단 룰·FormSection 하단 라인 포함, `footer-divider`
2곳). `@layer base`로 감싸 수정했다. Playwright 스크린샷으로 수정 전/후 의도한 색이
실제로 나타나는 것을 확인했다.

## 3. 공통 컴포넌트 추출 (공개 API 불변)

- **`cva` 도입**: `Button`/`Badge`/`Alert`/`Modal`/`DataGrid`/`ResultPanel`에서 `Record` 룩업·
  인라인 삼항·문자열 접합 등 5가지로 갈려 있던 variant 구현 방식을 `cva` 하나로 통일. 이미
  의존성에 있고 CLAUDE.md가 의무화했던 규약을 실제로 성립시켰다. props와 출력 클래스는 그대로.
- **신규 프리미티브**: `Chip`(토글 칩 5곳이 제각각이던 것을 흡수), `IconButton`(8곳 하드코딩
  통일), `Divider`(리터럴 `|` 대체), `Spinner`(`ResultPanel` 내부 전용이던 것을 분리)
- **레이어 재배치** (import 경로만 변경, 렌더 불변):
  - 도메인 지식 없는 컴포넌트를 `widgets/` → `shared/ui/`로: `pagination`, `summary-row`,
    `text-view-modal`, `grid-search-modal`, `step-indicator`, `step-layout`, `confirm-summary`
  - 도메인 지식(인증 정책·POL 수치)을 하드코딩한 컴포넌트를 `shared/ui/` → `entities/*/ui/`로:
    `otp-modal`, `limit-modal`, `session-expired-modal`
  - `PageShell`을 `widgets/` → `app/`으로 (하위 레이어가 상위 레이어를 import하던 의존성
    역전을 수정)

## 4. 린트 래칫 마감

상대경로 import 42건, `react-refresh` 경고 8건, `set-state-in-effect` 경고 4건(render 중
상태 조정 패턴으로 전환)을 모두 해소하고, 해소된 규칙을 전부 `warn` → `error`로 승격했다.
`pnpm check`는 error 0 / warning 2(아래 의도적 예외 1건)를 유지한다.

## 5. `/design-system` 갤러리 라우트 신설

토큰 / 프리미티브 / 조합 / 패턴 4개 탭으로 구성된 실물 카탈로그. variant × size 전수
매트릭스를 렌더링해 `Alert`의 4개 variant 중 2개만, `Badge.primary`가 1곳만 실사용
중이었다는 사실처럼 미사용 variant가 조용히 깨져도 몰랐던 상황을 드러낸다. 기존
`/dialogs`(`feedback-demo.tsx`)·`/result`(`result-demo.tsx`) 데모 라우트를 흡수했고
`result-demo.tsx`는 삭제했다.

## 6. 문서 정정 (코드 기준)

- `docs/DESIGN_TOKENS.md`: hex 값 다수 오류, "다크 테마 없음" 오기(실제 69줄 존재), 누락
  토큰 다수를 반영해 전면 재작성
- `docs/COMPONENT_INVENTORY.md`: 컴포넌트 이동 위치 반영, `SessionExpiredModal`이 실제로는
  전역 세션 만료 게이트로 쓰이고 있다는 점(과거엔 데모 전용으로 오기됨), D-02 인증 연결·
  C-01/C-02 라우팅 등 닫힌 갭 반영
- `CLAUDE.md`: 재사용표 최신화(이동된 파일 위치, 신규 모듈 추가), 표 밀도 13px→14px
  (POL-041과 일치), 남은 마이그레이션 항목 갱신

## 검증

- `pnpm check`: error 0 / warning 2
- `pnpm exec vite build`: 통과
- Playwright 시각회귀(5 아키타입 × 라이트/다크, 10장): diff 0 (보더색 수정분만 의도된
  재베이스라인)
- `/design-system` 4개 탭 라이트/다크 육안 확인
- 금지 패턴 재도입 0건: `[var(--color-`, 상대경로 import, `next/*`

## 부록 — 판단이 필요한 업무 규칙 충돌

코드가 아니라 사람이 정해야 하는 항목이라 이번 작업에서는 고치지 않고 보고만 한다.

| # | 항목 | 내용 |
|---|---|---|
| B1 | 표 행 높이 | POL-041은 44px, 코드는 `px-3 py-2.5`로 계산상 ≈41px. 패딩을 맞출지 POL 문구를 "≈44px"로 할지 |
| B2 | 다크 테마 | POL·REQ에 근거 조항이 전혀 없다. 신규 REQ 추가 또는 명시적 예외 처리 필요 |
| B3 | 텍스트 크기 조절(zoom) | 요구사항 없음. 1.3배에서 1280px 고정폭을 넘어 REQ-NFR-012 인수기준과 상충 가능 |
| B4 | 좌측 SideNav | REQ-CMN-001은 "헤더–콘텐츠–푸터 3단"인데 실제로는 4번째 구조 영역이 있다 |
| B7 | 데모 라우트 접근 가드 | `/dialogs`·`/result`는 이번에 `/design-system`으로 흡수됐지만, 배포 전 dev 전용 라우트를 env 플래그로 게이팅할지는 여전히 미결 |
| B8 | `/user/password` 중복 | F-01 한 화면에 라우트 2개가 동일 컴포넌트를 렌더 |

그 외 이번 작업 범위 밖에서 발견한 것: `product-detail.tsx`/`product-card-grid.tsx`의
`text-[32px]`(상품가 강조 표시), `app-header.tsx`의 `text-[10px]`(알림 배지 숫자)는 9단
타이포 스케일 밖의 임의값이다. 스케일에 없는 크기라 변환 시 렌더 결과가 바뀌므로(=승인
범위 밖의 시각 변경) 손대지 않았다 — 스케일을 확장할지 예외로 남길지 결정이 필요하다.
