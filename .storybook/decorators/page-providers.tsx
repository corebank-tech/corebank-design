import * as React from "react"
import { MemoryRouter } from "react-router-dom"
import { QueryClientProvider } from "@tanstack/react-query"
import type { Decorator } from "@storybook/react-vite"
import { createQueryClient } from "@/shared/api/query-client"
import { SessionProvider } from "@/app/session-context"
import { NotificationsProvider } from "@/app/notifications-context"
import { useSession } from "@/app/use-session"
import { MOCK_MEMBERS } from "@/entities/auth"

/**
 * 실제 로그인 흐름(SessionProvider.login)을 그대로 태워 인증 상태를 만든다 —
 * 화면 스토리가 실제 세션 로직과 어긋나지 않게 하기 위해 별도 인증 우회를 두지 않는다.
 */
function AutoLogin({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, login } = useSession()
  const [demoMember] = MOCK_MEMBERS

  React.useEffect(() => {
    if (isAuthenticated) return
    login(demoMember.memberId, demoMember.loginPassword)
  }, [isAuthenticated, login, demoMember])

  if (!isAuthenticated) return null
  return <>{children}</>
}

function PageProviders({ children }: { children: React.ReactNode }) {
  const [queryClient] = React.useState(createQueryClient)

  return (
    <QueryClientProvider client={queryClient}>
      <MemoryRouter initialEntries={["/"]}>
        <SessionProvider>
          <NotificationsProvider>{children}</NotificationsProvider>
        </SessionProvider>
      </MemoryRouter>
    </QueryClientProvider>
  )
}

/** 로그인·아이디찾기 등 인증 전 화면용. RequireAuth 게이트를 통과하지 않은 상태를 그대로 보여준다. */
export const WithGuestPage: Decorator = (Story) => (
  <PageProviders>
    <Story />
  </PageProviders>
)

/** RequireAuth로 보호되는 화면용. 실제 라우트에서는 항상 로그인된 상태로만 도달하므로 그 상태를 재현한다. */
export const WithAuthenticatedPage: Decorator = (Story) => (
  <PageProviders>
    <AutoLogin>
      <Story />
    </AutoLogin>
  </PageProviders>
)
