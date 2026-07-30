import React from "react"
import ReactDOM from "react-dom/client"
import { BrowserRouter } from "react-router-dom"
import { AppProviders } from "@/app/providers/app-providers"
import App from "@/App"
import { SessionProvider } from "@/app/session-context"
import { NotificationsProvider } from "@/app/notifications-context"
import "@/globals.css"

const enableMocking = async (): Promise<void> => {
  if (!import.meta.env.DEV || import.meta.env.VITE_ENABLE_MSW !== "true") return
  const { worker } = await import("@/mocks/browser")
  await worker.start({ onUnhandledRequest: "bypass" })
}

const root = ReactDOM.createRoot(document.getElementById("root")!)

enableMocking().then(() => {
  root.render(
    <React.StrictMode>
      <AppProviders>
        <BrowserRouter>
          <SessionProvider>
            <NotificationsProvider>
              <App />
            </NotificationsProvider>
          </SessionProvider>
        </BrowserRouter>
      </AppProviders>
    </React.StrictMode>,
  )
})
