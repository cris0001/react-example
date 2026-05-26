"use client"

import type { Location } from "../../types"

interface LocationSelectProps {
  value: { id: number | null; name: string }
  onChange: (val: { id: number; name: string } | null) => void
  options: Location[]
  className?: string
}

export function LocationSelect({ value, onChange, options, className }: LocationSelectProps) {
  return (
    <select
      value={value.id ?? ""}
      onChange={(e) => {
        const id = Number(e.target.value)
        if (!id) { onChange(null); return }
        const loc = options.find((l) => l.id === id)
        if (loc) onChange({ id: loc.id, name: loc.nazwa })
      }}
      className={[
        "w-full px-2 border border-border bg-background text-xs rounded focus:outline-none focus:ring-1 focus:ring-primary/30",
        className ?? "h-8",
      ].join(" ")}
    >
      <option value="">Brak lokalizacji</option>
      {options.map((loc) => (
        <option key={loc.id} value={loc.id}>
          {loc.nazwa}
        </option>
      ))}
    </select>
  )
}
