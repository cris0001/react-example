import { useQuery, useMutation, useInfiniteQuery } from "@tanstack/react-query"
import { useSearchParams, useRouter, usePathname } from "next/navigation"
import { useCallback, useMemo } from "react"
import { api } from "@/utils/api"
import { useAuthStore } from "@/store/auth.store"
import type { MessagesPage, SendMessagePayload, Recipient } from "../types"
import type { EmployeesData } from "@/app/(authorized)/employees/types"

export const messageKeys = {
  thread: (userId: number) => ["messages", "thread", userId] as const,
}

// ---------------------------------------------------------------------------
// Wiadomości z infinite scroll - useInfiniteQuery zamiast paginacji
// ---------------------------------------------------------------------------
export function useMessagesInfinite(userId: number | null) {
  const firma = useAuthStore((s) => s.user?.firma ?? "")

  return useInfiniteQuery<MessagesPage>({
    queryKey: messageKeys.thread(userId!),
    initialPageParam: 0,
    queryFn: async ({ pageParam }) => {
      const { data } = await api.post(
        `messages/getMessages/${firma}/${userId}?sort=data_wpisu,desc&page=${pageParam}&size=20`
      )
      return {
        content: data.content ?? [],
        last: data.last ?? true,
        size: data.size ?? 0,
      }
    },
    // Następna strona: inkrementuj pageParam dopóki last !== true
    getNextPageParam: (lastPage, allPages) =>
      lastPage.last ? undefined : allPages.length,
    enabled: !!userId && !!firma,
    staleTime: 15_000,
    refetchInterval: 30_000,
  })
}

// ---------------------------------------------------------------------------
// Mutacja: wyślij wiadomość - POST /api/fcm/{firma}/send
// ---------------------------------------------------------------------------
export function useSendMessage() {
  const firma = useAuthStore((s) => s.user?.firma ?? "")

  return useMutation({
    mutationFn: (payload: SendMessagePayload) =>
      api.post(`fcm/${firma}/send`, payload),
  })
}

// ---------------------------------------------------------------------------
// URL params hook
// ---------------------------------------------------------------------------
export function useMessagesParams() {
  const sp = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()

  const selectedId = sp.get("open") ? Number(sp.get("open")) : null

  const selectUser = useCallback((id: number) => {
    const params = new URLSearchParams(sp.toString())
    params.set("open", String(id))
    router.push(`${pathname}?${params.toString()}`)
  }, [sp, router, pathname])

  const clearUser = useCallback(() => {
    const params = new URLSearchParams(sp.toString())
    params.delete("open")
    router.push(`${pathname}?${params.toString()}`)
  }, [sp, router, pathname])

  return { selectedId, selectUser, clearUser }
}

// ---------------------------------------------------------------------------
// Helper: lista odbiorców z wybranych pracowników i stanowisk
// ---------------------------------------------------------------------------
export function useRecipients(
  employees: EmployeesData[],
  selectedEmployeeIds: Recipient[],
  selectedJobIds: number[]
): Recipient[] {
  return useMemo(() => {
    const byJobs = new Set(selectedJobIds)
    const map = new Map<number, Recipient>()

    for (const r of selectedEmployeeIds) map.set(r.id, r)

    for (const e of employees) {
      if (!e.fcmToken) continue
      if (!byJobs.has(e.idStanow)) continue
      if (map.has(e.id)) continue
      map.set(e.id, { id: e.id, fcmToken: e.fcmToken, imie: e.imie, nazwisko: e.nazwisko })
    }

    return Array.from(map.values())
  }, [employees, selectedEmployeeIds, selectedJobIds])
}
