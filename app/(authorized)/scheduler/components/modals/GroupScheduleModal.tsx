"use client"

import { useState } from "react"
import { Input, Select, Textarea } from "@/components/ui"
import { X } from "lucide-react"
import { LocationSelect } from "../LocationSelect"
import { useGroupSchedule, useLocations } from "../../hooks/useScheduler"

interface GroupScheduleModalProps {
  selectedCells: Set<string>
  onClose: () => void
}

export function GroupScheduleModal({ selectedCells, onClose }: GroupScheduleModalProps) {
  const [start, setStart] = useState("")
  const [end, setEnd] = useState("")
  const [loc, setLoc] = useState<{ id: number; name: string } | null>(null)
  const [message, setMessage] = useState<{ ok: boolean; text: string } | null>(null)

  const { data: locations = [] } = useLocations()
  const { mutateAsync: groupSchedule, isPending } = useGroupSchedule()

  const invalid = start && end && start > end

  const handleSave = async () => {
    if (!start || !end || invalid) return
    try {
      await groupSchedule({
        selectedCells: Array.from(selectedCells),
        planOd: start,
        planDo: end,
        idLok: loc?.id ?? null,
      })
      setMessage({ ok: true, text: "Zapisano grupowy grafik." })
      setTimeout(onClose, 1200)
    } catch (err: unknown) {
      setMessage({ ok: false, text: (err as any)?.response?.data?.message ?? "Błąd zapisu." })
      setTimeout(() => setMessage(null), 5000)
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center bg-black/50 backdrop-blur-sm p-4 pt-[20vh]"
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
    >
      <div className="w-full max-w-sm bg-card border border-border rounded-2xl shadow-xl overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-border">
          <h2 className="text-sm font-semibold text-foreground">
            Grupowy grafik ({selectedCells.size} komórek)
          </h2>
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-muted text-muted-foreground transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-5 space-y-4">
          {message && (
            <div className={[
              "px-3 py-2.5 rounded-lg text-sm border",
              message.ok
                ? "bg-emerald-50 border-emerald-200 text-emerald-800 dark:bg-emerald-900/20 dark:border-emerald-800 dark:text-emerald-300"
                : "bg-destructive/8 border-destructive/20 text-destructive",
            ].join(" ")}>
              {message.text}
            </div>
          )}

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-foreground">Godzina od</label>
              <input type="time" step={900} value={start} onChange={(e) => setStart(e.target.value)}
                className={["w-full h-9 px-3 rounded-lg border bg-input text-sm focus:outline-none focus:ring-2 focus:ring-primary/30",
                  invalid ? "border-destructive" : "border-border"].join(" ")} />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-foreground">Godzina do</label>
              <input type="time" step={900} value={end} onChange={(e) => setEnd(e.target.value)}
                className={["w-full h-9 px-3 rounded-lg border bg-input text-sm focus:outline-none focus:ring-2 focus:ring-primary/30",
                  invalid ? "border-destructive" : "border-border"].join(" ")} />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-foreground">Lokalizacja</label>
            <LocationSelect value={{ id: loc?.id ?? null, name: loc?.name ?? "" }}
              onChange={setLoc} options={locations} className="h-9" />
          </div>
        </div>

        <div className="flex justify-end gap-2 px-5 py-4 border-t border-border">
          <button onClick={onClose} className="px-4 py-2 text-sm rounded-lg border border-border hover:bg-muted transition-colors">
            Anuluj
          </button>
          <button
            onClick={handleSave}
            disabled={isPending || !start || !end || !!invalid}
            className="px-4 py-2 text-sm rounded-lg bg-primary text-white hover:bg-primary/90 disabled:opacity-50 transition-colors"
          >
            {isPending ? "Zapisywanie…" : "Zapisz"}
          </button>
        </div>
      </div>
    </div>
  )
}
