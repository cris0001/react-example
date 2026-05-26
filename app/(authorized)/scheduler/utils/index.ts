import type { SchedulerData, DayIndex } from "../types"

export function formatTime(v?: string | null): string {
  if (!v) return ""
  const [h, m] = v.split(":")
  if (!h || !m) return ""
  return `${h.padStart(2, "0")}:${m.padStart(2, "0")}`
}

export function displayCell(row: SchedulerData, day: DayIndex): string {
  const sym = (row[`symbolAbs${day}` as const] as string | undefined)?.trim()
  if (sym) return sym.toUpperCase()
  const od = formatTime((row[`planOd${day}` as const] as string | undefined)?.trim())
  const to = formatTime((row[`planDo${day}` as const] as string | undefined)?.trim())
  return od && to ? `${od}-${to}` : ""
}

export function formatWithWeekday(iso: string): string {
  const weekdays: Record<number, string> = {
    1: "pn", 2: "wt", 3: "śr", 4: "cz", 5: "pt", 6: "sb", 7: "nd",
  }
  const d = new Date(iso + "T12:00:00")
  const js = d.getDay()
  const num = js === 0 ? 7 : js
  const dd = String(d.getDate()).padStart(2, "0")
  const mm = String(d.getMonth() + 1).padStart(2, "0")
  return `${dd}.${mm} (${weekdays[num]})`
}

// Zakresy kopiowania godzin (pn-pt, wt-pt itd.)
export const DAY_RANGES_WEEKDAYS: Record<number, { label: string; days: number[] }> = {
  1: { label: "pn–pt", days: [1, 2, 3, 4, 5] },
  2: { label: "wt–pt", days: [2, 3, 4, 5] },
  3: { label: "śr–pt", days: [3, 4, 5] },
  4: { label: "cz–pt", days: [4, 5] },
}

export const DAY_RANGES_FULL: Record<number, { label: string; days: number[] }> = {
  1: { label: "pn–nd", days: [1, 2, 3, 4, 5, 6, 7] },
  2: { label: "wt–nd", days: [2, 3, 4, 5, 6, 7] },
  3: { label: "śr–nd", days: [3, 4, 5, 6, 7] },
  4: { label: "cz–nd", days: [4, 5, 6, 7] },
  5: { label: "pt–nd", days: [5, 6, 7] },
  6: { label: "sb–nd", days: [6, 7] },
}
