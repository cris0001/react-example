"use client"

import { useState, useCallback } from "react"
import { Input, Select, Textarea } from "@/components/ui"
import { X, Loader2, CheckCircle, XCircle } from "lucide-react"
import { useFlatEmployees, useGenerateSchedule } from "../../hooks/useScheduler"
import type { ScheduleStatus } from "../../types"

interface GenerateScheduleModalProps {
  statusMap: Map<string, ScheduleStatus>
  setStatusMap: (map: Map<string, ScheduleStatus>) => void
}

export function GenerateScheduleModal({ statusMap, setStatusMap }: GenerateScheduleModalProps) {
  const [open, setOpen] = useState(false)
  const [selectedPesels, setSelectedPesels] = useState<string[]>([])
  const [from, setFrom] = useState("")
  const [to, setTo] = useState("")
  const [message, setMessage] = useState<{ ok: boolean; text: string } | null>(null)

  const { data: employees = [], isLoading } = useFlatEmployees()
  const { mutateAsync: generate, isPending } = useGenerateSchedule()

  const toggle = useCallback((pesel: string) => {
    setSelectedPesels((prev) =>
      prev.includes(pesel) ? prev.filter((p) => p !== pesel) : [...prev, pesel]
    )
  }, [])

  const toggleAll = useCallback(() => {
    setSelectedPesels((prev) =>
      prev.length === employees.length ? [] : employees.map((e) => e.pesel)
    )
  }, [employees])

  const handleGenerate = async () => {
    if (!from || !to || selectedPesels.length === 0) return
    try {
      const result = await generate({
        pesele: selectedPesels.join(","),
        dataOd: from,
        dataDo: to,
      })
      // Buduj status map z wyników
      const map = new Map<string, ScheduleStatus>()
      if (Array.isArray((result as any).data)) {
        for (const r of (result as any).data) {
          const key = `${r.pesel}|${r.data}`
          map.set(key, {
            ok: r.ok,
            tresc: r.tresc || r.blad || "",
            imienazwisko: r.nazwiskoimie || "",
            data: r.data,
          })
        }
      }
      setStatusMap(map)
      setMessage({ ok: true, text: "Grafik wygenerowany." })
    } catch (err: unknown) {
      setMessage({ ok: false, text: (err as any)?.response?.data?.message ?? "Błąd generowania." })
    }
    setTimeout(() => setMessage(null), 5000)
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="text-sm px-3 py-1.5 rounded-lg border border-border hover:bg-muted transition-colors"
      >
        Generuj grafik
      </button>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
          onClick={(e) => { if (e.target === e.currentTarget) setOpen(false) }}
        >
          <div className="w-full max-w-md bg-card border border-border rounded-2xl shadow-xl overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-border">
              <h2 className="text-sm font-semibold text-foreground">Generuj grafik</h2>
              <button onClick={() => setOpen(false)} className="p-1 rounded-lg hover:bg-muted text-muted-foreground transition-colors">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 space-y-4">
              {message && (
                <div className={[
                  "flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm border",
                  message.ok
                    ? "bg-emerald-50 border-emerald-200 text-emerald-800 dark:bg-emerald-900/20 dark:border-emerald-800 dark:text-emerald-300"
                    : "bg-destructive/8 border-destructive/20 text-destructive",
                ].join(" ")}>
                  {message.ok ? <CheckCircle className="w-4 h-4 shrink-0" /> : <XCircle className="w-4 h-4 shrink-0" />}
                  {message.text}
                </div>
              )}

              {/* Zakres dat */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-muted-foreground">Od</label>
                  <Input type="date" value={from} onChange={(e) => setFrom(e.target.value)} />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-muted-foreground">Do</label>
                  <Input type="date" value={to} onChange={(e) => setTo(e.target.value)} />
                </div>
              </div>

              {/* Lista pracowników */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-medium text-muted-foreground">
                    Pracownicy ({selectedPesels.length}/{employees.length})
                  </label>
                  <button onClick={toggleAll} className="text-xs text-primary hover:underline">
                    {selectedPesels.length === employees.length ? "Odznacz wszystkich" : "Zaznacz wszystkich"}
                  </button>
                </div>
                <div className="border border-border rounded-lg max-h-48 overflow-y-auto">
                  {isLoading ? (
                    <div className="flex items-center justify-center py-6">
                      <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
                    </div>
                  ) : (
                    employees.map((emp) => (
                      <label
                        key={emp.pesel}
                        className="flex items-center gap-2.5 px-3 py-2 hover:bg-muted/50 cursor-pointer border-b border-border last:border-0"
                      >
                        <input
                          type="checkbox"
                          className="w-4 h-4 rounded accent-primary"
                          checked={selectedPesels.includes(emp.pesel)}
                          onChange={() => toggle(emp.pesel)}
                        />
                        <span className="text-sm">{emp.imie} {emp.nazwisko}</span>
                      </label>
                    ))
                  )}
                </div>
              </div>

              {/* Wyniki generowania */}
              {statusMap.size > 0 && (
                <div className="border border-border rounded-lg max-h-32 overflow-y-auto">
                  {Array.from(statusMap.values()).map((st, i) => (
                    <div key={i} className={[
                      "flex items-start gap-2 px-3 py-2 text-xs border-b border-border last:border-0",
                      st.ok === 0 ? "text-destructive" : "text-emerald-600 dark:text-emerald-400",
                    ].join(" ")}>
                      {st.ok === 0
                        ? <XCircle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                        : <CheckCircle className="w-3.5 h-3.5 shrink-0 mt-0.5" />}
                      <span className="break-words">{st.imienazwisko} {st.data}: {st.tresc}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="flex justify-end gap-2 px-5 py-4 border-t border-border">
              <button onClick={() => setOpen(false)} className="px-4 py-2 text-sm rounded-lg border border-border hover:bg-muted transition-colors">
                Anuluj
              </button>
              <button
                onClick={handleGenerate}
                disabled={isPending || !from || !to || selectedPesels.length === 0}
                className="px-4 py-2 text-sm rounded-lg bg-primary text-white hover:bg-primary/90 disabled:opacity-50 transition-colors flex items-center gap-2"
              >
                {isPending && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                {isPending ? "Generowanie…" : "Generuj"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
