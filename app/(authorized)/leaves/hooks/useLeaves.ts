import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { useSearchParams } from "next/navigation"
import { api } from "@/utils/api"
import type { LeaveRequest, LeavesPage, LeaveCalendarData } from "../types"

export const leaveKeys = {
  all: ["leaves"] as const,
  pending: (page: number) => ["leaves", "pending", page] as const,
  calendar: ["leaves", "calendar"] as const,
}

// ---------------------------------------------------------------------------
// Wnioski do zatwierdzenia (stronicowane)
// ---------------------------------------------------------------------------
export function usePendingLeaves(page: number, size = 5) {
  return useQuery<LeavesPage>({
    queryKey: leaveKeys.pending(page),
    queryFn: async () => {
      const { data } = await api.post(
        `urlop/getAbsencjeDoZatwierdzenia?page=${page - 1}&size=${size}`,
        { search: "" }
      )
      return {
        content: data.content ?? [],
        last: data.last ?? true,
        size: data.size ?? 0,
      }
    },
    staleTime: 30_000,
  })
}

// ---------------------------------------------------------------------------
// Dane kalendarza - zatwierdzone i do zatwierdzenia
// ---------------------------------------------------------------------------
export function useLeaveCalendar() {
  return useQuery<LeaveCalendarData>({
    queryKey: leaveKeys.calendar,
    queryFn: async () => {
      const [yetToDecide, accepted] = await Promise.all([
        api.get("urlop/getAbsencjeByStatus/0").then((r) => r.data),
        api.get("urlop/getAbsencjeByStatus/1").then((r) => r.data),
      ])
      return { yetToDecide, accepted }
    },
    staleTime: 60_000,
  })
}

// ---------------------------------------------------------------------------
// Mutacja: akceptuj lub odrzuć wniosek
// ---------------------------------------------------------------------------
export function useDecideLeave() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      recno,
      status,
      uwagi,
    }: {
      recno: number
      status: 0 | 1
      uwagi?: string
    }) => {
      const params = new URLSearchParams({
        status: String(status),
        recno: String(recno),
      })
      if (uwagi) params.set("uwagi", uwagi)
      return api.put(`urlop/decyzja?${params.toString()}`)
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: leaveKeys.all })
    },
  })
}

// ---------------------------------------------------------------------------
// URL params hook
// ---------------------------------------------------------------------------
export function useLeavesPageParams() {
  const sp = useSearchParams()
  const page = Number(sp.get("page") ?? 1)
  const size = Number(sp.get("size") ?? 5)
  return { page, size }
}
