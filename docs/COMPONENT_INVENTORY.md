# CoreBank 컴포넌트 인벤토리

> 재사용 컴포넌트 계층(`src/shared/ui`, `src/widgets`)의 위치·props·사용 화면을 정리한다.
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
| Badge | `badge.tsx` | `variant` + span 속성 | 계좌상태/처리상태 표시 전반 |
| Alert | `alert.tsx` | `variant`, `title` + div 속성(인라인 안내 배너) | 폼 검증 안내 |
| FormRow | `form-row.tsx` | `label`, `required`, `htmlFor`, `labelWidth` | 전 입력 폼 |
| FormSection | `form-section.tsx` | `title`, `action` (하단 `--color-navy` 라인 고정) | 전 입력 폼 |
| Skeleton | `skeleton.tsx` | — (로딩 인디케이터, REQ-CMN-022) | DataGrid 내부 등 |
| Modal | `modal.tsx` | `open`, `onClose`, `title`, `tone`, `size`, `footer`, `closeOnOverlay`, `closeOnEsc`, `hideCloseButton` — **A-91/92/93 계열의 공통 베이스** | B04, B05, D04, G04, 상품약관(terms-agreement) 외 |
| AlertDialog(A-91) | `alert-dialog.tsx` | `open`, `onClose`, `messages`, `confirmLabel`, `onConfirm` — 버튼 1개(REQ-CMN-010 Alert) | A-03, A-04, A-07, A-08, 상품약관 |
| ConfirmDialog(A-91) | `confirm-dialog.tsx` | `open`, `onConfirm`, `messages`, `items`(label:value 표), `cancelLabel`, `confirmLabel` — 버튼 2개(REQ-CMN-010 Confirm) | B04, B05, B06, A-04, E-04, G-04, F-01, D-05, G-02/03 래퍼, E-02/03 래퍼 |
| ErrorDialog(A-92) | `error-dialog.tsx` | `open`, `onClose`, `messages`, `code`(REQ-CMN-009 오류코드 접기영역), `onConfirm` | B04, B05, A-03, A-07, E-04, G-04, F-01, C-05 |
| OtpModal(A-93) | `otp-modal.tsx` | `open`, `onClose`, `onConfirm(code)`, `guide` | B-05, C-05, D-05, G-02 래퍼, E-02 래퍼 |
| LimitModal | `limit-modal.tsx` | `perDay`, `perTransfer`, `dailyRemaining`, `onChangeLimit` | (데모만; 실 화면 미연결 — §4 참조) |
| SessionExpiredModal(A-11) | `session-expired-modal.tsx` | `open` 없음(`onRelogin`), `message` | (데모만; A-11 독립 화면 미구현 — §4 참조) |

## 2. `src/widgets/query` — 조회 그리드 세트 (A-94)

| 컴포넌트 | 위치 | props 요약 |
|---|---|---|
| DataGrid | `data-grid.tsx` | `columns`(정렬·렌더·폭), `rows`, `loading`, `emptyMessage`, `selectable`, `rowKey`, `skeletonRows` — 정렬/페이징은 컬럼·상위 상태와 조합 |
| SearchPanel | `search-panel.tsx` | `children`(FormRow 조합), `onSearch`, `onReset`, `onSaveCondition`, `searchLabel` |
| Pagination | `pagination.tsx` | `page`, `totalPages`, `blockSize`, `onPageChange` |
| GridToolbar | `grid-toolbar.tsx` | `periodLabel`, `totalCount`, `pageSize`(5·10·20·30·50·전체, POL-022), `baseTimeLabel`, `onPrint`/`onBrailleView`/`onSaveFile`/`onSearch` — `[보고서인쇄][점자보기][파일저장][검색]` 툴바 |
| SummaryRow | `summary-row.tsx` | `items`(label/value/numeric/valueColor), `labelWidth` |
| EmptyState | `empty-state.tsx` | `message`, `description`, `action` (REQ-CMN-021 "조회 결과가 없습니다.") |
| search-fields.tsx | `search-fields.tsx` | `AccountSelectField`, `PeriodField`, `RadioRowField`, `KeywordField` — 검색조건 전용 입력 필드 세트 |

**사용 화면ID(DataGrid 실사용 기준, 14개 화면):** B-01, B-02, B-05, B-06, B-07, B-03(transaction-inquiry-screen), D-04, E-04, E-05, F-02, G-04, G-05, C-02(product-detail, 라우팅 미연결 — §4), A-09(main-dashboard)

## 3. `src/widgets/shell` — 앱 셸 (A-90)

