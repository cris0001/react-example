"use client"

import { Loader2, AlertCircle } from "lucide-react"
import { useEmployee } from "../../hooks/useEmployees"
import { useEmployeeRaport } from "./hooks/useEmployeeDetail"
import { RaportRangeSelect } from "./components/RaportRangeSelect"
import ReportTable from "./components/ReportTable"
import { useRaportParams } from "../hooks/useEmployeeDetailParams"

export default function RaportPage() {
  const { id, from, to } = useRaportParams()

  const { data: employee } = useEmployee(id)
  const empData = employee
    ? { pesel: employee.uzytkownik.pesel, firma: employee.uzytkownik.firma }
    : undefined

  const { data: rows = [], isLoading, isError, error } = useEmployeeRaport(id, empData, from, to)

  return (
    <div>
      <RaportRangeSelect />

      {isLoading && (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
        </div>
      )}

      {isError && (
        <div className="flex items-center gap-2 text-sm text-destructive bg-destructive/8 border border-destructive/20 rounded-xl px-4 py-3">
          <AlertCircle className="w-4 h-4 shrink-0" />
          {(error as any)?.response?.data?.message ?? "Nie udało się pobrać raportu."}
        </div>
      )}

      {!isLoading && !isError && <ReportTable rows={rows} />}
    </div>
  )
}
