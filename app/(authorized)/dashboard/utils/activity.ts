export function parseDateToTs(input: string): number {
  if (!input) return 0
  const ts = new Date(input.replace(" ", "T")).getTime()
  return isNaN(ts) ? 0 : ts
}

export function fromNow(ts: number): string {
  const diff = Date.now() - ts
  const m = Math.floor(diff / 60000)
  if (m < 1) return "przed chwilą"
  if (m < 60) return `${m} min temu`
  const h = Math.floor(m / 60)
  if (h < 24) return `${h} h temu`
  const d = Math.floor(h / 24)
  if (d === 1) return "wczoraj"
  return `${d} dni temu`
}

export function badgeLabel(temat: string): string {
  if (temat === "Spoznienie pracownika") return "spóźnienie"
  if (temat === "Wyjscie pracownika") return "przed czasem"
  return temat
}

export function badgeColor(temat: string): string {
  if (temat === "Spoznienie pracownika")
    return "bg-rose-100 text-rose-700 dark:bg-rose-900/20 dark:text-rose-300"
  if (temat === "Wyjscie pracownika")
    return "bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-300"
  return "bg-muted text-muted-foreground"
}

export function iconColor(temat: string): string {
  if (temat === "Spoznienie pracownika")
    return "bg-rose-100 text-rose-600 dark:bg-rose-900/20 dark:text-rose-400"
  if (temat === "Wyjscie pracownika")
    return "bg-blue-100 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400"
  return "bg-muted text-muted-foreground"
}
