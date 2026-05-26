import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { useSearchParams } from "next/navigation"
import { useCallback } from "react"
import { useRouter, usePathname } from "next/navigation"
import { api } from "@/utils/api"
import type { Task, TasksPage, TaskComment, TaskAttachment, CreateTaskPayload, UpdateTaskPayload, TaskStatus, TaskPriority } from "../types"

// ---------------------------------------------------------------------------
// Query keys
// ---------------------------------------------------------------------------
export const taskKeys = {
  all: ["tasks"] as const,
  list: (page: number, status: string, priority: string) =>
    ["tasks", "list", page, status, priority] as const,
  detail: (id: number) => ["tasks", "detail", id] as const,
  comments: (id: number) => ["tasks", "comments", id] as const,
  attachments: (id: number) => ["tasks", "attachments", id] as const,
}

// ---------------------------------------------------------------------------
// URL params hook
// ---------------------------------------------------------------------------
export function useTaskParams() {
  const sp = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()

  const page = Number(sp.get("page") ?? 1)
  const status = sp.get("status") ?? ""
  const priority = sp.get("priority") ?? ""
  const taskId = sp.get("task") ? Number(sp.get("task")) : null

  const setParam = useCallback((key: string, value: string | null) => {
    const params = new URLSearchParams(sp.toString())
    if (value) params.set(key, value)
    else params.delete(key)
    router.push(`${pathname}?${params.toString()}`)
  }, [sp, router, pathname])

  const openTask = useCallback((id: number) => setParam("task", String(id)), [setParam])
  const closeTask = useCallback(() => setParam("task", null), [setParam])

  return { page, status, priority, taskId, setParam, openTask, closeTask }
}

// ---------------------------------------------------------------------------
// Lista zadań
// ---------------------------------------------------------------------------
export function useTasks(page: number, status: string, priority: string) {
  return useQuery<TasksPage>({
    queryKey: taskKeys.list(page, status, priority),
    queryFn: async () => {
      const body: Record<string, any> = { page: page - 1, size: 20 }
      if (status) body.status = status
      if (priority) body.priorytet = priority
      const { data } = await api.post("tasks", body)
      return data
    },
    staleTime: 30_000,
  })
}

// ---------------------------------------------------------------------------
// Szczegóły zadania
// ---------------------------------------------------------------------------
export function useTask(id: number | null) {
  return useQuery<Task>({
    queryKey: taskKeys.detail(id!),
    queryFn: async () => {
      const { data } = await api.get(`tasks/${id}`)
      return data
    },
    enabled: !!id,
  })
}

// ---------------------------------------------------------------------------
// Komentarze
// ---------------------------------------------------------------------------
export function useTaskComments(taskId: number | null) {
  return useQuery<TaskComment[]>({
    queryKey: taskKeys.comments(taskId!),
    queryFn: async () => {
      const { data } = await api.get(`tasks/${taskId}/comments`)
      return data
    },
    enabled: !!taskId,
  })
}

// ---------------------------------------------------------------------------
// Załączniki
// ---------------------------------------------------------------------------
export function useTaskAttachments(taskId: number | null) {
  return useQuery<TaskAttachment[]>({
    queryKey: taskKeys.attachments(taskId!),
    queryFn: async () => {
      const { data } = await api.get(`tasks/${taskId}/attachments/${0}`)
      return data
    },
    enabled: !!taskId,
  })
}

// ---------------------------------------------------------------------------
// Mutacje
// ---------------------------------------------------------------------------
export function useCreateTask() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: CreateTaskPayload) =>
      api.post("tasks/create", payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: taskKeys.all }),
  })
}

export function useUpdateTask() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: UpdateTaskPayload }) =>
      api.put(`tasks/${id}/update`, payload),
    onSuccess: (_data, { id }) => {
      queryClient.invalidateQueries({ queryKey: taskKeys.detail(id) })
      queryClient.invalidateQueries({ queryKey: taskKeys.all })
    },
  })
}

export function useAddComment() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ taskId, tresc }: { taskId: number; tresc: string }) =>
      api.post(`tasks/${taskId}/comments/create`, { tresc }),
    onSuccess: (_data, { taskId }) => {
      queryClient.invalidateQueries({ queryKey: taskKeys.comments(taskId) })
      queryClient.invalidateQueries({ queryKey: taskKeys.detail(taskId) })
    },
  })
}

export function useDeleteTask() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: number) => api.delete(`tasks/${id}/attachments`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: taskKeys.all }),
  })
}

// ---------------------------------------------------------------------------
// Mutacja: zmień status zadania
// ---------------------------------------------------------------------------
export function useUpdateTaskStatus() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, status }: { id: number; status: TaskStatus }) =>
      api.put(`tasks/${id}/status/${status}/update`),
    onSuccess: (_data, { id }) => {
      queryClient.invalidateQueries({ queryKey: taskKeys.detail(id) })
      queryClient.invalidateQueries({ queryKey: taskKeys.all })
    },
  })
}

// ---------------------------------------------------------------------------
// Mutacja: pobierz dostępne statusy
// ---------------------------------------------------------------------------
export function useAvailableStatuses() {
  return useQuery<string[]>({
    queryKey: ["tasks", "statuses"],
    queryFn: async () => {
      const { data } = await api.get("tasks/getAvailableStatuses")
      return data
    },
    staleTime: 60 * 60_000,
  })
}
