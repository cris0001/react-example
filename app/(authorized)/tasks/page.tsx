"use client"

import { useState } from "react"
import { Plus, Loader2, AlertCircle, CheckSquare } from "lucide-react"
import { useTasks, useTaskParams } from "./hooks/useTasks"
import TaskRow from "./components/TaskRow"
import { TaskFilters } from "./components/TaskFilters"
import { NewTaskModal } from "./components/NewTaskModal"
import { TaskDetailPanel } from "./components/TaskDetailPanel"
import { Pagination } from "@/components/Pagination"

export default function TasksPage() {
  const { page, status, priority, taskId, setParam, openTask, closeTask } = useTaskParams()
  const { data, isLoading, isError, error } = useTasks(page, status, priority)
  const [newTaskOpen, setNewTaskOpen] = useState(false)

  const tasks = data?.content ?? []

  return (
    <div className="p-4 sm:p-6">

      <div className="flex items-center justify-between mb-5">
        <div>
          <h1 className="text-xl font-bold text-foreground">Zadania</h1>
          {data && (
            <p className="text-xs text-muted-foreground mt-0.5">
              {data.totalElements} {data.totalElements === 1 ? "zadanie" : "zadań"}
            </p>
          )}
        </div>
        <button
          onClick={() => setNewTaskOpen(true)}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg bg-primary text-white hover:bg-primary/90 transition-colors shadow-sm"
        >
          <Plus className="w-4 h-4" />
          <span className="hidden xs:inline">Nowe</span>
        </button>
      </div>

      <div className="mb-4">
        <TaskFilters
          status={status}
          priority={priority}
          onStatusChange={(v) => setParam("status", v)}
          onPriorityChange={(v) => setParam("priority", v)}
        />
      </div>

      {isLoading && (
        <div className="flex flex-col items-center justify-center py-20 gap-3">
          <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
          <p className="text-sm text-muted-foreground">Ładowanie zadań…</p>
        </div>
      )}

      {isError && (
        <div className="flex items-start gap-3 text-sm bg-destructive/8 border border-destructive/20 rounded-xl px-4 py-3">
          <AlertCircle className="w-4 h-4 text-destructive shrink-0 mt-0.5" />
          <span className="text-destructive">
            {(error as any)?.response?.data?.message ?? "Nie udało się pobrać zadań."}
          </span>
        </div>
      )}

      {!isLoading && !isError && tasks.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 gap-3 text-center">
          <div className="w-12 h-12 rounded-2xl bg-muted flex items-center justify-center">
            <CheckSquare className="w-5 h-5 text-muted-foreground" />
          </div>
          <p className="text-sm font-medium text-foreground">Brak zadań</p>
          <p className="text-xs text-muted-foreground">Utwórz pierwsze zadanie klikając przycisk powyżej</p>
        </div>
      )}

      {!isLoading && !isError && tasks.length > 0 && (
        <>
          <div className="space-y-2">
            {tasks.map((task) => (
              <TaskRow key={task.id} task={task} onClick={openTask} />
            ))}
          </div>
          <Pagination last={data?.last ?? true} />
        </>
      )}

      {newTaskOpen && <NewTaskModal onClose={() => setNewTaskOpen(false)} />}
      {taskId && <TaskDetailPanel taskId={taskId} onClose={closeTask} />}
    </div>
  )
}
