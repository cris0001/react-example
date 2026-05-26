"use client"

import { memo, useCallback, useEffect, useMemo, useRef, useState } from "react"
import Link from "next/link"
import { MapPin, TriangleAlert, CheckCircle } from "lucide-react"
import { ExpandedCell } from "./ExpandedCell"
import { displayCell, formatTime } from "../../utils"
import type { SchedulerData, DayIndex, Location, ScheduleStatus, CellUpdate } from "../../types"

const DAY_FIELDS: DayIndex[] = [1, 2, 3, 4, 5, 6, 7]

function cn(...s: Array<string | false | null | undefined>) {
  return s.filter(Boolean).join(" ")
}

interface TableRowProps {
  row: SchedulerData
  idx: number
  locations: Location[]
  expandedRow: number[]
  selectedCells: Set<string>
  toggleRow: (id: number) => void
  editMode: boolean
  canSelectCell: (row: SchedulerData, day: DayIndex) => boolean
  onCellPointerDown: (recno: number, rowIndex: number, day: DayIndex) => void
  onCellPointerEnter: (recno: number, rowIndex: number, day: DayIndex) => void
  onCellClick: (recno: number, rowIndex: number, day: DayIndex) => void
  onApplyCellUpdates: (updates: CellUpdate[]) => void
  getStatusFor: (pesel: string, iso: string) => ScheduleStatus | undefined
}

// memo z custom comparatorem - rerenderuje tylko gdy zmieniły się dane tego wiersza
export const TableRow = memo(TableRowComponent, (prev, next) => {
  if (prev.row !== next.row || prev.editMode !== next.editMode) return false
  const wasExpanded = prev.expandedRow.includes(prev.row.recno)
  const isExpanded = next.expandedRow.includes(next.row.recno)
  if (wasExpanded !== isExpanded) return false
  if (prev.editMode && next.editMode) {
    const recno = prev.row.recno
    for (let day = 1; day <= 7; day++) {
      const key = `${recno}:${day}`
      if (prev.selectedCells.has(key) !== next.selectedCells.has(key)) return false
    }
  }
  return true
})

