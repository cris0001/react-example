"use client"

import { memo, useState, useCallback } from "react"
import { CheckCircle, XCircle, Loader2 } from "lucide-react"
import { Textarea } from "@/components/ui"
import { useDecideLeave } from "../hooks/useLeaves"
import { cn } from "@/utils/helpers"
import type { LeaveRequest } from "../types"

const dtf = new Intl.DateTimeFormat("pl-PL", {
  day: "2-digit", month: "2-digit", year: "numeric",
})

function fmt(iso: string) {
  return dtf.format(new Date(iso))
}

interface LeaveRowProps {
  leave: LeaveRequest
}

function LeaveRow({ leave }: LeaveRowProps) {
  const { mutateAsync: decide, isPending } = useDecideLeave()
  const [confirmAction, setConfirmAction] = useState<"accept" | "reject" | null>(null)
  const [rejectReason, setRejectReason] = useState("")
  const [message, setMessage] = useState<{ ok: boolean; text: string } | null>(null)

  const handleDecide = useCallback(async (action: "accept" | "reject") => {
    try {
      await decide({
        recno: leave.recno,
        status: action === "accept" ? 1 : 0,
        uwagi: action === "reject" ? rejectReason : undefined,
      })
      setConfirmAction(null)
      setRejectReason("")
      setMessage({ ok: true, text: action === "accept" ? "Zaakceptowano." : "Odrzucono." })
      setTimeout(() => setMessage(null), 3000)
    } catch (err: unknown) {
      setMessage({ ok: false, text: (err as any)?.response?.data?.message ?? "Błąd operacji." })
      setTimeout(() => setMessage(null), 5000)
    }
  }, [leave.recno, rejectReason, decide])

  return (
    <div className="bg-card border border-border rounded-xl p-4 space-y-3">
      {/* Nagłówek */}
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-sm font-medium text-foreground">
            {leave.imie} {leave.nazwisko}
          </p>
          <p className="text-xs text-muted-foreground mt-0.5">{leave.nazwa}</p>
          <div className="flex flex-wrap gap-3 mt-1.5 text-xs text-muted-foreground">
            <span>{fmt(leave.poczAbs)} – {fmt(leave.konAbs)}</span>
            <span className="font-medium text-foreground">{leave.dniNieb} dni</span>
          </div>
          {leave.uwagi && (
            <p className="text-xs text-muted-foreground mt-1 italic">„{leave.uwagi}"</p>
          )}
        </div>

        {/* Akcje - widoczne gdy nie ma confirmacji */}
        {!confirmAction && (
          <div className="flex gap-1.5 shrink-0">
            <button
              onClick={() => setConfirmAction("accept")}
              disabled={isPending}
              className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium rounded-lg bg-emerald-100 text-emerald-700 hover:bg-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-300 transition-colors disabled:opacity-50"
            >
              <CheckCircle className="w-3.5 h-3.5" />
              Akceptuj
            </button>
            <button
              onClick={() => setConfirmAction("reject")}
              disabled={isPending}
              className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium rounded-lg bg-destructive/10 text-destructive hover:bg-destructive/20 transition-colors disabled:opacity-50"
            >
              <XCircle className="w-3.5 h-3.5" />
              Odrzuć
            </button>
          </div>
        )}
      </div>

      {/* Potwierdzenie */}
      {confirmAction && (
        <div className={cn(
          "rounded-lg border p-3 space-y-2",
          confirmAction === "accept"
            ? "bg-emerald-50 border-emerald-200 dark:bg-emerald-900/10 dark:border-emerald-800"
            : "bg-destructive/5 border-destructive/20"
        )}>
          <p className="text-xs font-medium text-foreground">
            {confirmAction === "accept" ? "Zatwierdzić wniosek?" : "Odrzucić wniosek?"}
          </p>

          {confirmAction === "reject" && (
            <Textarea
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              placeholder="Powód odrzucenia (nieobowiązkowe)"
              rows={2}
              className="text-xs"
            />
          )}

          <div className="flex gap-2">
            <button
              onClick={() => { setConfirmAction(null); setRejectReason("") }}
              className="px-3 py-1.5 text-xs rounded-lg border border-border hover:bg-muted transition-colors"
            >
              Anuluj
            </button>
            <button
              onClick={() => handleDecide(confirmAction)}
              disabled={isPending}
              className={cn(
                "flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg text-white transition-colors disabled:opacity-50",
                confirmAction === "accept"
                  ? "bg-emerald-600 hover:bg-emerald-700"
                  : "bg-destructive hover:bg-destructive/90"
              )}
            >
              {isPending && <Loader2 className="w-3 h-3 animate-spin" />}
              {confirmAction === "accept" ? "Akceptuj" : "Odrzuć"}
            </button>
          </div>
        </div>
      )}

      {/* Komunikat */}
      {message && (
        <p className={cn(
          "text-xs",
          message.ok ? "text-emerald-600 dark:text-emerald-400" : "text-destructive"
        )}>
          {message.text}
        </p>
      )}
    </div>
  )
}

function areEqual(prev: LeaveRowProps, next: LeaveRowProps) {
  return (
    prev.leave.recno === next.leave.recno &&
    prev.leave.czyZat === next.leave.czyZat
  )
}

export default memo(LeaveRow, areEqual)
