import { useCallback, useEffect, useRef, useState } from "react"
import type { DayIndex } from "../types"

function makeCellKey(recno: number, day: DayIndex) {
  return `${recno}:${day}`
}

type RowLike = { recno: number }

type UseCellSelectionParams<Row extends RowLike> = {
  data: Row[]
  canSelectCell: (row: Row, day: DayIndex) => boolean
  onEnterEditMode?: () => void
}

export function useCellSelection<Row extends RowLike>({
  data,
  canSelectCell,
  onEnterEditMode,
}: UseCellSelectionParams<Row>) {
  const [editMode, setEditMode] = useState(false)
  const [selectedCells, setSelectedCells] = useState<Set<string>>(new Set())

  // Refs żeby handlery nie łapały stale closures
  const dataRef = useRef<Row[]>(data)
  const selectedCellsRef = useRef<Set<string>>(selectedCells)

  useEffect(() => { dataRef.current = data }, [data])
  useEffect(() => { selectedCellsRef.current = selectedCells }, [selectedCells])

  // Drag state
  const isDraggingRef = useRef(false)
  const dragMovedRef = useRef(false)
  const dragAnchorRef = useRef<{ rowIndex: number; day: DayIndex } | null>(null)
  const selectedSnapshotRef = useRef<Set<string> | null>(null)
  const dragModeRef = useRef<"add" | "remove" | null>(null)

  // Sprzątanie drag state po pointerup
  useEffect(() => {
    const onUp = () => {
      isDraggingRef.current = false
      dragMovedRef.current = false
      dragAnchorRef.current = null
      selectedSnapshotRef.current = null
      dragModeRef.current = null
    }
    window.addEventListener("pointerup", onUp)
    window.addEventListener("mouseup", onUp)
    window.addEventListener("pointercancel", onUp)
    return () => {
      window.removeEventListener("pointerup", onUp)
      window.removeEventListener("mouseup", onUp)
      window.removeEventListener("pointercancel", onUp)
    }
  }, [])

  const clearSelection = useCallback(() => setSelectedCells(new Set()), [])

  const toggleEditMode = useCallback(() => {
    setSelectedCells(new Set())
    setEditMode((v) => {
      const next = !v
      if (next) onEnterEditMode?.()
      return next
    })
  }, [onEnterEditMode])

  const toggleSelected = useCallback((recno: number, day: DayIndex) => {
    setSelectedCells((prev) => {
      const next = new Set(prev)
      const key = makeCellKey(recno, day)
      if (next.has(key)) next.delete(key)
      else next.add(key)
      return next
    })
  }, [])

  const onCellPointerDown = useCallback(
    (recno: number, rowIndex: number, day: DayIndex) => {
      if (!editMode) return
      const row = dataRef.current[rowIndex]
      if (!row || !canSelectCell(row, day)) return

      isDraggingRef.current = true
      dragMovedRef.current = false
      dragAnchorRef.current = { rowIndex, day }
      selectedSnapshotRef.current = new Set(selectedCellsRef.current)

      const startKey = makeCellKey(recno, day)
      dragModeRef.current = selectedCellsRef.current.has(startKey) ? "remove" : "add"
    },
    [editMode, canSelectCell]
  )

  const onCellPointerEnter = useCallback(
    (recno: number, rowIndex: number, day: DayIndex) => {
      if (
        !editMode ||
        !isDraggingRef.current ||
        !dragAnchorRef.current ||
        !selectedSnapshotRef.current ||
        !dragModeRef.current
      ) return

      dragMovedRef.current = true
      const rows = dataRef.current
      const a = dragAnchorRef.current
      const minRow = Math.min(a.rowIndex, rowIndex)
      const maxRow = Math.max(a.rowIndex, rowIndex)
      const minDay = Math.min(a.day, day) as DayIndex
      const maxDay = Math.max(a.day, day) as DayIndex
      const base = new Set(selectedSnapshotRef.current)

      for (let r = minRow; r <= maxRow; r++) {
        const rRow = rows[r]
        if (!rRow) continue
        for (let d = minDay; d <= maxDay; d++) {
          const dd = d as DayIndex
          if (!canSelectCell(rRow, dd)) continue
          const key = makeCellKey(rRow.recno, dd)
          if (dragModeRef.current === "add") base.add(key)
          else base.delete(key)
        }
      }
      setSelectedCells(base)
    },
    [editMode, canSelectCell]
  )

  const onCellClick = useCallback(
    (recno: number, rowIndex: number, day: DayIndex) => {
      if (!editMode) return
      const row = dataRef.current[rowIndex]
      if (!row || !canSelectCell(row, day)) return
      if (dragMovedRef.current) return
      toggleSelected(recno, day)
    },
    [editMode, canSelectCell, toggleSelected]
  )

  return {
    editMode,
    selectedCells,
    toggleEditMode,
    clearSelection,
    handlers: { onCellPointerDown, onCellPointerEnter, onCellClick },
  }
}
