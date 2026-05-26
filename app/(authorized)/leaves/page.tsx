"use client"

import { Loader2, AlertCircle, CalendarDays, UmbrellaOff } from "lucide-react"
import LeaveRow from "./components/LeaveRow"
import { LeavesCalendar } from "./components/LeavesCalendar"
import { usePendingLeaves, useLeavesPageParams } from "./hooks/useLeaves"
import { Pagination } from "@/components/Pagination"

export default function LeavesPage() {
  const { page, size } = useLeavesPageParams()
  const { data, isLoading, isError, error } = usePendingLeaves(page, size)

  const items = data?.content ?? []

  return (
    <div className="p-4 sm:p-6 space-y-8">

      {/* Wnioski do zatwierdzenia */}
      <section>
        <div className="flex items-center gap-2 mb-4">
          <UmbrellaOff className="w-4 h-4 text-muted-foreground" />
          <h1 className="text-xl font-bold text-foreground">Urlopy</h1>
          {data && items.length > 0 && (
            <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-amber-100 text-amber-700 dark:bg-amber-900/20 dark:text-amber-300">
              {items.length} do zatwierdzenia
            </span>
          )}
        </div>

        {isLoading && (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
          </div>
        )}

        {isError && (
          <div className="flex items-start gap-3 text-sm bg-destructive/8 border border-destructive/20 rounded-xl px-4 py-3">
            <AlertCircle className="w-4 h-4 text-destructive shrink-0 mt-0.5" />
            <span className="text-destructive">
              {(error as any)?.response?.data?.message ?? "Nie udało się pobrać wniosków."}
            </span>
          </div>
        )}

        {!isLoading && !isError && items.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12 gap-2 text-center">
            <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center">
              <UmbrellaOff className="w-4 h-4 text-muted-foreground" />
            </div>
            <p className="text-sm text-muted-foreground">Brak wniosków do zatwierdzenia</p>
          </div>
        )}

        {!isLoading && !isError && items.length > 0 && (
          <>
            <div className="space-y-2">
              {items.map((leave) => (
                <LeaveRow key={leave.recno} leave={leave} />
              ))}
            </div>
            <Pagination last={data?.last ?? true} />
          </>
        )}
      </section>

      {/* Separator */}
      <div className="border-t border-border" />

      {/* Kalendarz zatwierdzeń */}
      <section>
        <div className="flex items-center gap-2 mb-4">
          <CalendarDays className="w-4 h-4 text-muted-foreground" />
          <h2 className="text-base font-semibold text-foreground">Zatwierdzone nieobecności</h2>
        </div>
        <LeavesCalendar />
      </section>

    </div>
  )
}
