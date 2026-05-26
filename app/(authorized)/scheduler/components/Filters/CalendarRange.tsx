"use client"

import { useRouter, usePathname, useSearchParams } from "next/navigation"
import { ChevronLeft, ChevronRight, CalendarDays, RefreshCcw } from "lucide-react"
import { addWeeks, addDays, startOfWeek, endOfWeek, format, isWithinInterval } from "date-fns"
import { pl } from "date-fns/locale"

interface CalendarRangeProps {
  onWeekChange?: () => void
}

export function CalendarRange({ onWeekChange }: CalendarRangeProps) {
  const router = useRouter()
  const pathname = usePathname()
  const search = useSearchParams()

  const param = search.get("day")
  const anchor =
    param && !isNaN(new Date(param).getTime()) ? new Date(param) : new Date()

  const weekStart = startOfWeek(anchor, { weekStartsOn: 1 })
  const weekEnd = endOfWeek(anchor, { weekStartsOn: 1 })
  const today = new Date()
  const isCurrentWeek = isWithinInterval(today, { start: weekStart, end: weekEnd })

  const toYmd = (d: Date) => {
    const y = d.getFullYear()
    const m = String(d.getMonth() + 1).padStart(2, "0")
    const dd = String(d.getDate()).padStart(2, "0")
    return `${y}-${m}-${dd}`
  }

  const setUrlDay = (d: Date) => {
    onWeekChange?.()
    const params = new URLSearchParams(search.toString())
    params.set("day", toYmd(d))
    router.replace(`${pathname}?${params.toString()}`, { scroll: false })
  }

  const go = (deltaWeeks: number) => {
    const nextAnchor = addWeeks(anchor, deltaWeeks)
    const start = startOfWeek(nextAnchor, { weekStartsOn: 1 })
    setUrlDay(addDays(start, 0))
  }

  const goToToday = () => {
    const start = startOfWeek(today, { weekStartsOn: 1 })
    setUrlDay(addDays(start, 0))
  }

  return (
    <div className="inline-flex items-center gap-1 rounded-xl border border-border bg-card shadow-sm px-1 h-9">
      <button
        onClick={() => go(-1)}
        className="p-1.5 rounded-lg hover:bg-muted transition-colors"
        title="Poprzedni tydzień"
      >
        <ChevronLeft className="w-4 h-4" />
      </button>

      <div className="flex items-center gap-1.5 px-2 text-sm text-foreground">
        <CalendarDays className="w-3.5 h-3.5 text-muted-foreground" />
        <span className="whitespace-nowrap">
          {format(weekStart, "d MMM", { locale: pl })} –{" "}
          {format(weekEnd, "d MMM", { locale: pl })}
        </span>
      </div>

      <button
        onClick={() => go(1)}
        className="p-1.5 rounded-lg hover:bg-muted transition-colors"
        title="Następny tydzień"
      >
        <ChevronRight className="w-4 h-4" />
      </button>

      {!isCurrentWeek && (
        <button
          onClick={goToToday}
          className="p-1.5 rounded-lg hover:bg-muted transition-colors text-muted-foreground"
          title="Wróć do bieżącego tygodnia"
        >
          <RefreshCcw className="w-3.5 h-3.5" />
        </button>
      )}
    </div>
  )
}
