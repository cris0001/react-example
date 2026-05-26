import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { api } from "@/utils/api"
import { useAuthStore } from "@/store/auth.store"
import type { SchedulerData, Location, LeaveType } from "../types"
import type { ApiPage } from "@/types"
import { useJobPositions } from "../../employees/hooks/useEmployees"

// Re-eksport żeby scheduler nie importował z employees
export { useJobPositions }

export const schedulerKeys = {
  list: (day: string, page: number, size: number, jt: number | null) =>
    ["scheduler", "list", day, page, size, jt] as const,
  locations: ["scheduler", "locations"] as const,
  leaveTypes: (firma: string) => ["scheduler", "leave-types", firma] as const,
  flatEmployees: ["scheduler", "flat-employees"] as const,
}

// ---------------------------------------------------------------------------
// Grafik (tygodniowy)
// ---------------------------------------------------------------------------
export function useScheduler(
  day: string,
  page: number,
  size: number,
  jt: number | null
) {
  return useQuery<Pick<ApiPage<SchedulerData>, "last" | "content" | "size">>({
    queryKey: schedulerKeys.list(day, page, size, jt),
    queryFn: async () => {
      const { data } = await api.post(
        `grafik/adm/getSchedule?page=${page - 1}&size=${size}`,
        { pesel: "", dataTygodnia: day, idStanow: jt ?? undefined }
      )
      return {
        last: data.last ?? true,
        size: data.size ?? 0,
        content: data.content ?? [],
      }
    },
    staleTime: 30_000,
  })
}

// ---------------------------------------------------------------------------
// Lokalizacje
// ---------------------------------------------------------------------------
export function useLocations() {
  return useQuery<Location[]>({
    queryKey: schedulerKeys.locations,
    queryFn: async () => {
      const { data } = await api.post(
        "user/adm/locations?page=0&size=333"
      )
      return data.content ?? []
    },
    staleTime: 60 * 60_000,
  })
}

// ---------------------------------------------------------------------------
// Typy urlopów
// ---------------------------------------------------------------------------
export function useLeaveTypes() {
  const firma = useAuthStore((s) => s.user?.firma ?? "")

  return useQuery<LeaveType[]>({
    queryKey: schedulerKeys.leaveTypes(firma),
    queryFn: async () => {
      const { data } = await api.get(
        `urlop/rodzajeAbsencji?firma=${firma}`
      )
      return data
    },
    enabled: !!firma,
    staleTime: 60 * 60_000,
  })
}

// ---------------------------------------------------------------------------
// Flat lista pracowników (dla GenerateModal)
// ---------------------------------------------------------------------------
export function useFlatEmployees() {
  return useQuery<{ id: number; imie: string; nazwisko: string; pesel: string }[]>({
    queryKey: schedulerKeys.flatEmployees,
    queryFn: async () => {
      const { data } = await api.post(
        "user/adm/employees?page=0&size=999&sort=nazwisko,asc"
      )
      return (data.content ?? []).map((e: any) => ({
        id: e.id,
        imie: e.imie,
        nazwisko: e.nazwisko,
        pesel: e.pesel ?? "",
      }))
    },
    staleTime: 5 * 60_000,
  })
}

// ---------------------------------------------------------------------------
// Mutacja: dodaj dzień do grafiku
// ---------------------------------------------------------------------------
export function useAddScheduleDay() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: {
      pesel: string; firma: string; data: string
      idLok: number; planOd: string; planDo: string
    }) => api.post("grafik/adm/addEmployeeSingleWorkDayToSchedule", payload),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["scheduler"] })
    },
  })
}

// ---------------------------------------------------------------------------
// Mutacja: aktualizuj dzień grafiku
// ---------------------------------------------------------------------------
export function useUpdateScheduleDay() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: {
      pesel: string; firma: string; data: string
      idLok: number; planOd: string; planDo: string
    }) => api.post("grafik/adm/updateEmployeeWorkDay", payload),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["scheduler"] })
    },
  })
}

// ---------------------------------------------------------------------------
// Mutacja: generuj grafik
// ---------------------------------------------------------------------------
export function useGenerateSchedule() {
  const queryClient = useQueryClient()
  const firma = useAuthStore((s) => s.user?.firma ?? "")

  return useMutation({
    mutationFn: (payload: {
      pesele: string; dataOd: string; dataDo: string
    }) =>
      api.post("grafik/adm/schedule/generate", { ...payload, firma }),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["scheduler"] })
    },
  })
}

// ---------------------------------------------------------------------------
// Mutacja: grupowe urlopy
// ---------------------------------------------------------------------------
export function useGroupLeave() {
  const queryClient = useQueryClient()
  const firma = useAuthStore((s) => s.user?.firma ?? "")

  return useMutation({
    mutationFn: (payload: {
      pesele: string[]; dataOd: string; dataDo: string
      symbol: string; czyNieOpis: string; uwagi: string
    }) =>
      api.post("urlop/adm/addGroupLeave", { ...payload, firma }),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["scheduler"] })
    },
  })
}

// ---------------------------------------------------------------------------
// Mutacja: grupowy grafik pracy
// ---------------------------------------------------------------------------
export function useGroupSchedule() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: {
      selectedCells: string[]; planOd: string; planDo: string; idLok: number | null
    }) =>
      api.post("grafik/adm/updateGroupWorkDays", payload),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["scheduler"] })
    },
  })
}
