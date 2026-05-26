"use client"

import { memo } from "react"
import { MessageSquare, Paperclip, Calendar, User } from "lucide-react"
import { cn } from "@/utils/helpers"
import { STATUS_LABELS, STATUS_COLORS, PRIORITY_LABELS, PRIORITY_COLORS, formatTaskDate } from "../utils"
import type { Task } from "../types"

interface TaskRowProps {
  task: Task
  onClick: (id: number) => void
}

function TaskRow({ task, onClick }: TaskRowProps) {
  return (
    <div
      onClick={() => onClick(task.id)}
      className={cn(
        "flex flex-col sm:flex-row sm:items-center gap-3 p-4",
        "rounded-xl border border-border bg-card cursor-pointer",
        "hover:bg-muted/40 hover:shadow-sm hover:-translate-y-px",
        "transition-all duration-150"
      )}
    >
      {/* Główna treść */}
      <div className="flex-1 min-w-0">
        <div className="flex flex-wrap items-center gap-2 mb-1">
          <span className={cn("text-[11px] font-medium px-2 py-0.5 rounded-full", STATUS_COLORS[task.status])}>
            {STATUS_LABELS[task.status]}
          </span>
          <span className={cn("text-[11px] font-medium px-2 py-0.5 rounded-full", PRIORITY_COLORS[task.priorytet])}>
            {PRIORITY_LABELS[task.priorytet]}
          </span>
        </div>

        <p className="text-sm font-medium text-foreground truncate">{task.temat}</p>
        <p className="text-xs text-muted-foreground line-clamp-1 mt-0.5">{task.tresc}</p>
      </div>

      {/* Meta */}
      <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground shrink-0">
        {task.dataRealizacji && (
          <span className="flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            {formatTaskDate(task.dataRealizacji)}
          </span>
        )}
        {task.przypisanyDoImie && (
          <span className="flex items-center gap-1">
            <User className="w-3 h-3" />
            {task.przypisanyDoImie} {task.przypisanyDoNazwisko}
          </span>
        )}
        {task.liczbaKomentarzy > 0 && (
          <span className="flex items-center gap-1">
            <MessageSquare className="w-3 h-3" />
            {task.liczbaKomentarzy}
          </span>
        )}
        {task.liczbaZalacznikow > 0 && (
          <span className="flex items-center gap-1">
            <Paperclip className="w-3 h-3" />
            {task.liczbaZalacznikow}
          </span>
        )}
      </div>
    </div>
  )
}

function areEqual(prev: TaskRowProps, next: TaskRowProps) {
  return (
    prev.task.id === next.task.id &&
    prev.task.status === next.task.status &&
    prev.task.priorytet === next.task.priorytet &&
    prev.task.temat === next.task.temat &&
    prev.task.liczbaKomentarzy === next.task.liczbaKomentarzy &&
    prev.task.liczbaZalacznikow === next.task.liczbaZalacznikow
  )
}

export default memo(TaskRow, areEqual)
