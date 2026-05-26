"use client"

import { Loader2, AlertCircle, CalendarDays } from "lucide-react"
import { useEmployee } from "../../hooks/useEmployees"
import { useEmployeeLeaves, useLeaveEntitlements } from "../raport/hooks/useEmployeeDetail"
import { Pagination } from "@/components/Pagination"
import { useLeavesParams } from "../hooks/useEmployeeDetailParams"

const toStr = (v: unknown) => (v == null ? "" : String(v))
const dtf = new Intl.DateTimeFormat("pl-PL", { day: "2-digit", month: "2-digit", year: "numeric" })

function LeavesSummary({ entitlements }: { entitlements: { wymiarRocznyDni: number; zaleglyDni: number; wykorzystano: number; zostaloDni: number } }) {
  const items = [
    { label: "Wymiar roczny", value: `${entitlements.wymiarRocznyDni} dni` },
    { label: "Zaległe", value: `${entitlements.zaleglyDni} dni` },
    { label: "Wykorzystano", value: `${entitlements.wykorzystano} dni` },
    { label: "Zostało", value: `${entitlements.zostaloDni} dni`, highlight: true },
  ]

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
      {items.map((item) => (
        <div key={item.label} className={`rounded-xl border p-3 ${item.highlight ? "bg-primary/5 border-primary/20" : "bg-card border-border"}`}>
          <p className="text-xs text-muted-foreground">{item.label}</p>
          <p className={`text-lg font-bold mt-0.5 ${item.highlight ? "text-primary" : "text-foreground"}`}>{item.value}</p>
        </div>
      ))}
    </div>
  )
}

export default function LeavesPage() {
  const { id, page } = useLeavesParams()

  const { data: employee } = useEmployee(id)
  const empData = employee
    ? { pesel: employee.uzytkownik.pesel, firma: employee.uzytkownik.firma }
    : undefined

  const { data: leavesPage, isLoading, isError, error } = useEmployeeLeaves(id, empData, page)
  const { data: entitlements } = useLeaveEntitlements(id, empData)

  const items = leavesPage?.content.filter((l) => l.czyZat === 1) ?? []

  return (
    <div className="space-y-4">
      {entitlements && <LeavesSummary entitlements={entitlements} />}

      {isLoading && (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
        </div>
      )}

      {isError && (
        <div className="flex items-center gap-2 text-sm text-destructive bg-destructive/8 border border-destructive/20 rounded-xl px-4 py-3">
          <AlertCircle className="w-4 h-4 shrink-0" />
          {(error as any)?.response?.data?.message ?? "Nie udało się pobrać urlopów."}
        </div>
      )}

      {!isLoading && !isError && (
        <>
          <div className="rounded-xl border border-border overflow-hidden">
            <div className="flex items-center gap-2 px-4 py-2.5 bg-muted/60 border-b border-border">
              <CalendarDays className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm font-medium text-foreground">Nieobecności pracownika</span>
            </div>

            {/* Mobile */}
            <div className="md:hidden divide-y divide-border bg-card">
              {items.length === 0 ? (
                <p className="text-center text-sm text-muted-foreground py-10">Brak danych.</p>
              ) : items.map((r, idx) => (
                <div key={`${r.recno}-${idx}`} className="p-3">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-sm font-medium">
                      {toStr(r.poczAbs) && toStr(r.konAbs)
                        ? `${dtf.format(new Date(r.poczAbs))} — ${dtf.format(new Date(r.konAbs))}`
                        : "—"}
                    </span>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-muted text-muted-foreground">{r.dniNieb} dni</span>
                  </div>
                  <div className="mt-1.5 flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">Rodzaj</span>
                    <span className="text-xs px-2 py-0.5 rounded-md bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400">
                      {toStr(r.nazwa) || "—"}
                    </span>
                  </div>
                  {r.uwagi && <p className="text-xs text-muted-foreground mt-1.5">{r.uwagi}</p>}
                </div>
              ))}
            </div>

            {/* Desktop */}
            <div className="hidden md:block overflow-auto bg-card">
              <table className="w-full text-sm">
                <thead className="bg-muted/40">
                  <tr>
                    {["Data (od – do)", "Rodzaj", "Dni nieob.", "Uwagi"].map((h) => (
                      <th key={h} className="text-left text-xs font-medium text-muted-foreground px-4 py-2.5 border-b border-border">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {items.length === 0 ? (
                    <tr><td colSpan={4} className="text-center text-muted-foreground py-10">Brak danych.</td></tr>
                  ) : items.map((r, idx) => (
                    <tr key={`${r.recno}-${idx}`} className={idx % 2 ? "bg-muted/20" : undefined}>
                      <td className="px-4 py-3 whitespace-nowrap">
                        {toStr(r.poczAbs) && toStr(r.konAbs)
                          ? `${dtf.format(new Date(r.poczAbs))} — ${dtf.format(new Date(r.konAbs))}`
                          : "—"}
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-xs px-2 py-1 rounded-md bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400">
                          {toStr(r.nazwa) || "—"}
                        </span>
                      </td>
                      <td className="px-4 py-3">{r.dniNieb}</td>
                      <td className="px-4 py-3 text-muted-foreground">{toStr(r.uwagi) || "—"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <Pagination last={leavesPage?.last ?? true} />
        </>
      )}
    </div>
  )
}
