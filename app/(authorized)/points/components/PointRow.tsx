"use client"

import { memo, useState, useCallback } from "react"
import { Edit, Trash2, Loader2, QrCode, Lock } from "lucide-react"
import { cn } from "@/utils/helpers"
import { useDeletePoint } from "../hooks/usePoints"
import type { Point } from "../types"

const dtf = new Intl.DateTimeFormat("pl-PL", {
  day: "2-digit", month: "2-digit", year: "numeric",
})

interface PointRowProps {
  point: Point
  onEdit: (id: number) => void
}

function PointRow({ point, onEdit }: PointRowProps) {
  const { mutateAsync: deletePoint, isPending } = useDeletePoint()
  const [confirmDelete, setConfirmDelete] = useState(false)
  const [message, setMessage] = useState<string | null>(null)

  const handleDelete = useCallback(async () => {
    try {
      await deletePoint(point.id)
    } catch (err: unknown) {
      setMessage((err as any)?.response?.data?.message ?? "Błąd usuwania.")
      setTimeout(() => setMessage(null), 4000)
    }
  }, [point.id, deletePoint])

  return (
    <div className="bg-card border border-border rounded-xl p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3 min-w-0">
          <div className="w-9 h-9 rounded-lg bg-secondary/10 text-secondary flex items-center justify-center shrink-0">
            <QrCode className="w-4 h-4" />
          </div>

          <div className="min-w-0">
            <p className="text-sm font-semibold text-foreground">
              {point.imie} {point.nazwisko}
            </p>
            <p className="text-xs text-muted-foreground mt-0.5">{point.email}</p>

            <div className="flex flex-wrap gap-2 mt-2 text-[11px] text-muted-foreground">
              {point.dataWpisu && (
                <span>Dodano: {dtf.format(new Date(point.dataWpisu))}</span>
              )}
              {point.zablokowany && (
                <span className="flex items-center gap-1 text-destructive font-medium">
                  <Lock className="w-3 h-3" /> Zablokowany
                </span>
              )}
            </div>
          </div>
        </div>

        {!confirmDelete && (
          <div className="flex items-center gap-1 shrink-0">
            <button
              onClick={() => onEdit(point.id)}
              className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
              title="Edytuj"
            >
              <Edit className="w-4 h-4" />
            </button>
            <button
              onClick={() => setConfirmDelete(true)}
              className="p-2 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
              title="Usuń"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {confirmDelete && (
        <div className="mt-3 p-3 rounded-lg bg-destructive/5 border border-destructive/20 space-y-2">
          <p className="text-xs font-medium text-foreground">Usunąć punkt odbić?</p>
          <div className="flex gap-2">
            <button
              onClick={() => setConfirmDelete(false)}
              className="px-3 py-1.5 text-xs rounded-lg border border-border hover:bg-muted transition-colors"
            >
              Anuluj
            </button>
            <button
              onClick={handleDelete}
              disabled={isPending}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-destructive text-white hover:bg-destructive/90 disabled:opacity-50 transition-colors"
            >
              {isPending && <Loader2 className="w-3 h-3 animate-spin" />}
              Usuń
            </button>
          </div>
        </div>
      )}

      {message && <p className="text-xs text-destructive mt-2">{message}</p>}
    </div>
  )
}

function areEqual(prev: PointRowProps, next: PointRowProps) {
  return (
    prev.point.id === next.point.id &&
    prev.point.nazwisko === next.point.nazwisko &&
    prev.point.email === next.point.email &&
    prev.point.zablokowany === next.point.zablokowany
  )
}

export default memo(PointRow, areEqual)
