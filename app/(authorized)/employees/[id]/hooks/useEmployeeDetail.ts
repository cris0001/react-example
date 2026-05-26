import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { api } from "@/utils/api"
import { useAuthStore } from "@/store/auth.store"
import type { RaportData, LeavesData, LeaveEntitlements } from "../../types"
import type { ApiPage } from "@/types"

// ---------------------------------------------------------------------------
// Query keys
// ---------------------------------------------------------------------------
export const employeeDetailKeys = {
  raport: (id: number, from: string, to: string) =>
    ["employee-detail", "raport", id, from, to] as const,
  leaves: (id: number, page: number) =>
    ["employee-detail", "leaves", id, page] as const,
  entitlements: (id: number) =>
    ["employee-detail", "entitlements", id] as const,
}

// ---------------------------------------------------------------------------
// Raport obecności
// ---------------------------------------------------------------------------
export function useEmployeeRaport(
  employee: { pesel: string; firma: string } | undefined,
  from: string,
  to: string
) {
  return useQuery<RaportData[]>({
    queryKey: employeeDetailKeys.raport(0, from, to),
    queryFn: async () => {
      const { data } = await api.post("user/adm/employee/getEmployeeRaport", {
        firma: employee!.firma,
        pesel: employee!.pesel,
        dataOd: from,
        dataDo: to,
      })
      return data
    },
    enabled: !!employee?.pesel && !!employee?.firma,
    staleTime: 30_000,
  })
}

// ---------------------------------------------------------------------------
// Urlopy pracownika
// ---------------------------------------------------------------------------
export function useEmployeeLeaves(
  employee: { pesel: string; firma: string } | undefined,
  page: number,
  size = 20
) {
  return useQuery<ApiPage<LeavesData>>({
    queryKey: employeeDetailKeys.leaves(0, page),
    queryFn: async () => {
      const { data } = await api.get(
        `user/adm/hr/leaves/${employee!.firma}/${employee!.pesel}?page=${page - 1}&size=${size}`
      )
      return data
    },
    enabled: !!employee?.pesel && !!employee?.firma,
  })
}

// ---------------------------------------------------------------------------
// Wymiary urlopu (entitlements)
// ---------------------------------------------------------------------------
export function useLeaveEntitlements(
  employee: { pesel: string; firma: string } | undefined
) {
  return useQuery<LeaveEntitlements>({
    queryKey: employeeDetailKeys.entitlements(0),
    queryFn: async () => {
      const { data } = await api.get(
        `user/adm/hr/entitlements/${employee!.firma}/${employee!.pesel}`
      )
      return data
    },
    enabled: !!employee?.pesel && !!employee?.firma,
    staleTime: 60_000,
  })
}
