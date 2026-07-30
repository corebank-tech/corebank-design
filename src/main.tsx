import React from "react"
import ReactDOM from "react-dom/client"
import { BrowserRouter } from "react-router-dom"
import App from "./App"
import { SessionProvider } from "./app/session-context"
import { NotificationsProvider } from "./app/notifications-context"
import "./globals.css"

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <SessionProvider>
        <NotificationsProvider>
          <App />
        </NotificationsProvider>
      </SessionProvider>
    </BrowserRouter>
  </React.StrictMode>,
)
