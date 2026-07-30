import * as React from "react"
import { AlertCircle } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import { NoticeBoxFooter } from "@/components/shell/notice-box"

export function LoginScreen() {
  const [userId, setUserId] = React.useState("")
  const [password, setPassword] = React.useState("")
  const [attempts, setAttempts] = React.useState(0)
  const [error, setError] = React.useState(false)

  const MAX = 5

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Demo: always fail to showcase the inline error + attempt counter.
    const next = Math.min(attempts + 1, MAX)
    setAttempts(next)
    setError(true)
  }

  return (
    <div className="flex flex-col items-center py-6">
      <div className="w-full max-w-[480px]">
        <div className="border border-[var(--color-border)] bg-white p-8">
          <div className="mb-6 text-center">
            <h1 className="text-page font-bold text-ink">로그인</h1>
            <p className="mt-1 text-sm text-ink-muted">
              CoreBank 인터넷뱅킹에 오신 것을 환영합니다.
            </p>
          </div>

          {error && (
            <div
              role="alert"
              className="mb-4 flex items-start gap-2 rounded-[var(--radius)] border border-[var(--color-danger)] bg-[var(--color-danger-tint)] p-3"
            >
              <AlertCircle
                className="mt-0.5 h-4 w-4 shrink-0 text-[var(--color-danger)]"
                aria-hidden="true"
              />
              <p className="text-sm text-ink">
                아이디 또는 비밀번호가 올바르지 않습니다.{" "}
                <span className="font-bold text-[var(--color-danger)]">
                  ({attempts}/{MAX}회)
                </span>
              </p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label htmlFor="login-id" className="text-sm font-bold text-ink">
                이용자ID
              </label>
              <Input
                id="login-id"
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
                placeholder="아이디를 입력하세요"
                autoComplete="username"
                invalid={error}
              />
              <p className="text-2xs text-ink-muted">
                ※ 아이디·비밀번호 방식만 제공되며, 공동인증서·간편인증은 지원하지 않습니다.
              </p>
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="login-pw" className="text-sm font-bold text-ink">
                비밀번호
              </label>
              <Input
                id="login-pw"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="비밀번호를 입력하세요"
                autoComplete="current-password"
                invalid={error}
              />
              <p className="text-2xs text-ink-muted">
                ※ 비밀번호를 5회 연속 잘못 입력하면 계정이 잠깁니다(관리자 확인 후 해제 가능).
              </p>
            </div>

            <Checkbox label="아이디 저장" />

            <Button type="submit" size="lg" fullWidth className="mt-1">
              로그인
            </Button>
          </form>

          <div className="mt-5 flex items-center justify-center gap-3 text-sm text-ink-muted">
            <a href="#" className="hover:text-primary hover:underline">
              아이디 찾기
            </a>
            <span className="text-[var(--color-border-strong)]" aria-hidden="true">
              |
            </span>
            <a href="#" className="hover:text-primary hover:underline">
              비밀번호 재설정
            </a>
            <span className="text-[var(--color-border-strong)]" aria-hidden="true">
              |
            </span>
            <a href="#" className="hover:text-primary hover:underline">
              회원가입
            </a>
          </div>
        </div>

        <NoticeBoxFooter
          className="mt-8"
          items={[
            "보안을 위해 로그인 후 10분간 이용이 없으면 자동으로 로그아웃됩니다(헤더의 [연장]으로 세션을 갱신할 수 있습니다).",
            "비밀번호를 5회 연속 잘못 입력하면 계정이 잠기며, 잠금 해제는 고객센터를 통한 관리자 확인 후에만 가능합니다.",
            "인증서·간편인증·보안카드는 제공하지 않으며, 아이디·비밀번호 방식으로만 로그인할 수 있습니다.",
          ]}
        />
      </div>
    </div>
  )
}
