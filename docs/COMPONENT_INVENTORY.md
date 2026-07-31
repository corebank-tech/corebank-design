# CoreBank 컴포넌트 인벤토리

> 재사용 컴포넌트 계층(`src/shared/ui`, `src/widgets`, `src/entities/*/ui`, `src/app`)의 위치·props·사용 화면을 정리한다.
> 화면(`src/pages`) 자체의 화면ID 대응은 `docs/requirements.md` §1 및 추적성 점검 결과를 참조한다.
> "사용 화면ID" 는 실제 JSX 렌더링(`<Component`) 기준이며, 타입만 import 한 경우는 제외했다.

## 1. `src/shared/ui` — 범용 프레젠테이션 컴포넌트

| 컴포넌트 | 위치 | props 요약 | 사용 화면ID(대표) |
|---|---|---|---|
| Button | `button.tsx` | `variant`, `size`(sm/md/lg — 반응형 예외 키), `fullWidth` + 네이티브 button 속성 | 전 화면 |
| Input | `input.tsx` | `invalid` + 네이티브 input 속성 | 전 입력 화면 |
| Select | `select.tsx` | `invalid` + 네이티브 select 속성 | 전 입력 화면 |
| Checkbox | `checkbox.tsx` | `label` + 네이티브 input(checkbox) 속성 | A-02(약관동의) 등 |
| Radio | `radio.tsx` | `label` + 네이티브 input(radio) 속성 | 검색모달, 자동이체 주기 선택 등 |
| Badge | `badge.tsx` | `variant`(primary/neutral/success/danger/warning) + span 속성 | 계좌상태/처리상태 표시 전반 |
| Alert | `alert.tsx` | `variant`(info/success/warning/danger), `title` + div 속성(인라인 안내 배너) | 폼 검증 안내(실 화면에서는 success·danger만) |
| Chip | `chip.tsx` | `tone`(default/active/primary/primary-tint/muted), `size`(sm/md/lg) + 네이티브 button 속성 | 기간 프리셋, 빠른 금액, 상품 카테고리 필터, 최근/자주 쓰는 계좌 |
| IconButton | `icon-button.tsx` | `size`(sm/md/lg), `shape`(square/circle) + 네이티브 button 속성 | 헤더 아이콘, 즐겨찾기, 인쇄/맨위로 등 |
| Divider | `divider.tsx` | `tone`(default/footer-divider) | 푸터 링크 사이 구분선 등 리터럴 `\|` 대체 |
| Spinner | `spinner.tsx` | `size`(sm/md/lg) | ResultPanel `pending` 등 |
| Skeleton | `skeleton.tsx` | — (로딩 인디케이터, REQ-CMN-022) | DataGrid 내부 등 |
| FormRow | `form-row.tsx` | `label`, `required`, `htmlFor`, `labelWidth` | 전 입력 폼 |
| FormSection | `form-section.tsx` | `title`, `action` (하단 `--color-navy` 라인 고정) | 전 입력 폼 |
| Modal | `modal.tsx` | `open`, `onClose`, `title`, `tone`, `size`, `footer`, `closeOnOverlay`, `closeOnEsc`, `hideCloseButton` — **A-91/92/93 계열의 공통 베이스** | B04, B05, D04, G04, 상품약관(terms-agreement) 외 |
| AlertDialog(A-91) | `alert-dialog.tsx` | `open`, `onClose`, `messages`, `confirmLabel`, `onConfirm` — 버튼 1개(REQ-CMN-010 Alert) | A-03, A-04, A-07, A-08, 상품약관 |
| ConfirmDialog(A-91) | `confirm-dialog.tsx` | `open`, `onConfirm`, `messages`, `items`(label:value 표), `cancelLabel`, `confirmLabel` — 버튼 2개(REQ-CMN-010 Confirm) | B04, B05, B06, A-04, D-05, E-04, G-04, F-01, D-02/E-02/G-02 |
| ErrorDialog(A-92) | `error-dialog.tsx` | `open`, `onClose`, `messages`, `code`(REQ-CMN-009 오류코드 접기영역), `onConfirm` | B04, B05, A-03, A-07, E-04, G-04, F-01, C-05 |
| DataGrid | `data-grid.tsx` | `columns`(정렬·렌더·폭), `rows`, `loading`, `emptyMessage`, `selectable`, `onSelectionChange`, `rowKey`, `skeletonRows` — 정렬/페이징은 컬럼·상위 상태와 조합 | §2 참조 |
| EmptyState | `empty-state.tsx` | `message`, `description`, `action` (REQ-CMN-021 "조회 결과가 없습니다.") | DataGrid 결과 0건 화면 전반 |
| Pagination | `pagination.tsx` | `page`, `totalPages`, `blockSize`, `onPageChange` | §2 참조 |
| SummaryRow | `summary-row.tsx` | `items`(label/value/numeric/valueColor), `labelWidth` | §2 참조 |
| GridSearchModal | `grid-search-modal.tsx` | `open`, `onClose`, `fields`(검색 대상 컬럼), `onApply(fieldKey, keyword)` — A-94 공통 그리드 검색 모달(REQ-CMN-020) | B-01, B-03, D-04, E-04, E-05, F-02, G-04, G-05 |
| TextViewModal | `text-view-modal.tsx` | `open`, `onClose`, `title`, `headers`, `rows` — 점자보기 텍스트 대체뷰 | 조회 그리드 툴바 `[점자보기]` |
| StepLayout | `step-layout.tsx` | `steps`, `currentStep`, `title`, `notice`, `noticeTitle`, `footer`, `children` — 스텝 인디케이터+본문+하단 액션의 공통 골격 | §4 참조 |
| StepIndicator | `step-indicator.tsx` | `steps`, `currentStep` | §4 참조 |
| ConfirmSummary | `confirm-summary.tsx` | `columns`(label/value/emphasis) — 확인 단계 요약 표 | §4 참조 |

