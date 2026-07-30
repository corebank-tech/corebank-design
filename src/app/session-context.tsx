import * as React from "react"
import { MOCK_MEMBERS } from "@/lib/mock/auth"

/** POL-001: 세션 타임아웃 10분(600초). */
const SESSION_SECONDS = 600
/** POL-003: 연속 5회 실패 시 계정 잠금. */
const MAX_ATTEMPTS = 5

export type LoginResult =
  | { ok: true }
  | { ok: false; locked: boolean; attempts: number }

export interface SessionContextValue {
  isAuthenticated: boolean
  customerName: string
  remainingSeconds: number
  /** 무조작 10분 경과로 세션이 만료되어 A-11 안내가 표시되어야 하는 상태. */
  expired: boolean
  login: (userId: string, password: string) => LoginResult
  logout: () => void
  extend: () => void
  /** A-11 안내 확인 후 세션 상태를 완전히 정리한다. */
  acknowledgeExpired: () => void
}

const SessionContext = React.createContext<SessionContextValue | null>(null)

export function SessionProvider({ children }: { children: React.ReactNode }) {
  const [customerName, setCustomerName] = React.useState<string | null>(null)
  const [remainingSeconds, setRemainingSeconds] = React.useState(SESSION_SECONDS)
  const [expired, setExpired] = React.useState(false)
  const [attempts, setAttempts] = React.useState(0)
  const [locked, setLocked] = React.useState(false)

  const isAuthenticated = customerName != null && !expired

  React.useEffect(() => {
    if (!isAuthenticated) return
    const id = setInterval(() => {
      setRemainingSeconds((prev) => {
        if (prev <= 1) {
          setExpired(true)
          return 0
        }
        return prev - 1
      })
    }, 1000)
    return () => clearInterval(id)
  }, [isAuthenticated])

  const login = React.useCallback(
    (userId: string, password: string): LoginResult => {
      if (locked) return { ok: false, locked: true, attempts: MAX_ATTEMPTS }

      const member = MOCK_MEMBERS.find(
        (m) => m.memberId === userId && m.loginPassword === password,
      )
      if (member) {
        setCustomerName(member.ownerName)
        setRemainingSeconds(SESSION_SECONDS)
        setExpired(false)
        setAttempts(0)
        return { ok: true }
      }

      const next = attempts + 1
      setAttempts(next)
      if (next >= MAX_ATTEMPTS) setLocked(true)
      return { ok: false, locked: next >= MAX_ATTEMPTS, attempts: next }
    },
    [attempts, locked],
  )

  const logout = React.useCallback(() => {
    setCustomerName(null)
    setExpired(false)
    setRemainingSeconds(SESSION_SECONDS)
  }, [])

  const extend = React.useCallback(() => {
    setRemainingSeconds(SESSION_SECONDS)
  }, [])

  const acknowledgeExpired = React.useCallback(() => {
    setCustomerName(null)
    setExpired(false)
    setRemainingSeconds(SESSION_SECONDS)
  }, [])

  const value = React.useMemo<SessionContextValue>(
    () => ({
      isAuthenticated,
      customerName: customerName ?? "",
      remainingSeconds,
      expired,
      login,
      logout,
      extend,
      acknowledgeExpired,
    }),
    [isAuthenticated, customerName, remainingSeconds, expired, login, logout, extend, acknowledgeExpired],
  )

  return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>
}

export function useSession(): SessionContextValue {
  const ctx = React.useContext(SessionContext)
  if (!ctx) throw new Error("useSession must be used within SessionProvider")
  return ctx
}
