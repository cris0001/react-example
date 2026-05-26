"use client"

import { memo, useState, useCallback, useEffect } from "react"
import { Clock, ClipboardPaste, Info } from "lucide-react"
import { LocationSelect } from "../LocationSelect"
import { formatTime, DAY_RANGES_WEEKDAYS, DAY_RANGES_FULL } from "../../utils"
import { useAddScheduleDay, useUpdateScheduleDay } from "../../hooks/useScheduler"
import type { SchedulerData, DayIndex, Location } from "../../types"

interface ExpandedCellProps {
  row: SchedulerData
  d: DayIndex
  tmpItem: SchedulerData
  isExpanded: boolean
  setTmpItem: (data: SchedulerData) => void
  handleCopyValues: (a: string, b: string, loc: number, locName: string, ids: number[]) => void
  locations: Location[]
  onApplyCellUpdates: (updates: {
    recno: number; day: DayIndex
    planOd: string; planDo: string; lok: string; nazwLok: string
  }[]) => void
  isDirty: (day: DayIndex) => boolean
  markDirty: (day: DayIndex) => void
  clearDirty: (day: DayIndex) => void
}

// memo z custom comparatorem - rerenderuje tylko pola dla tego dnia
export const ExpandedCell = memo(ExpandedCellComponent, (prev, next) => {
  if (prev.d !== next.d || prev.isExpanded !== next.isExpanded) return false
  const d = prev.d
  if (prev.isDirty(d) !== next.isDirty(d)) return false
  const fields = [`planOd${d}`, `planDo${d}`, `lok${d}`, `nazwLok${d}`] as const
  for (const f of fields) {
    if ((prev.tmpItem as any)[f] !== (next.tmpItem as any)[f]) return false
  }
  if (prev.row.recno !== next.row.recno || prev.row.pesel !== next.row.pesel) return false
  return true
})

