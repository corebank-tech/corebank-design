/**
 * CoreBank display formatters. KRW single currency, Asia/Seoul.
 * Keep all presentation formatting here so components stay pure.
 */

/** 1000000 -> "1,000,000원" (or "1,000,000" when suffix=false). */
export function formatAmount(
  value: number,
  options: { suffix?: boolean } = {},
): string {
  const { suffix = true } = options
  if (!Number.isInteger(value)) {
    console.warn(`formatAmount: non-integer amount ${value}; truncating.`)
  }
  const truncated = Math.trunc(value)
  const grouped = truncated.toLocaleString("ko-KR")
  return suffix ? `${grouped}원` : grouped
}

/** "110632892336" -> "110-632-892336" (3-3-6). Non-digits are stripped. */
export function formatAccountNo(raw: string): string {
  const digits = raw.replace(/\D/g, "")
  if (digits.length !== 12) {
    // Fall back to a best-effort 3-3-rest grouping for non-standard lengths.
    return [digits.slice(0, 3), digits.slice(3, 6), digits.slice(6)]
      .filter(Boolean)
      .join("-")
  }
  return `${digits.slice(0, 3)}-${digits.slice(3, 6)}-${digits.slice(6)}`
}

function toDate(input: Date | string): Date {
  return input instanceof Date ? input : new Date(input)
}

function pad(n: number): string {
  return String(n).padStart(2, "0")
}

/** -> "YYYY.MM.DD" */
export function formatDate(input: Date | string): string {
  const d = toDate(input)
  return `${d.getFullYear()}.${pad(d.getMonth() + 1)}.${pad(d.getDate())}`
}

/** -> "YYYY.MM.DD HH:mm:ss" */
export function formatDateTime(input: Date | string): string {
  const d = toDate(input)
  return `${formatDate(d)} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(
    d.getSeconds(),
  )}`
}
