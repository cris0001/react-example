import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { useSearchParams, useRouter, usePathname } from "next/navigation"
import { useCallback } from "react"
import { api } from "@/utils/api"
import { useAuthStore } from "@/store/auth.store"
import type { Point, CreatePointPayload, UpdatePointPayload, UpdatePointPasswordPayload } from "../types"

export const pointKeys = {
  all: ["points"] as const,
  list: (page: number) => ["points", "list", page] as const,
}

// ---------------------------------------------------------------------------
// Lista punktów
// ---------------------------------------------------------------------------
export function usePoints(page: number, size = 20) {
  return useQuery<{ content: Point[]; last: boolean; totalElements: number }>({
    queryKey: pointKeys.list(page),
    queryFn: async () => {
      const { data } = await api.post(
        `user/adm/systemPoints?page=${page - 1}&size=${size}`
      )
      return {
        content: data.content ?? [],
        last: data.last ?? true,
        totalElements: data.totalElements ?? 0,
      }
    },
    staleTime: 30_000,
  })
}

// ---------------------------------------------------------------------------
// Mutacja: utwórz punkt
// ---------------------------------------------------------------------------
export function useCreatePoint() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: CreatePointPayload) =>
      api.post("user/adm/createSystemPoint", payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: pointKeys.all }),
  })
}

// ---------------------------------------------------------------------------
// Mutacja: zaktualizuj punkt
// ---------------------------------------------------------------------------
export function useUpdatePoint() {
  const queryClient = useQueryClient()
  const firma = useAuthStore((s) => s.user?.firma ?? "")

  return useMutation({
    mutationFn: (payload: UpdatePointPayload) =>
      api.put("user/adm/systemPoint/update", { ...payload, firma }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: pointKeys.all }),
  })
}

// ---------------------------------------------------------------------------
// Mutacja: zmień hasło punktu
// ---------------------------------------------------------------------------
export function useUpdatePointPassword() {
  const firma = useAuthStore((s) => s.user?.firma ?? "")

  return useMutation({
    mutationFn: (payload: UpdatePointPasswordPayload) =>
      api.put("user/adm/systemPoint/changePassword", { ...payload, firma }),
  })
}

// ---------------------------------------------------------------------------
// Mutacja: usuń punkt
// ---------------------------------------------------------------------------
export function useDeletePoint() {
  const queryClient = useQueryClient()
  const firma = useAuthStore((s) => s.user?.firma ?? "")

  return useMutation({
    mutationFn: (id: number) =>
      api.delete(`user/adm/systemPoint/${firma}/${id}/delete`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: pointKeys.all }),
  })
}

// ---------------------------------------------------------------------------
// URL params + modal hook
// ---------------------------------------------------------------------------
export function usePointsParams() {
  const sp = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()

  const page = Number(sp.get("page") ?? 1)
  const editId = sp.get("edit") ? Number(sp.get("edit")) : null
  const isNew = sp.get("modal") === "new"

  const openNew = useCallback(() => {
    const params = new URLSearchParams(sp.toString())
    params.set("modal", "new")
    params.delete("edit")
    router.push(`${pathname}?${params.toString()}`)
  }, [sp, router, pathname])

  const openEdit = useCallback((id: number) => {
    const params = new URLSearchParams(sp.toString())
    params.set("edit", String(id))
    params.delete("modal")
    router.push(`${pathname}?${params.toString()}`)
  }, [sp, router, pathname])

  const closeModal = useCallback(() => {
    const params = new URLSearchParams(sp.toString())
    params.delete("modal")
    params.delete("edit")
    router.push(`${pathname}?${params.toString()}`)
  }, [sp, router, pathname])

  return { page, editId, isNew, openNew, openEdit, closeModal }
}

// ---------------------------------------------------------------------------
// Toggle: blokada punktu
// ---------------------------------------------------------------------------
export function useTogglePointBlock() {
  const queryClient = useQueryClient()
  const firma = useAuthStore((s) => s.user?.firma ?? "")

  return useMutation({
    mutationFn: (id: number) =>
      api.get(`user/adm/systemPoint/${firma}/${id}/block`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: pointKeys.all }),
  })
}

// ---------------------------------------------------------------------------
// Toggle: aktywność punktu
// ---------------------------------------------------------------------------
export function useTogglePointActive() {
  const queryClient = useQueryClient()
  const firma = useAuthStore((s) => s.user?.firma ?? "")

  return useMutation({
    mutationFn: (id: number) =>
      api.get(`user/adm/esytemPoint/${firma}${id}/active`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: pointKeys.all }),
  })
}