function ExpandedCellComponent({
  row, d, tmpItem, isExpanded, setTmpItem,
  handleCopyValues, locations, onApplyCellUpdates,
  isDirty, markDirty, clearDirty,
}: ExpandedCellProps) {
  const labelA = `planOd${d}` as keyof SchedulerData
  const labelB = `planDo${d}` as keyof SchedulerData
  const labelLoc = `lok${d}` as keyof SchedulerData
  const labelLocName = `nazwLok${d}` as keyof SchedulerData

  const from = (tmpItem[labelA] as string) ?? ""
  const to = (tmpItem[labelB] as string) ?? ""
  const loc = (tmpItem[labelLoc] as number | null) ?? null

  const rowFrom = ((row as any)[`planOd${d}`] as string ?? "").trim()
  const rowTo = ((row as any)[`planDo${d}`] as string ?? "").trim()
  const rowHasPlan = rowFrom !== "" && rowTo !== ""

  const draftHasPlan = !!formatTime(from) && !!formatTime(to)
  const invalid = draftHasPlan && formatTime(from) > formatTime(to)

  const [message, setMessage] = useState<{ ok: boolean; text: string } | null>(null)

  const { mutateAsync: addDay, isPending: isAdding } = useAddScheduleDay()
  const { mutateAsync: updateDay, isPending: isUpdating } = useUpdateScheduleDay()

  const buildPayload = useCallback(() => ({
    pesel: row.pesel,
    firma: row.firma,
    data: (row as any)[`data${d}`] as string,
    idLok: loc ?? 0,
    planOd: formatTime(from),
    planDo: formatTime(to),
  }), [row, d, loc, from, to])

  const applyUpdate = useCallback(() => {
    onApplyCellUpdates([{
      recno: row.recno, day: d,
      planOd: formatTime(from), planDo: formatTime(to),
      lok: String(loc ?? ""), nazwLok: (tmpItem[labelLocName] as string) ?? "",
    }])
    clearDirty(d)
  }, [row.recno, d, from, to, loc, tmpItem, labelLocName, onApplyCellUpdates, clearDirty])

  const handleSave = useCallback(async () => {
    try {
      if (rowHasPlan) {
        await updateDay(buildPayload())
      } else {
        await addDay(buildPayload())
      }
      setMessage({ ok: true, text: "Zapisano." })
      applyUpdate()
    } catch (err: unknown) {
      setMessage({ ok: false, text: (err as any)?.response?.data?.message ?? "Błąd zapisu." })
    }
    setTimeout(() => setMessage(null), 5000)
  }, [rowHasPlan, buildPayload, addDay, updateDay, applyUpdate])

  // Jeśli komórka jest zablokowana (__:__)
  if ((tmpItem[labelA] as string) === "__:__") {
    return <td className={`px-1 py-2 border-b border-l ${isExpanded ? "bg-muted/50" : "bg-background"}`} />
  }

  return (
    <td
      className={[
        "px-1 py-2 border-b border-l align-top",
        isExpanded ? "bg-muted/30 dark:bg-muted/20" : "bg-background",
        message && !message.ok ? "bg-destructive/5 border-destructive/20" : "",
        message?.ok ? "bg-emerald-50 dark:bg-emerald-900/10" : "",
      ].join(" ")}
    >
      <div className="flex flex-col gap-1.5">
        {/* Godziny od-do */}
        <div className="grid grid-cols-2 gap-1">
          {[
            { label: labelA, value: from },
            { label: labelB, value: to },
          ].map(({ label, value }) => (
            <div key={String(label)} className="relative">
              <input
                type="time"
                step={900}
                min="00:00"
                max="23:59"
                value={formatTime(value)}
                onClick={(e) => e.stopPropagation()}
                onChange={(e) => {
                  setTmpItem({ ...tmpItem, [label]: e.target.value } as SchedulerData)
                  markDirty(d)
                }}
                className={[
                  "h-8 w-full text-xs border px-1 pr-5 bg-background dark:bg-muted focus:outline-none focus:ring-1 focus:ring-primary/30 rounded",
                  invalid ? "border-destructive" : "border-border",
                ].join(" ")}
              />
              <Clock className="pointer-events-none absolute right-1 top-1/2 -translate-y-1/2 w-3 h-3 text-muted-foreground" />
            </div>
          ))}
        </div>

        {/* Lokalizacja - tylko gdy mamy godziny */}
        {draftHasPlan && (
          <LocationSelect
            value={{ id: loc, name: (tmpItem[labelLocName] as string) ?? "" }}
            onChange={(val) => {
              setTmpItem({
                ...tmpItem,
                [labelLoc]: val?.id ?? null,
                [labelLocName]: val?.name ?? "",
              } as SchedulerData)
              markDirty(d)
            }}
            options={locations}
            className="h-8"
          />
        )}

        {/* Błąd */}
        {message && !message.ok && (
          <p className="text-xs text-destructive break-all">{message.text}</p>
        )}

        {/* Kopiowanie na kolejne dni */}
        {isDirty(d) && !invalid && draftHasPlan && (
          <div className="flex items-center gap-1 mt-1">
            <Info className="w-3.5 h-3.5 text-muted-foreground shrink-0" title="Kopiuj na kolejne dni" />
            <div className="flex flex-wrap gap-1">
              {DAY_RANGES_WEEKDAYS[d] && (
                <button
                  onClick={() => handleCopyValues(
                    tmpItem[labelA] as string, tmpItem[labelB] as string,
                    tmpItem[labelLoc] as number, tmpItem[labelLocName] as string,
                    DAY_RANGES_WEEKDAYS[d].days
                  )}
                  className="text-[11px] px-1.5 py-0.5 rounded bg-rose-200 text-rose-800 hover:bg-rose-300 transition-colors"
                >
                  {DAY_RANGES_WEEKDAYS[d].label}
                </button>
              )}
              {DAY_RANGES_FULL[d] && (
                <button
                  onClick={() => handleCopyValues(
                    tmpItem[labelA] as string, tmpItem[labelB] as string,
                    tmpItem[labelLoc] as number, tmpItem[labelLocName] as string,
                    DAY_RANGES_FULL[d].days
                  )}
                  className="text-[11px] px-1.5 py-0.5 rounded bg-purple-200 text-purple-800 hover:bg-purple-300 transition-colors"
                >
                  {DAY_RANGES_FULL[d].label}
                </button>
              )}
            </div>
          </div>
        )}

        {/* Zapisz */}
        {isDirty(d) && !invalid && (
          <button
            onClick={handleSave}
            disabled={isAdding || isUpdating || (!rowHasPlan && (!draftHasPlan || !loc))}
            className="text-xs px-2 py-1 rounded bg-primary text-white hover:bg-primary/90 disabled:opacity-50 transition-colors mt-0.5"
          >
            {isAdding || isUpdating
              ? "Zapisywanie…"
              : rowHasPlan ? "Zapisz" : "Dodaj"}
          </button>
        )}
      </div>
    </td>
  )
}
