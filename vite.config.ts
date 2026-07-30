import { defineConfig } from "vitest/config"
import react from "@vitejs/plugin-react"
import path from "node:path"

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    headers: {
      "X-Content-Type-Options": "nosniff",
      "Referrer-Policy": "strict-origin-when-cross-origin",
      "X-Frame-Options": "SAMEORIGIN",
      "Permissions-Policy": "camera=(), microphone=(), geolocation=()",
    },
    watch: {
      // .claude/worktrees/ 아래 다른 세션의 워크트리 체크아웃 변경까지 감지해
      // 불필요한 전체 새로고침을 유발하지 않도록 제외한다.
      ignored: ["**/.claude/**"],
    },
  },
  test: {
    environment: "jsdom",
    globals: false,
    setupFiles: ["./src/shared/lib/test-setup.ts"],
    include: ["src/**/*.test.{ts,tsx}"],
  },
})
