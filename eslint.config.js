import js from "@eslint/js"
import globals from "globals"
import tseslint from "typescript-eslint"
import reactHooks from "eslint-plugin-react-hooks"
import reactRefresh from "eslint-plugin-react-refresh"
import boundaries from "eslint-plugin-boundaries"
import checkFile from "eslint-plugin-check-file"
import prettier from "eslint-config-prettier/flat"

/** FSD 레이어. partialMatch: false = 패턴에 매칭되는 개별 파일이 해당 요소. */
const ELEMENTS = [
  { type: "app", pattern: "src/app/**/*", partialMatch: false },
  { type: "app", pattern: "src/{App,main}.tsx", partialMatch: false },
  { type: "pages", pattern: "src/pages/**/*", partialMatch: false },
  { type: "widgets", pattern: "src/widgets/**/*", partialMatch: false },
  { type: "features", pattern: "src/features/**/*", partialMatch: false },
  { type: "entities", pattern: "src/entities/**/*", partialMatch: false },
  { type: "shared", pattern: "src/shared/**/*", partialMatch: false },
  // dev 전용 mock 서버. 제품 코드에서는 절대 import 되지 않는다.
  { type: "mocks", pattern: "src/mocks/**/*", partialMatch: false },
]

const allowTo = (from, to) => ({
  from: { element: { type: from } },
  allow: { to: { element: { types: { anyOf: to } } } },
})

export default tseslint.config(
  {
    ignores: [
      "dist",
      "coverage",
      "playwright-report",
      "test-results",
      "public/mockServiceWorker.js",
      "src/shared/api/generated",
      // 저장소 루트에서 실행할 때 .claude/worktrees/ 아래 다른 세션의 워크트리
      // 체크아웃(별도 .git 포함)까지 스캔하지 않도록 제외한다.
      ".claude",
    ],
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  reactHooks.configs.flat.recommended,
  reactRefresh.configs.vite,
  {
    files: ["src/**/*.{ts,tsx}"],
    linterOptions: { reportUnusedDisableDirectives: "error" },
    languageOptions: {
      ecmaVersion: 2022,
      globals: globals.browser,
      parserOptions: { ecmaFeatures: { jsx: true } },
    },
    plugins: { boundaries, "check-file": checkFile },
    settings: {
      "boundaries/include": ["src/**/*.{ts,tsx}"],
      "boundaries/elements": ELEMENTS,
      "import/resolver": {
        typescript: { alwaysTryTypes: true, project: "./tsconfig.json" },
      },
    },
    rules: {
      /* ---- error: 현재 위반 0건 ---- */
      "@typescript-eslint/no-explicit-any": "error",
      "no-restricted-syntax": [
        "error",
        {
          selector: "Literal[value=/\\[var\\(--color-/]",
          message:
            "색상 토큰은 @theme에 매핑된 유틸리티 클래스를 쓴다. [var(--color-*)] 대괄호 탈출구를 다시 쓰지 않는다(POL-039).",
        },
        {
          selector: "TemplateElement[value.raw=/\\[var\\(--color-/]",
          message:
            "색상 토큰은 @theme에 매핑된 유틸리티 클래스를 쓴다. [var(--color-*)] 대괄호 탈출구를 다시 쓰지 않는다(POL-039).",
        },
      ],
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            {
              group: ["next", "next/*"],
              message: "Next.js가 아니다. react-router-dom / <img> 를 쓴다.",
            },
          ],
        },
      ],
      "no-restricted-exports": [
        "error",
        {
          restrictDefaultExports: {
            direct: true,
            named: true,
            defaultFrom: true,
            namedFrom: true,
            namespaceFrom: true,
          },
        },
      ],
      "check-file/folder-naming-convention": [
        "error",
        { "src/**/": "KEBAB_CASE" },
      ],
      // FSD 마이그레이션 완료로 error 승격 (모두 위반 0건 확인됨)
      "@typescript-eslint/consistent-type-definitions": ["error", "type"],
      "@typescript-eslint/array-type": ["error", { default: "array" }],
      "@typescript-eslint/consistent-type-imports": [
        "error",
        { prefer: "type-imports", fixStyle: "inline-type-imports" },
      ],
      "@typescript-eslint/no-unused-vars": [
        "error",
        { argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
      ],
      "check-file/filename-naming-convention": [
        "error",
        { "**/*.{ts,tsx}": "KEBAB_CASE" },
        { ignoreMiddleExtensions: true },
      ],
      // 하드코딩 정리 작업으로 error 승격 (모두 위반 0건 확인됨)
      "@typescript-eslint/no-restricted-imports": [
        "error",
        {
          patterns: [
            { group: ["./*", "../*"], message: "@/ 절대경로만 사용한다." },
          ],
        },
      ],
      "react-hooks/exhaustive-deps": "error",
      "react-hooks/set-state-in-effect": "error",
      "react-hooks/purity": "error",
      "react-hooks/static-components": "error",
      "react-hooks/immutability": "error",
      "react-hooks/preserve-manual-memoization": "error",
      "react-refresh/only-export-components": [
        "error",
        { allowConstantExport: true },
      ],

      /* ---- warn: entities/account → entities/transfer 참조 2건(의도적 예외,
         CLAUDE.md "남은 마이그레이션" 참고 — 출금계좌 삭제 가능 여부가 예약이체·
         자동이체 등록 여부에 의존하는 도메인 규칙이라 엔티티 간 참조가 불가피하다) ---- */
      "boundaries/dependencies": [
        "warn",
        {
          default: "disallow",
          message:
            "FSD 레이어 위반: {{from.type}} → {{to.type}} 은 허용되지 않는다.",
          policies: [
            allowTo("app", [
              "app",
              "pages",
              "widgets",
              "features",
              "entities",
              "shared",
              "mocks",
            ]),
            allowTo("pages", ["widgets", "features", "entities", "shared"]),
            allowTo("widgets", ["features", "entities", "shared"]),
            allowTo("features", ["entities", "shared"]),
            allowTo("entities", ["shared"]),
            allowTo("shared", ["shared"]),
            allowTo("mocks", ["mocks", "shared", "entities"]),
          ],
        },
      ],
    },
  },
  {
    // 라이브러리가 default export를 요구하는 문서화된 예외
    files: ["src/App.tsx", "*.config.{ts,js,mjs}", "eslint.config.js"],
    rules: { "no-restricted-exports": "off" },
  },
  {
    // App.tsx는 앱 합성 루트 관례상 PascalCase 파일명을 유지한다
    files: ["src/App.tsx"],
    rules: { "check-file/filename-naming-convention": "off" },
  },
  {
    files: [
      "*.config.{ts,js,mjs}",
      "eslint.config.js",
      "orval.config.ts",
      "playwright.config.ts",
    ],
    languageOptions: { globals: globals.node },
  },
  prettier,
)
