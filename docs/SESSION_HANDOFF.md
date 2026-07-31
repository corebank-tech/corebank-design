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

## 다음 단계 (사용자 승인됨, 이번 세션 마지막 방향)

**Storybook 설치.** 화면 디자인을 FE에 전달하는 방법으로 Figma 대신(또는 병행) Storybook을
쓰기로 했다:
- 컴포넌트 스토리: `src/shared/ui`의 실제 cva 기반 컴포넌트를 그대로 문서화 (코드가 곧 진실이라
  Figma처럼 손으로 옮기다 어긋날 일이 없음)
- 화면(Page) 스토리: `src/pages/*.tsx`의 실제 화면을 mock 데이터(`src/mocks`, `entities/*/api`)와
  함께 통째로 스토리로 등록해 "화면 디자인 카탈로그"로도 쓴다
- Chromatic(시각 회귀 SaaS)은 무료 티어에 스냅샷 제한이 있다는 점만 참고 — Storybook 자체는
  완전 무료, 사용량 제한 없음(로컬/CI에서 도는 정적 빌드 도구)

## 참고

- 저장소: `/Users/danhan/Documents/GitHub/corebank-design`
- 이 세션 종료 시점에 `pnpm check`(typecheck+lint+format+test) 전부 통과 상태
- 프로젝트 상시 규약은 `CLAUDE.md`, 요구사항 단일 출처는 `docs/requirements.md` — 이번 세션에서
  변경한 내용은 전부 그 두 문서와 `docs/DESIGN_TOKENS.md`/`docs/COMPONENT_INVENTORY.md`에 이미
  반영돼 있다. 이 문서는 "왜 지금 이 상태인지"에 대한 서술적 요약일 뿐, 규약의 단일 출처가
  아니다 — 내용이 위 문서들과 어긋나면 그쪽을 믿는다.