function TableRowComponent({
  row, idx, locations, expandedRow, toggleRow,
  editMode, canSelectCell, selectedCells,
  onCellPointerDown, onCellPointerEnter, onCellClick,
  onApplyCellUpdates, getStatusFor,
}: TableRowProps) {
  const isExpanded = expandedRow.includes(row.recno)
  const [tmpItem, setTmpItem] = useState<SchedulerData>({ ...row })
  const [dirtyDays, setDirtyDays] = useState<Set<DayIndex>>(() => new Set())
  const wasExpandedRef = useRef(false)

  // Odświeżaj tmpItem tylko przy otwieraniu (nie zamykaniu) — żeby draft nie znikał
  useEffect(() => {
    if (isExpanded && !wasExpandedRef.current) setTmpItem({ ...row })
    wasExpandedRef.current = isExpanded
  }, [isExpanded, row])

  const markDirty = useCallback((day: DayIndex) => {
    setDirtyDays((prev) => prev.has(day) ? prev : new Set([...prev, day]))
  }, [])

  const clearDirty = useCallback((day: DayIndex) => {
    setDirtyDays((prev) => { const next = new Set(prev); next.delete(day); return next })
  }, [])

  const isDirty = useCallback((day: DayIndex) => dirtyDays.has(day), [dirtyDays])

  const isSelected = useCallback(
    (recno: number, day: DayIndex) => selectedCells.has(`${recno}:${day}`),
    [selectedCells]
  )

  // useMemo - przelicza dane komórek tylko gdy row się zmieni
  const cellData = useMemo(() => {
    const result = {} as Record<DayIndex, {
      text: string; sym: string | undefined
      locName: string; selectable: boolean
      weekBefore: string; iso: string
    }>
    DAY_FIELDS.forEach((d) => {
      result[d] = {
        text: displayCell(row, d),
        sym: (row[`symbolAbs${d}` as const] as string | undefined)?.trim(),
        locName: (row[`nazwLok${d}` as const] as string) || "",
        selectable: canSelectCell(row, d),
        weekBefore: (row[`popTydz${d}` as const] as string) || "",
        iso: (row[`data${d}` as const] as string) || "",
      }
    })
    return result
  }, [row, canSelectCell])

  const handleCopyValues = useCallback(
    (a: string, b: string, loc: number, locName: string, ids: number[]) => {
      setTmpItem((prev) => {
        const next = { ...prev } as any
        for (const id of ids) {
          next[`planOd${id}`] = a; next[`planDo${id}`] = b
          next[`lok${id}`] = loc; next[`nazwLok${id}`] = locName
        }
        return next
      })
      setDirtyDays((prev) => {
        const next = new Set(prev)
        ids.forEach((id) => next.add(id as DayIndex))
        return next
      })
    },
    []
  )

  return (
    <>
      <tr
        onClick={() => toggleRow(row.recno)}
        className={cn(
          "cursor-pointer transition-colors duration-75",
          isExpanded
            ? "bg-primary/5 dark:bg-primary/10"
            : idx % 2 === 0
              ? "bg-card hover:bg-muted/40"
              : "bg-muted/20 hover:bg-muted/50"
        )}
      >
        {/* Kolumna pracownik */}
        <td className={cn(
          "px-4 py-2.5 border-r border-border align-middle",
          !isExpanded && "border-b border-border"
        )}>
          <div className="text-sm font-medium text-foreground truncate leading-tight">
            {row.imie} {row.nazwisko}
          </div>
          {row.stanowisko && (
            <span className="inline-block mt-1 text-[10px] font-medium px-1.5 py-px rounded-md bg-muted text-muted-foreground border border-border/60">
              {row.stanowisko}
            </span>
          )}
        </td>

        {/* Kolumny dni */}
        {DAY_FIELDS.map((d) => {
          const cell = cellData[d]
          const selected = isSelected(row.recno, d)
          const st = getStatusFor(row.pesel, cell.iso)
          const lokVal = (row as any)[`lok${d}`]

          const isWeekend = d >= 6
          return (
            <td
              key={`${row.recno}-${d}`}
              className={cn(
                "border-b border-l border-border text-center align-middle relative select-none",
                isExpanded ? "bg-primary/5" : isWeekend ? "bg-muted/30" : "",
                editMode && (cell.selectable ? "cursor-crosshair" : "opacity-30 cursor-not-allowed"),
                selected && "!bg-primary/15 dark:!bg-primary/25 ring-1 ring-inset ring-primary/30"
              )}
              onPointerDown={(e) => {
                if (!editMode || !cell.selectable) return
                e.preventDefault(); e.stopPropagation()
                onCellPointerDown(row.recno, idx, d)
              }}
              onPointerEnter={(e) => {
                if (!editMode || !cell.selectable) return
                e.preventDefault(); e.stopPropagation()
                onCellPointerEnter(row.recno, idx, d)
              }}
              onClick={(e) => {
                if (!editMode || !cell.selectable) return
                e.preventDefault(); e.stopPropagation()
                onCellClick(row.recno, idx, d)
              }}
            >
              <div className="flex flex-col items-center justify-center py-2 px-1 min-h-[44px]">
                {cell.weekBefore && (
                  <span className="text-[9px] text-muted-foreground/60 mb-0.5">{cell.weekBefore}</span>
                )}
                {cell.text ? (
                  cell.sym ? (
                    // Absencja - badge
                    <span className="text-[11px] font-semibold px-2 py-0.5 rounded-md bg-secondary/15 text-secondary dark:bg-secondary/20 border border-secondary/20">
                      {cell.text}
                    </span>
                  ) : (
                    // Godziny - wyróżnione
                    <span className="text-[12px] font-semibold text-foreground tabular-nums tracking-tight">
                      {cell.text}
                    </span>
                  )
                ) : (
                  <span className="text-muted-foreground/20 text-lg">·</span>
                )}
              </div>

              {/* Status po generowaniu */}
              {st && (
                <div className="absolute top-1 right-1">
                  {st.ok === 0 && (
                    <div title={st.tresc}>
                      <TriangleAlert className="w-3.5 h-3.5 text-destructive" />
                    </div>
                  )}
                  {st.ok === 1 && <CheckCircle className="w-3.5 h-3.5 text-emerald-500" />}
                </div>
              )}

              {/* Lokalizacja */}
              {lokVal && !cell.sym && (
                <div className="flex justify-center mt-0.5">
                  <span className="inline-flex items-center gap-0.5 text-[10px] text-muted-foreground">
                    <MapPin className="w-2.5 h-2.5 text-secondary shrink-0" />
                    <span className="truncate max-w-[80px]">{cell.locName}</span>
                  </span>
                </div>
              )}
            </td>
          )
        })}
      </tr>

      {/* Rozwinięty wiersz edycji */}
      {isExpanded && !editMode && (
        <tr>
          <td className={cn("px-3 py-2 border-b border-r bg-card align-bottom text-xs")}>
            <Link href={`/scheduler/addLeave/${row.pesel}`}>
              <button className="text-xs px-3 py-1.5 rounded-lg border border-border hover:bg-muted transition-colors">
                Dodaj urlop
              </button>
            </Link>
          </td>
          {DAY_FIELDS.map((d) => (
            <ExpandedCell
              key={`${row.recno}-edit-${d}`}
              row={row}
              d={d}
              tmpItem={tmpItem}
              setTmpItem={setTmpItem}
              locations={locations}
              isExpanded={isExpanded}
              onApplyCellUpdates={onApplyCellUpdates}
              handleCopyValues={handleCopyValues}
              isDirty={isDirty}
              markDirty={markDirty}
              clearDirty={clearDirty}
            />
          ))}
        </tr>
      )}
    </>
  )
}
