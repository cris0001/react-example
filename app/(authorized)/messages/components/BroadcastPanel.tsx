"use client"

import { useState, useCallback } from "react"
import { Send, Loader2, Users, X } from "lucide-react"
import { useSendMessage, useRecipients } from "../hooks/useMessages"
import { cn } from "@/utils/helpers"
import type { EmployeesData, JobPosition } from "@/app/(authorized)/employees/types"
import type { Recipient } from "../types"

interface BroadcastPanelProps {
  employees: EmployeesData[]
  jobPositions: JobPosition[]
}

export function BroadcastPanel({ employees, jobPositions }: BroadcastPanelProps) {
  const { mutateAsync: send, isPending } = useSendMessage()

  const [title, setTitle] = useState("")
  const [message, setMessage] = useState("")
  const [selectedJobIds, setSelectedJobIds] = useState<number[]>([])
  const [selectedEmployees, setSelectedEmployees] = useState<Recipient[]>([])
  const [result, setResult] = useState<{ ok: boolean; text: string } | null>(null)

  const recipients = useRecipients(employees, selectedEmployees, selectedJobIds)

  const toggleJob = useCallback((id: number) => {
    setSelectedJobIds((prev) =>
      prev.includes(id) ? prev.filter((j) => j !== id) : [...prev, id]
    )
  }, [])

  const toggleEmployee = useCallback((emp: EmployeesData) => {
    if (!emp.fcmToken) return
    setSelectedEmployees((prev) => {
      const exists = prev.find((r) => r.id === emp.id)
      if (exists) return prev.filter((r) => r.id !== emp.id)
      return [...prev, { id: emp.id, fcmToken: emp.fcmToken!, imie: emp.imie, nazwisko: emp.nazwisko }]
    })
  }, [])

  const handleSend = useCallback(async () => {
    if (!title.trim() || !message.trim() || recipients.length === 0) return

    try {
      await send({ title: title.trim(), message: message.trim(), recivers: recipients })
      setTitle("")
      setMessage("")
      setSelectedJobIds([])
      setSelectedEmployees([])
      setResult({ ok: true, text: `Wysłano do ${recipients.length} odbiorców.` })
      setTimeout(() => setResult(null), 4000)
    } catch (err: unknown) {
      setResult({ ok: false, text: (err as any)?.response?.data?.message ?? "Błąd wysyłania." })
      setTimeout(() => setResult(null), 5000)
    }
  }, [title, message, recipients, send])

  return (
    <div className="p-4 space-y-4">
      <div className="flex items-center gap-2">
        <Users className="w-4 h-4 text-muted-foreground" />
        <h2 className="text-sm font-semibold text-foreground">Broadcast</h2>
        {recipients.length > 0 && (
          <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-primary/10 text-primary">
            {recipients.length} odbiorców
          </span>
        )}
      </div>

      {result && (
        <div className={cn(
          "px-3 py-2.5 rounded-lg text-sm border",
          result.ok
            ? "bg-emerald-50 border-emerald-200 text-emerald-800 dark:bg-emerald-900/20 dark:border-emerald-800 dark:text-emerald-300"
            : "bg-destructive/8 border-destructive/20 text-destructive"
        )}>
          {result.text}
        </div>
      )}

      {/* Stanowiska */}
      {jobPositions.length > 0 && (
        <div className="space-y-1.5">
          <p className="text-xs font-medium text-muted-foreground">Według stanowiska</p>
          <div className="flex flex-wrap gap-1.5">
            {jobPositions.map((jp) => (
              <button
                key={jp.id}
                onClick={() => toggleJob(jp.id)}
                className={cn(
                  "text-xs px-2.5 py-1 rounded-lg border transition-colors",
                  selectedJobIds.includes(jp.id)
                    ? "bg-primary/10 border-primary/30 text-primary"
                    : "border-border text-muted-foreground hover:bg-muted"
                )}
              >
                {jp.nazwa}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Indywidualni */}
      <div className="space-y-1.5">
        <p className="text-xs font-medium text-muted-foreground">Indywidualnie</p>
        <div className="border border-border rounded-xl max-h-36 overflow-y-auto">
          {employees.filter((e) => !!e.fcmToken).map((emp) => {
            const isSelected = selectedEmployees.some((r) => r.id === emp.id)
            return (
              <button
                key={emp.id}
                onClick={() => toggleEmployee(emp)}
                className={cn(
                  "w-full flex items-center gap-2 px-3 py-2 text-left text-sm transition-colors border-b border-border last:border-0",
                  isSelected ? "bg-primary/8 text-primary" : "hover:bg-muted/50 text-foreground"
                )}
              >
                <div className={cn(
                  "w-5 h-5 rounded-full border flex items-center justify-center text-[10px] font-semibold shrink-0",
                  isSelected ? "bg-primary border-primary text-white" : "border-border text-muted-foreground"
                )}>
                  {isSelected ? "✓" : `${emp.imie?.[0] ?? ""}${emp.nazwisko?.[0] ?? ""}`}
                </div>
                <span className="truncate">{emp.imie} {emp.nazwisko}</span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Formularz */}
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Tytuł"
        className="w-full h-9 px-3 text-sm rounded-lg border border-border bg-input focus:outline-none focus:ring-2 focus:ring-primary/30"
      />

      <div className="flex gap-2">
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Treść wiadomości…"
          rows={3}
          className="flex-1 px-3 py-2 text-sm rounded-lg border border-border bg-input focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none placeholder:text-muted-foreground/50"
        />
        <button
          onClick={handleSend}
          disabled={isPending || !title.trim() || !message.trim() || recipients.length === 0}
          className="p-2.5 rounded-lg bg-primary text-white hover:bg-primary/90 disabled:opacity-50 transition-colors self-end"
        >
          {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
        </button>
      </div>
    </div>
  )
}
