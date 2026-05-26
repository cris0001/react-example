"use client"

import { useState, useMemo, useCallback } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Loader2 } from "lucide-react"
import { useLeaveCalendar } from "../hooks/useLeaves"
import { cn } from "@/utils/helpers"
import type { LeaveRequest } from "../types"

const DAYS_PL = ["Pn", "Wt", "Śr", "Cz", "Pt", "Sb", "Nd"]
const MONTHS_PL = [
  "Styczeń", "Luty", "Marzec", "Kwiecień", "Maj", "Czerwiec",
  "Lipiec", "Sierpień", "Wrzesień", "Październik", "Listopad", "Grudzień",
]

function toYmd(d: Date) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`
}

// Buduje mapę: "YYYY-MM-DD" → lista nieobecności
function buildDayMap(items: LeaveRequest[]) {
  const map = new Map<string, LeaveRequest[]>()
  for (const item of items) {
    const start = new Date(item.poczAbs)
    const end = new Date(item.konAbs)
    const cur = new Date(start)
    while (cur <= end) {
      const key = toYmd(cur)
      if (!map.has(key)) map.set(key, [])
      map.get(key)!.push(item)
      cur.setDate(cur.getDate() + 1)
    }
  }
  return map
}

const dtf = new Intl.DateTimeFormat("pl-PL", {
  day: "2-digit", month: "2-digit", year: "numeric",
})

// Kolory dla różnych pracowników
const COLORS = [
  "bg-blue-200 text-blue-800 dark:bg-blue-900/40 dark:text-blue-200",
  "bg-emerald-200 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-200",
  "bg-purple-200 text-purple-800 dark:bg-purple-900/40 dark:text-purple-200",
  "bg-amber-200 text-amber-800 dark:bg-amber-900/40 dark:text-amber-200",
  "bg-rose-200 text-rose-800 dark:bg-rose-900/40 dark:text-rose-200",
  "bg-cyan-200 text-cyan-800 dark:bg-cyan-900/40 dark:text-cyan-200",
]

export function LeavesCalendar() {
  const { data, isLoading } = useLeaveCalendar()
  const today = new Date()

  const [year, setYear] = useState(today.getFullYear())
  const [month, setMonth] = useState(today.getMonth())
  const [tooltip, setTooltip] = useState<{ day: string; items: LeaveRequest[] } | null>(null)

  // useMemo - przelicza mapę tylko gdy dane się zmienią
  const acceptedMap = useMemo(() => {
    if (!data?.accepted) return new Map<string, LeaveRequest[]>()
    return buildDayMap(data.accepted)
  }, [data?.accepted])

  const pendingMap = useMemo(() => {
    if (!data?.yetToDecide) return new Map<string, LeaveRequest[]>()
    return buildDayMap(data.yetToDecide)
  }, [data?.yetToDecide])

  // Stabilny kolor per pracownik (po peselu)
  const colorMap = useMemo(() => {
    const map = new Map<string, string>()
    let i = 0
    const all = [...(data?.accepted ?? []), ...(data?.yetToDecide ?? [])]
    for (const item of all) {
      if (!map.has(item.pesel)) {
        map.set(item.pesel, COLORS[i % COLORS.length])
        i++
      }
    }
    return map
  }, [data])

  const prevMonth = useCallback(() => {
    if (month === 0) { setMonth(11); setYear((y) => y - 1) }
    else setMonth((m) => m - 1)
  }, [month])

  const nextMonth = useCallback(() => {
    if (month === 11) { setMonth(0); setYear((y) => y + 1) }
    else setMonth((m) => m + 1)
  }, [month])

  const goToday = useCallback(() => {
    setYear(today.getFullYear())
    setMonth(today.getMonth())
  }, [])

  // Buduj siatkę dni
  const days = useMemo(() => {
    const firstDay = new Date(year, month, 1).getDay()
    const startOffset = firstDay === 0 ? 6 : firstDay - 1 // ISO: pn=0
    const daysInMonth = new Date(year, month + 1, 0).getDate()
    const grid: (number | null)[] = []
    for (let i = 0; i < startOffset; i++) grid.push(null)
    for (let d = 1; d <= daysInMonth; d++) grid.push(d)
    // Wypełnij do pełnych tygodni
    while (grid.length % 7 !== 0) grid.push(null)
    return grid
  }, [year, month])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-10">
        <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Nawigacja */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1">
          <button onClick={prevMonth} className="p-1.5 rounded-lg hover:bg-muted transition-colors">
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="text-sm font-semibold text-foreground px-2 min-w-[140px] text-center">
            {MONTHS_PL[month]} {year}
          </span>
          <button onClick={nextMonth} className="p-1.5 rounded-lg hover:bg-muted transition-colors">
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
        <button
          onClick={goToday}
          className="text-xs px-3 py-1.5 rounded-lg border border-border hover:bg-muted transition-colors"
        >
          Dziś
        </button>
      </div>

      {/* Legenda */}
      <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-sm bg-emerald-200 dark:bg-emerald-900/40" />
          Zatwierdzone
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-sm bg-amber-200 dark:bg-amber-900/40" />
          Do zatwierdzenia
        </span>
      </div>

      {/* Siatka kalendarza */}
      <div className="rounded-xl border border-border overflow-hidden">
        {/* Nagłówki dni */}
        <div className="grid grid-cols-7 bg-muted/60">
          {DAYS_PL.map((d, i) => (
            <div
              key={d}
              className={cn(
                "text-center text-[11px] font-medium text-muted-foreground py-2",
                i >= 5 && "text-muted-foreground/50"
              )}
            >
              {d}
            </div>
          ))}
        </div>

        {/* Dni */}
        <div className="grid grid-cols-7 bg-card divide-x divide-y divide-border">
          {days.map((day, idx) => {
            if (day === null) {
              return <div key={`empty-${idx}`} className="min-h-[64px] bg-muted/20" />
            }

            const ymd = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`
            const accepted = acceptedMap.get(ymd) ?? []
            const pending = pendingMap.get(ymd) ?? []
            const isToday = ymd === toYmd(today)
            const isWeekend = (idx % 7) >= 5

            return (
              <div
                key={ymd}
                className={cn(
                  "min-h-[64px] p-1 relative",
                  isWeekend && "bg-muted/20",
                  (accepted.length > 0 || pending.length > 0) && "cursor-pointer hover:bg-muted/30 transition-colors"
                )}
                onClick={() => {
                  const all = [...accepted, ...pending]
                  if (all.length > 0) setTooltip(tooltip?.day === ymd ? null : { day: ymd, items: all })
                }}
              >
                {/* Numer dnia */}
                <span className={cn(
                  "text-xs font-medium inline-flex items-center justify-center w-5 h-5 rounded-full",
                  isToday ? "bg-primary text-white" : "text-foreground",
                  isWeekend && !isToday && "text-muted-foreground"
                )}>
                  {day}
                </span>

                {/* Wskaźniki nieobecności */}
                <div className="mt-0.5 space-y-0.5">
                  {accepted.slice(0, 2).map((r, i) => (
                    <div
                      key={`a-${r.recno}-${i}`}
                      className={cn(
                        "text-[9px] font-medium px-1 py-px rounded truncate",
                        colorMap.get(r.pesel) ?? COLORS[0]
                      )}
                    >
                      {r.imie?.[0]}{r.nazwisko?.[0]}
                    </div>
                  ))}
                  {pending.slice(0, 1).map((r, i) => (
                    <div
                      key={`p-${r.recno}-${i}`}
                      className="text-[9px] font-medium px-1 py-px rounded truncate bg-amber-200 text-amber-800 dark:bg-amber-900/40 dark:text-amber-200"
                    >
                      {r.imie?.[0]}{r.nazwisko?.[0]} ?
                    </div>
                  ))}
                  {accepted.length + pending.length > 3 && (
                    <div className="text-[9px] text-muted-foreground px-1">
                      +{accepted.length + pending.length - 3}
                    </div>
                  )}
                </div>

                {/* Tooltip */}
                {tooltip?.day === ymd && (
                  <div className="absolute z-50 left-0 top-full mt-1 w-56 bg-card border border-border rounded-xl shadow-lg p-2 space-y-1.5">
                    <p className="text-[11px] font-semibold text-muted-foreground">
                      {dtf.format(new Date(ymd))}
                    </p>
                    {tooltip.items.map((r) => (
                      <div key={r.recno} className="text-xs">
                        <span className="font-medium text-foreground">{r.imie} {r.nazwisko}</span>
                        <span className="text-muted-foreground ml-1">— {r.nazwa}</span>
                        {r.czyZat === 0 && (
                          <span className="ml-1 text-amber-600 dark:text-amber-400">(oczekuje)</span>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* Kliknięcie poza tooltip */}
      {tooltip && (
        <div className="fixed inset-0 z-40" onClick={() => setTooltip(null)} />
      )}
    </div>
  )
}
