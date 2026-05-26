import type { TaskStatus, TaskPriority } from "../types"

export const STATUS_LABELS: Record<TaskStatus, string> = {
  OPEN: "Otwarte",
  IN_PROGRESS: "W toku",
  DONE: "Zakończone",
  CANCELLED: "Anulowane",
}

export const STATUS_COLORS: Record<TaskStatus, string> = {
  OPEN: "bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-300",
  IN_PROGRESS: "bg-amber-100 text-amber-700 dark:bg-amber-900/20 dark:text-amber-300",
  DONE: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-300",
  CANCELLED: "bg-muted text-muted-foreground",
}

export const PRIORITY_LABELS: Record<TaskPriority, string> = {
  LOW: "Niski",
  MEDIUM: "Średni",
  HIGH: "Wysoki",
  CRITICAL: "Krytyczny",
}

export const PRIORITY_COLORS: Record<TaskPriority, string> = {
  LOW: "bg-muted text-muted-foreground",
  MEDIUM: "bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-300",
  HIGH: "bg-amber-100 text-amber-700 dark:bg-amber-900/20 dark:text-amber-300",
  CRITICAL: "bg-rose-100 text-rose-700 dark:bg-rose-900/20 dark:text-rose-300",
}

export function formatTaskDate(iso: string | null): string {
  if (!iso) return "—"
  return new Intl.DateTimeFormat("pl-PL", {
    day: "2-digit", month: "2-digit", year: "numeric",
  }).format(new Date(iso))
}
