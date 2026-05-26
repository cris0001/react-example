"use client"

import { useCallback, useEffect, useMemo, useState } from "react"
import { TableRow } from "./TableRow"
import { GenerateScheduleModal } from "../modals/GenerateScheduleModal"
import { GroupScheduleModal } from "../modals/GroupScheduleModal"
import { GroupLeaveModal } from "../modals/GroupLeaveModal"
import { CalendarRange } from "../Filters/CalendarRange"
import { JobPositionFilter } from "../Filters/JobPositionFilter"
import { useCellSelection } from "../../hooks/useCellSelection"
import { formatWithWeekday } from "../../utils"
import type { SchedulerData, ScheduleStatus, CellUpdate, Location, DayIndex } from "../../types"
import type { JobPosition } from "../../../employees/types"
import {cn} from "@/utils/helpers";

const DAY_FIELDS: DayIndex[] = [1, 2, 3, 4, 5, 6, 7]
const EMP_COL_W = 150
const DAY_COL_W = 140

interface SchedulerTableProps {
  schedulerData: SchedulerData[]
  locations: Location[]
  jobPositions: JobPosition[]
}

export function SchedulerTable({ schedulerData, locations, jobPositions }: SchedulerTableProps) {
  const [data, setData] = useState<SchedulerData[]>([...schedulerData])
  const [expandedRow, setExpandedRow] = useState<number[]>([])
  const [statusMap, setStatusMap] = useState<Map<string, ScheduleStatus>>(new Map())
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false)
  const [groupScheduleOpen, setGroupScheduleOpen] = useState(false)
  const [groupLeaveOpen, setGroupLeaveOpen] = useState(false)

  useEffect(() => {
    setData([...schedulerData])
  }, [schedulerData])

  const canSelectCell = useCallback((row: SchedulerData, day: DayIndex) => {
    const from = (row[`planOd${day}` as const] as string) || ""
    return from !== "__:__"
  }, [])

  const {
    editMode,
    selectedCells,
    toggleEditMode,
    handlers: { onCellPointerDown, onCellPointerEnter, onCellClick },
  } = useCellSelection<SchedulerData>({
    data,
    canSelectCell,
    onEnterEditMode: () => setExpandedRow([]),
  })

  const toggleRow = useCallback((id: number) => {
    if (editMode) return
    setExpandedRow((prev) => {
      if (prev.length === 0) return [id]
      if (prev.includes(id)) return prev.filter((r) => r !== id)
      return [id]
    })
  }, [editMode])

  // useCallback - applyCellUpdates jest stabilne, nie powoduje rerenderów wierszy
  const applyCellUpdates = useCallback((updates: CellUpdate[]) => {
    const byRecno = new Map<number, CellUpdate[]>()
    for (const u of updates) {
      const arr = byRecno.get(u.recno)
      if (arr) arr.push(u)
      else byRecno.set(u.recno, [u])
    }
    setData((prev) =>
      prev.map((row) => {
        const changes = byRecno.get(row.recno)
        if (!changes?.length) return row
        const next = { ...row }
        for (const u of changes) {
          const d = Number(u.day) as DayIndex
          ;(next as any)[`planOd${d}`] = u.planOd ?? ""
          ;(next as any)[`planDo${d}`] = u.planDo ?? ""
          ;(next as any)[`lok${d}`] = u.lok == null ? null : Number(u.lok)
          ;(next as any)[`nazwLok${d}`] = u.nazwLok ?? ""
        }
        return next
      })
    )
  }, [])

  const getStatusFor = useCallback(
    (pesel: string, iso: string) => statusMap.get(`${pesel}|${iso}`),
    [statusMap]
  )

  // useMemo - nagłówki dni przeliczane tylko gdy dane się zmienią
  const headerIsos = useMemo(
    () => data.length ? DAY_FIELDS.map((i) => (data[0] as any)[`data${i}`] as string) : [],
    [data]
  )

  return (
    <div className="space-y-3">
      {/* Filtry i akcje - mobile toggle */}
      <div className="sm:hidden">
        <button
          onClick={() => setMobileFiltersOpen((v) => !v)}
          className="w-full flex items-center justify-between px-4 py-2.5 rounded-xl border border-border bg-card text-sm hover:bg-muted transition-colors"
        >
          <span className="font-medium">Filtry i akcje</span>
          <span className="text-muted-foreground">☰</span>
        </button>
      </div>

      {/* Filtry i akcje */}
      <div className={[
        "flex flex-wrap items-center justify-between gap-2",
        mobileFiltersOpen ? "flex" : "hidden sm:flex",
      ].join(" ")}>
        {/* Filtry */}
        <div className="flex flex-wrap items-center gap-2">
          <CalendarRange onWeekChange={() => setExpandedRow([])} />
          <JobPositionFilter jobPositions={jobPositions} />
        </div>

        {/* Akcje */}
        <div className="flex flex-wrap items-center gap-2">
          {!editMode && (
            <GenerateScheduleModal statusMap={statusMap} setStatusMap={setStatusMap} />
          )}

          <button
            onClick={toggleEditMode}
            className={[
              "text-sm px-3 py-1.5 rounded-lg border transition-colors",
              editMode
                ? "border-destructive bg-destructive/10 text-destructive hover:bg-destructive/20"
                : "border-border hover:bg-muted",
            ].join(" ")}
          >
            {editMode ? "Zakończ zaznaczanie" : "Zaznaczanie grupowe"}
          </button>

          {editMode && selectedCells.size > 0 && (
            <>
              <button
                onClick={() => setGroupScheduleOpen(true)}
                className="text-sm px-3 py-1.5 rounded-lg border border-border hover:bg-muted transition-colors"
              >
                Grafik grupowy ({selectedCells.size})
              </button>
              <button
                onClick={() => setGroupLeaveOpen(true)}
                className="text-sm px-3 py-1.5 rounded-lg border border-border hover:bg-muted transition-colors"
              >
                Urlop grupowy
              </button>
            </>
          )}
        </div>
      </div>

      {/* Tabela */}
      <div className="rounded-xl border border-border overflow-auto shadow-sm">
        <table className="w-full text-sm border-separate border-spacing-0 table-fixed select-none">
          <colgroup>
            <col style={{ width: EMP_COL_W }} />
            {DAY_FIELDS.map((_, i) => <col key={i} style={{ width: DAY_COL_W }} />)}
          </colgroup>

          <thead className="sticky top-0 z-10">
            <tr className="bg-sidebar border-b border-border">
              <th className="text-left text-[11px] font-semibold text-muted-foreground tracking-wider uppercase px-4 py-3 border-r border-border">
                Pracownik
              </th>
              {headerIsos.map((iso, i) => {
                const isWeekend = i >= 5
                return (
                  <th key={iso} className={cn(
                    "text-center text-[11px] font-semibold tracking-wide px-2 py-3 border-l border-border whitespace-nowrap",
                    isWeekend ? "text-muted-foreground/50" : "text-muted-foreground"
                  )}>
                    {formatWithWeekday(iso)}
                  </th>
                )
              })}
            </tr>
          </thead>

          <tbody>
            {data.map((row, idx) => (
              <TableRow
                key={row.recno}
                row={row}
                idx={idx}
                locations={locations}
                onApplyCellUpdates={applyCellUpdates}
                expandedRow={expandedRow}
                toggleRow={toggleRow}
                selectedCells={selectedCells}
                editMode={editMode}
                canSelectCell={canSelectCell}
                onCellPointerDown={onCellPointerDown}
                onCellPointerEnter={onCellPointerEnter}
                onCellClick={onCellClick}
                getStatusFor={getStatusFor}
              />
            ))}
            {data.length === 0 && (
              <tr>
                <td colSpan={8} className="text-center text-sm text-muted-foreground py-10">
                  Brak danych dla wybranego tygodnia.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modale grupowe */}
      {groupScheduleOpen && (
        <GroupScheduleModal
          selectedCells={selectedCells}
          onClose={() => setGroupScheduleOpen(false)}
        />
      )}
      {groupLeaveOpen && (
        <GroupLeaveModal
          selectedCells={selectedCells}
          onClose={() => setGroupLeaveOpen(false)}
        />
      )}
    </div>
  )
}
