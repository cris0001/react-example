"use client"

import { Plus, Loader2, AlertCircle, QrCode } from "lucide-react"
import PointRow from "./components/PointRow"
import { PointModal } from "./components/PointModal"
import { usePoints, usePointsParams } from "./hooks/usePoints"
import { Pagination } from "@/components/Pagination"

export default function PointsPage() {
  const { page, editId, isNew, openNew, openEdit, closeModal } = usePointsParams()
  const { data, isLoading, isError, error } = usePoints(page)

  const points = data?.content ?? []

  return (
    <div className="p-4 sm:p-6">

      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-foreground">Punkty odbić</h1>
          {data && (
            <p className="text-xs text-muted-foreground mt-0.5">
              {data.totalElements} {data.totalElements === 1 ? "punkt" : "punktów"}
            </p>
          )}
        </div>
        <button
          onClick={openNew}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg bg-primary text-white hover:bg-primary/90 transition-colors shadow-sm"
        >
          <Plus className="w-4 h-4" />
          <span className="hidden xs:inline">Dodaj</span>
        </button>
      </div>

      {isLoading && (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
        </div>
      )}

      {isError && (
        <div className="flex items-start gap-3 text-sm bg-destructive/8 border border-destructive/20 rounded-xl px-4 py-3">
          <AlertCircle className="w-4 h-4 text-destructive shrink-0 mt-0.5" />
          <span className="text-destructive">
            {(error as any)?.response?.data?.message ?? "Nie udało się pobrać punktów."}
          </span>
        </div>
      )}

      {!isLoading && !isError && points.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 gap-3 text-center">
          <div className="w-12 h-12 rounded-2xl bg-muted flex items-center justify-center">
            <QrCode className="w-5 h-5 text-muted-foreground" />
          </div>
          <p className="text-sm font-medium text-foreground">Brak punktów odbić</p>
          <p className="text-xs text-muted-foreground">Dodaj pierwszy punkt klikając przycisk powyżej</p>
        </div>
      )}

      {!isLoading && !isError && points.length > 0 && (
        <>
          <div className="space-y-2">
            {points.map((point) => (
              <PointRow key={point.id} point={point} onEdit={openEdit} />
            ))}
          </div>
          <Pagination last={data?.last ?? true} />
        </>
      )}

      {(isNew || editId) && (
        <PointModal editId={editId} onClose={closeModal} />
      )}
    </div>
  )
}
