export function isISODate(s?: unknown): s is string {
  return typeof s === "string" && /^\d{4}-\d{2}-\d{2}$/.test(s)
}

export function formatYMD(d: Date): string {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, "0")
  const dd = String(d.getDate()).padStart(2, "0")
  return `${y}-${m}-${dd}`
}

export function mondaySundayRange(today = new Date()): { from: string; to: string } {
  const jsDow = today.getDay()
  const isoDow = jsDow === 0 ? 7 : jsDow
  const monday = new Date(today)
  monday.setHours(0, 0, 0, 0)
  monday.setDate(today.getDate() - (isoDow - 1))
  const sunday = new Date(monday)
  sunday.setDate(monday.getDate() + 6)
  return { from: formatYMD(monday), to: formatYMD(sunday) }
}
