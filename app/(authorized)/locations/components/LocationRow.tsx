"use client"

import { memo, useState, useCallback } from "react"
import { MapPin, Edit, Trash2, Loader2 } from "lucide-react"
import { cn } from "@/utils/helpers"
import { useDeleteLocation } from "../hooks/useLocations"
import { ODB_LABELS } from "../types"
import type { Location } from "../types"

interface LocationRowProps {
  location: Location
  onEdit: (id: number) => void
}

function LocationRow({ location, onEdit }: LocationRowProps) {
  const { mutateAsync: deleteLocation, isPending } = useDeleteLocation()
  const [confirmDelete, setConfirmDelete] = useState(false)
  const [message, setMessage] = useState<string | null>(null)

  const handleDelete = useCallback(async () => {
    try {
      await deleteLocation(location.id)
      setConfirmDelete(false)
    } catch (err: unknown) {
      setMessage((err as any)?.response?.data?.message ?? "Błąd usuwania.")
      setTimeout(() => setMessage(null), 4000)
    }
  }, [location.id, deleteLocation])

  const hasCoords = location.gpsLat != null && location.gpsLng != null

  return (
    <div className="bg-card border border-border rounded-xl p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3 min-w-0">
          <div className="w-9 h-9 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
            <MapPin className="w-4 h-4" />
          </div>

          <div className="min-w-0">
            <p className="text-sm font-semibold text-foreground">{location.nazwa}</p>

            {(location.adres1 || location.adres2) && (
              <p className="text-xs text-muted-foreground mt-0.5">
                {[location.adres1, location.adres2].filter(Boolean).join(", ")}
              </p>
            )}

            <div className="flex flex-wrap gap-2 mt-2">
              <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-muted text-muted-foreground">
                {ODB_LABELS[location.sposobOdb]}
              </span>

              {hasCoords && (
                <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-300">
                  GPS ✓
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Akcje */}
        {!confirmDelete && (
          <div className="flex items-center gap-1 shrink-0">
            <button
              onClick={() => onEdit(location.id)}
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

      {/* Potwierdzenie usunięcia */}
      {confirmDelete && (
        <div className="mt-3 p-3 rounded-lg bg-destructive/5 border border-destructive/20 space-y-2">
          <p className="text-xs font-medium text-foreground">Usunąć lokalizację?</p>
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

      {message && (
        <p className="text-xs text-destructive mt-2">{message}</p>
      )}
    </div>
  )
}

function areEqual(prev: LocationRowProps, next: LocationRowProps) {
  return (
    prev.location.id === next.location.id &&
    prev.location.nazwa === next.location.nazwa &&
    prev.location.adres1 === next.location.adres1 &&
    prev.location.sposobOdb === next.location.sposobOdb &&
    prev.location.gpsLat === next.location.gpsLat &&
    prev.location.gpsLng === next.location.gpsLng
  )
}

export default memo(LocationRow, areEqual)
