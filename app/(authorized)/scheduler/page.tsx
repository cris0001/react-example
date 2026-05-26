"use client"

import { Loader2, AlertCircle } from "lucide-react"
import { SchedulerTable } from "./components/SchedulerTable"
import { useScheduler, useLocations, useJobPositions } from "./hooks/useScheduler"
import { useSchedulerParams } from "./hooks/useSchedulerParams"
import { Pagination } from "@/components/Pagination"

function SchedulerSkeleton() {
  return (
    <div className="space-y-2 mt-4">
      <div className="h-10 bg-muted rounded-xl animate-pulse" />
      {[...Array(8)].map((_, i) => (
        <div key={i} className="h-12 rounded-xl bg-muted animate-pulse" />
      ))}
    </div>
  )
}

export default function SchedulerPage() {
  const { page, day, jt } = useSchedulerParams()

  const { data: scheduler, isLoading, isError, error } = useScheduler(day, page, 50, jt)
  const { data: locations = [] } = useLocations()
  const { data: jobPositions = [] } = useJobPositions()

  return (
    <div className="p-4 sm:p-6">
      <h1 className="text-xl font-bold text-foreground mb-4">Grafik</h1>

      {isLoading && <SchedulerSkeleton />}

      {isError && (
        <div className="flex items-center gap-2 text-sm text-destructive bg-destructive/8 border border-destructive/20 rounded-xl px-4 py-3 mt-4">
          <AlertCircle className="w-4 h-4 shrink-0" />
          {(error as any)?.response?.data?.message ?? "Nie udało się pobrać grafiku."}
        </div>
      )}

      {!isLoading && !isError && scheduler && (
        <>
          <SchedulerTable
            schedulerData={scheduler.content}
            locations={locations}
            jobPositions={jobPositions}
          />
          <Pagination last={scheduler.last} />
        </>
      )}
    </div>
  )
}
