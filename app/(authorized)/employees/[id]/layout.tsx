"use client"

import { useParams, usePathname, useRouter } from "next/navigation"
import Link from "next/link"
import { BarChart3, CalendarDays, ArrowLeft, Mail, Phone, Info, Loader2 } from "lucide-react"
import { Input, Select } from "@/components/ui"
import { useEmployee, useDismissReasons, useDismissEmployee } from "../hooks/useEmployees"
import { cn } from "@/utils/helpers"
import { useState, useCallback } from "react"
import type { ReactNode } from "react"

const dtf = new Intl.DateTimeFormat("pl-PL", {
  day: "2-digit", month: "2-digit", year: "numeric",
  hour: "2-digit", minute: "2-digit",
})

function toDateSafe(s?: string | null) {
  if (!s) return null
  const d = new Date(s.includes("T") ? s : s.replace(" ", "T"))
  return isNaN(d.getTime()) ? null : d
}

interface LayoutProps {
  children: ReactNode
}

export default function EmployeeDetailLayout({ children }: LayoutProps) {
  const params = useParams()
  const id = Number(params.id)
  const pathname = usePathname()
  const router = useRouter()

  const { data: employee, isLoading } = useEmployee(id)
  const { data: dismissReasons = [] } = useDismissReasons()
  const { mutateAsync: dismissEmployee, isPending: isDismissing } = useDismissEmployee()

  const [dismissOpen, setDismissOpen] = useState(false)
  const [dismissReason, setDismissReason] = useState("")
  const [dismissDate, setDismissDate] = useState("")
  const [dismissError, setDismissError] = useState("")

  const base = `/employees/${id}`
  const isRaport = pathname.startsWith(`${base}/raport`) || pathname === base
  const isLeaves = pathname.startsWith(`${base}/leaves`)

  const handleDismiss = useCallback(async () => {
    if (!dismissReason || !dismissDate) return
    try {
      await dismissEmployee({ id, reason: dismissReason, date: dismissDate })
      router.push("/employees")
    } catch (err: unknown) {
      setDismissError((err as any)?.response?.data?.message ?? "Błąd przy zwalnianiu pracownika.")
    }
  }, [id, dismissReason, dismissDate, dismissEmployee, router])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (!employee) return null

  const u = employee.uzytkownik
  const fullName = `${u.imie ?? ""} ${u.nazwisko ?? ""}`.trim()
  const initials = `${u.imie?.[0] ?? ""}${u.nazwisko?.[0] ?? ""}`.toUpperCase()
  const wpis = toDateSafe(u.dataWpisu)
  const zmiana = toDateSafe(u.dataZmiany)

  return (
    <div className="p-4 sm:p-6">

      {/* Wstecz */}
      <button
        onClick={() => router.push("/employees")}
        className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors mb-4"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        Pracownicy
      </button>

      {/* Header card */}
      <div className="bg-card border border-border rounded-2xl p-4 sm:p-5 mb-4">
        <div className="flex items-start justify-between gap-4">

          {/* Avatar + dane */}
          <div className="flex items-center gap-4 min-w-0">
            <div className="hidden sm:flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary text-lg font-bold border border-primary/10">
              {initials}
            </div>

            <div className="min-w-0">
              <h1 className="text-lg font-bold text-foreground">{fullName || "—"}</h1>

              <div className="flex flex-wrap items-center gap-3 mt-1">
                {u.email && (
                  <span className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Mail className="w-3 h-3" />
                    {u.email}
                  </span>
                )}
                {u.telefon && (
                  <span className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Phone className="w-3 h-3" />
                    {u.telefon}
                  </span>
                )}
              </div>

              {/* Role */}
              <div className="flex flex-wrap gap-1 mt-2">
                {employee.role?.map((r) => (
                  <span
                    key={r}
                    className="text-[10px] font-medium uppercase px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/10"
                  >
                    {r.replace(/^ROLE_/, "")}
                  </span>
                ))}
                {u.zablokowany && (
                  <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-destructive/10 text-destructive border border-destructive/10">
                    Zablokowany
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Przycisk zwolnij */}
          <button
            onClick={() => setDismissOpen(true)}
            className="shrink-0 text-xs font-medium px-3 py-1.5 rounded-lg bg-destructive/10 text-destructive hover:bg-destructive/20 border border-destructive/20 transition-colors uppercase tracking-wide"
          >
            Zwolnij
          </button>
        </div>

        {/* Metadane */}
        <div className="flex flex-wrap items-center gap-2 mt-3 pt-3 border-t border-border text-[11px] text-muted-foreground">
          <span className="flex items-center gap-1">
            <Info className="w-3 h-3" />
            {u.wpisal ? `Dodał: ${u.wpisal}` : "Dodano"}
          </span>
          {wpis && <span>• Wpis: {dtf.format(wpis)}</span>}
          {zmiana && <span>• Zmiana: {dtf.format(zmiana)}</span>}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 bg-muted/60 rounded-xl p-1 w-full sm:w-auto mb-4">
        <Link
          href={`${base}/raport`}
          className={cn(
            "flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-colors",
            isRaport
              ? "bg-background text-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          <BarChart3 className="w-4 h-4" />
          Raport
        </Link>
        <Link
          href={`${base}/leaves`}
          className={cn(
            "flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-colors",
            isLeaves
              ? "bg-background text-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          <CalendarDays className="w-4 h-4" />
          Urlopy
        </Link>
      </div>

      {/* Content */}
      {children}

      {/* Modal: Zwolnij pracownika */}
      {dismissOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
          onClick={(e) => { if (e.target === e.currentTarget) setDismissOpen(false) }}
        >
          <div className="w-full max-w-sm bg-card border border-border rounded-2xl shadow-xl p-5 space-y-4">
            <h2 className="text-sm font-semibold text-foreground">
              Zwalnianie: {fullName}
            </h2>

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-foreground">Powód zwolnienia</label>
              <Select value={dismissReason} onChange={(e) => setDismissReason(e.target.value)}>
                <option value="">Wybierz powód</option>
                {dismissReasons.map((r) => (
                  <option key={r.symbol} value={r.symbol}>
                    {r.symbol} — {r.nazwa}
                  </option>
                ))}
              </Select>
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-foreground">Data zwolnienia</label>
              <Input type="date" value={dismissDate} onChange={(e) => setDismissDate(e.target.value)} />
            </div>

            {dismissError && (
              <p className="text-xs text-destructive">{dismissError}</p>
            )}

            <div className="flex justify-end gap-2 pt-1">
              <button
                onClick={() => setDismissOpen(false)}
                className="px-4 py-2 text-sm rounded-lg border border-border hover:bg-muted transition-colors"
              >
                Anuluj
              </button>
              <button
                onClick={handleDismiss}
                disabled={!dismissReason || !dismissDate || isDismissing}
                className="px-4 py-2 text-sm rounded-lg bg-destructive text-white hover:bg-destructive/90 disabled:opacity-50 transition-colors"
              >
                {isDismissing ? "Zwalnianie…" : "Zwolnij"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
