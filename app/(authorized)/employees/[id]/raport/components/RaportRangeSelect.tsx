"use client"

import { useState, useEffect, useCallback } from "react"
import { useRouter, usePathname, useSearchParams } from "next/navigation"
import { Input } from "@/components/ui"
import { CalendarIcon } from "lucide-react"
import {isISODate, mondaySundayRange} from "@/app/(authorized)/employees/[id]/utils/date";

const dtfPL = new Intl.DateTimeFormat("pl-PL", {
  day: "2-digit", month: "2-digit", year: "numeric",
})

export function RaportRangeSelect() {
  const router = useRouter()
  const pathname = usePathname()
  const sp = useSearchParams()

  const [open, setOpen] = useState(false)
  const [from, setFrom] = useState(() => {
    const f = sp.get("from")
    return isISODate(f) ? f : mondaySundayRange().from
  })
  const [to, setTo] = useState(() => {
    const t = sp.get("to")
    return isISODate(t) ? t : mondaySundayRange().to
  })

  // Sync z URL gdy back/forward
  useEffect(() => {
    const f = sp.get("from")
    const t = sp.get("to")
    if (isISODate(f) && isISODate(t)) {
      setFrom(f)
      setTo(t)
    }
  }, [sp])

  const apply = useCallback(() => {
    const params = new URLSearchParams(sp.toString())
    params.set("from", from)
    params.set("to", to)
    router.replace(`${pathname}?${params.toString()}`, { scroll: false })
    setOpen(false)
  }, [from, to, pathname, router, sp])

  const label =
    from && to
      ? `${dtfPL.format(new Date(from))} — ${dtfPL.format(new Date(to))}`
      : "Zakres dat"

  return (
    <div className="flex justify-end mb-3 relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2 h-9 px-3 rounded-lg border border-border bg-background text-sm hover:bg-muted transition-colors min-w-[220px] justify-between"
      >
        <CalendarIcon className="w-4 h-4 text-muted-foreground shrink-0" />
        <span className="flex-1 text-left truncate">{label}</span>
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-1.5 z-50 bg-card border border-border rounded-xl shadow-lg p-4 min-w-[280px]">
          <div className="space-y-3">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-muted-foreground">Od</label>
              <Input type="date" value={from} onChange={(e) => setFrom(e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-muted-foreground">Do</label>
              <Input type="date" value={to} onChange={(e) => setTo(e.target.value)} />
            </div>
            <div className="flex gap-2 pt-1">
              <button
                onClick={() => setOpen(false)}
                className="flex-1 py-2 text-sm rounded-lg border border-border hover:bg-muted transition-colors"
              >
                Anuluj
              </button>
              <button
                onClick={apply}
                className="flex-1 py-2 text-sm rounded-lg bg-primary text-white hover:bg-primary/90 transition-colors"
              >
                Zastosuj
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
