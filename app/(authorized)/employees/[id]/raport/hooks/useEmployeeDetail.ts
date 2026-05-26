import { useQuery } from "@tanstack/react-query"
import { api } from "@/utils/api"
import type { ApiPage } from "@/types"
import {LeaveEntitlements, LeavesData, RaportData} from "@/app/(authorized)/employees/types";

export const employeeDetailKeys = {
  raport: (id: number, from: string, to: string) =>
    ["employee-detail", "raport", id, from, to] as const,
  leaves: (id: number, page: number) =>
    ["employee-detail", "leaves", id, page] as const,
  entitlements: (id: number, pesel: string) =>
    ["employee-detail", "entitlements", id, pesel] as const,
}

export function useEmployeeRaport(
  id: number,
  employee: { pesel: string; firma: string } | undefined,
  from: string,
  to: string
) {
  return useQuery<RaportData[]>({
    queryKey: employeeDetailKeys.raport(id, from, to),
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

export function useEmployeeLeaves(
    id: number,
    employee: { pesel: string; firma: string } | undefined,
    page: number,
    size = 20
) {
  return useQuery<ApiPage<LeavesData>>({
    queryKey: employeeDetailKeys.leaves(id, page),
    queryFn: async () => {
      const { data } = await api.post(
          `urlop/getAbsencjeDlaPracownikaZatwierdzone?page=${page - 1}&size=${size}`,
          { firma: employee!.firma, pesel: employee!.pesel, typ: '' }
      )
      return data
    },
    enabled: !!employee?.pesel && !!employee?.firma,
  })
}

export function useLeaveEntitlements(
  id: number,
  employee: { pesel: string; firma: string } | undefined
) {
  return useQuery<LeaveEntitlements>({
    queryKey: employeeDetailKeys.entitlements(id, employee?.pesel ?? ""),
    queryFn: async () => {
      const year = new Date().getFullYear()
      const { data } = await api.get(
        `urlop/wymiar?firma=${employee!.firma}&pesel=${employee!.pesel}&rok=${year}`
      )
      return Array.isArray(data) ? data[0] : data
    },
    enabled: !!employee?.pesel && !!employee?.firma,
    staleTime: 60_000,
  })
}