`data-grid.tsx`/`empty-state.tsx`/`pagination.tsx`/`summary-row.tsx`(조회 그리드)와
`step-layout.tsx`/`step-indicator.tsx`/`confirm-summary.tsx`(스텝 폼)는 도메인 지식 없이
어느 화면에서나 조립되는 범용 프레젠테이션 컴포넌트라 `src/shared/ui`에 있다. §2·§4는 이들을
실제로 감싸 쓰는 도메인별 위젯(`src/widgets/query`, `src/widgets/transfer`)을 다룬다.

## 2. `src/widgets/query` — 조회 그리드 도메인 조립 (A-94)

| 컴포넌트 | 위치 | props 요약 |
|---|---|---|
| SearchPanel | `search-panel.tsx` | `children`(FormRow 조합), `onSearch`, `onReset`, `onSaveCondition`, `searchLabel` |
| GridToolbar | `grid-toolbar.tsx` | `periodLabel`, `totalCount`, `pageSize`(5·10·20·30·50·전체, POL-022), `baseTimeLabel`, `onPrint`/`onBrailleView`/`onSaveFile`/`onSearch` — `[보고서인쇄][점자보기][파일저장][검색]` 툴바 |
| search-fields.tsx | `search-fields.tsx` | `AccountSelectField`, `PeriodField`, `RadioRowField`, `KeywordField` — 검색조건 전용 입력 필드 세트 |

**사용 화면ID(DataGrid 실사용 기준, 14개 화면):** B-01, B-02, B-05, B-06, B-07, B-03(transaction-inquiry-screen), D-04, E-04, E-05, F-02, G-04, G-05, C-02(product-detail, 라우팅 미연결 — §6 참조), A-09(main-dashboard)

## 3. 앱 셸 (A-90)

| 컴포넌트 | 위치 | props 요약 |
|---|---|---|
| PageShell | `src/app/page-shell.tsx` | `activeId`, `breadcrumb`, `title`, `notice`, `noticeTitle`, `bare` — 전 화면의 최상위 레이아웃 래퍼. `customerName`/로그인 상태/세션 잔여시간은 props가 아니라 내부에서 `useSession()` 컨텍스트로 읽는다 |
| AppHeader | `src/widgets/shell/app-header.tsx` | `activeId`, `customerName`, `unreadCount`, `remainingSeconds`, `loggedIn`, `onExtend`, `onLogout`, `onOpenFullMenu`, `onOpenNotifications` |
| BreadcrumbBar | `src/widgets/shell/breadcrumb-bar.tsx` | `trail` |
| SideNav | `src/widgets/shell/side-nav.tsx` | `activeId` — 좌측 2단 서브메뉴. `PageShell`이 `bare`가 아니고 `activeId`가 있을 때만 렌더 |
| NoticeBox / NoticeBoxFooter | `src/shared/ui/notice-box.tsx` | `title`, `items`, `defaultOpen`(Footer 변형은 접이식) — 모든 조회·폼 화면 하단 `[알아두세요]` 박스 |
| FullMenuOverlay | `src/widgets/shell/full-menu-overlay.tsx` | `open`, `onClose` |
| PageHeader | `src/widgets/shell/page-header.tsx` | `title`, `textScaleActive`, `onCycleTextScale` — `[텍스트 크기 조절]` 포함 |
| Footer | `src/widgets/shell/footer.tsx` | — |

**사용 화면ID:** 전 화면(PageShell을 통해 App.tsx 라우트 전체에서 조합)

`PageShell`은 원래 `src/widgets/shell/`에 있었으나 `app`(라우터·세션 컨텍스트) 레이어를
import하는 의존성 역전이 있어 `src/app/page-shell.tsx`로 옮겼다.

