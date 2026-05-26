"use client"

import { useState, useEffect } from "react"
import { CalendarIcon, X } from "lucide-react"
import { cn } from "@/utils/helpers"
import { Label } from "./Label"

const DAYS = ["Pn", "Wt", "Śr", "Cz", "Pt", "Sb", "Nd"]
const MONTHS = [
  "Styczeń", "Luty", "Marzec", "Kwiecień", "Maj", "Czerwiec",
  "Lipiec", "Sierpień", "Wrzesień", "Październik", "Listopad", "Grudzień",
]

function formatYMD(d: Date): string {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, "0")
  const dd = String(d.getDate()).padStart(2, "0")
  return `${y}-${m}-${dd}`
}

function getDaysInMonth(year: number, month: number): number {
  return new Date(year, month + 1, 0).getDate()
}

function getFirstDayOfMonth(year: number, month: number): number {
  const d = new Date(year, month, 1).getDay()
  return d === 0 ? 6 : d - 1 // ISO: pn=0
}

interface SingleDatePickerProps {
  value?: string | null
  onChange: (val: string) => void
  label?: string
  className?: string
  clearable?: boolean
  error?: boolean
}

export function SingleDatePicker({
  value, onChange, label, className, clearable = true, error,
}: SingleDatePickerProps) {
  const [open, setOpen] = useState(false)

  const parsed = value ? new Date(value) : null
  const today = new Date()

  const [viewYear, setViewYear] = useState(parsed?.getFullYear() ?? today.getFullYear())
  const [viewMonth, setViewMonth] = useState(parsed?.getMonth() ?? today.getMonth())

  // Sync widoku z wartością
  useEffect(() => {
    if (parsed) {
      setViewYear(parsed.getFullYear())
      setViewMonth(parsed.getMonth())
    }
  }, [value])

  const daysInMonth = getDaysInMonth(viewYear, viewMonth)
  const firstDay = getFirstDayOfMonth(viewYear, viewMonth)

  const handleSelect = (day: number) => {
    const d = new Date(viewYear, viewMonth, day)
    onChange(formatYMD(d))
    setOpen(false)
  }

  const prevMonth = () => {
    if (viewMonth === 0) { setViewMonth(11); setViewYear((y) => y - 1) }
    else setViewMonth((m) => m - 1)
  }

  const nextMonth = () => {
    if (viewMonth === 11) { setViewMonth(0); setViewYear((y) => y + 1) }
    else setViewMonth((m) => m + 1)
  }

  const displayValue = parsed
    ? parsed.toLocaleDateString("pl-PL", { day: "2-digit", month: "2-digit", year: "numeric" })
    : null

  return (
    <div className="relative space-y-1.5">
      {label && <Label>{label}</Label>}

      {/* Trigger */}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className={cn(
          "w-full h-10 px-3 flex items-center gap-2 rounded-lg border bg-input text-sm text-left",
          "focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors",
          error ? "border-destructive" : "border-border",
          open && "ring-2 ring-primary/30 border-primary",
          className
        )}
      >
        <CalendarIcon className="w-4 h-4 text-muted-foreground shrink-0" />
        <span className={cn("flex-1 truncate", !displayValue && "text-muted-foreground/60")}>
          {displayValue ?? "Wybierz datę"}
        </span>
        {clearable && value && (
          <span
            onClick={(e) => { e.stopPropagation(); onChange("") }}
            className="p-0.5 rounded hover:bg-muted text-muted-foreground"
          >
            <X className="w-3 h-3" />
          </span>
        )}
      </button>

      {/* Popover kalendarza */}
      {open && (
        <>
          {/* Overlay */}
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />

          <div className="absolute z-50 mt-1 bg-card border border-border rounded-xl shadow-lg p-3 w-[260px]">
            {/* Nawigacja miesiąca */}
            <div className="flex items-center justify-between mb-3">
              <button type="button" onClick={prevMonth}
                className="p-1 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors">
                ‹
              </button>
              <span className="text-sm font-medium text-foreground">
                {MONTHS[viewMonth]} {viewYear}
              </span>
              <button type="button" onClick={nextMonth}
                className="p-1 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors">
                ›
              </button>
            </div>

            {/* Nagłówki dni */}
            <div className="grid grid-cols-7 mb-1">
              {DAYS.map((d) => (
                <div key={d} className="text-center text-[10px] font-medium text-muted-foreground py-1">
                  {d}
                </div>
              ))}
            </div>

            {/* Siatka dni */}
            <div className="grid grid-cols-7 gap-0.5">
              {/* Puste komórki przed pierwszym dniem */}
              {Array.from({ length: firstDay }).map((_, i) => (
                <div key={`e-${i}`} />
              ))}

              {Array.from({ length: daysInMonth }, (_, i) => i + 1).map((day) => {
                const isToday =
                  day === today.getDate() &&
                  viewMonth === today.getMonth() &&
                  viewYear === today.getFullYear()

                const isSelected =
                  parsed &&
                  day === parsed.getDate() &&
                  viewMonth === parsed.getMonth() &&
                  viewYear === parsed.getFullYear()

                return (
                  <button
                    key={day}
                    type="button"
                    onClick={() => handleSelect(day)}
                    className={cn(
                      "h-8 w-full rounded-lg text-sm transition-colors",
                      isSelected
                        ? "bg-primary text-white font-semibold"
                        : isToday
                          ? "bg-primary/10 text-primary font-semibold hover:bg-primary/20"
                          : "hover:bg-muted text-foreground"
                    )}
                  >
                    {day}
                  </button>
                )
              })}
            </div>

            {/* Dziś */}
            <div className="mt-2 pt-2 border-t border-border">
              <button
                type="button"
                onClick={() => { onChange(formatYMD(today)); setOpen(false) }}
                className="w-full text-xs text-center text-primary hover:underline"
              >
                Dziś
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
