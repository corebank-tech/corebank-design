import * as React from "react"
import {
  MOCK_NOTIFICATION_INBOX,
  type NotificationInboxRow,
} from "@/entities/notification"

export type NotificationsContextValue = {
  notifications: NotificationInboxRow[]
  unreadCount: number
  markRead: (id: string) => void
}

const NotificationsContext =
  React.createContext<NotificationsContextValue | null>(null)

/**
 * F-02 알림함과 헤더 배지(A-90)가 공유하는 단일 상태(REQ-MYPG-005).
 * 알림함에서 읽음 처리하면 헤더 배지 건수가 즉시 반영된다.
 */
export function NotificationsProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const [notifications, setNotifications] = React.useState<
    NotificationInboxRow[]
  >(() =>
    [...MOCK_NOTIFICATION_INBOX].sort((a, b) =>
      b.occurredAt.localeCompare(a.occurredAt),
    ),
  )

  const markRead = React.useCallback((id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n)),
    )
  }, [])

  const unreadCount = notifications.filter((n) => !n.read).length

  const value = React.useMemo<NotificationsContextValue>(
    () => ({ notifications, unreadCount, markRead }),
    [notifications, unreadCount, markRead],
  )

  return (
    <NotificationsContext.Provider value={value}>
      {children}
    </NotificationsContext.Provider>
  )
}

export function useNotifications(): NotificationsContextValue {
  const ctx = React.useContext(NotificationsContext)
  if (!ctx)
    throw new Error(
      "useNotifications must be used within NotificationsProvider",
    )
  return ctx
}
