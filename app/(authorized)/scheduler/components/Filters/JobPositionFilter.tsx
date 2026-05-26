"use client"

import { useRouter, usePathname, useSearchParams } from "next/navigation"
import { X } from "lucide-react"
import type { JobPosition } from "../../types"

interface JobPositionFilterProps {
  jobPositions: JobPosition[]
}

export function JobPositionFilter({ jobPositions }: JobPositionFilterProps) {
  const router = useRouter()
  const pathname = usePathname()
  const search = useSearchParams()
  const param = search.get("jt")

  const set = (val: string | null) => {
    const params = new URLSearchParams(search.toString())
    if (val) params.set("jt", val)
    else params.delete("jt")
    router.replace(`${pathname}?${params.toString()}`, { scroll: false })
  }

  return (
    <div className="flex items-center gap-1">
      <select
        value={param ?? ""}
        onChange={(e) => set(e.target.value || null)}
        className="h-9 px-3 rounded-xl border border-border bg-card text-sm min-w-[180px] focus:outline-none focus:ring-2 focus:ring-primary/30"
      >
        <option value="">Wszystkie stanowiska</option>
        {jobPositions.map((jp) => (
          <option key={jp.id} value={jp.id}>
            {jp.nazwa}
          </option>
        ))}
      </select>
      {param && (
        <button
          onClick={() => set(null)}
          className="p-2 rounded-lg border border-border hover:bg-muted transition-colors text-muted-foreground"
          title="Wyczyść"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  )
}
