import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { useSearchParams, useRouter, usePathname } from "next/navigation"
import { useCallback } from "react"
import { api } from "@/utils/api"
import { useAuthStore } from "@/store/auth.store"
import type { Location, CreateLocationPayload } from "../types"

export const locationKeys = {
  all: ["locations"] as const,
  list: (page: number) => ["locations", "list", page] as const,
  detail: (id: number) => ["locations", "detail", id] as const,
}

// ---------------------------------------------------------------------------
// Lista lokalizacji
// ---------------------------------------------------------------------------
export function useLocations(page: number, size = 20) {
  return useQuery<{ content: Location[]; last: boolean; totalElements: number }>({
    queryKey: locationKeys.list(page),
    queryFn: async () => {
      const { data } = await api.post(
        `user/adm/locations?page=${page - 1}&size=${size}`
      )
      return {
        content: data.content ?? [],
        last: data.last ?? true,
        totalElements: data.totalElements ?? 0,
      }
    },
    staleTime: 60_000,
  })
}

// ---------------------------------------------------------------------------
// Szczegóły jednej lokalizacji
// ---------------------------------------------------------------------------
export function useLocation(id: number | null) {
  return useQuery<Location>({
    queryKey: locationKeys.detail(id!),
    queryFn: async () => {
      const { data } = await api.get(`user/adm/location/${id}`)
      return data
    },
    enabled: !!id,
  })
}

// ---------------------------------------------------------------------------
// Mutacja: utwórz lokalizację
// ---------------------------------------------------------------------------
export function useCreateLocation() {
  const queryClient = useQueryClient()
  const firma = useAuthStore((s) => s.user?.firma ?? "")

  return useMutation({
    mutationFn: (payload: CreateLocationPayload) =>
      api.post("user/adm/createLocation", { ...payload, firma }),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: locationKeys.all }),
  })
}

// ---------------------------------------------------------------------------
// Mutacja: aktualizuj lokalizację
// ---------------------------------------------------------------------------
export function useUpdateLocation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: Location) =>
      api.put(`user/adm/updateLocation/${payload.id}`, payload),
    onSuccess: (_data, payload) => {
      queryClient.invalidateQueries({ queryKey: locationKeys.detail(payload.id) })
      queryClient.invalidateQueries({ queryKey: locationKeys.all })
    },
  })
}

// ---------------------------------------------------------------------------
// Mutacja: usuń lokalizację
// ---------------------------------------------------------------------------
export function useDeleteLocation() {
  const queryClient = useQueryClient()
  const firma = useAuthStore((s) => s.user?.firma ?? "")

  return useMutation({
    mutationFn: (id: number) =>
      api.delete(`user/adm/deleteLocation/${firma}/${id}`),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: locationKeys.all }),
  })
}

// ---------------------------------------------------------------------------
// URL params + modal hook
// ---------------------------------------------------------------------------
export function useLocationsParams() {
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
