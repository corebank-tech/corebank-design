import { ArrowUp } from "lucide-react"

const FOOTER_LINKS = [
  "개인정보처리방침",
  "이용약관",
  "전자금융거래 이용약관",
  "이메일무단수집거부",
  "보안센터",
  "사이트맵",
]

export function Footer() {
  const scrollTop = () => {
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" })
    }
  }

  return (
    <footer className="mt-12 border-t border-[var(--color-footer-divider)] bg-[var(--color-footer-bg)] text-[var(--color-footer-fg)]">
      <div className="mx-auto w-[1280px] px-4 py-8">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <ul className="flex flex-wrap items-center gap-x-4 gap-y-2">
              {FOOTER_LINKS.map((link, i) => (
                <li key={link} className="flex items-center gap-4">
                  <a
                    href="#"
                    className="text-sm text-[var(--color-footer-fg)] hover:text-[var(--color-footer-fg-strong)] hover:underline"
                  >
                    {link}
                  </a>
                  {i < FOOTER_LINKS.length - 1 && (
                    <span className="text-[var(--color-footer-divider)]" aria-hidden="true">
                      |
                    </span>
                  )}
                </li>
              ))}
            </ul>

            <div className="mt-4 flex flex-col gap-1 text-xs text-[var(--color-footer-fg-faint)]">
              <p>
                <span className="font-bold text-[var(--color-footer-fg-strong)]">고객센터 1599-0000</span>
                <span className="ml-2">평일 09:00~18:00 (주말·공휴일 휴무)</span>
              </p>
              <p>서울특별시 중구 코어대로 100, CoreBank Tower</p>
              <p>&copy; {new Date().getFullYear()} CoreBank. All rights reserved.</p>
            </div>
          </div>

          <button
            type="button"
            onClick={scrollTop}
            className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[var(--color-footer-divider)] text-[var(--color-footer-fg-strong)] hover:bg-[var(--color-footer-hover-bg)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-footer-fg-strong)]"
            aria-label="맨 위로 이동"
          >
            <ArrowUp className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>
      </div>
    </footer>
  )
}
