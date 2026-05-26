"use client"

import { useMemo, useState } from "react"
import { Search } from "lucide-react"
import { cn } from "@/utils/helpers"
import type { EmployeesData } from "@/app/(authorized)/employees/types"

interface ContactListProps {
  employees: EmployeesData[]
  selectedId: number | null
  onSelect: (id: number) => void
}

export function ContactList({ employees, selectedId, onSelect }: ContactListProps) {
  const [search, setSearch] = useState("")

  // useMemo - filtrowanie tylko gdy search lub lista się zmieni
  const filtered = useMemo(() => {
    if (!search.trim()) return employees.filter((e) => !!e.fcmToken)
    const q = search.toLowerCase()
    return employees.filter(
      (e) => !!e.fcmToken &&
        (`${e.imie} ${e.nazwisko}`.toLowerCase().includes(q) ||
          e.email.toLowerCase().includes(q))
    )
  }, [employees, search])

  return (
    <div className="flex flex-col h-full border-r border-border">
      {/* Szukaj */}
      <div className="p-3 border-b border-border">
        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Szukaj pracownika…"
            className="w-full h-8 pl-8 pr-3 text-xs rounded-lg border border-border bg-input focus:outline-none focus:ring-2 focus:ring-primary/30"
          />
        </div>
      </div>

      {/* Lista */}
      <div className="flex-1 overflow-y-auto">
        {filtered.length === 0 && (
          <p className="text-xs text-muted-foreground text-center py-8">Brak pracowników z FCM.</p>
        )}
        {filtered.map((emp) => {
          const initials = `${emp.imie?.[0] ?? ""}${emp.nazwisko?.[0] ?? ""}`.toUpperCase()
          const isSelected = emp.id === selectedId

          return (
            <button
              key={emp.id}
              onClick={() => onSelect(emp.id)}
              className={cn(
                "w-full flex items-center gap-3 px-3 py-2.5 text-left transition-colors",
                isSelected ? "bg-primary/10" : "hover:bg-muted/50"
              )}
            >
              <div className={cn(
                "w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold shrink-0",
                isSelected ? "bg-primary text-white" : "bg-muted text-muted-foreground"
              )}>
                {initials}
              </div>
              <div className="min-w-0">
                <p className={cn(
                  "text-sm font-medium truncate",
                  isSelected ? "text-primary" : "text-foreground"
                )}>
                  {emp.imie} {emp.nazwisko}
                </p>
                <p className="text-[11px] text-muted-foreground truncate">{emp.email}</p>
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}
