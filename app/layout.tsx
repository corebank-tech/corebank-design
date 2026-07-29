import type { Metadata, Viewport } from "next"
import { Noto_Sans_KR } from "next/font/google"
import "./globals.css"

const notoSansKr = Noto_Sans_KR({
  subsets: ["latin"],
  weight: ["400", "500", "700", "900"],
  variable: "--font-sans",
  display: "swap",
})

export const metadata: Metadata = {
  title: "CoreBank | 인터넷뱅킹",
  description: "CoreBank 개인 인터넷뱅킹 - 조회, 이체, 금융상품, 사용자관리",
}

export const viewport: Viewport = {
  themeColor: "#12459b",
  width: "device-width",
  initialScale: 1,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ko" className={`${notoSansKr.variable} bg-background`}>
      <body className="font-sans antialiased">{children}</body>
    </html>
  )
}
