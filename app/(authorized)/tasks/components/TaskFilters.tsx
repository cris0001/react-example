"use client"

import { Select } from "@/components/ui"
import { STATUS_LABELS, PRIORITY_LABELS } from "../utils"
import type { TaskStatus, TaskPriority } from "../types"

interface TaskFiltersProps {
  status: string
  priority: string
  onStatusChange: (v: string | null) => void
  onPriorityChange: (v: string | null) => void
}

export function TaskFilters({ status, priority, onStatusChange, onPriorityChange }: TaskFiltersProps) {
  return (
    <div className="flex flex-wrap gap-2">
      <Select
        value={status}
        onChange={(e) => onStatusChange(e.target.value || null)}
        className="h-9 w-auto min-w-[160px]"
      >
        <option value="">Wszystkie statusy</option>
        {(Object.keys(STATUS_LABELS) as TaskStatus[]).map((s) => (
          <option key={s} value={s}>{STATUS_LABELS[s]}</option>
        ))}
      </Select>

      <Select
        value={priority}
        onChange={(e) => onPriorityChange(e.target.value || null)}
        className="h-9 w-auto min-w-[160px]"
      >
        <option value="">Wszystkie priorytety</option>
        {(Object.keys(PRIORITY_LABELS) as TaskPriority[]).map((p) => (
          <option key={p} value={p}>{PRIORITY_LABELS[p]}</option>
        ))}
      </Select>
    </div>
  )
}
