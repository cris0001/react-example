"use client"

import { useState, useCallback, useRef } from "react"
import { X, MessageSquare, Paperclip, Send, Loader2, Calendar, User, Flag } from "lucide-react"
import { useTask, useTaskComments, useAddComment, useUpdateTask } from "../hooks/useTasks"
import { STATUS_LABELS, STATUS_COLORS, PRIORITY_LABELS, PRIORITY_COLORS, formatTaskDate } from "../utils"
import { cn } from "@/utils/helpers"
import type { TaskStatus } from "../types"

interface TaskDetailPanelProps {
  taskId: number
  onClose: () => void
}

export function TaskDetailPanel({ taskId, onClose }: TaskDetailPanelProps) {
  const { data: task, isLoading } = useTask(taskId)
  const { data: comments = [] } = useTaskComments(taskId)
  const { mutateAsync: addComment, isPending: isCommenting } = useAddComment()
  const { mutateAsync: updateTask } = useUpdateTask()

  const [comment, setComment] = useState("")
  const commentRef = useRef<HTMLTextAreaElement>(null)

  const handleAddComment = useCallback(async () => {
    if (!comment.trim()) return
    await addComment({ taskId, tresc: comment.trim() })
    setComment("")
  }, [taskId, comment, addComment])

  const handleStatusChange = useCallback(async (status: TaskStatus) => {
    if (!task) return
    await updateTask({
      id: taskId,
      payload: {
        temat: task.temat,
        tresc: task.tresc,
        priorytet: task.priorytet,
        status,
        dataRealizacji: task.dataRealizacji,
        przypisanyDo: task.przypisanyDo,
      }
    })
  }, [task, taskId, updateTask])

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div className="flex-1 bg-black/30 backdrop-blur-sm" onClick={onClose} />

      {/* Panel */}
      <div className="w-full max-w-md bg-background border-l border-border flex flex-col shadow-xl">

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-border shrink-0">
          <h2 className="text-sm font-semibold text-foreground">Szczegóły zadania</h2>
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-muted text-muted-foreground transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>

        {isLoading && (
          <div className="flex items-center justify-center flex-1">
            <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
          </div>
        )}

        {task && (
          <>
            {/* Task info */}
            <div className="flex-1 overflow-y-auto">
              <div className="p-5 space-y-4 border-b border-border">
                <h3 className="text-base font-semibold text-foreground">{task.temat}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{task.tresc}</p>

                {/* Meta */}
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="space-y-1">
                    <span className="text-muted-foreground flex items-center gap-1">
                      <Flag className="w-3 h-3" /> Status
                    </span>
                    {/* Status dropdown */}
                    <select
                      value={task.status}
                      onChange={(e) => handleStatusChange(e.target.value as TaskStatus)}
                      className={cn(
                        "text-[11px] font-medium px-2 py-1 rounded-lg border-0 cursor-pointer focus:outline-none focus:ring-1 focus:ring-primary/30",
                        STATUS_COLORS[task.status]
                      )}
                    >
                      {(Object.keys(STATUS_LABELS) as TaskStatus[]).map((s) => (
                        <option key={s} value={s}>{STATUS_LABELS[s]}</option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1">
                    <span className="text-muted-foreground flex items-center gap-1">
                      <Flag className="w-3 h-3" /> Priorytet
                    </span>
                    <span className={cn("inline-block text-[11px] font-medium px-2 py-0.5 rounded-full", PRIORITY_COLORS[task.priorytet])}>
                      {PRIORITY_LABELS[task.priorytet]}
                    </span>
                  </div>

                  {task.dataRealizacji && (
                    <div className="space-y-1">
                      <span className="text-muted-foreground flex items-center gap-1">
                        <Calendar className="w-3 h-3" /> Termin
                      </span>
                      <span className="font-medium text-foreground">{formatTaskDate(task.dataRealizacji)}</span>
                    </div>
                  )}

                  {task.przypisanyDoImie && (
                    <div className="space-y-1">
                      <span className="text-muted-foreground flex items-center gap-1">
                        <User className="w-3 h-3" /> Przypisano
                      </span>
                      <span className="font-medium text-foreground">
                        {task.przypisanyDoImie} {task.przypisanyDoNazwisko}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Komentarze */}
              <div className="p-5 space-y-3">
                <div className="flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm font-medium text-foreground">
                    Komentarze ({comments.length})
                  </span>
                </div>

                {comments.length === 0 && (
                  <p className="text-xs text-muted-foreground py-4 text-center">Brak komentarzy.</p>
                )}

                <div className="space-y-3">
                  {comments.map((c) => (
                    <div key={c.id} className="bg-muted/40 rounded-xl p-3">
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-xs font-medium text-foreground">
                          {c.autorImie} {c.autorNazwisko}
                        </span>
                        <span className="text-[10px] text-muted-foreground">
                          {formatTaskDate(c.dataUtworzenia)}
                        </span>
                      </div>
                      <p className="text-xs text-foreground leading-relaxed">{c.tresc}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Dodaj komentarz */}
            <div className="p-4 border-t border-border shrink-0">
              <div className="flex gap-2">
                <textarea
                  ref={commentRef}
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault()
                      handleAddComment()
                    }
                  }}
                  placeholder="Dodaj komentarz… (Enter = wyślij)"
                  rows={2}
                  className="flex-1 px-3 py-2 rounded-lg border border-border bg-input text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none placeholder:text-muted-foreground/50"
                />
                <button
                  onClick={handleAddComment}
                  disabled={isCommenting || !comment.trim()}
                  className="p-2 rounded-lg bg-primary text-white hover:bg-primary/90 disabled:opacity-50 transition-colors self-end"
                >
                  {isCommenting
                    ? <Loader2 className="w-4 h-4 animate-spin" />
                    : <Send className="w-4 h-4" />
                  }
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
