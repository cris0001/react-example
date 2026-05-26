"use client"

import { useMemo, memo } from "react"
import type { RaportData } from "../../../types"

const dtfDate = new Intl.DateTimeFormat("pl-PL", {
  day: "2-digit", month: "2-digit", year: "numeric",
})

const toStr = (v: unknown) => (v == null ? "" : String(v))

function span(from: unknown, to: unknown) {
  const f = toStr(from), t = toStr(to)
  if (!f && !t) return "—"
  return `${f || "—"}–${t || "—"}`
}

function parseHm(hm: unknown): number | null {
  const s = toStr(hm)
  if (!s) return null
  const m = s.match(/^(\d{1,2}):(\d{2})$/)
  if (!m) return null
  return Number(m[1]) * 60 + Number(m[2])
}

function rangeMinutes(from: unknown, to: unknown): number | null {
  const A = parseHm(from), B = parseHm(to)
  if (A == null || B == null) return null
  return Math.max(0, B - A)
}

function fmtDuration(mins: number | null): string {
  if (mins == null) return "—"
  const h = Math.floor(mins / 60)
  const m = mins % 60
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`
}

function buildTags(r: RaportData) {
  const hasPlan = !!toStr(r.planOd) || !!toStr(r.planDo)
  const realDo = (r as any).realDo ?? r.ralDo
  const tags: { key: string; label: string; color: string }[] = []

  if (!hasPlan) return tags

  const lateStart = r.realOd != null ? (parseHm(r.realOd) ?? 0) - (parseHm(r.planOd) ?? 0) : null
  const earlyEnd = realDo != null ? (parseHm(r.planDo) ?? 0) - (parseHm(realDo) ?? 0) : null

  if (r.realOd == null) tags.push({ key: "no-start", label: "Brak startu", color: "bg-slate-100 text-slate-700 border-slate-200 dark:bg-white/10 dark:text-slate-300 dark:border-white/10" })
  if (realDo == null) tags.push({ key: "no-end", label: "Brak końca", color: "bg-slate-100 text-slate-700 border-slate-200 dark:bg-white/10 dark:text-slate-300 dark:border-white/10" })
  if (lateStart != null && lateStart > 0) tags.push({ key: "late", label: `Spóźnienie ${lateStart} min`, color: "bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-900/20 dark:text-rose-300 dark:border-rose-800" })
  if (earlyEnd != null && earlyEnd > 0) tags.push({ key: "early", label: `Wcześniej ${earlyEnd} min`, color: "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-900/20 dark:text-amber-300 dark:border-amber-800" })

  return tags
}

// memo - tabela nie rerenderuje się gdy parent zmienia stan (np. otwarcie date pickera)
const ReportTable = memo(function ReportTable({ rows }: { rows: RaportData[] }) {
  // useMemo - sortowanie tylko gdy dane się zmienią
  const data = useMemo(
    () => [...(rows ?? [])].sort((a, b) => +new Date(String(b.data)) - +new Date(String(a.data))),
    [rows]
  )

  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center py-12 text-sm text-muted-foreground border border-border rounded-xl">
        Brak wpisów w wybranym zakresie.
      </div>
    )
  }

  return (
    <>
      {/* Mobile: karty */}
      <div className="md:hidden space-y-2">
        {data.map((r, idx) => {
          const realDo = (r as any).realDo ?? r.ralDo
          const workMin = rangeMinutes(r.realOd, realDo)
          const tags = buildTags(r)
          const hasPlan = !!toStr(r.planOd) || !!toStr(r.planDo)

          return (
            <div key={`${String(r.data)}-${idx}`} className="bg-card border border-border rounded-xl p-3">
              <div className="flex items-center justify-between gap-2">
                <span className="text-sm font-medium text-foreground">
                  {r.data ? dtfDate.format(new Date(String(r.data))) : "—"}
                </span>
                <span className="text-xs font-mono text-muted-foreground">{fmtDuration(workMin)}</span>
              </div>

              <div className="mt-2 grid grid-cols-2 gap-x-4 gap-y-1 text-xs">
                <span className="text-muted-foreground">Plan / Absencja</span>
                <span className="text-right font-medium">
                  {hasPlan ? span(r.planOd, r.planDo) : r.absNazwa ? (
                    <span className="px-1.5 py-0.5 rounded bg-muted text-muted-foreground">{toStr(r.absNazwa)}</span>
                  ) : "—"}
                </span>
                <span className="text-muted-foreground">Rzeczywisty</span>
                <span className="text-right font-medium">{span(r.realOd, realDo)}</span>
              </div>

              {tags.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-2">
                  {tags.map((t) => (
                    <span key={t.key} className={`text-[10px] font-medium px-2 py-0.5 rounded-full border ${t.color}`}>
                      {t.label}
                    </span>
                  ))}
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* Desktop: tabela */}
      <div className="hidden md:block rounded-xl border border-border overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-muted/60">
            <tr>
              {["Data", "Plan / Absencja", "Rzeczywisty", "Czas pracy", "Uwagi"].map((h) => (
                <th key={h} className="text-left text-xs font-medium text-muted-foreground px-4 py-2.5 border-b border-border">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-card divide-y divide-border">
            {data.map((r, idx) => {
              const hasPlan = !!toStr(r.planOd) || !!toStr(r.planDo)
              const realDo = (r as any).realDo ?? r.ralDo
              const workMin = rangeMinutes(r.realOd, realDo)
              const tags = buildTags(r)

              return (
                <tr key={`${String(r.data)}-${idx}`} className={idx % 2 ? "bg-muted/20" : undefined}>
                  <td className="px-4 py-3 whitespace-nowrap text-foreground">
                    {r.data ? dtfDate.format(new Date(String(r.data))) : "—"}
                  </td>
                  <td className="px-4 py-3">
                    {hasPlan ? span(r.planOd, r.planDo) : r.absNazwa ? (
                      <span className="text-xs px-2 py-0.5 rounded-full bg-muted text-muted-foreground">
                        {toStr(r.absNazwa)}
                      </span>
                    ) : "—"}
                  </td>
                  <td className="px-4 py-3 font-medium">{span(r.realOd, realDo)}</td>
                  <td className="px-4 py-3 font-mono text-sm">{fmtDuration(workMin)}</td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-1">
                      {tags.map((t) => (
                        <span key={t.key} className={`text-[10px] font-medium px-2 py-0.5 rounded-full border ${t.color}`}>
                          {t.label}
                        </span>
                      ))}
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </>
  )
})

export default ReportTable