## 4. `src/widgets/transfer` — 거래 스텝 도메인 조립 (A-95)

| 컴포넌트 | 위치 | props 요약 |
|---|---|---|
| ResultPanel | `result-panel.tsx` | `variant`(success/fail/pending), `message`, `description`, `highlightLabel`, `highlightValue`, `columns`, `row`, `actions`, `footnote` |
| transfer-fields.tsx | `transfer-fields.tsx` | `WithdrawAccountField`, `AccountPasswordField`, `AccountNumberField`, `AmountField`, `MemoField`, `TransferDateField`, `TransferCycleField`, `DayOfMonthField`, `TransferEndDateField` — 도메인 날짜 계산은 `src/shared/lib/date.ts`(date-fns 래핑)를 쓴다 |

`StepLayout`/`StepIndicator`/`ConfirmSummary`는 도메인 지식이 없는 범용 컴포넌트라 §1(`shared/ui`)로
옮겼다 — 원래 있던 docstring이 "회원가입·상품가입·이체에서 재사용"이라고 밝히고 있었던 것과
일치시킨 것이다.

**사용 화면ID(StepLayout 실사용 기준, 18개 화면):** A-02~A-06(회원가입 5단계), C-03~C-06(상품가입 4단계), D-01~D-03(즉시이체 3단계), E-01~E-03(예약이체 3단계), G-01~G-03(자동이체 3단계)

> 회원가입(A-02~06)은 CLAUDE.md 재사용표에 명시된 "4개 거래"에는 속하지 않지만 동일한 A-95 컴포넌트를 재사용하고 있다.

## 5. `src/entities/*/ui` — 도메인 지식이 있는 모달

Modal 베이스 위에 있지만 인증 정책·오류 문구·POL 수치를 하드코딩하고 있어 `shared/ui`가 아니라
도메인 슬라이스에 둔다.

| 컴포넌트 | 위치 | props 요약 | 사용 화면ID |
|---|---|---|---|
| OtpModal(A-93) | `src/entities/auth/ui/otp-modal.tsx` | `open`, `onClose`, `onConfirm(code)`, `guide` | B-05, C-05, D-05, D-01~03, E-01~04, G-01~04 — 이체·자동이체·예약이체 인증 단계 전반 |
| SessionExpiredModal(A-11) | `src/entities/auth/ui/session-expired-modal.tsx` | `open`, `onRelogin`, `onMainScreen` | 전 화면(`App.tsx`의 `SessionExpiredGate`가 POL-001 10분 무조작 타임아웃 시 전역으로 띄운다) |
| LimitModal | `src/entities/transfer/ui/limit-modal.tsx` | `open`, `onClose`, `perDay`, `perTransfer`, `dailyRemaining`, `onChangeLimit` | (데모만; 실 화면 미연결 — §6 참조) |

## 6. 아키타입 재사용 집계

| 아키타입 | 화면ID | 재사용 화면 수 | 비고 |
|---|---|---|---|
| 조회 그리드(A-94, DataGrid) | A-94 | **14개 화면** | §2 목록 참조. C-02는 컴포넌트 존재하나 라우팅 미연결 |
| 스텝 레이아웃(A-95, StepLayout) | A-95 | **18개 화면** | 4개 거래(상품가입·즉시이체·예약이체·자동이체) + 회원가입 |
| 모달(A-91/92/93, Modal 계열) | A-91·92·93 | **18개 화면** | Modal 베이스 위에 AlertDialog/ConfirmDialog/ErrorDialog/OtpModal 4종이 합성됨. SessionExpiredModal은 전 화면에서 전역으로 동작해 화면ID 집계에 포함하지 않는다. LimitModal만 아직 실 화면에 미연결(`/design-system` 데모에만 존재) |

## 7. 알려진 갭 (설계 시 참고)

- **LimitModal**: 컴포넌트는 구현되어 있으나 D-05(이체한도 조회/변경) 화면은 `FormSection` +
  `SummaryRow` + `ConfirmDialog` + `OtpModal`을 직접 조합해 자체 구현했고 `LimitModal`을 쓰지
  않는다. 실 사용처가 없고 `/design-system`("조합" 탭) 데모에만 등장한다.

이전에 있던 나머지 갭(D-02 `securitySlot` 빈 슬롯, C-01/C-02 `EmptyState` 플레이스홀더 라우팅,
SessionExpiredModal 미연결)은 이후 작업에서 이미 닫혔다 — D-02는 OtpModal이 실제로 연결됐고,
`/products`·`/products/:productId`는 `C01ProductList`/`C02ProductDetail`로 라우팅되며,
SessionExpiredModal은 §5에 적었듯 전역 세션 만료 게이트로 동작한다.