| 컴포넌트 | 위치 | props 요약 |
|---|---|---|
| PageShell | `page-shell.tsx` | `activeId`, `breadcrumb`, `title`, `notice`, `noticeTitle`, `customerName`, `loggedIn`, `bare` — 전 화면의 최상위 레이아웃 래퍼 |
| AppHeader | `app-header.tsx` | `activeId`, `customerName`, `unreadCount`, `sessionSeconds`, `loggedIn`, `onExtend`, `onLogout`, `onOpenFullMenu` |
| BreadcrumbBar | `breadcrumb-bar.tsx` | `trail` |
| NoticeBox / NoticeBoxFooter | `notice-box.tsx` | `title`, `items`, `defaultOpen`(Footer 변형은 접이식) — 모든 조회·폼 화면 하단 `[알아두세요]` 박스 |
| FullMenuOverlay | `full-menu-overlay.tsx` | `open`, `onClose` |
| PageHeader | `page-header.tsx` | `title` |
| Footer | `footer.tsx` | — |

**사용 화면ID:** 전 화면(PageShell을 통해 App.tsx 라우트 전체에서 조합)

## 4. `src/widgets/transfer` — 거래 스텝 레이아웃 세트 (A-95)

| 컴포넌트 | 위치 | props 요약 |
|---|---|---|
| StepLayout | `step-layout.tsx` | `steps`, `currentStep`, `title`, `notice`, `noticeTitle`, `footer`, `children` — 스텝 인디케이터+본문+하단 액션의 공통 골격 |
| StepIndicator | `step-indicator.tsx` | `steps`, `currentStep` |
| ConfirmSummary | `confirm-summary.tsx` | `columns`(label/value/emphasis) — 확인 단계 요약 표 |
| ResultPanel | `result-panel.tsx` | `variant`, `message`, `description`, `highlightLabel`, `highlightValue`, `columns`, `row`, `actions`, `footnote` |
| transfer-fields.tsx | `transfer-fields.tsx` | `WithdrawAccountField`, `AccountPasswordField`, `AccountNumberField`, `AmountField`, `MemoField`, `TransferDateField`, `TransferCycleField`, `DayOfMonthField`, `TransferEndDateField` + 날짜 유틸(`parseISO`/`toISO`/`addDays`/`daysBetween`/`addMonths`) |

**사용 화면ID(StepLayout 실사용 기준, 18개 화면):** A-02~A-06(회원가입 5단계), C-03~C-06(상품가입 4단계), D-01~D-03(즉시이체 3단계), E-01~E-03(예약이체 3단계), G-01~G-03(자동이체 3단계)

> 회원가입(A-02~06)은 CLAUDE.md 재사용표에 명시된 "4개 거래"에는 속하지 않지만 동일한 A-95 컴포넌트를 재사용하고 있다.

## 5. 아키타입 재사용 집계

| 아키타입 | 화면ID | 재사용 화면 수 | 비고 |
|---|---|---|---|
| 조회 그리드(A-94, DataGrid) | A-94 | **14개 화면** | §2 목록 참조. C-02는 컴포넌트 존재하나 라우팅 미연결 |
| 스텝 레이아웃(A-95, StepLayout) | A-95 | **18개 화면** | 4개 거래(상품가입·즉시이체·예약이체·자동이체) + 회원가입 |
| 모달(A-91/92/93, Modal 계열) | A-91·92·93 | **16개 화면**(데모 페이지 제외) | Modal 베이스 위에 AlertDialog/ConfirmDialog/ErrorDialog/OtpModal 4종이 합성됨. LimitModal·SessionExpiredModal은 아직 실 화면에 연결되지 않고 `pages/feedback-demo.tsx` 데모에만 존재 |

## 6. 알려진 갭 (설계 시 참고)

- **D-02(즉시이체 확인/인증)**: `instant-transfer/step-2-confirm.tsx`가 `securitySlot` prop을 빈 슬롯("보안매체 입력 영역")으로 두고 있어, G-02/E-02와 달리 OtpModal·계좌비밀번호 입력이 아직 실제로 연결되지 않았다.
- **C-01/C-02(상품몰 목록/상세)**: `pages/product/product-card-grid.tsx`, `product-detail.tsx` 컴포넌트는 존재하지만 `App.tsx`는 여전히 플레이스홀더(`EmptyState`)로 라우팅한다.
- **LimitModal / SessionExpiredModal**: 컴포넌트는 구현되어 있으나 실제 화면(D-05 이체한도 관리, A-11 세션만료 안내)에 연결된 사용처가 없고 `feedback-demo.tsx`에만 등장한다. A-11은 독립 페이지 파일 자체가 없다(§ 추적성 점검 참조).
