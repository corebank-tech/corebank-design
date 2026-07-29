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

const KO_DIGITS = ["", "일", "이", "삼", "사", "오", "육", "칠", "팔", "구"]
const KO_SMALL_UNITS = ["", "십", "백", "천"]
const KO_BIG_UNITS = ["", "만", "억", "조", "경"]

function readFourDigits(num: number): string {
  const s = String(num).padStart(4, "0")
  let out = ""
  for (let i = 0; i < 4; i++) {
    const d = Number(s[i])
    if (d !== 0) out += KO_DIGITS[d] + KO_SMALL_UNITS[3 - i]
  }
  return out
}

/**
 * 1000000 -> "일백만원". Reads a KRW integer amount in Korean numerals.
 * Used for the read-back label next to amount inputs.
 */
export function formatKoreanAmount(value: number): string {
  const n = Math.trunc(Math.abs(value))
  if (n === 0) return "영원"
  const groups: number[] = []
  let x = n
  while (x > 0) {
    groups.push(x % 10000)
    x = Math.floor(x / 10000)
  }
  let out = ""
  for (let i = groups.length - 1; i >= 0; i--) {
    if (groups[i] !== 0) out += readFourDigits(groups[i]) + KO_BIG_UNITS[i]
  }
  return `${out}원`
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

/** "홍길동" -> "홍*동". Masks all but the first and last character. (REQ-NFR-005) */
export function maskName(name: string): string {
  if (name.length <= 1) return name
  if (name.length === 2) return `${name[0]}*`
  return `${name[0]}${"*".repeat(name.length - 2)}${name[name.length - 1]}`
}

/** "110632892336" -> "110-632-89****". Masks the trailing digits of the last group. (REQ-NFR-005) */
export function maskAccountNo(raw: string): string {
  const formatted = formatAccountNo(raw)
  const groups = formatted.split("-")
  const lastIndex = groups.length - 1
  const last = groups[lastIndex]
  groups[lastIndex] =
    last.length <= 2 ? last : `${last.slice(0, 2)}${"*".repeat(last.length - 2)}`
  return groups.join("-")
}

/** "abcdef@example.com" -> "ab***@example.com". Masks the local part after the first 2 characters. (REQ-NFR-005) */
export function maskEmail(email: string): string {
  const [local, domain] = email.split("@")
  if (!domain) return email
  const visible = local.slice(0, 2)
  return `${visible}***@${domain}`
}
