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
  // TEMPORARY: 레이어 밖 레거시 디렉터리. src/lib 해체 커밋에서 이 요소와
  // 아래 관련 정책을 함께 삭제한다.
  { type: "legacy", pattern: "src/lib/**/*", partialMatch: false },
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

      /* ---- warn: 기존 위반이 있어 가시성만 확보. FSD 마이그레이션 커밋에서 error로 승격 ---- */
      "@typescript-eslint/consistent-type-definitions": ["warn", "type"],
      "@typescript-eslint/array-type": ["warn", { default: "array" }],
      "@typescript-eslint/consistent-type-imports": [
        "warn",
        { prefer: "type-imports", fixStyle: "inline-type-imports" },
      ],
      "@typescript-eslint/no-unused-vars": [
        "warn",
        { argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
      ],
      "check-file/filename-naming-convention": [
        "warn",
        { "**/*.{ts,tsx}": "KEBAB_CASE" },
        { ignoreMiddleExtensions: true },
      ],
      "@typescript-eslint/no-restricted-imports": [
        "warn",
        {
          patterns: [
            { group: ["./*", "../*"], message: "@/ 절대경로만 사용한다." },
          ],
        },
      ],
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
              "legacy",
              "mocks",
            ]),
            allowTo("pages", [
              "widgets",
              "features",
              "entities",
              "shared",
              "legacy",
            ]),
            allowTo("widgets", ["features", "entities", "shared", "legacy"]),
            allowTo("features", ["entities", "shared", "legacy"]),
            allowTo("entities", ["shared", "legacy"]),
            allowTo("shared", ["shared"]),
            // TEMPORARY: legacy 는 어디서든 import 가능하고 무엇이든 import 가능
            allowTo("legacy", ["legacy", "shared", "pages"]),
            { allow: { to: { element: { type: "legacy" } } } },
            allowTo("mocks", ["mocks", "shared", "legacy", "entities"]),
          ],
        },
      ],
      "react-hooks/exhaustive-deps": "warn",
      "react-hooks/set-state-in-effect": "warn",
      "react-hooks/purity": "warn",
      "react-hooks/static-components": "warn",
      "react-hooks/immutability": "warn",
      "react-hooks/preserve-manual-memoization": "warn",
      "react-refresh/only-export-components": [
        "warn",
        { allowConstantExport: true },
      ],
    },
  },
  {
    // 라이브러리가 default export를 요구하는 문서화된 예외
    files: ["src/App.tsx", "*.config.{ts,js,mjs}", "eslint.config.js"],
    rules: { "no-restricted-exports": "off" },
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
