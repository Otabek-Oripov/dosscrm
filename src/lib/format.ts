import { format, formatDistanceToNow, parseISO } from "date-fns"

const UZS = new Intl.NumberFormat("uz-UZ", { maximumFractionDigits: 0 })

export function fmtMoney(n?: number | null): string {
  if (n == null || isNaN(n)) return "—"
  return UZS.format(n) + " so'm"
}

export function fmtNumber(n?: number | null, digits = 0): string {
  if (n == null || isNaN(n)) return "—"
  return new Intl.NumberFormat("uz-UZ", {
    maximumFractionDigits: digits,
    minimumFractionDigits: digits,
  }).format(n)
}

export function fmtPercent(n?: number | null, digits = 1): string {
  if (n == null || isNaN(n)) return "—"
  return new Intl.NumberFormat("uz-UZ", {
    style: "percent",
    maximumFractionDigits: digits,
    minimumFractionDigits: digits,
  }).format(n / 100)
}

export function fmtDate(d?: string | Date | null, withTime = false): string {
  if (!d) return "—"
  const date = typeof d === "string" ? parseISO(d) : d
  return format(date, withTime ? "dd MMM yyyy, HH:mm" : "dd MMM yyyy")
}

export function fmtTime(d?: string | Date | null): string {
  if (!d) return "—"
  const date = typeof d === "string" ? parseISO(d) : d
  return format(date, "HH:mm:ss")
}

export function timeAgo(d?: string | Date | null): string {
  if (!d) return "—"
  const date = typeof d === "string" ? parseISO(d) : d
  return formatDistanceToNow(date, { addSuffix: true })
    .replace("about ", "")
    .replace(" ago", " oldin")
    .replace("less than a minute", "hozir")
    .replace("a minute", "1 daqiqa")
    .replace("an hour", "1 soat")
    .replace("a day", "1 kun")
    .replace("a month", "1 oy")
    .replace("a year", "1 yil")
    .replace("minutes", "daqiqa")
    .replace("hours", "soat")
    .replace("days", "kun")
    .replace("months", "oy")
    .replace("years", "yil")
}

export function initials(name?: string): string {
  if (!name) return "?"
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase() ?? "")
    .join("")
}

export function truncate(s: string | undefined, max = 60): string {
  if (!s) return ""
  return s.length > max ? s.slice(0, max - 1) + "…" : s
}
