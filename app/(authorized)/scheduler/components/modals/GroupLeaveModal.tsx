"use client"

import { useState, useMemo } from "react"
import { Input, Select, Textarea } from "@/components/ui"
import { X } from "lucide-react"
import { useLeaveTypes, useGroupLeave } from "../../hooks/useScheduler"

interface GroupLeaveModalProps {
  selectedCells: Set<string>
  onClose: () => void
}

export function GroupLeaveModal({ selectedCells, onClose }: GroupLeaveModalProps) {
  const [from, setFrom] = useState("")
  const [to, setTo] = useState("")
  const [type, setType] = useState("")
  const [desc, setDesc] = useState("")
  const [czyNieOpis, setCzyNieOpis] = useState("")
  const [message, setMessage] = useState<{ ok: boolean; text: string } | null>(null)

  const { data: leaveTypes = [] } = useLeaveTypes()
  const { mutateAsync: groupLeave, isPending } = useGroupLeave()

  const selectedType = useMemo(
    () => leaveTypes.find((t) => t.symbol === type),
    [leaveTypes, type]
  )

  const typeOptions = (selectedType?.czyNieOpcje ?? []) as { text: string; value: string }[]

  // Wyciągnij unikalne pesele z zaznaczonych komórek (format: "recno:day")
  // W tym kontekście selectedCells zawiera klucze - do grupowego urlopu
  // przekazujemy je do backendu
  const handleSave = async () => {
    if (!from || !to || !type) return
    try {
      await groupLeave({
        pesele: Array.from(selectedCells) as string[],
        dataOd: from,
        dataDo: to,
        symbol: type,
        czyNieOpis: czyNieOpis,
        uwagi: desc,
      })
      setMessage({ ok: true, text: "Urlop grupowy dodany." })
      setTimeout(onClose, 1200)
    } catch (err: unknown) {
      setMessage({ ok: false, text: (err as any)?.response?.data?.message ?? "Błąd dodawania urlopu." })
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
            Grupowy urlop ({selectedCells.size} komórek)
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
              <label className="text-sm font-medium text-foreground">Od</label>
              <Input type="date" value={from} onChange={(e) => setFrom(e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-foreground">Do</label>
              <Input type="date" value={to} onChange={(e) => setTo(e.target.value)} />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-foreground">Rodzaj nieobecności</label>
            <Select value={type} onChange={(e) => setType(e.target.value)}>
              <option value="">Wybierz rodzaj</option>
              {leaveTypes.map((t) => (
                <option key={t.symbol} value={t.symbol}>{t.nazwa}</option>
              ))}
            </Select>
          </div>

          {typeOptions.length > 0 && (
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-foreground">{selectedType?.czyNieOpis}</label>
              <Select value={czyNieOpis} onChange={(e) => setCzyNieOpis(e.target.value)}>
                <option value="">Wybierz opcję</option>
                {typeOptions.map((o) => (
                  <option key={o.value} value={o.value}>{o.text}</option>
                ))}
              </Select>
            </div>
          )}

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-foreground">Uwagi</label>
            <Textarea value={desc} onChange={(e) => setDesc(e.target.value)} rows={2} />
          </div>
        </div>

        <div className="flex justify-end gap-2 px-5 py-4 border-t border-border">
          <button onClick={onClose} className="px-4 py-2 text-sm rounded-lg border border-border hover:bg-muted transition-colors">
            Anuluj
          </button>
          <button
            onClick={handleSave}
            disabled={isPending || !from || !to || !type}
            className="px-4 py-2 text-sm rounded-lg bg-primary text-white hover:bg-primary/90 disabled:opacity-50 transition-colors"
          >
            {isPending ? "Dodawanie…" : "Dodaj urlop"}
          </button>
        </div>
      </div>
    </div>
  )
}
